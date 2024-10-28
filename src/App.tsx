import React from 'react';
import MenuScreen from './components/Screens/MenuScreen';
import GameScreen from './components/Screens/GameScreen';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { ScreenType } from './types/gameTypes';
import { setScreen } from './store/navigationSlice';

const App: React.FC = () => {
  const currentScreen = useAppSelector((state) => state.navigation.currentScreen);
  const dispatch = useAppDispatch();

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
        return <div>Screen not implemented yet</div>;
    }
  };

  return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        {renderScreen()}
      </div>
  );
};

export default App;