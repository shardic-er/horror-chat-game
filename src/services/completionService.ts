// src/services/completionService.ts

import { ChatMessage } from '../types/gameTypes';
import { Book } from '../types/libraryTypes';
import { loadUser, saveUser } from './userService';
import GameLogger from './loggerService';

// Helper function to check if all words in a text are known
const isTextComplete = (text: string, knownWords: Set<string>): boolean => {
    const wordsInText = text.toLowerCase()
        .split(/\s+/)
        .map(word => word.replace(/[.,!?;:'"]/g, ''))
        .filter(word => word.length > 0);

    return wordsInText.every(word => knownWords.has(word));
};

// Check if a chat message is complete
export const isChatMessageComplete = (
    message: ChatMessage,
    knownWords: Set<string>
): boolean => {
    return isTextComplete(message.content, knownWords);
};

// Check if a book is complete
export const isBookComplete = (
    book: Book,
    knownWords: Set<string>
): boolean => {
    return book.content.pages.every(page =>
        isTextComplete(page.text, knownWords)
    );
};

// Update completion status and stats
export const updateCompletionStatus = (
    contentId: string,
    contentType: 'book' | 'chat',
    isComplete: boolean
): void => {
    const currentUser = loadUser();
    if (!currentUser) return;

    // Check if already completed to avoid double-counting
    if (currentUser.completedContentIds.includes(contentId)) {
        return;
    }

    if (isComplete) {
        const updatedUser = {
            ...currentUser,
            completedContentIds: [...currentUser.completedContentIds, contentId],
            progressStats: {
                ...currentUser.progressStats,
                solvedChatMessages: contentType === 'chat'
                    ? (currentUser.progressStats.solvedChatMessages + 1)
                    : currentUser.progressStats.solvedChatMessages,
                completedBooks: contentType === 'book'
                    ? (currentUser.progressStats.completedBooks + 1)
                    : currentUser.progressStats.completedBooks
            }
        };

        GameLogger.logGameState({
            type: 'Content Completion',
            contentId,
            contentType,
            previousStats: currentUser.progressStats,
            newStats: updatedUser.progressStats
        });

        saveUser(updatedUser);
    }
};

// Check if content was previously completed
export const isContentCompleted = (contentId: string): boolean => {
    const currentUser = loadUser();
    return currentUser?.completedContentIds.includes(contentId) || false;
};