import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, UserData, ChatMessage } from '../types/gameTypes';
import { v4 as uuidv4 } from 'uuid';

const initialVocabulary = ['the', 'a', 'is', 'in', 'it', 'you', 'i', 'to', 'and', 'of'];

const createNewUser = (): UserData => ({
    id: uuidv4(),
    vocabulary: initialVocabulary,
    progressFlags: {},
    isRegistered: false
});

const initialState: GameState = {
    currentUser: null,
    chatHistories: {},
    availablePartners: [],
    isInitialized: false
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        initializeGame: (state) => {
            if (!state.currentUser) {
                state.currentUser = createNewUser();
            }
            state.isInitialized = true;
        },
        updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
            if (state.currentUser) {
                state.currentUser = {
                    ...state.currentUser,
                    ...action.payload
                };
            }
        },
        addChatMessage: (state, action: PayloadAction<{
            partnerId: string,
            message: ChatMessage
        }>) => {
            const { partnerId, message } = action.payload;
            if (!state.chatHistories[partnerId]) {
                state.chatHistories[partnerId] = {
                    partnerId,
                    messages: []
                };
            }
            state.chatHistories[partnerId].messages.push(message);
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        }
    }
});

export const {
    initializeGame,
    updateUser,
    addChatMessage,
    setError
} = gameSlice.actions;

export default gameSlice.reducer;