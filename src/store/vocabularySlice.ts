import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VocabularyState {
    // Using Set for O(1) lookups, but we'll serialize to/from array for Redux
    knownWords: string[];
    tokenLimit: number;
}

const initialState: VocabularyState = {
    knownWords: ['the', 'a', 'is', 'in', 'it', 'you', 'i', 'to', 'and', 'of'],
    tokenLimit: 10,
};

const vocabularySlice = createSlice({
    name: 'vocabulary',
    initialState,
    reducers: {
        addWord: (state, action: PayloadAction<string>) => {
            if (!state.knownWords.includes(action.payload)) {
                state.knownWords.push(action.payload);
            }
        },
        incrementTokenLimit: (state) => {
            state.tokenLimit += 1;
        },
    },
});

export const { addWord, incrementTokenLimit } = vocabularySlice.actions;
export default vocabularySlice.reducer;