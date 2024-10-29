// src/components/game/GameMenu/GameMenu.tsx

import React from 'react';
import { DisplayMode } from '../../../types/gameTypes';
import './GameMenu.styles.css';

interface GameMenuProps {
    currentMode: DisplayMode;
    onModeSelect: (mode: DisplayMode) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ currentMode, onModeSelect }) => {
    return (
        <div className="game-menu">
            <button
                className={`menu-button ${currentMode === 'library' ? 'active' : ''}`}
                onClick={() => onModeSelect('library')}
                aria-label="Library Mode"
                title="Library Mode"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="menu-icon"
                >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
            </button>
            <button
                className={`menu-button ${currentMode === 'chat' ? 'active' : ''}`}
                onClick={() => onModeSelect('chat')}
                aria-label="Chat Mode"
                title="Chat Mode"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="menu-icon"
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>
        </div>
    );
};

export default GameMenu;