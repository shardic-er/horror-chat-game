// src/components/game/WordDeletion/WordDeletion.tsx

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './WordDeletion.styles.css';

interface DeletingWord {
    id: string;
    word: string;
    startX: number;
    startY: number;
    rotation: number;
    scale: number;
    progress: number;
}

interface WordDeletionProps {
    words: string[];
    onComplete?: () => void;
}

const WordDeletion: React.FC<WordDeletionProps> = (
    {
       words,
       onComplete
    }) => {
    const [deletingWords, setDeletingWords] = useState<DeletingWord[]>([]);
    const animationFrame = useRef<number>();
    const startTime = useRef<number>(0);
    const deletingWordsRef = useRef<DeletingWord[]>([]);

    const initializeWords = useCallback(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        return words.map((word, index) => ({
            id: `${word}-${Date.now()}-${index}`,
            word,
            startX: centerX + (Math.random() - 0.5) * 200,
            startY: centerY + (Math.random() - 0.5) * 200,
            rotation: Math.random() * 360,
            scale: 1,
            progress: 0
        }));
    }, [words]);

    useEffect(() => {
        if (words.length > 0) {
            const newWords = initializeWords();
            setDeletingWords(newWords);
            startTime.current = Date.now();
        }
    }, [words, initializeWords]);

    useEffect(() => {
        deletingWordsRef.current = deletingWords;
    }, [deletingWords]);

    useEffect(() => {
        if (deletingWordsRef.current.length === 0) return;

        const duration = 2000;
        let lastTime = Date.now();

        const animate = () => {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            setDeletingWords(prev => {
                const updated = prev.map(word => {
                    if (word.progress >= 1) return word;
                    const newProgress = Math.min(word.progress + (deltaTime / duration), 1);
                    return {
                        ...word,
                        progress: newProgress
                    };
                });

                if (updated.every(w => w.progress >= 1)) {
                    requestAnimationFrame(() => {
                        onComplete?.();
                        setDeletingWords([]);
                    });
                }

                return updated;
            });

            if (!deletingWordsRef.current.every(w => w.progress >= 1)) {
                animationFrame.current = requestAnimationFrame(animate);
            }
        };

        animationFrame.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current);
            }
        };
    }, [onComplete]);

    const getWordStyle = (word: DeletingWord) => {
        const t = word.progress;

        // Easing function for more dramatic effect
        const easeInQuart = (t: number) => t * t * t * t;
        const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

        // Scale down and fade out
        const scale = 1 - easeInQuart(t) * 0.8;
        const opacity = 1 - easeOutQuart(t);

        // Spiral downward motion
        const angle = t * Math.PI * 4;
        const radius = 100 * t;
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius + (200 * t); // Add downward motion

        // Apply transformations
        const x = word.startX + offsetX;
        const y = word.startY + offsetY;
        const rotation = word.rotation + (t * 720); // Two full rotations

        return {
            transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`,
            opacity
        };
    };

    if (deletingWords.length === 0) return null;

    return createPortal(
        <div className="word-deletion-overlay">
            {deletingWords.map(word => (
                <div
                    key={word.id}
                    className="deleting-word"
                    style={getWordStyle(word)}
                >
                    <span className="badge">
                        {word.word}
                    </span>
                </div>
            ))}
        </div>,
        document.body
    );
};

export default WordDeletion;