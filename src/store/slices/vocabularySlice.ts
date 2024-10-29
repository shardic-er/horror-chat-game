// src/store/vocabularySlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../types/store.types';
import { addWordToVocabulary, loadUser } from '../../services/userService';
import { LLMClient } from '../../services/llmClient';
import { getApiKey } from '../../services/apiKeyService';

export interface VocabularySlice {
    knownWords: string[];
    wordLimit: number;
    isProcessingVariations: boolean;
}

const dispatchWordDiscoveryEvent = (word: string, sourceElement: HTMLElement | null) => {
    console.log('Dispatching word discovery event:', { word, sourceElement }); // Debug log

    const event = new CustomEvent('wordDiscovered', {
        detail: {
            words: [word],
            sourceElement
        }
    });

    document.dispatchEvent(event);
    console.log('Event dispatched'); // Debug log
};

// Custom event for variation discoveries
const dispatchVariationsDiscoveryEvent = (variations: string[], sourceElement: HTMLElement | null) => {
    const event = new CustomEvent('wordDiscovered', {
        detail: {
            words: variations,
            sourceElement
        }
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
                const uniqueVariations = variations
                    .filter(v => v.trim() !== '' && v.toLowerCase() !== word.toLowerCase())
                    .reduce((acc: string[], current) => {
                        const lcCurrent = current.toLowerCase();
                        if (!acc.some(item => item.toLowerCase() === lcCurrent)) {
                            acc.push(current);
                        }
                        return acc;
                    }, []);

                return uniqueVariations;
            } catch (error) {
                return [];
            }
        } catch (error) {
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

const initialState: VocabularySlice = {
    knownWords: getUserVocabulary(),
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
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWordVariations.pending, (state) => {
                state.isProcessingVariations = true;
            })
            .addCase(getWordVariations.fulfilled, (state, action) => {
                state.isProcessingVariations = false;
                // Add variations is handled in the thunk
            })
            .addCase(getWordVariations.rejected, (state) => {
                state.isProcessingVariations = false;
            });
    }
});

export const { setVocabulary, addWord, addWords } = vocabularySlice.actions;

export const addNewWord = (word: string) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        const state = getState();
        const currentVocabulary = state.vocabulary.knownWords.map(w => w.toLowerCase());

        // Only process the word if it's actually new
        if (!currentVocabulary.includes(word.toLowerCase())) {
            // Add to vocabulary through normal means
            const updatedUser = addWordToVocabulary(word);
            if (updatedUser) {
                dispatch(addWord(word));

                // Get variations
                try {
                    const variations = await dispatch(getWordVariations(word)).unwrap();
                    if (variations && variations.length > 0) {
                        // Filter out variations we already know
                        const newVariations = variations.filter(
                            v => !currentVocabulary.includes(v.toLowerCase())
                        );

                        if (newVariations.length > 0) {
                            // Dispatch variations discovered event only for new variations
                            const variationsEvent = new CustomEvent('wordDiscovered', {
                                detail: {
                                    words: newVariations,
                                }
                            });
                            document.dispatchEvent(variationsEvent);

                            // Add new variations to vocabulary
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

export default vocabularySlice.reducer;