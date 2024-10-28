export enum ScreenType {
    TITLE = 'TITLE',
    MENU = 'MENU',
    CHAT = 'CHAT',
    LIBRARY = 'LIBRARY',
    SETTINGS = 'SETTINGS'
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
    metadata?: {
        isRedacted?: boolean;
        isError?: boolean;
        isTutorial?: boolean;
    };
}

export interface ChatHistory {
    partnerId: string;
    messages: ChatMessage[];
}

export interface GameState {
    currentUser: UserData | null;
    chatHistories: Record<string, ChatHistory>;
    availablePartners: AIPartner[];
    isInitialized: boolean;
    error?: string;
}