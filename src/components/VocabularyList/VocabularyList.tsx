import React, { useState, useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import { ListGroup, Form, Badge, Card } from 'react-bootstrap';

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
        // This will be connected to the chat input later
    };

    return (
        <Card bg="dark" text="light">
            <Card.Header>
                <Form.Control
                    type="text"
                    placeholder="Search vocabulary..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-dark text-light"
                />
            </Card.Header>
            <Card.Body className="p-0">
                <ListGroup
                    variant="flush"
                    style={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#666 #333'
                    }}
                >
                    {filteredWords.map((word, index) => (
                        <ListGroup.Item
                            key={index}
                            action
                            variant="dark"
                            className="d-flex justify-content-between align-items-center border-bottom border-secondary"
                            onClick={() => handleWordClick(word)}
                        >
                            <Badge
                                bg="secondary"
                                className="text-light px-2 py-1 w-100 text-start"
                                style={{ cursor: 'pointer' }}
                            >
                                {word}
                            </Badge>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card.Body>
        </Card>
    );
};

export default VocabularyList;