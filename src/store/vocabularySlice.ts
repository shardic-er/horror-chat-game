import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from './store';
import { addWordToVocabulary, loadUser } from '../services/userService';

interface VocabularyState {
    knownWords: string[];
    wordLimit: number;
}

const calculateWordLimit = (vocabularySize: number): number => {
    return Math.floor(Math.sqrt(vocabularySize));
};

// Initialize from cookie if available, otherwise use defaults
const getUserVocabulary = (): string[] => {
    const userData = loadUser();
    return userData?.vocabulary || ['the', 'a', 'is', 'in', 'it', 'you', 'i', 'to', 'and', 'of'];
};

const initialState: VocabularyState = {
    knownWords: getUserVocabulary(),
    wordLimit: calculateWordLimit(getUserVocabulary().length),
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
            if (!state.knownWords.includes(action.payload)) {
                state.knownWords.push(action.payload);
                state.wordLimit = calculateWordLimit(state.knownWords.length);
            }
        },
    },
});

export const { setVocabulary, addWord } = vocabularySlice.actions;

// Thunk for adding words that ensures cookie sync
export const addNewWord = (word: string) => async (dispatch: AppDispatch) => {
    const updatedUser = addWordToVocabulary(word);
    if (updatedUser) {
        dispatch(setVocabulary(updatedUser.vocabulary));
    }
};

export default vocabularySlice.reducer;