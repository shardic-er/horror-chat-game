// src/store/navigationSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from './store';
import { ScreenType, DisplayMode } from '../types/gameTypes';

interface NavigationState {
    currentScreen: ScreenType;
    displayMode: DisplayMode;
}

const initialState: NavigationState = {
    currentScreen: ScreenType.MENU,
    displayMode: 'reading'
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

// Properly typed thunk action
export const forceNavigationReset = () => {
    return async (dispatch: AppDispatch) => {
        localStorage.removeItem('navigation');
        dispatch(resetNavigation());
    };
};

export default navigationSlice.reducer;