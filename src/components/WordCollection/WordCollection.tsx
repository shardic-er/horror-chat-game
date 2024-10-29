// src/components/WordCollection/WordCollection.tsx

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './WordCollection.styles.css';

interface CollectingWord {
    id: string;
    word: string;
    startX: number;
    startY: number;
    controlX: number;
    controlY: number;
    progress: number;
    collected: boolean;
}

interface WordCollectionProps {
    words: string[];
    onComplete?: () => void;
}

const WordCollection: React.FC<WordCollectionProps> = ({
                                                           words,
                                                           onComplete
                                                       }) => {
    const [collectingWords, setCollectingWords] = useState<CollectingWord[]>([]);
    const animationFrame = useRef<number>();
    const startTime = useRef<number>(0);

    const initializeWords = useCallback(() => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const spawnAreaWidth = viewportWidth * 0.4;
        const spawnAreaHeight = viewportHeight * 0.2;
        const spawnAreaLeft = (viewportWidth - spawnAreaWidth) / 2;
        const spawnAreaTop = viewportHeight * 0.6;

        return words.map((word, index) => {
            const startX = spawnAreaLeft + (Math.random() * spawnAreaWidth);
            const startY = spawnAreaTop + (Math.random() * spawnAreaHeight);
            const controlX = startX + (Math.random() - 0.5) * 300;
            const controlY = startY - viewportHeight * (0.5 + Math.random() * 0.3);

            return {
                id: `${word}-${Date.now()}-${index}`,
                word,
                startX,
                startY,
                controlX,
                controlY,
                progress: 0,
                collected: false
            };
        });
    }, [words]);

    // Initialize words when the component mounts or words change
    useEffect(() => {
        if (words.length > 0) {
            const newWords = initializeWords();
            setCollectingWords(newWords);
            startTime.current = Date.now();
        }
    }, [words, initializeWords]);

    // Handle animation
    useEffect(() => {
        if (collectingWords.length === 0) return;

        const duration = 1500;
        let lastTime = Date.now();

        const animate = () => {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            setCollectingWords(prev => {
                const updated = prev.map(word => {
                    if (word.collected) return word;
                    const newProgress = Math.min(word.progress + (deltaTime / duration), 1);
                    return {
                        ...word,
                        progress: newProgress,
                        collected: newProgress >= 1
                    };
                });

                // If all words are collected, schedule cleanup
                if (updated.every(w => w.collected)) {
                    requestAnimationFrame(() => {
                        onComplete?.();
                        setCollectingWords([]);
                    });
                }

                return updated;
            });

            if (!collectingWords.every(w => w.collected)) {
                animationFrame.current = requestAnimationFrame(animate);
            }
        };

        animationFrame.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current);
            }
        };
    }, [collectingWords.length, onComplete]);

    const getWordPosition = useCallback((word: CollectingWord) => {
        const t = word.progress;
        const x = word.startX + (word.controlX - word.startX) * t;
        const y = word.startY + (word.controlY - word.startY) * t;
        const scale = 1 + Math.sin(t * Math.PI) * 0.2;
        const opacity = 1 - t;
        const rotation = (x - word.startX) * 0.1;

        return { x, y, scale, opacity, rotation };
    }, []);

    if (collectingWords.length === 0) return null;

    return createPortal(
        <div className="word-collection-overlay">
            {collectingWords.map(word => {
                const { x, y, scale, opacity, rotation } = getWordPosition(word);
                return (
                    <div
                        key={word.id}
                        className="collecting-word"
                        style={{
                            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotation}deg)`,
                            opacity
                        }}
                    >
                        <span className="badge">
                            {word.word}
                        </span>
                    </div>
                );
            })}
        </div>,
        document.body
    );
};

export default WordCollection;