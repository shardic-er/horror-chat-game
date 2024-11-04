// src/services/storageService.ts

import { UserData, ProgressFlag } from '../types/gameTypes';

const INITIAL_VOCABULARY = ['the', 'a', 'is', 'in', 'it', 'you', 'i', 'to', 'and', 'of'];

type StorageKey =
    | 'horror_game_user_data'
    | 'horror_game_vocabulary'
    | 'horror_game_forgotten_words'
    | 'horror_game_progress'
    | 'horror_game_settings'
    | `horror_game_vocabulary_chunk_${number}`;

interface StorageMetadata {
    totalChunks: number;
    totalItems: number;
    lastUpdated: string;
}

export class StorageService {
    private static instance: StorageService;
    private readonly CHUNK_SIZE = 1000; // Store 1000 words per chunk

    private constructor() {
        this.initializeStorageIfEmpty();
    }

    static getInstance(): StorageService {
        if (!this.instance) {
            this.instance = new StorageService();
        }
        return this.instance;
    }

    private initializeStorageIfEmpty(): void {
        // Check if we have any existing data
        const vocabulary = this.getVocabulary();
        const userData = this.getItem<UserData>('horror_game_user_data');

        if (!vocabulary || vocabulary.length === 0) {
            this.setVocabulary(INITIAL_VOCABULARY);
        }

        if (!userData) {
            // Initialize with default user data
            const initialUserData: UserData = {
                id: crypto.randomUUID(),
                vocabulary: INITIAL_VOCABULARY,
                forgottenWords: [],
                validatedTypoCount: 0,
                progressFlags: this.initializeProgressFlags(),
                progressStats: {
                    solvedChatMessages: 0,
                    completedBooks: 0
                },
                completedContentIds: [],
                isRegistered: false
            };

            this.setItem('horror_game_user_data', initialUserData);
        }
    }

    private initializeProgressFlags(): { [K in ProgressFlag]: boolean } {
        const flags = {} as { [K in ProgressFlag]: boolean };
        Object.values(ProgressFlag).forEach(flag => {
            flags[flag as ProgressFlag] = false;
        });
        // Begin with beginner books unlocked
        flags[ProgressFlag.BEGINNER_BOOKS_UNLOCKED] = true;
        return flags;
    }

    // Basic storage operations
    setItem(key: StorageKey, value: any): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Failed to store data for key: ${key}`, error);
            throw error;
        }
    }

    getItem<T>(key: StorageKey): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Failed to retrieve data for key: ${key}`, error);
            return null;
        }
    }

    removeItem(key: StorageKey): void {
        localStorage.removeItem(key);
    }

    // Chunked storage for vocabulary
    setVocabulary(words: string[]): void {
        const chunks = this.chunkArray(words, this.CHUNK_SIZE);

        // Store metadata
        this.setItem('horror_game_vocabulary', {
            totalChunks: chunks.length,
            totalItems: words.length,
            lastUpdated: new Date().toISOString()
        } as StorageMetadata);

        // Store each chunk
        chunks.forEach((chunk, index) => {
            this.setItem(`horror_game_vocabulary_chunk_${index}` as StorageKey, chunk);
        });
    }

    getVocabulary(): string[] {
        const meta = this.getItem<StorageMetadata>('horror_game_vocabulary');
        if (!meta) return [];

        const words: string[] = [];
        for (let i = 0; i < meta.totalChunks; i++) {
            const chunk = this.getItem<string[]>(`horror_game_vocabulary_chunk_${i}` as StorageKey);
            if (chunk) words.push(...chunk);
        }

        return words;
    }

    // Helper methods
    private chunkArray<T>(array: T[], size: number): T[][] {
        return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
            array.slice(i * size, i * size + size)
        );
    }

    // Additional helper methods for forgotten words (since they might also grow large)
    setForgottenWords(words: string[]): void {
        this.setItem('horror_game_forgotten_words', words);
    }

    getForgottenWords(): string[] {
        return this.getItem<string[]>('horror_game_forgotten_words') || [];
    }

    // Clear all data (useful for testing and resets)
    clearAll(): void {
        const meta = this.getItem<StorageMetadata>('horror_game_vocabulary');
        if (meta) {
            for (let i = 0; i < meta.totalChunks; i++) {
                this.removeItem(`horror_game_vocabulary_chunk_${i}` as StorageKey);
            }
        }

        this.removeItem('horror_game_vocabulary');
        this.removeItem('horror_game_forgotten_words');
        this.removeItem('horror_game_user_data');
        this.removeItem('horror_game_progress');
        this.removeItem('horror_game_settings');
    }

    // User data operations
    getUserData(): UserData | null {
        return this.getItem<UserData>('horror_game_user_data');
    }

    updateUserData(updates: Partial<UserData>): UserData {
        const currentData = this.getUserData();
        if (!currentData) {
            throw new Error('No user data found');
        }

        const updatedData = {
            ...currentData,
            ...updates,
        };

        this.setItem('horror_game_user_data', updatedData);

        // If vocabulary is being updated, make sure to update the chunked storage too
        if (updates.vocabulary) {
            this.setVocabulary(updates.vocabulary);
        }

        return updatedData;
    }

    // Enhanced vocabulary methods
    getVocabularyWithFallback(): string[] {
        const vocab = this.getVocabulary();
        return vocab.length > 0 ? vocab : INITIAL_VOCABULARY;
    }
}

// Export a singleton instance
export const storage = StorageService.getInstance();