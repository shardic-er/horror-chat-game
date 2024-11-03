import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch, RootState } from '../../types/store.types';
import {
    UserData,
    ChatMessage,
    ChatError,
    ChatHistory,
    AIPartner
} from '../../types/gameTypes';
import {
    loadUser,
    saveUser,
    createNewUser,
    updateUser
} from '../../services/userService';
import { LLMClient } from '../../services/llmClient';
import { AI_PARTNERS } from '../../config/aiPartners';
import { getApiKey } from '../../services/apiKeyService';
import { setProgressFlags } from './vocabularySlice';


export interface GameSlice {
    currentUser: UserData | null;
    chatHistories: Record<string, ChatHistory>;
    availablePartners: AIPartner[];
    currentPartnerId?: string;
    isInitialized: boolean;
    error?: string;
    chatState: {
        isLoading: boolean;
        error: ChatError | null;
        messageQueue: string[];
        retryCount: number;
    };
}

// Enhanced initial state with chat-specific fields
const initialState: GameSlice = {
    currentUser: null,
    chatHistories: {},
    availablePartners: AI_PARTNERS,
    currentPartnerId: AI_PARTNERS[0].id,
    isInitialized: false,
    error: undefined,
    chatState: {
        isLoading: false,
        error: null,
        messageQueue: [],
        retryCount: 0
    }
};

// Async thunk for sending messages
export const sendMessage = createAsyncThunk<
    string,
    { message: string; partnerId: string },
    { state: RootState }
    >(
    'game/sendMessage',
    async ({ message, partnerId }, { getState, rejectWithValue }) => {
        console.log('User Message:', message); // Debug logging

        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('API key not found');
        }

        const state = getState();
        const partner = state.game.availablePartners.find(p => p.id === partnerId);
        if (!partner) {
            throw new Error('AI partner not found');
        }

        const chatHistory = state.game.chatHistories[partnerId]?.messages || [];
        console.log('Chat History:', chatHistory); // Debug logging

        try {
            const llmClient = new LLMClient(apiKey);
            const response = await llmClient.generateResponse(
                partner,
                chatHistory,
                message
            );
            console.log('AI Response:', response); // Debug logging
            return response;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        resetChatHistory: (state, action: PayloadAction<string>) => {
            const partnerId = action.payload;
            state.chatHistories[partnerId] = {
                partnerId,
                messages: []
            };
        },
        setCurrentUser: (state, action: PayloadAction<UserData>) => {
            state.currentUser = action.payload;
        },
        updateUserData: (state, action: PayloadAction<Partial<UserData>>) => {
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
        setCurrentPartner: (state, action: PayloadAction<string>) => {
            state.currentPartnerId = action.payload;
        },
        clearChatError: (state) => {
            state.chatState.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },
        resetChatState: (state) => {
            state.chatState = initialState.chatState;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle sendMessage lifecycle
            .addCase(sendMessage.pending, (state) => {
                state.chatState.isLoading = true;
                state.chatState.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.chatState.isLoading = false;
                state.chatState.retryCount = 0;

                // Add AI response to chat history
                if (state.currentPartnerId) {
                    const aiMessage: ChatMessage = {
                        id: uuidv4(),
                        sender: state.currentPartnerId,
                        content: action.payload
                    };

                    if (!state.chatHistories[state.currentPartnerId]) {
                        state.chatHistories[state.currentPartnerId] = {
                            partnerId: state.currentPartnerId,
                            messages: []
                        };
                    }

                    state.chatHistories[state.currentPartnerId].messages.push(aiMessage);
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.chatState.isLoading = false;
                state.chatState.error = {
                    message: action.payload as string || 'Failed to send message',
                    timestamp: new Date().toISOString()
                };
                state.chatState.retryCount += 1;
            })
            .addCase(setProgressFlags, (state, action) => {
                if (state.currentUser) {
                    state.currentUser.progressFlags = action.payload;
                }
            });
    }
});

// Export actions
export const {
    setCurrentUser,
    updateUserData,
    addChatMessage,
    setCurrentPartner,
    clearChatError,
    setError,
    setInitialized,
    resetChatState,
    resetChatHistory,
} = gameSlice.actions;

// Thunk for initializing the game
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

// Thunk for updating user state
export const updateUserState = (updates: Partial<UserData>) => async (dispatch: AppDispatch) => {
    try {
        const updatedUser = updateUser(updates);
        dispatch(setCurrentUser(updatedUser));
    } catch (error) {
        dispatch(setError('Failed to update user state'));
    }
};

// Helper thunk for sending a message and handling the response
export const sendChatMessage = (message: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const { currentPartnerId } = state.game;

    if (!currentPartnerId) {
        dispatch(setError('No AI partner selected'));
        return;
    }

    // First add the user's message to the chat history
    const userMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'user',
        content: message
    };

    dispatch(addChatMessage({
        partnerId: currentPartnerId,
        message: userMessage
    }));

    // Then send the message to the AI
    try {
        await dispatch(sendMessage({ message, partnerId: currentPartnerId }));
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

export default gameSlice.reducer;