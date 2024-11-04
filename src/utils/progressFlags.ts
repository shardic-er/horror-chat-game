import {ProgressFlag} from "../types/gameTypes";

// Helper function to initialize progress flags with all required values
export const initializeProgressFlags = (): Record<ProgressFlag, boolean> => {
    return {
        [ProgressFlag.COMPLETED_DELETIONS]: false,
        [ProgressFlag.BEGINNER_BOOKS_UNLOCKED]: true, // This starts as true
        [ProgressFlag.BASIC_BOOKS_UNLOCKED]: false,
        [ProgressFlag.INTERMEDIATE_BOOKS_UNLOCKED]: false,
        [ProgressFlag.ADVANCED_BOOKS_UNLOCKED]: false,
    };
};

// Helper to ensure all flags are present
export const ensureCompleteFlags = (
    flags: Partial<Record<ProgressFlag, boolean>>
): Record<ProgressFlag, boolean> => {
    const completeFlags = initializeProgressFlags();
    return {
        ...completeFlags,
        ...flags
    };
};