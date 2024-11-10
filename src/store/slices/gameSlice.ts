import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {v4 as uuidv4} from 'uuid';
import {AppDispatch, RootState} from '../../types/store.types';
import {AIPartner, ChatError, ChatHistory, ChatMessage, UserData} from '../../types/gameTypes';
import {createNewUser, loadUser, saveUser, updateUser} from '../../services/userService';
import {LLMClient} from '../../services/llmClient';
import {CHAT_PARTNERS} from '../../config/aiPartners';
import {getApiKey} from '../../services/apiKeyService';
import {setProgressFlags} from './vocabularySlice';
import GameLogger from "../../services/loggerService";

export interface ChatState {
    isLoading: boolean;
    error: ChatError | null;
    messageQueue: string[];
    retryCount: number;
    loadingPartnerId?: string; // Track which partner is loading
}

export interface ChatState {
    isLoading: boolean;
    error: ChatError | null;
    messageQueue: string[];
    retryCount: number;
    loadingPartnerId?: string; // Track which partner is loading
}

export interface GameSlice {
    currentUser: UserData | null;
    chatHistories: Record<string, ChatHistory>;
    availablePartners: AIPartner[];
    currentPartnerId?: string;
    isInitialized: boolean;
    error?: string;
    chatState: ChatState
}

// Enhanced initial state with chat-specific fields
// And ensure the initial state matches:
const initialState: GameSlice = {
    currentUser: null,
    chatHistories: {},
    availablePartners: CHAT_PARTNERS,
    currentPartnerId: CHAT_PARTNERS[0].id,
    isInitialized: false,
    error: undefined,
    chatState: {
        isLoading: false,
        error: null,
        messageQueue: [],
        retryCount: 0,
        loadingPartnerId: undefined
    }
};

export const sendMessage = createAsyncThunk<
    { response: string; partnerId: string },
    { message: string; partnerId: string },
    { state: RootState }
    >(
    'game/sendMessage',
    async ({ message, partnerId }, { getState, rejectWithValue }) => {
        GameLogger.logGameState({
            type: 'Message Send Attempt',
            partnerId,
            message,
            timestamp: new Date().toISOString()
        });

        const apiKey = getApiKey();
        if (!apiKey) {
            GameLogger.logError('Message Send', new Error('API key not found'));
            throw new Error('API key not found');
        }

        const state = getState();
        const partner = state.game.availablePartners.find(p => p.id === partnerId);
        if (!partner) {
            GameLogger.logError('Message Send', new Error('AI partner not found'));
            throw new Error('AI partner not found');
        }

        try {
            const llmClient = new LLMClient(apiKey);
            const chatHistory = state.game.chatHistories[partnerId]?.messages || [];

            const response = await llmClient.generateResponse(
                partner,
                chatHistory,
                message
            );

            GameLogger.logGameState({
                type: 'Message Send Success',
                partnerId,
                messageLength: message.length,
                responseLength: response.length,
                timestamp: new Date().toISOString()
            });

            return { response, partnerId };
        } catch (error) {
            GameLogger.logError('Message Send Failed', error);
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
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.fulfilled, (state, action) => {
                const { response, partnerId } = action.payload;

                GameLogger.logGameState({
                    type: 'Chat State Update',
                    action: 'Message Fulfilled',
                    partnerId,
                    currentPartnerId: state.currentPartnerId,
                    isLoading: state.chatState.isLoading,
                    timestamp: new Date().toISOString()
                });

                // Always clear loading state and partnerId when response is received
                state.chatState.isLoading = false;
                state.chatState.loadingPartnerId = undefined;
                state.chatState.retryCount = 0;

                // Always add the message to the correct chat history
                const aiMessage: ChatMessage = {
                    id: uuidv4(),
                    sender: partnerId,
                    content: response
                };

                if (!state.chatHistories[partnerId]) {
                    state.chatHistories[partnerId] = {
                        partnerId,
                        messages: []
                    };
                }

                state.chatHistories[partnerId].messages.push(aiMessage);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                const partnerId = action.meta.arg.partnerId;

                GameLogger.logGameState({
                    type: 'Chat State Update',
                    action: 'Message Rejected',
                    partnerId,
                    currentPartnerId: state.currentPartnerId,
                    error: action.payload,
                    timestamp: new Date().toISOString()
                });

                // Always clear loading state
                state.chatState.isLoading = false;
                state.chatState.loadingPartnerId = undefined;

                // Only set error if this is the active partner
                if (state.currentPartnerId === partnerId) {
                    state.chatState.error = {
                        message: action.payload as string || 'Failed to send message',
                        timestamp: new Date().toISOString()
                    };
                    state.chatState.retryCount += 1;
                }
            })
            .addCase(sendMessage.pending, (state, action) => {
                // Use the meta arg to get the partnerId from the original action
                state.chatState.loadingPartnerId = action.meta.arg.partnerId;
                state.chatState.isLoading = true;
                state.chatState.error = null;
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
    addChatMessage,
    setCurrentPartner,
    setError,
    setInitialized,
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