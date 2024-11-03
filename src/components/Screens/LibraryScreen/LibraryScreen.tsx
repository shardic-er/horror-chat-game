// src/components/Screens/LibraryScreen/LibraryScreen.tsx

import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, Card, Badge } from 'react-bootstrap';
import { useAppSelector } from '../../../store/hooks';
import { Book, getUniqueWordCount, getKnownWordCount } from '../../../types/libraryTypes';
import { libraryContent } from "../../../assets/library/books";
import ContentTypeIcon from '../../ContentTypeIcon/ContentTypeIcon';
import { selectKnownWordsSet } from '../../../store/selectors/vocabularySelectors';
import { isBookAvailable } from '../../../types/libraryTypes';
import './LibraryScreen.styles.css';

interface BookItemProps {
    book: Book;
    knownWords: Set<string>;
    onClick: (book: Book) => void;
}

const BookItem: React.FC<BookItemProps> = React.memo(({ book, knownWords, onClick }) => {
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
                            <Badge bg={readabilityPercentage > 80 ? 'success' : 'warning'}>
                                {readabilityPercentage}% Readable
                            </Badge>
                        </div>
                        <div className="mt-2 word-count">
                            {knownWordCount} / {uniqueWords} words known
                        </div>
                        {book.tags && book.tags.length > 0 && (
                            <div className="mt-2 tag-container">
                                {book.tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        bg="info"
                                        className="me-1 tag-badge"
                                        style={{ textTransform: 'capitalize' }}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
});

const LibraryScreen: React.FC<{ onBookSelect: (book: Book) => void }> = ({ onBookSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const knownWords = useAppSelector(selectKnownWordsSet);
    const progressFlags = useAppSelector(state => state.game.currentUser?.progressFlags);
    const vocabularySize = useAppSelector(state => state.vocabulary.knownWords.length);

    const availableBooks = useMemo(() => {
        return libraryContent.filter(book => {
            // Title or tag search
            const searchTerms = searchQuery.toLowerCase().split(/\s+/);
            const matchesSearch = searchTerms.every(term => {
                const matchesTitle = book.title.toLowerCase().includes(term);
                const matchesTag = book.tags?.some(tag =>
                    tag.toLowerCase().includes(term)
                ) || false;
                return matchesTitle || matchesTag;
            });

            // Check if book is unlocked based on flags and vocabulary size
            const isAvailable = !book.tags?.some(tag => {
                switch (tag) {
                    case 'beginner':
                        return !progressFlags?.beginnerBooksUnlocked;
                    case 'basic':
                        return !progressFlags?.basicBooksUnlocked && vocabularySize <= 200;
                    case 'intermediate':
                        return !progressFlags?.intermediateBooksUnlocked && vocabularySize <= 5000;
                    case 'advanced':
                        return !progressFlags?.advancedBooksUnlocked && vocabularySize <= 20000;
                    default:
                        return false;
                }
            });

            // Check required flag if present
            const meetsRequiredFlag = !book.requiredFlag ||
                (progressFlags && progressFlags[book.requiredFlag] === true);

            return matchesSearch && isAvailable && meetsRequiredFlag;
        });
    }, [searchQuery, progressFlags, vocabularySize]);

    return (
        <Container fluid className="library-screen">
            <Row className="mb-4">
                <Col>
                    <h1 className="library-title">Library</h1>
                    <Form.Control
                        type="text"
                        placeholder="Search books by title or tags..."
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