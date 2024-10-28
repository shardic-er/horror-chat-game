import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from './store';
import { ScreenType } from '../types/gameTypes';

interface NavigationState {
    currentScreen: ScreenType;
}

const navigationSlice = createSlice({
    name: 'navigation',
    initialState: { currentScreen: ScreenType.MENU } as NavigationState,
    reducers: {
        setScreen: (state, action: PayloadAction<ScreenType>) => {
            state.currentScreen = action.payload;
        },
        resetNavigation: (state) => {
            state.currentScreen = ScreenType.MENU;
        }
    }
});

export const { setScreen, resetNavigation } = navigationSlice.actions;

// Properly typed thunk action
export const forceNavigationReset = () => {
    return async (dispatch: AppDispatch) => {
        localStorage.removeItem('navigation');
        dispatch(resetNavigation());
    };
};

export default navigationSlice.reducer;