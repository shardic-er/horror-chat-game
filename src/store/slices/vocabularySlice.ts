import {createSlice, createAsyncThunk, createAction} from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../types/store.types';
import { loadUser, saveUser} from '../../services/userService';
import { LLMClient } from '../../services/llmClient';
import { createTypoValidationService } from '../../services/typoValidationService';
import { getApiKey } from '../../services/apiKeyService';
import { ProgressFlag } from '../../types/gameTypes';
import { updateUserState } from './gameSlice';
import GameLogger from "../../services/loggerService";
import { createSelector } from '@reduxjs/toolkit';
import { storage } from '../../services/storageService';
import { initializeProgressFlags, ensureCompleteFlags } from '../../utils/progressFlags';

export interface VocabularySlice {
    knownWords: string[];
    forgottenWords: string[];
    validatedTypoCount: number;
    wordLimit: number;
    isProcessingVariations: boolean;
}

export interface MistakeProgress {
    current: number;
    max: number;
    isComplete: boolean;
}

const VOCABULARY_THRESHOLDS = {
    BASIC: 200,
    INTERMEDIATE: 5000,
    ADVANCED: 20000
} as const;

// Initialize state from storage
const getInitialState = (): VocabularySlice => {
    const knownWords = storage.getVocabularyWithFallback();
    const userData = storage.getUserData();

    return {
        knownWords,
        forgottenWords: userData?.forgottenWords || [],
        validatedTypoCount: userData?.validatedTypoCount || 0,
        wordLimit: calculateWordLimit(knownWords.length),
        isProcessingVariations: false
    };
};

// Helper for determining book access flags
const determineBookAccess = (
    vocabularySize: number,
    currentFlags: Partial<Record<ProgressFlag, boolean>>
): Record<ProgressFlag, boolean> => {
    const flags = ensureCompleteFlags(currentFlags);

    flags[ProgressFlag.BASIC_BOOKS_UNLOCKED] =
        vocabularySize >= VOCABULARY_THRESHOLDS.BASIC;
    flags[ProgressFlag.INTERMEDIATE_BOOKS_UNLOCKED] =
        vocabularySize >= VOCABULARY_THRESHOLDS.INTERMEDIATE;
    flags[ProgressFlag.ADVANCED_BOOKS_UNLOCKED] =
        vocabularySize >= VOCABULARY_THRESHOLDS.ADVANCED;

    return flags;
};

// Event dispatch helpers
const dispatchWordEvent = (eventName: 'wordForgotten' | 'wordDiscovered', words: string[]) => {
    GameLogger.logGameState({
        type: 'Memory Recovery',
        action: `Dispatching ${eventName} Event`,
        words
    });

    const event = new CustomEvent(eventName, {
        detail: { words },
        bubbles: false // Prevent event bubbling
    });

    document.dispatchEvent(event);
};

const calculateWordLimit = (vocabularySize: number): number => {
    return Math.floor(Math.sqrt(vocabularySize));
};

// Memoized base selector
const selectValidatedTypoCount = (state: RootState) => state.vocabulary.validatedTypoCount;

// Word variations thunk
export const getWordVariations = createAsyncThunk(
    'vocabulary/getVariations',
    async (word: string) => {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error('API key not found');

        const llmClient = new LLMClient(apiKey);
        const systemPrompt = `You are a linguistic assistant. Given a word, respond only with a JSON array of its most common and natural inflections or derived forms based on its primary part of speech (verb, noun, adjective, or adverb). Do not include synonyms or related words. Focus on relevant forms such as plurals for nouns, tenses for verbs, comparative/superlative for adjectives, and standard variations for adverbs. Exclude rare or uncommon forms.`;
        const prompt = `Given the word "${word}", provide a JSON array of its common and natural variations according to the instructions.`;

        try {
            const response = await llmClient.generateResponse(
                {
                    id: 'vocabulary',
                    name: 'VOCABULARY',
                    systemPrompt,
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
                return variations.filter(v =>
                    v.trim() !== '' &&
                    v.toLowerCase() !== word.toLowerCase()
                );
            } catch (error) {
                console.error('Error parsing variations:', error);
                return [];
            }
        } catch (error) {
            console.error('Error getting variations:', error);
            return [];
        }
    }
);

const vocabularySlice = createSlice({
    name: 'vocabulary',
    initialState: getInitialState(),
    reducers: {
        addWord: (state, action) => {
            const word = action.payload.toLowerCase();
            if (!state.knownWords.includes(word)) {
                state.knownWords.push(word);
                state.wordLimit = calculateWordLimit(state.knownWords.length);
                storage.setVocabulary(state.knownWords);
            }
        },
        addWords: (state, action) => {
            const newWords = action.payload
                .map((w: string) => w.toLowerCase())
                .filter((w: string) => !state.knownWords.includes(w));

            if (newWords.length > 0) {
                state.knownWords.push(...newWords);
                state.wordLimit = calculateWordLimit(state.knownWords.length);
                storage.setVocabulary(state.knownWords);
            }
        },
        removeWords: (state, action) => {
            const wordsToRemove = action.payload.map((w: string) => w.toLowerCase());
            state.knownWords = state.knownWords.filter(word =>
                !wordsToRemove.includes(word.toLowerCase())
            );
            state.forgottenWords.push(...wordsToRemove);
            state.wordLimit = calculateWordLimit(state.knownWords.length);

            storage.setVocabulary(state.knownWords);
            storage.setForgottenWords(state.forgottenWords);
        },
        updateTypoCount: (state, action) => {
            state.validatedTypoCount = Math.min(100, state.validatedTypoCount + action.payload);
            const userData = storage.getItem<any>('horror_game_user_data') || {};
            storage.setItem('horror_game_user_data', {
                ...userData,
                validatedTypoCount: state.validatedTypoCount
            });
        }
    }
});

export const selectMistakeProgress = createSelector(
    [selectValidatedTypoCount],
    (typoCount) => ({
        current: typoCount,
        max: 100,
        isComplete: typoCount >= 100
    })
);

export const {
    addWord,
    addWords,
    removeWords,
    updateTypoCount
} = vocabularySlice.actions;

export const setProgressFlags = createAction<Record<ProgressFlag, boolean>>('vocabulary/setProgressFlags');

// Thunk for adding new words
export const addNewWord = (word: string) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        const state = getState();
        const wordLower = word.toLowerCase();

        if (!state.vocabulary.knownWords.includes(wordLower)) {
            GameLogger.logWordDiscovery(wordLower, 'Initial discovery');

            try {
                dispatch(addWord(wordLower));
                dispatchWordEvent('wordDiscovered', [wordLower]);

                const variations = await dispatch(getWordVariations(wordLower)).unwrap();

                if (variations?.length > 0) {
                    const newVariations = variations.filter(v => {
                        const varLower = v.toLowerCase();
                        return !state.vocabulary.knownWords.includes(varLower) &&
                            varLower !== wordLower;
                    });

                    if (newVariations.length > 0) {
                        dispatch(addWords(newVariations));
                        dispatchWordEvent('wordDiscovered', newVariations);
                    }
                }

                const finalState = getState();
                const vocabularySize = finalState.vocabulary.knownWords.length;
                const currentFlags = finalState.game.currentUser?.progressFlags || initializeProgressFlags();

                const newFlags = determineBookAccess(vocabularySize, currentFlags);

                if (JSON.stringify(newFlags) !== JSON.stringify(currentFlags)) {
                    dispatch(setProgressFlags(newFlags));
                    dispatch(updateUserState({ progressFlags: newFlags }));
                }

                storage.updateUserData({
                    vocabulary: finalState.vocabulary.knownWords,
                    progressFlags: newFlags
                });

            } catch (error) {
                GameLogger.logError('addNewWord', error);
            }
        }
    };

// Thunk for forgetting words
export const forgetWords = (words: string[]) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        const state = getState();

        GameLogger.logGameState({
            type: 'Forget Words Request',
            requestedWords: words,
            currentValidatedTypoCount: state.vocabulary.validatedTypoCount,
            currentVocabularySize: state.vocabulary.knownWords.length,
            currentForgottenWordsSize: state.vocabulary.forgottenWords.length,
            timestamp: new Date().toISOString()
        });

        const wordsToForget = words.filter(word =>
            !state.vocabulary.forgottenWords.includes(word.toLowerCase())
        );

        if (wordsToForget.length === 0) {
            GameLogger.logGameState({
                type: 'Forget Words Skipped',
                reason: 'All words already forgotten',
                requestedWords: words,
                timestamp: new Date().toISOString()
            });
            return;
        }

        try {
            const apiKey = getApiKey();
            if (!apiKey) {
                GameLogger.logError('Forget Words - API Key Missing', new Error('API key not found'));
                throw new Error('API key not found');
            }

            const validationService = createTypoValidationService(apiKey);

            GameLogger.logGameState({
                type: 'Typo Validation Started',
                wordsToValidate: wordsToForget,
                timestamp: new Date().toISOString()
            });

            const validationResult = await validationService.validateWords(wordsToForget);
            const validTypoCount = Object.values(validationResult).filter(isTypo => isTypo).length;

            GameLogger.logGameState({
                type: 'Typo Validation Complete',
                wordsChecked: wordsToForget,
                validationResults: validationResult,
                validTypoCount,
                timestamp: new Date().toISOString()
            });

            // First remove the words
            dispatch(removeWords(wordsToForget));

            // Then dispatch the event once
            dispatchWordEvent('wordForgotten', wordsToForget);

            if (validTypoCount > 0) {
                dispatch(updateTypoCount(validTypoCount));

                GameLogger.logGameState({
                    type: 'Typo Count Updated',
                    addedCount: validTypoCount,
                    previousTotal: state.vocabulary.validatedTypoCount,
                    newTotal: state.vocabulary.validatedTypoCount + validTypoCount,
                    timestamp: new Date().toISOString()
                });
            }

            // Check progress flag update
            const newState = getState();
            const shouldUpdateFlag =
                newState.vocabulary.validatedTypoCount >= 100 &&
                !newState.game.currentUser?.progressFlags[ProgressFlag.COMPLETED_DELETIONS];

            if (shouldUpdateFlag) {
                GameLogger.logGameState({
                    type: 'Progress Flag Update',
                    flag: ProgressFlag.COMPLETED_DELETIONS,
                    newValue: true,
                    reason: 'Reached 100 validated typos',
                    validatedTypoCount: newState.vocabulary.validatedTypoCount,
                    timestamp: new Date().toISOString()
                });

                const currentFlags = newState.game.currentUser?.progressFlags || initializeProgressFlags();
                dispatch(updateUserState({
                    progressFlags: {
                        ...currentFlags,
                        [ProgressFlag.COMPLETED_DELETIONS]: true
                    }
                }));
            }

            // Update user data
            const currentUser = loadUser();
            if (currentUser) {
                const updatedUser = {
                    ...currentUser,
                    vocabulary: newState.vocabulary.knownWords,
                    forgottenWords: newState.vocabulary.forgottenWords,
                    validatedTypoCount: newState.vocabulary.validatedTypoCount
                };

                GameLogger.logGameState({
                    type: 'User State Update',
                    vocabularySize: updatedUser.vocabulary.length,
                    forgottenWordsSize: updatedUser.forgottenWords.length,
                    validatedTypoCount: updatedUser.validatedTypoCount,
                    timestamp: new Date().toISOString()
                });

                saveUser(updatedUser);
            }

        } catch (error) {
            GameLogger.logError('Forget Words Process Error', {
                error,
                wordsAttempted: wordsToForget,
                state: {
                    vocabularySize: state.vocabulary.knownWords.length,
                    forgottenWordsSize: state.vocabulary.forgottenWords.length,
                    validatedTypoCount: state.vocabulary.validatedTypoCount
                }
            });

            // In case of error, still remove words and dispatch event
            dispatch(removeWords(wordsToForget));
            dispatchWordEvent('wordForgotten', wordsToForget);
        }
    };

export default vocabularySlice.reducer;