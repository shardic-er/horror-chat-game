// src/components/Screens/ForgetScreen/ForgetScreen.tsx

import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectMistakeProgress } from '../../../store/slices/vocabularySlice';
import TrashInput from '../../game/TrashInput/TrashInput';
import MemoryRecovery from '../../game/MemoryRecovery/MemoryRecovery';
import ProgressBar from '../../game/ProgressBar/ProgressBar';
import forgetImage from '../../../assets/images/IWantToForget.webp';
import rememberImage from '../../../assets/images/IWantToRemember.webp';
import './ForgetScreen.styles.css';

const ForgetScreen: React.FC = () => {
    const mistakeProgress = useAppSelector(selectMistakeProgress);
    const completedDeletions = useAppSelector(state =>
        state.game.currentUser?.progressFlags.completedDeletions ?? false
    );

    return (
        <div className="forget-screen">
            <div
                className="forget-background"
                style={{
                    backgroundImage: `url(${completedDeletions ? rememberImage : forgetImage})`
                }}
            />
            <div className="forget-content">
                {!mistakeProgress.isComplete && (
                    <div className="progress-section">
                        <h2>Mistakes Cleared</h2>
                        <ProgressBar
                            current={mistakeProgress.current}
                            max={mistakeProgress.max}
                            variant={completedDeletions ? 'success' : 'default'}
                        />
                        <p className="progress-text">
                            {mistakeProgress.current} / {mistakeProgress.max} mistakes cleared
                        </p>
                    </div>
                )}

                <div className="interaction-section">
                    {completedDeletions && (
                        <div className="recovery-interface">
                            <MemoryRecovery />
                        </div>
                    )}
                </div>

                <div className="trash-section">
                    <TrashInput />
                </div>
            </div>
        </div>
    );
};

export default ForgetScreen;