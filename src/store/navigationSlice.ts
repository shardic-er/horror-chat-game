import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScreenType } from '../types/gameTypes';

interface NavigationState {
    currentScreen: ScreenType;
}

const initialState: NavigationState = {
    currentScreen: ScreenType.MENU
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        setScreen: (state, action: PayloadAction<ScreenType>) => {
            state.currentScreen = action.payload;
        }
    }
});

export const { setScreen } = navigationSlice.actions;
export default navigationSlice.reducer;