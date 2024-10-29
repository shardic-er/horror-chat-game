// src/types/store.types.ts

import { store } from '../store/store';
import { NavigationSlice } from '../store/slices/navigationSlice';
import { VocabularySlice } from '../store/slices/vocabularySlice';
import { GameSlice } from '../store/slices/gameSlice';

export interface StoreState {
    navigation: NavigationSlice;
    vocabulary: VocabularySlice;
    game: GameSlice;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;