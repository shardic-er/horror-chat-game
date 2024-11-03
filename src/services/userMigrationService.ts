// src/services/userMigrationService.ts

import { UserData, ProgressFlag } from '../types/gameTypes';
import { v4 as uuidv4 } from 'uuid';
import GameLogger from './loggerService';

// Version control for user data schema
export const CURRENT_USER_VERSION = 1;

export interface UserDataVersion {
    version: number;
    userData: UserData;
}

const initialVocabulary = ['the', 'a', 'is', 'in', 'it', 'you', 'i', 'to', 'and', 'of'];

// Initialize progress flags with all enum values set to false
const initializeProgressFlags = (): { [K in ProgressFlag]: boolean } => {
    const flags = {} as { [K in ProgressFlag]: boolean };
    Object.values(ProgressFlag).forEach(flag => {
        flags[flag as ProgressFlag] = false;
    });
    flags[ProgressFlag.BEGINNER_BOOKS_UNLOCKED] = true;
    return flags;
};

// Migration functions to upgrade old user data
export const migrateUserData = (oldData: any): UserData => {
    // If no version, it's pre-versioning data
    const version = oldData.version || 0;
    let userData = oldData;

    // Apply migrations sequentially
    if (version < 1) {
        userData = migrateToV1(userData);
    }
    // Add future migrations here:
    // if (version < 2) userData = migrateToV2(userData);
    // if (version < 3) userData = migrateToV3(userData);

    return userData.userData;
};

const migrateToV1 = (oldData: any): UserDataVersion => {
    GameLogger.logGameState({
        type: 'Migration',
        fromVersion: 0,
        toVersion: 1,
        originalData: oldData
    });

    // Ensure all current progress flags exist
    const progressFlags = { ...initializeProgressFlags() };
    if (oldData.progressFlags) {
        Object.entries(oldData.progressFlags).forEach(([key, value]) => {
            if (key in progressFlags) {
                progressFlags[key as ProgressFlag] = value as boolean;
            }
        });
    }

    // Ensure all current stats exist
    const progressStats = {
        solvedChatMessages: oldData.progressStats?.solvedChatMessages || 0,
        completedBooks: oldData.progressStats?.completedBooks || 0
    };

    const userData: UserData = {
        id: oldData.id || uuidv4(),
        vocabulary: oldData.vocabulary || initialVocabulary,
        forgottenWords: oldData.forgottenWords || [],
        validatedTypoCount: oldData.validatedTypoCount || 0,
        progressFlags,
        progressStats,
        completedContentIds: oldData.completedContentIds || [],
        isRegistered: oldData.isRegistered || false
    };

    GameLogger.logGameState({
        type: 'Migration Complete',
        version: 1,
        migratedData: userData
    });

    return {
        version: 1,
        userData
    };
};

// Helper function to create a versioned user data object
export const createVersionedUserData = (userData: UserData): UserDataVersion => {
    return {
        version: CURRENT_USER_VERSION,
        userData: {
            ...userData,
            progressFlags: { ...initializeProgressFlags(), ...userData.progressFlags },
            progressStats: {
                solvedChatMessages: userData.progressStats?.solvedChatMessages || 0,
                completedBooks: userData.progressStats?.completedBooks || 0
            },
            completedContentIds: userData.completedContentIds || []
        }
    };
};

// Helper to ensure all required fields are present
export const ensureCompleteUserData = (userData: UserData): UserData => {
    return {
        ...userData,
        progressFlags: { ...initializeProgressFlags(), ...userData.progressFlags },
        progressStats: {
            solvedChatMessages: userData.progressStats?.solvedChatMessages || 0,
            completedBooks: userData.progressStats?.completedBooks || 0
        },
        completedContentIds: userData.completedContentIds || []
    };
};