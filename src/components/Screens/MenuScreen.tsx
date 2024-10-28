import React from 'react';

interface MenuScreenProps {
    onStartChat: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onStartChat }) => {
    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Game Menu</h1>
            <button
                onClick={onStartChat}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
                Enter Chat
            </button>
        </div>
    );
};

export default MenuScreen;