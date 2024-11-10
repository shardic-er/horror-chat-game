import React, { useRef, useState } from 'react';
import { DisplayMode, ProgressFlag } from '../../../types/gameTypes';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectMistakeProgress } from '../../../store/slices/vocabularySlice';
import DebugMode from '../DebugMode/DebugMode';
import { ReactComponent as LibraryModeIcon } from '../../../assets/images/LibraryModeIcon.svg';
import { ReactComponent as ChatModeIcon } from '../../../assets/images/ChatModeIcon.svg';
import { ReactComponent as ForgetModeIcon } from '../../../assets/images/ForgetModeIcon.svg';
import { ReactComponent as DebugModeIcon } from '../../../assets/images/DebugModeIcon.svg';
import './GameMenu.styles.css';

interface GameMenuProps {
    currentMode: DisplayMode;
    onModeSelect: (mode: DisplayMode) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ currentMode, onModeSelect }) => {
    const [debugMode, setDebugMode] = useState(false);
    const debugButtonRef = useRef<HTMLButtonElement>(null);
    const mistakeProgress = useAppSelector(selectMistakeProgress);
    const completedDeletions = useAppSelector(state =>
        state.game.currentUser?.progressFlags[ProgressFlag.COMPLETED_DELETIONS] ?? false
    );

    // Removed showPartners state and related handlers

    return (
        <div className="game-menu">
            <button
                className={`menu-button ${currentMode === 'library' ? 'active' : ''}`}
                onClick={() => onModeSelect('library')}
                aria-label="Library Mode"
                title="Library Mode"
            >
                <LibraryModeIcon className="menu-icon" />
            </button>

            <button
                className={`menu-button ${currentMode === 'chat' ? 'active' : ''}`}
                onClick={() => onModeSelect('chat')}
                aria-label="Chat Mode"
                title="Chat Mode"
            >
                <ChatModeIcon className="menu-icon" />
            </button>

            <button
                className={`menu-button ${currentMode === 'forget' ? 'active' : ''}`}
                onClick={() => onModeSelect('forget')}
                aria-label="Forget Mode"
                title="Forget Mode"
            >
                <ForgetModeIcon className="menu-icon" />
                {!completedDeletions && mistakeProgress.current > 0 && (
                    <div
                        className="progress-indicator"
                        style={{
                            background: `linear-gradient(to right, #28a745 ${(mistakeProgress.current / mistakeProgress.max) * 100}%, rgba(255, 255, 255, 0.1) 0%)`
                        }}
                    />
                )}
            </button>

            <button
                ref={debugButtonRef}
                className={`menu-button debug-button ${debugMode ? 'active' : ''}`}
                onClick={() => setDebugMode(!debugMode)}
                aria-label="Debug Mode"
                title="Debug Mode"
            >
                <DebugModeIcon className="menu-icon" />
            </button>

            <DebugMode
                isActive={debugMode}
                onClose={() => setDebugMode(false)}
                anchorRef={debugButtonRef}
            />
        </div>
    );
};

export default GameMenu;