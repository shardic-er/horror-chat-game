// src/components/Screens/LibraryScreen/LibraryScreen.tsx

import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, Card, Badge } from 'react-bootstrap';
import { useAppSelector } from '../../../store/hooks';
import { Book, getUniqueWordCount, getKnownWordCount } from '../../../types/libraryTypes';
import {libraryContent} from "../../../assets/library/books";
import ContentTypeIcon from '../../ContentTypeIcon/ContentTypeIcon';
import './LibraryScreen.styles.css';

interface BookItemProps {
    book: Book;
    knownWords: Set<string>;
    onClick: (book: Book) => void;
}

const BookItem: React.FC<BookItemProps> = ({ book, knownWords, onClick }) => {
    const uniqueWords = getUniqueWordCount(book.content);
    const knownWordCount = getKnownWordCount(book.content, knownWords);
    const readabilityPercentage = Math.round((knownWordCount / uniqueWords) * 100);

    return (
        <Card
            className="book-item mb-3"
            onClick={() => onClick(book)}
            role="button"
        >
            <Card.Body>
                <div className="d-flex align-items-center gap-3">
                    <ContentTypeIcon
                        type={book.content.backgroundType}
                        className="content-type-icon"
                    />
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="book-title mb-0">{book.title}</h5>
                            <Badge bg={readabilityPercentage > 80 ? 'success' : 'warning'} style={{color:'black'}}>
                                {readabilityPercentage}% Readable
                            </Badge>
                        </div>
                        <div className="mt-2 word-count">
                            {knownWordCount} / {uniqueWords} words known
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

const LibraryScreen: React.FC<{ onBookSelect: (book: Book) => void }> = ({ onBookSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const knownWords = useAppSelector(state => new Set(state.vocabulary.knownWords.map(w => w.toLowerCase())));
    const progressFlags = useAppSelector(state => state.game.currentUser?.progressFlags);

    const availableBooks = useMemo(() => {
        return libraryContent.filter(book => {
            // Filter by search query
            const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());

            // Filter by required flags, with proper type checking
            const isUnlocked = !book.requiredFlag ||
                (progressFlags && progressFlags[book.requiredFlag] === true);

            return matchesSearch && isUnlocked;
        });
    }, [searchQuery, progressFlags]);

    return (
        <Container fluid className="library-screen">
            <Row className="mb-4">
                <Col>
                    <h1 className="library-title">Library</h1>
                    <Form.Control
                        type="search"
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="books-container">
                        {availableBooks.map(book => (
                            <BookItem
                                key={book.title}
                                book={book}
                                knownWords={knownWords}
                                onClick={onBookSelect}
                            />
                        ))}
                        {availableBooks.length === 0 && (
                            <div className="text-center text-muted">
                                No books found
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default LibraryScreen;