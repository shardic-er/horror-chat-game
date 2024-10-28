import React from 'react';
import ChatMessage from '../ChatWindow/ChatMessage';

const GameScreen: React.FC = () => {
  // Temporary test message
  const testMessage = "Once upon a time there were three little pigs who lived in the woods.";

  return (
    <div className="container mx-auto p-4">
      <ChatMessage content={testMessage} />
    </div>
  );
};

export default GameScreen;