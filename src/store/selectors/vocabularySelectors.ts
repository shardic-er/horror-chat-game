// src/store/selectors/vocabularySelectors.ts

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../types/store.types';

const selectKnownWordsArray = (state: RootState) => state.vocabulary.knownWords;

export const selectKnownWordsSet = createSelector(
    [selectKnownWordsArray],
    (words) => new Set(words.map(w => w.toLowerCase()))
);