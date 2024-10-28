import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MenuScreen from './components/Screens/MenuScreen';
import GameScreen from './components/Screens/GameScreen';
import { RootState } from './store/store';
import { setScreen } from './store/navigationSlice';
import { ScreenType } from './types/gameTypes';
import { getApiKey } from './services/apiKeyService';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const currentScreen = useSelector((state: RootState) => state.navigation.currentScreen);

  // Reset to menu on fresh load/refresh
  useEffect(() => {
    const apiKey = getApiKey();
    // Even if we have an API key, start at menu
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
      </div>
  );
};

export default App;