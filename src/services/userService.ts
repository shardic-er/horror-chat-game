// src/services/userService.ts

import { UserData } from '../types/gameTypes';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

const USER_COOKIE_KEY = 'horror_game_user';

// Initial vocabulary every new user starts with
const initialVocabulary = ['the', 'a', 'is', 'in', 'it', 'you', 'i', 'to', 'and', 'of'];

// Create a new user with initial state
export const createNewUser = (): UserData => ({
    id: uuidv4(),
    vocabulary: initialVocabulary,
    forgottenWords: [],
    validatedTypoCount: 0,
    progressFlags: {
        completedTutorial: false,
        hasReadFirstBook: false,
        hasMetTerminal: false
    },
    isRegistered: false,
});

// Update saveUser to explicitly handle these fields
export const saveUser = (userData: UserData): void => {
    try {
        const serializedUser = JSON.stringify({
            ...userData,
            forgottenWords: userData.forgottenWords || [],
            validatedTypoCount: userData.validatedTypoCount || 0
        });
        Cookies.set(USER_COOKIE_KEY, serializedUser, { expires: 365 });
    } catch (error) {
        console.error('Error saving user data to cookie:', error);
    }
};

// Update loadUser to ensure these fields are loaded
export const loadUser = (): UserData | null => {
    try {
        const savedUser = Cookies.get(USER_COOKIE_KEY);
        if (!savedUser) return null;

        const parsedUser = JSON.parse(savedUser);
        return {
            ...parsedUser,
            forgottenWords: parsedUser.forgottenWords || [],
            validatedTypoCount: parsedUser.validatedTypoCount || 0,
            lastLoginDate: new Date(parsedUser.lastLoginDate),
            createdAt: new Date(parsedUser.createdAt)
        };
    } catch (error) {
        console.error('Error loading user data from cookie:', error);
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