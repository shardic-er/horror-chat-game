// src/components/game/GameMenu/GameMenu.tsx

import React from 'react';
import { DisplayMode } from '../../../types/gameTypes';
import { useAppSelector } from '../../../store/hooks';
import { selectMistakeProgress } from '../../../store/slices/vocabularySlice';
import './GameMenu.styles.css';

interface GameMenuProps {
    currentMode: DisplayMode;
    onModeSelect: (mode: DisplayMode) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ currentMode, onModeSelect }) => {
    const mistakeProgress = useAppSelector(selectMistakeProgress);

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
                title="Keep trying!"
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
            <button
                className={`menu-button ${currentMode === 'forget' ? 'active' : ''}`}
                onClick={() => onModeSelect('forget')}
                aria-label="Forget Mode"
                title="Forget Mode"
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
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    {mistakeProgress.isComplete && (
                        <path d="M5 10l4 4m0-4l-4 4" strokeLinecap="round"/>
                    )}
                </svg>
                {!mistakeProgress.isComplete && mistakeProgress.current > 0 && (
                    <div
                        className="progress-indicator"
                        style={{background: `linear-gradient(to right, #28a745 ${(mistakeProgress.current / mistakeProgress.max) * 100}%, rgba(255, 255, 255, 0.1) 0%)`}}
                    />
                )}
            </button>
        </div>
    );
};

export default GameMenu;