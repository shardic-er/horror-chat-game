import React, { useEffect, useState, useCallback } from 'react';
import WordDeletion from './WordDeletion';

interface DeletionInstance {
    id: string;
    words: string[];
}

const WordDeletionManager: React.FC = () => {
    const [deletions, setDeletions] = useState<DeletionInstance[]>([]);

    const handleWordForgotten = useCallback((event: CustomEvent<{words: string[]}>) => {
        const { words } = event.detail;
        if (words.length === 0) return;

        setDeletions(prev => [
            ...prev,
            {
                id: `${Date.now()}-${Math.random()}`,
                words
            }
        ]);
    }, []);

    useEffect(() => {
        // Only handle visual deletion animation
        document.addEventListener(
            'wordForgotten',
            handleWordForgotten as EventListener
        );

        return () => {
            document.removeEventListener(
                'wordForgotten',
                handleWordForgotten as EventListener
            );
        };
    }, [handleWordForgotten]);

    const handleComplete = useCallback((id: string) => {
        setDeletions(prev => prev.filter(d => d.id !== id));
    }, []);

    return (
        <>
            {deletions.map(({ id, words }) => (
                <WordDeletion
                    key={id}
                    words={words}
                    onComplete={() => handleComplete(id)}
                />
            ))}
        </>
    );
};

export default WordDeletionManager;