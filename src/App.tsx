// src/App.tsx

import React, { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import MenuScreen from './components/Screens/MenuScreen/MenuScreen';
import GameScreen from './components/Screens/GameScreen/GameScreen';
import WordCollectionManager from './components/game/WordCollection/WordCollectionManager';
import AchievementToast from './components/game/AchievementToast/AchievementToast';
import { setScreen } from './store/slices/navigationSlice';
import { ScreenType } from './types/gameTypes';
import { initializeGame } from './store/slices/gameSlice';
import { useSelector } from 'react-redux';
import { RootState } from './types/store.types';
import WordDeletionManager from "./components/game/WordDeletion/WordDeletionManager";
import { storage } from './services/storageService';
import { addWords } from './store/slices/vocabularySlice';
import GameLogger from './services/loggerService';

// Storage keys for event handling
const VOCABULARY_STORAGE_KEY = 'horror_game_vocabulary';
const USER_STORAGE_KEY = 'horror_game_user_data';

const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const currentScreen = useSelector((state: RootState) => state.navigation.currentScreen);

    // Handle storage events for multi-tab synchronization
    useEffect(() => {
        let lastUpdate = Date.now();
        const DEBOUNCE_TIME = 1000; // 1 second

        const handleStorageChange = (e: StorageEvent) => {
            // Check if the change is related to our application's data
            if (e.key?.startsWith('horror_game_')) {
                const now = Date.now();
                if (now - lastUpdate > DEBOUNCE_TIME) {
                    lastUpdate = now;

                    GameLogger.logGameState({
                        type: 'Storage Event',
                        action: 'Processing storage change',
                        key: e.key
                    });

                    // Handle vocabulary changes
                    if (e.key.startsWith(VOCABULARY_STORAGE_KEY)) {
                        const vocabulary = storage.getVocabulary();
                        dispatch(addWords(vocabulary));
                        GameLogger.logGameState({
                            type: 'Storage Event',
                            action: 'Synchronized vocabulary from other tab',
                            vocabularySize: vocabulary.length
                        });
                    }

                    // Handle user data changes
                    if (e.key === USER_STORAGE_KEY) {
                        const userData = storage.getUserData();
                        if (userData) {
                            dispatch(addWords(userData.vocabulary));
                            GameLogger.logGameState({
                                type: 'Storage Event',
                                action: 'Synchronized user data from other tab',
                                vocabularySize: userData.vocabulary.length
                            });
                        }
                    }
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [dispatch]);

    // Application initialization
    useEffect(() => {
        const initApp = async () => {
            try {
                await dispatch(initializeGame());
                dispatch(setScreen(ScreenType.MENU));

                GameLogger.logGameState({
                    type: 'App Initialization',
                    action: 'Complete',
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                GameLogger.logError('App Initialization', error);
            }
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
            <AchievementToast />
        </div>
    );
};

export default App;