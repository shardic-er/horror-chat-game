// src/services/userService.ts

import { UserData} from '../types/gameTypes';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import GameLogger from './loggerService';
import { migrateUserData, createVersionedUserData, ensureCompleteUserData } from './userMigrationService';
import {initializeProgressFlags} from "../utils/progressFlags";

export const USER_COOKIE_KEY = 'horror_game_user';

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
    }
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

        // Create a complete user object with versioning
        const userDataToSave = ensureCompleteUserData({
            ...userData,
            vocabulary: uniqueVocabulary
        });

        // Create versioned data
        const versionedData = createVersionedUserData(userDataToSave);

        // Log the prepared data
        GameLogger.logGameState({
            type: 'Pre-Save Prepared Data',
            preparedVocabulary: versionedData.userData.vocabulary,
            vocabularySize: versionedData.userData.vocabulary.length
        });

        const serializedUser = JSON.stringify(versionedData);

        // Check and log size
        const dataSize = new Blob([serializedUser]).size;
        GameLogger.logGameState({
            type: 'Cookie Size Check',
            size: dataSize,
            maxSize: 4096
        });

        // Only save if we're under size limit
        if (dataSize <= 4096) {
            Cookies.remove(USER_COOKIE_KEY);
            Cookies.set(USER_COOKIE_KEY, serializedUser, { expires: 365 });
            // Update cache with the saved data
            userDataCache = {
                data: versionedData.userData,
                timestamp: Date.now()
            };
        }
    } catch (error) {
        GameLogger.logError('saveUser', error);
    }
};

export const loadUser = (): UserData | null => {
    const now = Date.now();

    // Return cached data if valid
    if (userDataCache && (now - userDataCache.timestamp < CACHE_DURATION)) {
        return userDataCache.data;
    }

    try {
        const savedUser = Cookies.get(USER_COOKIE_KEY);
        if (!savedUser) {
            userDataCache = { data: null, timestamp: now };
            return null;
        }

        const parsedData = JSON.parse(savedUser);

        // Migrate data if necessary
        const migratedData = migrateUserData(parsedData);

        // Ensure vocabulary is unique and lowercase
        const cleanedVocabulary = Array.from(
            new Set(migratedData.vocabulary.map((w: string) => w.toLowerCase()))
        );

        // Create complete user data
        const userData = ensureCompleteUserData({
            ...migratedData,
            vocabulary: cleanedVocabulary
        });

        // Log the loaded data
        GameLogger.logGameState({
            type: 'User Data Loaded',
            vocabularySize: userData.vocabulary.length,
            flags: userData.progressFlags,
            stats: userData.progressStats
        });

        userDataCache = {
            data: userData,
            timestamp: now
        };

        return userData;

    } catch (error) {
        GameLogger.logError('loadUser', error);
        return null;
    }
};
// Update specific user fields and save to cookie
export const updateUser = (updates: Partial<UserData>): UserData => {
    const currentUser = loadUser();
    if (!currentUser) throw new Error('No user found');

    const updatedUser = {
        ...currentUser,
        ...updates,
        lastLoginDate: new Date()
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

// Clear user data (logout) (unused?)
export const clearUserData = (): void => {
    Cookies.remove(USER_COOKIE_KEY);
};

// Check if user exists (unused?)
export const userExists = (): boolean => {
    return !!Cookies.get(USER_COOKIE_KEY);
};