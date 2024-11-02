// src/App.tsx

import React, { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import MenuScreen from './components/Screens/MenuScreen/MenuScreen';
import GameScreen from './components/Screens/GameScreen/GameScreen';
import WordCollectionManager from './components/game/WordCollection/WordCollectionManager';
import { setScreen } from './store/slices/navigationSlice';
import { ScreenType } from './types/gameTypes';
import { initializeGame } from './store/slices/gameSlice';
import { useSelector } from 'react-redux';
import { RootState } from './types/store.types';
import WordDeletionManager from "./components/game/WordDeletion/WordDeletionManager";
import { loadUser } from './services/userService';
import { addWords } from './store/slices/vocabularySlice';
import GameLogger from './services/loggerService';
import { USER_COOKIE_KEY } from './services/userService';

const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const currentScreen = useSelector((state: RootState) => state.navigation.currentScreen);

    // Single storage event handler
    useEffect(() => {
        let lastUpdate = Date.now();
        const DEBOUNCE_TIME = 1000; // 1 second

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === USER_COOKIE_KEY) {
                const now = Date.now();
                if (now - lastUpdate > DEBOUNCE_TIME) {
                    lastUpdate = now;

                    GameLogger.logGameState({
                        type: 'Storage Event',
                        action: 'Processing storage change'
                    });

                    const userData = loadUser();
                    if (userData) {
                        dispatch(addWords(userData.vocabulary));
                        GameLogger.logGameState({
                            type: 'Storage Event',
                            action: 'Synchronized vocabulary from other tab',
                            vocabularySize: userData.vocabulary.length
                        });
                    }
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [dispatch]);

    // Single initialization effect
    useEffect(() => {
        const initApp = async () => {
            await dispatch(initializeGame());
            dispatch(setScreen(ScreenType.MENU));
        };

        initApp();
    }, [dispatch]);

    const renderScreen = () => {
        switch (currentScreen) {
            case ScreenType.MENU:
                return (
                    <MenuScreen
                        onStartChat={() => dispatch(setScreen(ScreenType.CHAT))}
                    />
                );
            case ScreenType.CHAT:
                return <GameScreen />;
            default:
                return (
                    <MenuScreen
                        onStartChat={() => dispatch(setScreen(ScreenType.CHAT))}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {renderScreen()}
            <WordCollectionManager />
            <WordDeletionManager/>
        </div>
    );
};

export default App;