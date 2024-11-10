// src/store/slices/memoryRecoverySlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiKey } from '../../services/apiKeyService';
import { LLMClient } from '../../services/llmClient';
import { AppDispatch, RootState } from '../../types/store.types';
import { addWords } from './vocabularySlice';
import GameLogger from '../../services/loggerService';

export interface TargetWord {
    word: string;
    recovered: boolean;
    essay?: string;
}

interface MemoryRecoveryState {
    targetWords: TargetWord[];
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;
    wordVariationsEnabled: boolean;
}

const initialState: MemoryRecoveryState = {
    targetWords: [],
    isInitialized: false,
    isLoading: false,
    error: null,
    wordVariationsEnabled: true
};

const WORDS_PROMPT = `Generate 10 intermediate difficulty English words that would be challenging but achievable for someone learning English. Format the response as a JSON array of words. The words should be meaningful and have rich semantic content that could inspire thoughtful essays.

Example format:
{
    "words": ["benevolent", "ephemeral", "serendipity", "resilient", "enigmatic", "ethereal", "cognizant", "melancholy", "paradox", "synchronicity"]
}

Respond ONLY with the JSON, no additional text.`;

const ESSAY_PROMPT = `You are the subconscious ghost of an amnesiac woman, writing about a word that has been recovered from the depths of memory. Write a poetic, introspective essay of approximately 100 words on the provided word. The essay should feel personal, haunting, and intimate - as if remembering something long forgotten. The tone should be slightly mysterious but hopeful.

Word to write about: `;

export const initializeTargetWords = createAsyncThunk(
    'memoryRecovery/initialize',
    async (_, { rejectWithValue }) => {
        const apiKey = getApiKey();
        if (!apiKey) return rejectWithValue('API key not found');

        try {
            const llmClient = new LLMClient(apiKey);
            const response = await llmClient.generateResponse(
                {
                    id: 'wordGenerator',
                    name: 'Word Generator',
                    systemPrompt: 'You are a linguistic expert specializing in vocabulary.',
                    maxInputTokens: 100,
                    maxOutputTokens: 200,
                    temperature: 0.7
                },
                [],
                WORDS_PROMPT,
                'gpt-3.5-turbo'
            );

            const parsedResponse = JSON.parse(response);
            return parsedResponse.words.map((word: string) => ({
                word: word.toLowerCase(),
                recovered: false
            }));
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const generateMemoryEssay = createAsyncThunk(
    'memoryRecovery/generateEssay',
    async (word: string, { rejectWithValue }) => {
        const apiKey = getApiKey();
        if (!apiKey) return rejectWithValue('API key not found');

        try {
            const llmClient = new LLMClient(apiKey);
            const response = await llmClient.generateResponse(
                {
                    id: 'essayGenerator',
                    name: 'Essay Generator',
                    systemPrompt: 'You are the subconscious ghost of an amnesiac woman, to write a short ~100 word essay on the provided word:',
                    maxInputTokens: 100,
                    maxOutputTokens: 500,
                    temperature: 0.8
                },
                [],
                ESSAY_PROMPT + word,
                'gpt-4'
            );

            return { word, essay: response };
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

// Helper function to extract words from essay text
const extractWords = (text: string): string[] => {
    return text
        .toLowerCase()
        .replace(/[.,!?;:'"]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2);  // Filter out very short words
};

// Thunk to handle the complete word recovery process
export const recoverWord = (word: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const targetWord = state.memoryRecovery.targetWords.find(tw =>
        tw.word.toLowerCase() === word.toLowerCase()
    );

    if (!targetWord || targetWord.recovered) {
        return;
    }

    try {
        const result = await dispatch(generateMemoryEssay(word)).unwrap();
        if (result.essay) {
            // Only add words to vocabulary if variations are enabled
            if (state.memoryRecovery.wordVariationsEnabled) {
                const wordsFromEssay = extractWords(result.essay);
                dispatch(addWords(wordsFromEssay));
            }

            dispatch(markWordRecovered({ word, essay: result.essay }));

            // Dispatch event for word collection animation
            const event = new CustomEvent('wordDiscovered', {
                detail: {
                    words: state.memoryRecovery.wordVariationsEnabled ? extractWords(result.essay) : [word]
                }
            });
            document.dispatchEvent(event);
        }
    } catch (error) {
        GameLogger.logError('Word Recovery', error);
    }
};


const memoryRecoverySlice = createSlice({
    name: 'memoryRecovery',
    initialState,
    reducers: {
        markWordRecovered: (state, action) => {
            const { word, essay } = action.payload;
            const targetWord = state.targetWords.find(tw => tw.word === word);
            if (targetWord) {
                targetWord.recovered = true;
                targetWord.essay = essay;
            }
        },
        setWordVariationsEnabled: (state, action) => {
            state.wordVariationsEnabled = action.payload;
        },
        resetMemoryRecovery: (state) => {
            state.targetWords = [];
            state.isInitialized = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeTargetWords.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(initializeTargetWords.fulfilled, (state, action) => {
                state.targetWords = action.payload;
                state.isInitialized = true;
                state.isLoading = false;
            })
            .addCase(initializeTargetWords.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const {
    markWordRecovered,
    setWordVariationsEnabled,
    resetMemoryRecovery
} = memoryRecoverySlice.actions;

// Selectors
export const selectTargetWords = (state: RootState) => state.memoryRecovery.targetWords;
export const selectIsInitialized = (state: RootState) => state.memoryRecovery.isInitialized;
export const selectIsLoading = (state: RootState) => state.memoryRecovery.isLoading;
export const selectError = (state: RootState) => state.memoryRecovery.error;

export default memoryRecoverySlice.reducer;