// src/components/Screens/GameScreen/GameScreen.tsx

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import VocabularyList from '../../game/VocabularyList/VocabularyList';
import PageNavigation from '../../game/PageNavigation/PageNavigation';
import GameMenu from '../../game/GameMenu/GameMenu';
import LibraryScreen from '../LibraryScreen/LibraryScreen';
import {DisplayMode, PageContent} from '../../../types/gameTypes';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { setDisplayMode } from '../../../store/slices/navigationSlice';
import { Book } from '../../../types/libraryTypes';
import './GameScreen.styles.css';
import ChatMessage from "../../game/ChatWindow/ChatMessage";
import ChatWindow from "../../game/ChatWindow/ChatWindow";
import ChatInput from "../../game/ChatInput/ChatInput";

const GameScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isInputFull, setIsInputFull] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const currentMode = useAppSelector(state => state.navigation.displayMode);
    const currentPartnerId = useAppSelector(state => state.game.currentPartnerId);

    const handleModeSelect = (mode: DisplayMode) => {
        dispatch(setDisplayMode(mode));
        // Reset selected book if we're leaving reading mode
        if (mode !== 'reading') {
            setSelectedBook(null);
            setCurrentPage(0);
        }
    };

    const handleVocabWordSelect = (word: string) => {
        const event = new CustomEvent('vocab-word-selected', {
            detail: { word }
        });
        window.dispatchEvent(event);
    };

    const handleBookSelect = (book: Book) => {
        setSelectedBook(book);
        setCurrentPage(0);
        dispatch(setDisplayMode('reading'));
    };

    const handleNextPage = () => {
        if (selectedBook && currentPage < selectedBook.content.pages.length - 1) {
            setCurrentPage(curr => curr + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(curr => curr - 1);
        }
    };

    const renderPageImage = (page: PageContent) => {
        if (page.image) {
            // Handle new image format
            if (page.image.type === 'svg') {
                return (
                    <div className="page-image-container">
                        {React.createElement(page.image.component)}
                    </div>
                );
            } else {
                return (
                    <img
                        src={page.image.src}
                        alt="Page illustration"
                        className="page-image"
                    />
                );
            }
        } else if (page.imageRef) {
            // Handle legacy imageRef format
            return (
                <img
                    src={page.imageRef}
                    alt="Page illustration"
                    className="page-image"
                />
            );
        }
        return null;
    };

    const renderContent = () => {
        switch (currentMode) {
            case 'library':
                return (
                    <div className="game-content-container">
                        <LibraryScreen onBookSelect={handleBookSelect} />
                    </div>
                );

            case 'reading':
                if (!selectedBook) return null;
                const pageContent = selectedBook.content.pages[currentPage];
                return (
                    <div className={`chat-messages-container ${selectedBook.content.backgroundType}`}>
                        <div className="page-content">
                            {renderPageImage(pageContent)}
                            <ChatMessage
                                content={pageContent.text}
                                style={pageContent.customStyles}
                            />
                        </div>
                        <PageNavigation
                            currentPage={currentPage}
                            totalPages={selectedBook.content.pages.length}
                            onNextPage={handleNextPage}
                            onPrevPage={handlePrevPage}
                        />
                    </div>
                );

            case 'chat':
                return (
                    <>
                        <div className="chat-messages-container chat">
                            <ChatWindow />
                        </div>
                        <ChatInput onInputLimitChange={setIsInputFull} />
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <Container fluid className="game-screen-container">
            <Row className="h-100">
                <Col xs="auto" className="p-0">
                    <GameMenu
                        currentMode={currentMode}
                        onModeSelect={handleModeSelect}
                    />
                </Col>
                <Col xs className="d-flex flex-column chat-area">
                    {renderContent()}
                </Col>
                <Col xs={3}>
                    <VocabularyList
                        onWordSelect={handleVocabWordSelect}
                        isInputFull={isInputFull}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default GameScreen;