// src/store/slices/vocabularySlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../types/store.types';
import {addWordToVocabulary, loadUser, saveUser} from '../../services/userService';
import { LLMClient } from '../../services/llmClient';
import { getApiKey } from '../../services/apiKeyService';
import { createSelector} from "@reduxjs/toolkit";

export interface VocabularySlice {
    knownWords: string[];
    forgottenWords: string[];
    validatedTypoCount: number;
    wordLimit: number;
    isProcessingVariations: boolean;
}

const dispatchWordForgottenEvent = (words: string[]) => {
    const event = new CustomEvent('wordForgotten', {
        detail: { words }
    });
    document.dispatchEvent(event);
};

export const getWordVariations = createAsyncThunk(
    'vocabulary/getVariations',
    async (word: string) => {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error('API key not found');

        const llmClient = new LLMClient(apiKey);
        const prompt = `Given the word "${word}", provide a JSON array of only the most common and natural variations that would appear in everyday English. Focus on:
- Regular plural forms (if a noun)
- Possessive forms (if a noun)
- Present/past tense (if a verb)
- Common derived forms
Do not include rare or uncommon variations. Format as JSON array. Example responses:
For "cat": ["cat's", "cats", "cats'"]
For "run": ["runs", "running", "ran"]
For "happy": ["happier", "happiest"]
For "fun": []`;

        try {
            const response = await llmClient.generateResponse(
                {
                    id: 'vocabulary',
                    name: 'VOCABULARY',
                    systemPrompt: 'You are a linguistic assistant. Respond only with a JSON array of common word variations. Be conservative and only include natural, frequently used forms.',
                    maxInputTokens: 100,
                    maxOutputTokens: 100,
                    temperature: 0.1
                },
                [],
                prompt,
                'gpt-3.5-turbo'
            );

            try {
                const variations = JSON.parse(response) as string[];
                return variations
                    .filter(v =>
                        v.trim() !== '' &&
                        v.toLowerCase() !== word.toLowerCase()
                    )
                    .filter((v, i, arr) =>
                        arr.findIndex(item =>
                            item.toLowerCase() === v.toLowerCase()
                        ) === i
                    );
            } catch (error) {
                return [];
            }
        } catch (error) {
            return [];
        }
    }
);

export const validateTypos = createAsyncThunk(
    'vocabulary/validateTypos',
    async (words: string[]) => {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error('API key not found');

        const llmClient = new LLMClient(apiKey);
        const prompt = `For each word in this list, determine if it appears to be a typo or grammatical mistake. Consider a word a mistake if it's:
1. A misspelling of a real word
2. An incorrect grammatical form (like "runned")
3. A double punctuation mistake (like "didn't't")
4. A nonsensical combination of valid words
Return a JSON object with each word as a key and a boolean as value. Words: ${words.join(', ')}`;

        try {
            console.log('Validating typos for words:', words);
            const response = await llmClient.generateResponse(
                {
                    id: 'vocabulary',
                    name: 'VOCABULARY',
                    systemPrompt: 'You are a linguistic validator. Respond only with a JSON object mapping words to boolean values indicating if they are typos/mistakes.',
                    maxInputTokens: 100,
                    maxOutputTokens: 100,
                    temperature: 0.1
                },
                [],
                prompt,
                'gpt-3.5-turbo'
            );

            console.log('Typo validation response:', response);
            const result = JSON.parse(response) as Record<string, boolean>;
            console.log('Parsed typo validation result:', result);
            return result;
        } catch (error) {
            console.error('Error validating typos:', error);
            return {};
        }
    }
);

const calculateWordLimit = (vocabularySize: number): number => {
    return Math.floor(Math.sqrt(vocabularySize));
};

const getUserVocabulary = (): string[] => {
    const userData = loadUser();
    return userData?.vocabulary || ['the', 'a', 'is', 'in', 'it', 'you', 'i', 'to', 'and', 'of'];
};

const getUserForgottenWords = (): string[] => {
    const userData = loadUser();
    return userData?.forgottenWords || [];
};

const getUserTypoCount = (): number => {
    const userData = loadUser();
    return userData?.validatedTypoCount || 0;
};

const initialState: VocabularySlice = {
    knownWords: getUserVocabulary(),
    forgottenWords: getUserForgottenWords(),
    validatedTypoCount: getUserTypoCount(),
    wordLimit: calculateWordLimit(getUserVocabulary().length),
    isProcessingVariations: false
};

const vocabularySlice = createSlice({
    name: 'vocabulary',
    initialState,
    reducers: {
        setVocabulary: (state, action: PayloadAction<string[]>) => {
            state.knownWords = action.payload;
            state.wordLimit = calculateWordLimit(action.payload.length);
        },
        addWord: (state, action: PayloadAction<string>) => {
            const word = action.payload.toLowerCase();
            if (!state.knownWords.includes(word)) {
                state.knownWords.push(word);
                state.wordLimit = calculateWordLimit(state.knownWords.length);
                console.log('Added word:', word);
                console.log('Updated vocabulary:', state.knownWords);
            }
        },
        addWords: (state, action: PayloadAction<string[]>) => {
            const newWords = action.payload
                .map(w => w.toLowerCase())
                .filter(w => !state.knownWords.includes(w));

            if (newWords.length > 0) {
                state.knownWords.push(...newWords);
                state.wordLimit = calculateWordLimit(state.knownWords.length);
                console.log('Added words:', newWords);
                console.log('Updated vocabulary:', state.knownWords);
            }
        },
        removeWords: (state, action: PayloadAction<string[]>) => {
            const wordsToRemove = action.payload.map(w => w.toLowerCase());
            state.knownWords = state.knownWords.filter(word =>
                !wordsToRemove.includes(word.toLowerCase())
            );
            state.forgottenWords.push(...wordsToRemove);
            state.wordLimit = calculateWordLimit(state.knownWords.length);
        },
        updateTypoCount: (state, action: PayloadAction<number>) => {
            state.validatedTypoCount = Math.min(100, state.validatedTypoCount + action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWordVariations.pending, (state) => {
                state.isProcessingVariations = true;
            })
            .addCase(getWordVariations.fulfilled, (state) => {
                state.isProcessingVariations = false;
            })
            .addCase(getWordVariations.rejected, (state) => {
                state.isProcessingVariations = false;
            })
            .addCase(validateTypos.fulfilled, (state, action) => {
                const newTypoCount = Object.values(action.payload).filter(Boolean).length;
                state.validatedTypoCount = Math.min(100, state.validatedTypoCount + newTypoCount);
            });
    },
});

export const {
    setVocabulary,
    addWord,
    addWords,
    removeWords,
    updateTypoCount
} = vocabularySlice.actions;

export const addNewWord = (word: string) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        const state = getState();
        const currentVocabulary = state.vocabulary.knownWords.map(w => w.toLowerCase());

        if (!currentVocabulary.includes(word.toLowerCase())) {
            const updatedUser = addWordToVocabulary(word);
            if (updatedUser) {
                dispatch(addWord(word));

                try {
                    const variations = await dispatch(getWordVariations(word)).unwrap();
                    if (variations && variations.length > 0) {
                        const newVariations = variations.filter(
                            v => !currentVocabulary.includes(v.toLowerCase())
                        );

                        if (newVariations.length > 0) {
                            const variationsEvent = new CustomEvent('wordDiscovered', {
                                detail: {
                                    words: newVariations,
                                }
                            });
                            document.dispatchEvent(variationsEvent);

                            dispatch(addWords(newVariations));
                            newVariations.forEach(variation => {
                                addWordToVocabulary(variation);
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error processing word variations:', error);
                }
            }
        }
    };

export const forgetWords = (words: string[]) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        const state = getState();
        const wordsToForget = words.filter(word =>
            !state.vocabulary.forgottenWords.includes(word.toLowerCase())
        );

        if (wordsToForget.length === 0) return;

        // The validateTypos call updates the validatedTypoCount through the reducer
        await dispatch(validateTypos(wordsToForget)).unwrap();

        // Remove words from vocabulary and update cookie
        dispatch(removeWords(wordsToForget));
        dispatchWordForgottenEvent(wordsToForget);

        // Get current state after updates
        const newState = getState();

        // Update user data in cookie
        const currentUser = loadUser();
        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                vocabulary: newState.vocabulary.knownWords,
                forgottenWords: newState.vocabulary.forgottenWords,
                validatedTypoCount: newState.vocabulary.validatedTypoCount
            };
            saveUser(updatedUser);
        }
    };

export const selectMistakeProgress = createSelector(
    [(state: RootState) => state.vocabulary.validatedTypoCount],
    (validatedTypoCount) => ({
        current: validatedTypoCount,
        max: 100,
        isComplete: validatedTypoCount >= 100
    })
);
export default vocabularySlice.reducer;