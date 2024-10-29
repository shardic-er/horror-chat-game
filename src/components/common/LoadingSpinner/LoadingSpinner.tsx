// src/components/common/LoadingSpinner/LoadingSpinner.tsx

import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: string;
    text?: string;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           size = 'md',
                                                           variant = 'light',
                                                           text = 'Loading...',
                                                           fullScreen = false,
                                                       }) => {
    const getSpinnerSize = (): number => {
        switch (size) {
            case 'sm':
                return 16;
            case 'lg':
                return 48;
            default:
                return 32;
        }
    };

    const spinner = (
        <div className="d-flex flex-column align-items-center justify-content-center gap-3">
            <Spinner
                animation="border"
                variant={variant}
                style={{ width: getSpinnerSize(), height: getSpinnerSize() }}
                role="status"
            />
            {text && <span className={`text-${variant}`}>{text}</span>}
        </div>
    );

    if (fullScreen) {
        return (
            <div
                className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 9999 }}
            >
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;