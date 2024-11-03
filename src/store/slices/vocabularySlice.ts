// src/store/slices/vocabularySlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../types/store.types';
import { loadUser, saveUser } from '../../services/userService';
import { LLMClient } from '../../services/llmClient';
import { createTypoValidationService } from '../../services/typoValidationService';
import { getApiKey } from '../../services/apiKeyService';
import { ProgressFlag } from '../../types/gameTypes';
import { updateUserState } from './gameSlice';
import GameLogger from "../../services/loggerService";
import { createSelector } from '@reduxjs/toolkit';

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

const dispatchWordForgottenEvent = (words: string[]) => {
    const event = new CustomEvent('wordForgotten', {
        detail: { words }
    });
    document.dispatchEvent(event);
};

// Memoized base selectors
const selectValidatedTypoCount = (state: RootState) => state.vocabulary.validatedTypoCount;

const dispatchWordDiscoveredEvent = (words: string[]) => {
    const event = new CustomEvent('wordDiscovered', {
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
Do not include rare or uncommon variations. Format as JSON array.`;

        try {
            const response = await llmClient.generateResponse(
                {
                    id: 'vocabulary',
                    name: 'VOCABULARY',
                    systemPrompt: 'You are a linguistic assistant. Respond only with a JSON array of common word variations.',
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
        addWord: (state, action: PayloadAction<string>) => {
            const word = action.payload.toLowerCase();
            if (!state.knownWords.includes(word)) {
                state.knownWords.push(word);
                state.wordLimit = calculateWordLimit(state.knownWords.length);
                GameLogger.logGameState({
                    type: 'Redux State Update - addWord',
                    knownWords: state.knownWords
                });
            }
        },
        addWords: (state, action: PayloadAction<string[]>) => {
            const newWords = action.payload
                .map(w => w.toLowerCase())
                .filter(w => !state.knownWords.includes(w));

            if (newWords.length > 0) {
                state.knownWords.push(...newWords);
                state.wordLimit = calculateWordLimit(state.knownWords.length);
                GameLogger.logGameState({
                    type: 'Redux State Update - addWords',
                    knownWords: state.knownWords
                });
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
    }
});

// Memoized computed selector
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

// Thunk for adding new words during gameplay
// In vocabularySlice.ts

export const addNewWord = (word: string) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        const state = getState();
        const wordLower = word.toLowerCase();

        if (!state.vocabulary.knownWords.includes(wordLower)) {
            GameLogger.logWordDiscovery(wordLower, 'Initial discovery');

            try {
                // Always get fresh user data before modifications
                const currentUser = loadUser();
                if (!currentUser) {
                    GameLogger.logError('addNewWord', 'No current user found');
                    return;
                }

                // First handle the base word
                if (!currentUser.vocabulary.includes(wordLower)) {
                    // Update Redux
                    dispatch(addWord(wordLower));
                    dispatchWordDiscoveredEvent([wordLower]);

                    // Get variations
                    const variations = await dispatch(getWordVariations(wordLower)).unwrap();
                    GameLogger.logGameState({
                        type: 'Variations Received',
                        baseWord: wordLower,
                        variations
                    });

                    if (variations?.length > 0) {
                        // Filter variations against latest user data
                        const newVariations = variations.filter(v => {
                            const varLower = v.toLowerCase();
                            return !currentUser.vocabulary.includes(varLower) &&
                                varLower !== wordLower;
                        });

                        if (newVariations.length > 0) {
                            GameLogger.logVariationDiscovery(wordLower, newVariations);
                            dispatch(addWords(newVariations));
                            dispatchWordDiscoveredEvent(newVariations);
                        }
                    }

                    // Get fresh state after all dispatches
                    const finalState = getState();

                    // Get fresh user data again before final save
                    const latestUser = loadUser();
                    if (latestUser) {
                        // Merge vocabularies preserving all other user data
                        const updatedUser = {
                            ...latestUser,
                            vocabulary: finalState.vocabulary.knownWords
                        };

                        GameLogger.logGameState({
                            type: 'Pre-Save State',
                            currentWords: latestUser.vocabulary.length,
                            newWords: finalState.vocabulary.knownWords.length
                        });

                        saveUser(updatedUser);

                        // Verify save
                        const verifyUser = loadUser();
                        GameLogger.logGameState({
                            type: 'Save Verification',
                            expectedWords: finalState.vocabulary.knownWords.length,
                            actualWords: verifyUser?.vocabulary.length || 0,
                            successful: verifyUser?.vocabulary.length === finalState.vocabulary.knownWords.length
                        });
                    }
                }
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

            // Trigger animation
            dispatchWordForgottenEvent(wordsToForget);

            // Remove words and update state
            dispatch(removeWords(wordsToForget));

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

                dispatch(updateUserState({
                    progressFlags: {
                        ...newState.game.currentUser?.progressFlags,
                        [ProgressFlag.COMPLETED_DELETIONS]: true
                    }
                }));
            }

            // Update cookies
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

            // In case of error, proceed with deletion but don't increment typo count
            dispatch(removeWords(wordsToForget));
        }
    };

export default vocabularySlice.reducer;