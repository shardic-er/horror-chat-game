import React, { useEffect } from 'react';
import { NavigationProps } from '../../types/gameTypes';
import './PageNavigation.styles.css';

const PageNavigation: React.FC<NavigationProps> = ({
                                                       currentPage,
                                                       totalPages,
                                                       onNextPage,
                                                       onPrevPage
                                                   }) => {
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                onNextPage();
            } else if (e.key === 'ArrowLeft') {
                onPrevPage();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [onNextPage, onPrevPage]);

    return (
        <div className="page-navigation">
            <button
                onClick={onPrevPage}
                disabled={currentPage <= 0}
                className="nav-button"
                aria-label="Previous page"
            >
                ←
            </button>
            <span className="page-indicator">
                Page {currentPage + 1} of {totalPages}
            </span>
            <button
                onClick={onNextPage}
                disabled={currentPage >= totalPages - 1}
                className="nav-button"
                aria-label="Next page"
            >
                →
            </button>
        </div>
    );
};

export default PageNavigation;