// src/services/userService.ts

import { UserData} from '../types/gameTypes';
import { v4 as uuidv4 } from 'uuid';
import GameLogger from './loggerService';
import { storage } from "./storageService";
import {initializeProgressFlags} from "../utils/progressFlags";


let userDataCache: {
    data: UserData | null;
    timestamp: number;
} | null = null;

const CACHE_DURATION = 1000; // 1 second;

// Initial vocabulary every new user starts with
const initialVocabulary = ['the', 'a', 'is', 'in', 'it', 'you', 'i', 'to', 'and', 'of'];

// Initialize progress flags with all enum values set to false


// Create a new user with initial state
export const createNewUser = (): UserData => {
    const initialFlags = initializeProgressFlags();
    return {
        id: uuidv4(),
        vocabulary: initialVocabulary,
        forgottenWords: [],
        validatedTypoCount: 0,
        progressFlags: initialFlags,
        progressStats: {
            solvedChatMessages: 0,
            completedBooks: 0
        },
        completedContentIds: [],
        isRegistered: false
    };
};

export const saveUser = (userData: UserData): void => {
    try {
        GameLogger.logGameState({
            type: 'Pre-Save Raw Data',
            rawVocabulary: userData.vocabulary,
            vocabularySize: userData.vocabulary.length
        });

        // Create a clean copy of the vocabulary
        const uniqueVocabulary = Array.from(
            new Set(userData.vocabulary.map(w => w.toLowerCase()))
        );

        // Create a complete user object
        const userDataToSave = {
            ...userData,
            vocabulary: uniqueVocabulary
        };

        // Log the prepared data
        GameLogger.logGameState({
            type: 'Pre-Save Prepared Data',
            preparedVocabulary: userDataToSave.vocabulary,
            vocabularySize: userDataToSave.vocabulary.length
        });

        // Save to storage service
        storage.updateUserData(userDataToSave);

    } catch (error) {
        GameLogger.logError('saveUser', error);
    }
};

export const loadUser = (): UserData | null => {
    try {
        const userData = storage.getUserData();

        if (!userData) {
            return null;
        }

        // Log the loaded data
        GameLogger.logGameState({
            type: 'User Data Loaded',
            vocabularySize: userData.vocabulary.length,
            flags: userData.progressFlags,
            stats: userData.progressStats
        });

        return userData;

    } catch (error) {
        GameLogger.logError('loadUser', error);
        return null;
    }
};


// Update specific user fields
export const updateUser = (updates: Partial<UserData>): UserData => {
    const currentUser = loadUser();
    if (!currentUser) throw new Error('No user found');

    const updatedUser = {
        ...currentUser,
        ...updates
    };

    saveUser(updatedUser);
    return updatedUser;
};

export const updateProgressStats = (
    contentId: string,
    contentType: 'book' | 'chat',
    isComplete: boolean
): UserData | null => {
    const currentUser = loadUser();
    if (!currentUser) return null;

    // Check if already completed to avoid double-counting
    if (currentUser.completedContentIds.includes(contentId)) {
        return currentUser;
    }

    if (isComplete) {
        const updatedUser = {
            ...currentUser,
            completedContentIds: [...currentUser.completedContentIds, contentId],
            progressStats: {
                ...currentUser.progressStats,
                solvedChatMessages: contentType === 'chat'
                    ? currentUser.progressStats.solvedChatMessages + 1
                    : currentUser.progressStats.solvedChatMessages,
                completedBooks: contentType === 'book'
                    ? currentUser.progressStats.completedBooks + 1
                    : currentUser.progressStats.completedBooks
            }
        };
        saveUser(updatedUser);
        return updatedUser;
    }

    return currentUser;
};

// Add a new word to user's vocabulary (unused?)
export const addWordToVocabulary = (word: string): UserData | null => {
    const currentUser = loadUser();
    if (!currentUser) return null;

    if (!currentUser.vocabulary.includes(word.toLowerCase())) {
        const updatedUser = {
            ...currentUser,
            vocabulary: [...currentUser.vocabulary, word.toLowerCase()]
        };
        saveUser(updatedUser);
        return updatedUser;
    }

    return currentUser;
};

// Remove a word from user's vocabulary (unused?)
export const removeWordFromVocabulary = (word: string): UserData | null => {
    const currentUser = loadUser();
    if (!currentUser) return null;

    const lowerWord = word.toLowerCase();

    // Only proceed if the word isn't already forgotten
    if (!currentUser.forgottenWords.includes(lowerWord)) {
        const updatedUser = {
            ...currentUser,
            vocabulary: currentUser.vocabulary.filter(w => w.toLowerCase() !== lowerWord),
            forgottenWords: [...currentUser.forgottenWords, lowerWord]
        };
        saveUser(updatedUser);
        return updatedUser;
    }

    return currentUser;
};

// Update a progress flag (unused?)
export const updateProgressFlag = (flagKey: string, value: boolean): UserData | null => {
    const currentUser = loadUser();
    if (!currentUser) return null;

    const updatedUser = {
        ...currentUser,
        progressFlags: {
            ...currentUser.progressFlags,
            [flagKey]: value
        }
    };

    saveUser(updatedUser);
    return updatedUser;
};

export const clearUserData = (): void => {
    storage.clearAll();
};

// Check if user exists (unused?)
export const userExists = (): boolean => {
    return storage.getUserData() !== null;
};


