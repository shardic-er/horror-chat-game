import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from './store';
import { GameState, UserData, ChatMessage } from '../types/gameTypes';
import { loadUser, saveUser, createNewUser, updateUser } from '../services/userService';

const initialState: GameState = {
    currentUser: null,
    chatHistories: {},
    availablePartners: [],
    isInitialized: false,
    error: undefined
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<UserData>) => {
            state.currentUser = action.payload;
        },
        updateUserData: (state, action: PayloadAction<Partial<UserData>>) => {
            if (state.currentUser) {
                state.currentUser = {
                    ...state.currentUser,
                    ...action.payload
                };
                // Note: The actual cookie update happens in the thunk
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
        },
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        }
    }
});

export const {
    setCurrentUser,
    updateUserData,
    addChatMessage,
    setError,
    setInitialized
} = gameSlice.actions;

// Thunks for user data management
export const initializeGame = () => async (dispatch: AppDispatch) => {
    try {
        let userData = loadUser();

        if (!userData) {
            userData = createNewUser();
            saveUser(userData);
        }

        dispatch(setCurrentUser(userData));
        dispatch(setInitialized(true));
    } catch (error) {
        dispatch(setError('Failed to initialize game'));
    }
};

export const updateUserState = (updates: Partial<UserData>) => async (dispatch: AppDispatch) => {
    try {
        const updatedUser = updateUser(updates);
        dispatch(setCurrentUser(updatedUser));
    } catch (error) {
        dispatch(setError('Failed to update user state'));
    }
};

export default gameSlice.reducer;