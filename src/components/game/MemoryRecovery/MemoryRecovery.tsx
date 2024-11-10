// src/components/game/MemoryRecovery/MemoryRecovery.tsx

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    initializeTargetWords,
    selectTargetWords,
    selectIsInitialized,
    selectIsLoading,
    selectError
} from '../../../store/slices/memoryRecoverySlice';
import { Card, Spinner } from 'react-bootstrap';
import './MemoryRecovery.styles.css';

const MemoryRecovery: React.FC = () => {
    const dispatch = useAppDispatch();
    const targetWords = useAppSelector(selectTargetWords);
    const isInitialized = useAppSelector(selectIsInitialized);
    const isLoading = useAppSelector(selectIsLoading);
    const error = useAppSelector(selectError);

    useEffect(() => {
        if (!isInitialized && !isLoading) {
            dispatch(initializeTargetWords());
        }
    }, [dispatch, isInitialized, isLoading]);

    if (isLoading) {
        return (
            <div className="memory-recovery-loading">
                <Spinner animation="border" variant="light" />
                <p>Retrieving lost memories...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="memory-recovery-error">
                <p>Failed to recover memories: {error}</p>
            </div>
        );
    }

    return (
        <div className="memory-recovery-container">
            <Card className="memory-prompt-card">
                <Card.Body>
                    <div className="memory-prompt-text">
                        I sense fragments of memory, floating just beyond reach.
                        These words feel... significant. Help me remember them,
                        one by one. Each recovered word might unlock something deeper...
                    </div>
                    <div className="target-words-grid">
                        {targetWords.map((targetWord) => (
                            <div
                                key={targetWord.word}
                                className={`target-word-item ${targetWord.recovered ? 'recovered' : ''}`}
                            >
                                <span className="target-word-text">{targetWord.word}</span>
                                {targetWord.recovered && <span className="recovered-checkmark">✓</span>}
                            </div>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            {targetWords.find(tw => tw.recovered && tw.essay) && (
                <Card className="essay-card">
                    <Card.Body>
                        <h5 className="essay-word">
                            {targetWords.find(tw => tw.recovered && tw.essay)?.word}
                        </h5>
                        <p className="essay-text">
                            {targetWords.find(tw => tw.recovered && tw.essay)?.essay}
                        </p>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default MemoryRecovery;