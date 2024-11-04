// src/components/game/StatsDisplay/StatsDisplay.tsx

import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../types/store.types';
import './StatsDisplay.styles.css';

// Memoized selectors
const selectKnownWordsCount = createSelector(
    [(state: RootState) => state.vocabulary.knownWords],
    (knownWords) => knownWords.length
);

const selectProgressStats = createSelector(
    [(state: RootState) => state.game.currentUser?.progressStats],
    (progressStats) => progressStats || { solvedChatMessages: 0, completedBooks: 0 }
);

const StatsDisplay = () => {
    const knownWordsCount = useAppSelector(selectKnownWordsCount);
    const stats = useAppSelector(selectProgressStats);

    return (
        <div className="stats-display">
            <div className="stats-item">
                <span className="stats-icon">📚</span>
                <div className="stats-content">
                    <span className="stats-label">Vocabulary</span>
                    <span className="stats-value">{knownWordsCount}</span>
                </div>
            </div>

            <div className="stats-item">
                <span className="stats-icon">📖</span>
                <div className="stats-content">
                    <span className="stats-label">Books Read</span>
                    <span className="stats-value">{stats.completedBooks}</span>
                </div>
            </div>

            <div className="stats-item">
                <span className="stats-icon">💭</span>
                <div className="stats-content">
                    <span className="stats-label">Messages Solved</span>
                    <span className="stats-value">{stats.solvedChatMessages}</span>
                </div>
            </div>
        </div>
    );
};

export default StatsDisplay;