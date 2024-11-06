import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './WordDeletion.styles.css';

interface DeletingWord {
    id: string;
    word: string;
    style: React.CSSProperties;
}

interface WordDeletionProps {
    words: string[];
    onComplete?: () => void;
}

const WordDeletion: React.FC<WordDeletionProps> = ({
                                                       words,
                                                       onComplete
                                                   }) => {
    const [deletingWords, setDeletingWords] = useState<DeletingWord[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const getRandomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

    const initializeWords = useCallback(() => {
        return words.map((word, index) => {
            // Random initial offset from center
            const offsetX = getRandomInRange(-500, 500);
            const offsetY = getRandomInRange(-200, 200);

            // Random parameters for motion
            const startRotation = getRandomInRange(-30, 30);
            const spinAmount = getRandomInRange(540, 900) * (Math.random() > 0.5 ? 1 : -1);
            const endX = getRandomInRange(-300, 300);

            return {
                id: `${word}-${Date.now()}-${index}`,
                word,
                style: {
                    '--offset-x': `${offsetX}px`,
                    '--offset-y': `${offsetY}px`,
                    '--start-rotation': `${startRotation}deg`,
                    '--spin-amount': `${spinAmount}deg`,
                    '--end-x': `${endX}px`,
                    animationDelay: `${index * 100}ms`,
                } as React.CSSProperties
            };
        });
    }, [words]);

    useEffect(() => {
        if (words.length > 0) {
            const newWords = initializeWords();
            setDeletingWords(newWords);

            // Calculate total animation duration including delays
            const totalDuration = 2000 + (words.length - 1) * 100;

            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Set timeout for completion
            timeoutRef.current = setTimeout(() => {
                onComplete?.();
                setDeletingWords([]);
            }, totalDuration);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [words, initializeWords, onComplete]);

    if (deletingWords.length === 0) return null;

    return createPortal(
        <div className="word-deletion-overlay">
            {deletingWords.map(word => (
                <div
                    key={word.id}
                    className="deleting-word"
                    style={word.style}
                >
                    <span className="badge" data-text={word.word}>
                        {word.word}
                    </span>
                </div>
            ))}
        </div>,
        document.body
    );
};

export default WordDeletion;