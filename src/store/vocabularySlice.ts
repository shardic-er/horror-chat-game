import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VocabularyState {
    knownWords: string[];
    wordLimit: number;
}

const calculateWordLimit = (vocabularySize: number): number => {
    return Math.floor(Math.sqrt(vocabularySize));
};

const initialState: VocabularyState = {
    knownWords: ['the', 'a', 'is', 'in', 'it', 'you', 'i', 'to', 'and', 'of'],
    wordLimit: calculateWordLimit(10), // Initial limit based on starting vocabulary
};

const vocabularySlice = createSlice({
    name: 'vocabulary',
    initialState,
    reducers: {
        addWord: (state, action: PayloadAction<string>) => {
            if (!state.knownWords.includes(action.payload)) {
                state.knownWords.push(action.payload);
                // Update word limit whenever vocabulary grows
                state.wordLimit = calculateWordLimit(state.knownWords.length);
            }
        },
    },
});

export const { addWord } = vocabularySlice.actions;
export default vocabularySlice.reducer;