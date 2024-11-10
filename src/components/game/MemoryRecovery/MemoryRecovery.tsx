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

interface MemoryRecoveryProps {
    onWordSelect?: (word: string) => void;
}

const MemoryRecovery: React.FC<MemoryRecoveryProps> = ({ onWordSelect }) => {
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

    const handleWordClick = (word: string) => {
        if (!targetWords.find(tw => tw.word === word)?.recovered) {
            onWordSelect?.(word);
        }
    };

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
                            <button
                                key={targetWord.word}
                                className={`target-word-button ${targetWord.recovered ? 'recovered' : ''}`}
                                onClick={() => handleWordClick(targetWord.word)}
                                disabled={targetWord.recovered}
                            >
                                {targetWord.word}
                                {targetWord.recovered && <span className="recovered-checkmark">✓</span>}
                            </button>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            <div className="recovered-essays">
                {targetWords
                    .filter(tw => tw.recovered && tw.essay)
                    .map((tw) => (
                        <Card key={tw.word} className="essay-card">
                            <Card.Body>
                                <h5 className="essay-word">{tw.word}</h5>
                                <p className="essay-text">{tw.essay}</p>
                            </Card.Body>
                        </Card>
                    ))}
            </div>
        </div>
    );
};

export default MemoryRecovery;