import React, {useRef, useState} from 'react';
import { DisplayMode, ProgressFlag } from '../../../types/gameTypes';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectMistakeProgress } from '../../../store/slices/vocabularySlice';
import { setCurrentPartner, resetChatHistory } from '../../../store/slices/gameSlice';
import DebugMode from '../DebugMode/DebugMode';
import { AI_PARTNERS } from '../../../config/aiPartners';
import { ReactComponent as LibraryModeIcon } from '../../../assets/images/LibraryModeIcon.svg';
import { ReactComponent as ChatModeIcon } from '../../../assets/images/ChatModeIcon.svg';
import { ReactComponent as ForgetModeIcon } from '../../../assets/images/ForgetModeIcon.svg';
import { ReactComponent as DebugModeIcon } from '../../../assets/images/DebugModeIcon.svg';
import { ReactComponent as ResetChatIcon } from '../../../assets/images/ResetChatIcon.svg';
import './GameMenu.styles.css';

interface GameMenuProps {
    currentMode: DisplayMode;
    onModeSelect: (mode: DisplayMode) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ currentMode, onModeSelect }) => {
    const dispatch = useAppDispatch();
    const [showPartners, setShowPartners] = useState(false);
    const [debugMode, setDebugMode] = useState(false);
    const debugButtonRef = useRef<HTMLButtonElement>(null);
    const mistakeProgress = useAppSelector(selectMistakeProgress);
    const currentPartnerId = useAppSelector(state => state.game.currentPartnerId);
    const completedDeletions = useAppSelector(state =>
        state.game.currentUser?.progressFlags[ProgressFlag.COMPLETED_DELETIONS] ?? false
    );

    const handlePartnerSelect = (partnerId: string) => {
        dispatch(setCurrentPartner(partnerId));
        setShowPartners(false);
    };

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

            <div className={`chat-menu-container ${showPartners ? 'expanded' : ''}`}>
                <button
                    className={`menu-button ${currentMode === 'chat' ? 'active' : ''}`}
                    onClick={() => {
                        if (currentMode === 'chat') {
                            setShowPartners(!showPartners);
                        } else {
                            onModeSelect('chat');
                        }
                    }}
                    aria-label="Chat Mode"
                    title="Chat Mode"
                >
                    <ChatModeIcon className="menu-icon" />
                </button>

                {showPartners && (
                    <div className="partner-list">
                        {AI_PARTNERS.map(partner => (
                            <button
                                key={partner.id}
                                className={`partner-button ${currentPartnerId === partner.id ? 'active' : ''}`}
                                onClick={() => handlePartnerSelect(partner.id)}
                            >
                                {partner.name}
                            </button>
                        ))}
                        <button
                            className="partner-button reset-button"
                            onClick={() => {
                                if (currentPartnerId) {
                                    dispatch(resetChatHistory(currentPartnerId));
                                }
                            }}
                        >
                            <ResetChatIcon className="menu-icon" />
                            Reset Conversation
                        </button>
                    </div>
                )}
            </div>

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