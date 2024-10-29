// src/components/WordCollection/WordCollectionManager.tsx

import React, { useEffect, useState, useCallback } from 'react';
import WordCollection from './WordCollection';

interface WordCollectionEvent {
    words: string[];
    sourceElement: HTMLElement | null;
}

interface CollectionInstance {
    id: string;
    words: string[];
}

const WordCollectionManager: React.FC = () => {
    const [collections, setCollections] = useState<CollectionInstance[]>([]);

    const handleWordDiscovery = useCallback((event: CustomEvent<WordCollectionEvent>) => {
        const { words } = event.detail;
        if (words.length === 0) return;

        setCollections(prev => [
            ...prev,
            {
                id: `${Date.now()}-${Math.random()}`,
                words
            }
        ]);
    }, []);

    useEffect(() => {
        document.addEventListener(
            'wordDiscovered',
            handleWordDiscovery as EventListener
        );

        return () => {
            document.removeEventListener(
                'wordDiscovered',
                handleWordDiscovery as EventListener
            );
        };
    }, [handleWordDiscovery]);

    const handleComplete = useCallback((id: string) => {
        setCollections(prev => prev.filter(c => c.id !== id));
    }, []);

    return (
        <>
            {collections.map(({ id, words }) => (
                <WordCollection
                    key={id}
                    words={words}
                    onComplete={() => handleComplete(id)}
                />
            ))}
        </>
    );
};

export default WordCollectionManager;