// src/App.tsx

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from './store/hooks';
import MenuScreen from './components/Screens/MenuScreen';
import GameScreen from './components/Screens/GameScreen';
import WordCollectionManager from './components/WordCollection/WordCollectionManager';
import { RootState } from './store/store';
import { setScreen } from './store/navigationSlice';
import { ScreenType } from './types/gameTypes';
import { getApiKey } from './services/apiKeyService';
import { initializeGame } from './store/gameSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentScreen = useSelector((state: RootState) => state.navigation.currentScreen);

  // Initialize game state and load user data on mount
  useEffect(() => {
    const apiKey = getApiKey();
    // Initialize game which will load user data from cookie
    dispatch(initializeGame());
    // Start at menu regardless of saved state
    dispatch(setScreen(ScreenType.MENU));
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
      </div>
  );
};

export default App;