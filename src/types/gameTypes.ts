// src/types/gameTypes.ts

export enum ScreenType {
    MENU = 'MENU',
    CHAT = 'CHAT',
    LIBRARY = 'LIBRARY',
    READING = 'READING'
}

export interface NavigationProps {
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
}

export type PageImage = {
    type: 'svg';
    component: React.FC;
} | {
    type: 'url';
    src: string;
};

export interface PageContent {
    text: string;
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

export type DisplayMode = 'chat' | 'library' | 'reading';