import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { ProgressFlag } from '../../../types/gameTypes';
import { createPortal } from 'react-dom';
import { PROGRESS_FLAG_DATA } from '../../../assets/progressFlags/progressFlags';
import './AchievementToast.styles.css';

const AchievementToast = () => {
    const [visible, setVisible] = useState(false);
    const [currentAchievement, setCurrentAchievement] = useState<ProgressFlag | null>(null);
    const [isExiting, setIsExiting] = useState(false);
    const progressFlags = useAppSelector((state) => state.game.currentUser?.progressFlags);

    useEffect(() => {
        if (!progressFlags) return;

        const activeFlag = Object.entries(progressFlags).find(
            ([_, value]) => value === true
        );

        if (activeFlag) {
            const [flag] = activeFlag;
            setCurrentAchievement(flag as ProgressFlag);
            setVisible(true);
            setIsExiting(false);
        }
    }, [progressFlags]);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => {
            setVisible(false);
            setCurrentAchievement(null);
        }, 500);
    };

    // Add keyboard handler for ESC key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && visible) {
                handleDismiss();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [visible]);

    if (!visible || !currentAchievement) return null;

    const achievement = PROGRESS_FLAG_DATA[currentAchievement];

    return createPortal(
        <div className="achievement-toast-container">
            <div
                className={`achievement-toast ${isExiting ? 'exit' : 'enter'}`}
                onClick={handleDismiss}
                role="alert"
                tabIndex={0} // Make the toast focusable
            >
                <div className="achievement-header">
                    <div className="achievement-icon-wrapper">
                        <achievement.Icon width={32} height={32} />
                    </div>
                    <div className="achievement-title-section">
                        <div className="achievement-name">
                            {'>'} {achievement.name}
                        </div>
                        <div className="detail-text">
                            {achievement.unlockCondition}
                        </div>
                    </div>
                </div>

                <div className="achievement-details">
                    <div className="detail-item">
                        <span className="detail-label">System Report</span>
                        <span className="detail-text">{achievement.description}</span>
                    </div>
                </div>

                <div className="achievement-footer">
                    <span className="key-command">[ESC]</span> TO DISMISS
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AchievementToast;