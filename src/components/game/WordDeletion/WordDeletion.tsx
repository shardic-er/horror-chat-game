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
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;

        return words.map((word, index) => {
            // Random starting position around center
            const spreadX = getRandomInRange(-centerX/3, centerX/3);
            const spreadY = getRandomInRange(-centerY/3, centerY/3);
            const startX = centerX + spreadX;
            const startY = centerY + spreadY;

            // Random arc parameters
            const arcX = getRandomInRange(-centerX/3, centerX/3); // Final x position
            const arcY = getRandomInRange(centerY/3, centerY/3); // Final y position
            const arcHeight = getRandomInRange(-300, -100); // Height of arc (negative for upward arc)
            const arcXMid = arcX * Math.random(); // Midpoint x position
            const rotation = getRandomInRange(360, 720) * (Math.random() > 0.5 ? 1 : -1); // Random rotation

            return {
                id: `${word}-${Date.now()}-${index}`,
                word,
                style: {
                    top: `${startY}px`,
                    left: `${startX}px`,
                    '--arc-x': arcX,
                    '--arc-y': arcY,
                    '--arc-x-mid': arcXMid,
                    '--arc-height': arcHeight,
                    '--rotation': rotation,
                    animationDelay: `${index * 100}ms`,
                } as React.CSSProperties
            };
        });
    }, [words]);

    useEffect(() => {
        if (words.length > 0) {
            const newWords = initializeWords();
            setDeletingWords(newWords);

            const totalDuration = 2000 + (words.length - 1) * 100;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

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