import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateUserState } from '../store/slices/gameSlice';
import { UserData } from '../types/gameTypes';

export const useGameState = () => {
    const dispatch = useAppDispatch();
    const gameState = useAppSelector(state => state.game);
    const currentUser = useAppSelector(state => state.game.currentUser);

    const updateUser = async (updates: Partial<UserData>) => {
        await dispatch(updateUserState(updates));
    };

    return {
        gameState,
        currentUser,
        updateUser
    };
};