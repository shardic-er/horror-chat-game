// src/types/gameTypes.ts

export enum ScreenType {
    MENU = 'MENU',
    CHAT = 'CHAT',
    LIBRARY = 'LIBRARY',
    READING = 'READING',
    FORGET = 'FORGET'
}

export interface NavigationProps {
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
}

export type PageImage =
    | {
    type: 'svg';
    component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
    | {
    type: 'url';
    src: string;
};


export interface PageContent {
    text: string;
    prompt?: string;
    imageRef?: string;  // Maintain backward compatibility
    image?: PageImage;  // New image handling
    customStyles?: React.CSSProperties;
}

export interface PaginatedContent {
    pages: PageContent[];
    backgroundType: 'book' | 'terminal' | 'letter' | 'note';
}

export interface GameContent {
    mode: DisplayMode;
    content: PaginatedContent | AIPartner;
}

export type BookDifficulty = 'beginner' | 'basic' | 'intermediate' | 'advanced';

export interface ChatError {
    message: string;
    timestamp: string;
}

export interface ProgressStats {
    solvedChatMessages: number;
    completedBooks: number;
}

export enum ProgressFlag {

    // has completed 100 typo removals
    COMPLETED_DELETIONS = 'completedDeletions',

    // has completed tutorial
    BEGINNER_BOOKS_UNLOCKED = 'beginnerBooksUnlocked',

    // vocabulary > 200
    BASIC_BOOKS_UNLOCKED = 'basicBooksUnlocked',

    // vocabulary > 5000
    INTERMEDIATE_BOOKS_UNLOCKED = 'intermediateBooksUnlocked',

    // vocabulary > 20000
    ADVANCED_BOOKS_UNLOCKED = 'advancedBooksUnlocked',
}

export interface UserData {
    id: string;
    vocabulary: string[];
    forgottenWords: string[];
    validatedTypoCount: number;
    progressFlags: {
        [K in ProgressFlag]: boolean;
    };
    progressStats: ProgressStats;
    isRegistered: boolean;
    username?: string;
    email?: string;
    currentAiPartner?: string;
    completedContentIds: string[];
}

export interface AIPartner {
    id: string;
    name: string;
    systemPrompt: string;
    maxInputTokens: number;
    maxOutputTokens: number;
    temperature: number;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | string;
    content: string;
    timestamp?: string;
    metadata?: {
        isRedacted?: boolean;
        isError?: boolean;
        isTutorial?: boolean;
        isRetry?: boolean;
    };
}

export interface ChatHistory {
    partnerId: string;
    messages: ChatMessage[];
}

export type DisplayMode = 'chat' | 'library' | 'reading' | 'forget';