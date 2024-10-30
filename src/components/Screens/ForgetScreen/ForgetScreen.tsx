// src/components/Screens/ForgetScreen/ForgetScreen.tsx

import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectMistakeProgress } from '../../../store/slices/vocabularySlice';
import TrashInput from '../../game/TrashInput/TrashInput';
import ProgressBar from '../../game/ProgressBar/ProgressBar';
import './ForgetScreen.styles.css';

const ForgetScreen: React.FC = () => {
    const mistakeProgress = useAppSelector(selectMistakeProgress);

    return (
        <div className="forget-screen">
            <div className="forget-background"></div>
            <div className="forget-content">
                {!mistakeProgress.isComplete && (
                    <div className="progress-section">
                        <h2>Mistakes Cleared</h2>
                        <ProgressBar
                            current={mistakeProgress.current}
                            max={mistakeProgress.max}
                        />
                        <p className="progress-text">
                            {mistakeProgress.current} / {mistakeProgress.max} mistakes cleared
                        </p>
                    </div>
                )}
                <div className="trash-section">
                    <TrashInput />
                </div>
            </div>
        </div>
    );
};

export default ForgetScreen;