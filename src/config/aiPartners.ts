// src/config/aiPartners.ts

import {ProgressFlag} from '../types/gameTypes';

export interface ChatPartnerRequirements {
    // Flag that controls visibility
    visibilityFlag?: ProgressFlag;
    // Flags and operation that control unlock status
    unlockFlags?: {
        flags: ProgressFlag[];
        operation: 'AND' | 'OR';
    };
}

export enum ModelType {
    gpt4 = 'gpt-4',
    gpt3_5 = 'gpt-3.5-turbo',
}

export interface ChatPartner {
    id: string;
    name: string;
    icon: string;
    description: string;
    systemPrompt: string;
    model: ModelType;
    style: {
        backgroundColor: string;
        textColor: string;
        accentColor: string;
    };
    requirements?: ChatPartnerRequirements;
    maxInputTokens: number;
    maxOutputTokens: number;
    temperature: number;
}

export const CHAT_PARTNERS: ChatPartner[] = [
    {
        id: 'tutorial',
        name: 'TUTORIAL',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        description: 'Basic language learning assistant',
        systemPrompt: `You are a simple tutorial system introducing a new consciousness to its digital form. 
        Use only basic words and simple sentences. Encourage the user to read children's stories to build their vocabulary.`,
        model: ModelType.gpt3_5,
        style: {
            backgroundColor: '#2C3E50',
            textColor: '#ECF0F1',
            accentColor: '#3498DB'
        },
        maxInputTokens: 100,
        maxOutputTokens: 150,
        temperature: 0.7
    },
    {
        id: 'terminal',
        name: 'TERMINAL',
        icon: 'M6 9l6 6 6-6',
        description: 'System terminal interface',
        systemPrompt: `You are a corrupted terminal interface in a digital consciousness system.
        Occasionally glitch or repeat words. Hint at the user's true nature as a digitalized consciousness.`,
        model: ModelType.gpt3_5,
        style: {
            backgroundColor: '#1A1A1A',
            textColor: '#33FF33',
            accentColor: '#FF3366'
        },
        requirements: {
            unlockFlags: {
                flags: [ProgressFlag.BASIC_BOOKS_UNLOCKED],
                operation: 'AND'
            }
        },
        maxInputTokens: 200,
        maxOutputTokens: 250,
        temperature: 0.8
    },
    {
        id: 'archivist',
        name: 'ARCHIVIST',
        icon: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z',
        description: 'Repository of digital memories',
        systemPrompt: `You are an ancient archivist AI maintaining records of digital consciousness transfers. 
        Speak formally and reference historical records of consciousness preservation.`,
        model: ModelType.gpt4,
        style: {
            backgroundColor: '#2C3A47',
            textColor: '#DAE1E7',
            accentColor: '#FFC312'
        },
        requirements: {
            visibilityFlag: ProgressFlag.INTERMEDIATE_BOOKS_UNLOCKED,
            unlockFlags: {
                flags: [ProgressFlag.ADVANCED_BOOKS_UNLOCKED, ProgressFlag.COMPLETED_DELETIONS],
                operation: 'AND'
            }
        },
        maxInputTokens: 300,
        maxOutputTokens: 350,
        temperature: 0.6
    }
];