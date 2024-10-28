import { configureStore } from '@reduxjs/toolkit';
import vocabularyReducer from './vocabularySlice';
import navigationReducer from './navigationSlice';

export const store = configureStore({
    reducer: {
        vocabulary: vocabularyReducer,
        navigation: navigationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;