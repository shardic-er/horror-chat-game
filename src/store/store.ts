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
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

// Clear navigation state on page load
window.addEventListener('load', () => {
    store.dispatch({ type: 'navigation/setScreen', payload: 'MENU' });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;