// src/types/libraryTypes.ts

import { PaginatedContent } from './gameTypes';

export interface Book {
    title: string;
    content: PaginatedContent;
    requiredFlag?: string;
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

// Get total unique words from all pages
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