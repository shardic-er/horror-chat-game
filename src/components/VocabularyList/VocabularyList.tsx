import React, { useState, useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Form, Badge, Card } from 'react-bootstrap';
import './VocabularyList.styles.css';

const VocabularyList: React.FC = () => {
    const knownWords = useAppSelector((state) => state.vocabulary.knownWords);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredWords = useMemo(() => {
        return knownWords.filter(word =>
            word.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort();
    }, [knownWords, searchTerm]);

    const handleWordClick = (word: string) => {
        alert(`Selected word: ${word}`);
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
                                bg="secondary"
                                className="word-badge"
                                onClick={() => handleWordClick(word)}
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