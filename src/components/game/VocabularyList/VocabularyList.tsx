// src/components/game/VocabularyList/VocabularyList.tsx

import React, { useState, useMemo } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { Form, Badge, Card } from 'react-bootstrap';
import './VocabularyList.styles.css';

interface VocabularyListProps {
    onWordSelect: (word: string) => void;
    isInputFull?: boolean;
}

const VocabularyList: React.FC<VocabularyListProps> = ({ onWordSelect, isInputFull = false }) => {
    const knownWords = useAppSelector((state) => state.vocabulary.knownWords);
    const forgottenWords = useAppSelector((state) => state.vocabulary.forgottenWords);
    const currentMode = useAppSelector(state => state.navigation.displayMode);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredWords = useMemo(() => {
        return knownWords
            .filter(word => {
                const matchesSearch = word.toLowerCase().includes(searchTerm.toLowerCase());
                // In forget mode, also filter out already forgotten words
                if (currentMode === 'forget') {
                    return matchesSearch && !forgottenWords.includes(word.toLowerCase());
                }
                return matchesSearch;
            })
            .sort();
    }, [knownWords, searchTerm, currentMode, forgottenWords]);

    const handleWordClick = (word: string) => {
        if (isInputFull) return;

        if (currentMode === 'forget') {
            // Dispatch a custom event for the trash input
            const event = new CustomEvent('vocab-word-selected', {
                detail: { word, mode: 'forget' }
            });
            window.dispatchEvent(event);
        } else {
            onWordSelect(word);
        }
    };

    return (
        <Card bg="dark" text="light" className="vocabulary-card">
            <Card.Header className="bg-dark border-bottom border-secondary">
                <Form.Control
                    type="text"
                    placeholder="Search vocabulary..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </Card.Header>
            <Card.Body className="p-0">
                <div className="vocabulary-container">
                    <div className="word-cloud">
                        {filteredWords.map((word, index) => (
                            <Badge
                                key={index}
                                bg={currentMode === 'forget' ? 'danger' : 'secondary'}
                                className={`vocabulary-badge ${isInputFull ? 'disabled' : ''}`}
                                onClick={() => !isInputFull && handleWordClick(word)}
                                role="button"
                                aria-disabled={isInputFull}
                            >
                                {word}
                            </Badge>
                        ))}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default VocabularyList;