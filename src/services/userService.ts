// src/services/userService.ts

import {ProgressFlag, UserData} from '../types/gameTypes';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import GameLogger from './loggerService';

export const USER_COOKIE_KEY = 'horror_game_user';

// Initial vocabulary every new user starts with
const initialVocabulary = ['the', 'a', 'is', 'in', 'it', 'you', 'i', 'to', 'and', 'of'];

// Initialize progress flags with all enum values set to false
const initializeProgressFlags = (): { [K in ProgressFlag]: boolean } => {
    const flags = {} as { [K in ProgressFlag]: boolean };
    Object.values(ProgressFlag).forEach(flag => {
        flags[flag] = false;
    });
    return flags;
};

// Create a new user with initial state
export const createNewUser = (): UserData => ({
    id: uuidv4(),
    vocabulary: initialVocabulary,
    forgottenWords: [],
    validatedTypoCount: 0,
    progressFlags: initializeProgressFlags(),
    isRegistered: false,
});

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

        // Create a complete new user object
        const userDataToSave: UserData = {
            id: userData.id,
            vocabulary: uniqueVocabulary,
            forgottenWords: userData.forgottenWords || [],
            validatedTypoCount: userData.validatedTypoCount || 0,
            progressFlags: userData.progressFlags || {},
            isRegistered: userData.isRegistered || false
        };

        // Log the prepared data
        GameLogger.logGameState({
            type: 'Pre-Save Prepared Data',
            preparedVocabulary: userDataToSave.vocabulary,
            vocabularySize: userDataToSave.vocabulary.length
        });

        const serializedUser = JSON.stringify(userDataToSave);

        // Check and log size
        const dataSize = new Blob([serializedUser]).size;
        GameLogger.logGameState({
            type: 'Cookie Size Check',
            size: dataSize,
            maxSize: 4096
        });

        // Only save if we're under size limit
        if (dataSize <= 4096) {
            Cookies.remove(USER_COOKIE_KEY); // Clear existing cookie first
            Cookies.set(USER_COOKIE_KEY, serializedUser, { expires: 365 });

            // Immediate verification
            const verifyData = Cookies.get(USER_COOKIE_KEY);
            if (verifyData) {
                const parsedVerify = JSON.parse(verifyData);
                const saveSuccessful =
                    JSON.stringify(parsedVerify.vocabulary.sort()) ===
                    JSON.stringify(uniqueVocabulary.sort());

                GameLogger.logGameState({
                    type: 'Save Verification',
                    expectedSize: uniqueVocabulary.length,
                    actualSize: parsedVerify.vocabulary.length,
                    saveSuccessful,
                    expectedVocabulary: uniqueVocabulary,
                    actualVocabulary: parsedVerify.vocabulary
                });

                if (!saveSuccessful) {
                    GameLogger.logError('saveUser', 'Verification failed - saved data does not match original');
                }
            }
        } else {
            GameLogger.logError('saveUser', 'Data exceeds cookie size limit');
        }
    } catch (error) {
        GameLogger.logError('saveUser', error);
    }
};

export const loadUser = (): UserData | null => {
    try {
        const savedUser = Cookies.get(USER_COOKIE_KEY);
        if (!savedUser) {
            GameLogger.logError('loadUser', 'No saved user found');
            return null;
        }

        GameLogger.logGameState({
            type: 'Pre-Parse User Data',
            rawData: savedUser
        });

        const parsedUser = JSON.parse(savedUser);

        // Ensure vocabulary is unique and lowercase
        const cleanedVocabulary = Array.from(
            new Set(parsedUser.vocabulary.map((w: string) => w.toLowerCase()))
        );

        const userData = {
            ...parsedUser,
            vocabulary: cleanedVocabulary,
            forgottenWords: parsedUser.forgottenWords || [],
            validatedTypoCount: parsedUser.validatedTypoCount || 0
        };

        GameLogger.logGameState({
            type: 'Post-Load User Data',
            vocabularySize: userData.vocabulary.length,
            vocabulary: userData.vocabulary
        });

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

// Add a new word to user's vocabulary
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

// Remove a word from user's vocabulary
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

// Update a progress flag
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

// Clear user data (logout)
export const clearUserData = (): void => {
    Cookies.remove(USER_COOKIE_KEY);
};

// Check if user exists
export const userExists = (): boolean => {
    return !!Cookies.get(USER_COOKIE_KEY);
};