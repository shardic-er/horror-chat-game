// src/store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import vocabularyReducer from './slices/vocabularySlice';
import navigationReducer from './slices/navigationSlice';
import gameReducer from './slices/gameSlice';
import memoryRecoveryReducer from './slices/memoryRecoverySlice';

export const store = configureStore({
    reducer: {
        vocabulary: vocabularyReducer,
        navigation: navigationReducer,
        game: gameReducer,
        memoryRecovery: memoryRecoveryReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'game/initializeGame',
                    'memoryRecovery/initialize',
                    'memoryRecovery/generateEssay'
                ],
                ignoredActionPaths: [
                    'payload.createdAt',
                    'payload.lastLoginDate',
                    'payload.essay'
                ],
                ignoredPaths: [
                    'game.currentUser.createdAt',
                    'game.currentUser.lastLoginDate',
                    'memoryRecovery.targetWords'
                ],
            },
        })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;