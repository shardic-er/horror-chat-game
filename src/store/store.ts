// src/store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import vocabularyReducer from './slices/vocabularySlice';
import navigationReducer from './slices/navigationSlice';
import gameReducer from './slices/gameSlice';

export const store = configureStore({
    reducer: {
        vocabulary: vocabularyReducer,
        navigation: navigationReducer,
        game: gameReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'game/initializeGame'
                ],
                ignoredActionPaths: ['payload.createdAt', 'payload.lastLoginDate'],
                ignoredPaths: ['game.currentUser.createdAt', 'game.currentUser.lastLoginDate'],
            },
        })
});