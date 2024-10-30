// src/components/game/ProgressBar/ProgressBar.tsx

import React from 'react';
import './ProgressBar.styles.css';

interface ProgressBarProps {
    current: number;
    max: number;
    variant?: 'default' | 'danger' | 'warning' | 'success';
    showLabel?: boolean;
    height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
                                                     current,
                                                     max,
                                                     variant = 'default',
                                                     showLabel = false,
                                                     height = 8
                                                 }) => {
    const percentage = Math.min((current / max) * 100, 100);

    return (
        <div className="progress-bar-container" style={{ height: `${height}px` }}>
            <div
                className={`progress-bar-fill ${variant}`}
                style={{ width: `${percentage}%` }}
            />
            {showLabel && (
                <div className="progress-bar-label">
                    {current} / {max}
                </div>
            )}
        </div>
    );
};

export default ProgressBar;