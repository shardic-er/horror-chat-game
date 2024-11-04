// src/assets/library/books.ts
import { Book } from '../../types/libraryTypes';

import { threePigsBook } from './ThreeLittlePigs/ThreeLittlePigs';
import { systemLogsBook } from './SystemTerminalLogs/SystemTerminalLogs';
import { transferLetterBook } from './TransferAuthorization/TransferAuthorization';
import { recoveryNotesBook } from './RecoveryNotes/RecoveryNotes';
import { countingNumbersBook } from './CountingNumbers/CountingNumbers';
import { shapesBook } from './ShapesBook/ShapesBook';
import { petsBook } from './PetsBook/PetsBook';
import allAboutLove from "./AllAboutLove/AllAboutLove";
import ColorsAllAround from "./ColorsAllAround/ColorsAllAround";
import IDontBelieveInGhosts from "./IDontBelieveInGhosts/IDontBelieveInGhosts"
import NervousMervis from "./NervousMervis/NervousMervis";
import YouCantGoBack from "./YouCantGoBack/YouCantGoBack";
import ILoveYouGoodbye from "./ILoveYouGoodbye/ILoveYouGoodbye";

export const libraryContent: Book[] = [
    ColorsAllAround,
    threePigsBook,
    systemLogsBook,
    transferLetterBook,
    recoveryNotesBook,
    countingNumbersBook,
    shapesBook,
    petsBook,
    allAboutLove,
    IDontBelieveInGhosts,
    NervousMervis,
    YouCantGoBack,
    // ILoveYouGoodbye,
];

// Define the difficulty order
const difficultyOrder = ['beginner', 'basic', 'intermediate', 'advanced'];

// Create a map for quick rank lookup
const difficultyRank: { [key: string]: number } = difficultyOrder.reduce((acc, level, index) => {
    acc[level] = index;
    return acc;
}, {} as { [key: string]: number });

// Sorting function
libraryContent.sort((a, b) => {
    // Function to get the highest priority rank for a book
    const getBookRank = (book: Book): number => {
        // Safely access book.tags, defaulting to an empty array if undefined
        const tags = book.tags ?? [];

        // Find the lowest index (highest priority) among the book's tags
        const ranks = tags
            .map(tag => difficultyRank[tag.toLowerCase()]) // Ensure case-insensitive matching
            .filter(rank => rank !== undefined); // Exclude tags that are not in difficultyOrder

        if (ranks.length === 0) {
            // If no matching tags, assign a rank lower than the lowest defined
            return difficultyOrder.length;
        }

        return Math.min(...ranks);
    };

    const rankA = getBookRank(a);
    const rankB = getBookRank(b);

    return rankA - rankB;
});
