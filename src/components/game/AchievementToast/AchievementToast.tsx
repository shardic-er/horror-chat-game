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

    if (!visible || !currentAchievement) return null;

    const toastContent = (
        <div className="achievement-toast-container">
            <div
                className={`achievement-toast ${isExiting ? 'exit' : 'enter'}`}
                onClick={handleDismiss}
            >
                <div className="achievement-toast-header">
                    <div className="achievement-icon-container">
                        {(() => {
                            const FlagIcon = PROGRESS_FLAG_DATA[currentAchievement].Icon;
                            return <FlagIcon width={32} height={32} />;
                        })()}
                    </div>
                    <div className="achievement-text-content">
                        <h3 className="achievement-toast-title">
                            {PROGRESS_FLAG_DATA[currentAchievement].name}
                        </h3>
                        <div className="achievement-details">
                            <div className="unlock-detail">
                                <span className="detail-label">Unlocked:</span>
                                <span className="detail-text">
                                {PROGRESS_FLAG_DATA[currentAchievement].description}
                            </span>
                            </div>
                            <div className="unlock-detail">
                                <span className="detail-label">Condition:</span>
                                <span className="detail-text">
                                {PROGRESS_FLAG_DATA[currentAchievement].unlockCondition}
                            </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="achievement-toast-dismiss">Click to dismiss</div>
            </div>
        </div>
    );

    return createPortal(toastContent, document.body);
};

export default AchievementToast;