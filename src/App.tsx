// src/App.tsx

import React, { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import MenuScreen from './components/Screens/MenuScreen/MenuScreen';
import GameScreen from './components/Screens/GameScreen/GameScreen';
import WordCollectionManager from './components/game/WordCollection/WordCollectionManager';
import { setScreen } from './store/slices/navigationSlice';
import { ScreenType } from './types/gameTypes';
import { getApiKey } from './services/apiKeyService';
import { initializeGame } from './store/slices/gameSlice';
import { useSelector } from 'react-redux';
import { RootState } from './types/store.types';
import { NavigationSlice } from './store/slices/navigationSlice';


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