// src/types/libraryTypes.ts

import {PaginatedContent, ProgressFlag} from './gameTypes';

export interface Book {
    title: string;
    content: PaginatedContent;
    requiredFlag?: ProgressFlag;
    tags?: string[];
}

// Helper to get unique words from text
const getUniqueWords = (text: string): Set<string> => {
    return new Set(
        text.toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 0)
            .map(word => word.replace(/[.,!?;:'"]/g, ''))
    );
};


// Keep existing functions but update to use new getBookContent
export const getUniqueWordCount = (content: PaginatedContent): number => {
    const allWords = new Set<string>();
    content.pages.forEach(page => {
        const pageWords = getUniqueWords(page.text);
        pageWords.forEach(word => allWords.add(word));
    });
    return allWords.size;
};

// Get count of known unique words
export const getKnownWordCount = (content: PaginatedContent, knownWords: Set<string>): number => {
    const allUniqueWords = new Set<string>();
    content.pages.forEach(page => {
        const pageWords = getUniqueWords(page.text);
        pageWords.forEach(word => {
            if (knownWords.has(word.toLowerCase())) {
                allUniqueWords.add(word);
            }
        });
    });
    return allUniqueWords.size;
};

// Add completion check function
export const isContentComplete = (content: string, knownWords: Set<string>): boolean => {
    const words = content.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(word => word.replace(/[.,!?;:'"]/g, ''));

    return words.every(word => knownWords.has(word));
};

// Update existing helper function to work with full book content
export const getBookContent = (book: Book): string => {
    return book.content.pages.map(page => page.text).join(' ');
};

// Add function to check if book should be available based on tags and vocab size
export const isBookAvailable = (book: Book, progressFlags: { [K in ProgressFlag]: boolean }, vocabularySize: number): boolean => {
    // If no tags, book is always available
    if (!book.tags || book.tags.length === 0) return true;

    // Check if book has any difficulty tags and corresponding requirements
    if (book.tags.includes('beginner')) {
        return progressFlags[ProgressFlag.BEGINNER_BOOKS_UNLOCKED];
    }
    if (book.tags.includes('basic')) {
        return progressFlags[ProgressFlag.BASIC_BOOKS_UNLOCKED] || vocabularySize > 200;
    }
    if (book.tags.includes('intermediate')) {
        return progressFlags[ProgressFlag.INTERMEDIATE_BOOKS_UNLOCKED] || vocabularySize > 5000;
    }
    if (book.tags.includes('advanced')) {
        return progressFlags[ProgressFlag.ADVANCED_BOOKS_UNLOCKED] || vocabularySize > 20000;
    }

    // If no difficulty tags, book is available
    return true;
}