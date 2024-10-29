// src/types/gameTypes.ts

export enum ScreenType {
    TITLE = 'TITLE',
    MENU = 'MENU',
    CHAT = 'CHAT',
    LIBRARY = 'LIBRARY',
    SETTINGS = 'SETTINGS'
}

export interface NavigationProps {
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
}

export interface PageContent {
    text: string;
    imageRef?: string;
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

export interface ChatError {
    message: string;
    timestamp: string;
}

export interface UserData {
    id: string;
    vocabulary: string[];
    progressFlags: {
        [key: string]: boolean;
    };
    isRegistered: boolean;
    username?: string;
    email?: string;
    currentAiPartner?: string;
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

export type DisplayMode = 'chat' | 'reading';