import { configureStore } from '@reduxjs/toolkit';
import vocabularyReducer from './vocabularySlice';
import navigationReducer from './navigationSlice';
import gameReducer from './gameSlice';

export const store = configureStore({
    reducer: {
        vocabulary: vocabularyReducer,
        navigation: navigationReducer,
        game: gameReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types for serialization check
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'game/initializeGame'
                ],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.createdAt', 'payload.lastLoginDate'],
                // Ignore these paths in the state
                ignoredPaths: ['game.currentUser.createdAt', 'game.currentUser.lastLoginDate'],
            },
        }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;