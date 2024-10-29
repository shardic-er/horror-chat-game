// src/store/slices/navigationSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../types/store.types';
import { ScreenType, DisplayMode } from '../../types/gameTypes';

export interface NavigationSlice {
    currentScreen: ScreenType;
    displayMode: DisplayMode;
}

const initialState: NavigationSlice = {
    currentScreen: ScreenType.CHAT,
    displayMode: 'chat'
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        setScreen: (state, action: PayloadAction<ScreenType>) => {
            state.currentScreen = action.payload;
        },
        setDisplayMode: (state, action: PayloadAction<DisplayMode>) => {
            state.displayMode = action.payload;
        },
        resetNavigation: (state) => {
            state.currentScreen = ScreenType.MENU;
            state.displayMode = 'reading';
        }
    }
});

export const {
    setScreen,
    setDisplayMode,
    resetNavigation
} = navigationSlice.actions;

export const forceNavigationReset = () => {
    return async (dispatch: AppDispatch) => {
        localStorage.removeItem('navigation');
        dispatch(resetNavigation());
    };
};

export default navigationSlice.reducer;