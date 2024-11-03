import {ProgressFlag} from "../types/gameTypes";

export const initializeProgressFlags = (): { [K in ProgressFlag]: boolean } => {
    const flags = {} as { [K in ProgressFlag]: boolean };
    Object.values(ProgressFlag).forEach(flag => {
        flags[flag as ProgressFlag] = false;

    });

    // For new users, beginner books are initially available
    flags[ProgressFlag.BEGINNER_BOOKS_UNLOCKED] = true;
    return flags;

};