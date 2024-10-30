// src/components/Screens/GameScreen/GameScreen.tsx

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import VocabularyList from '../../game/VocabularyList/VocabularyList';
import PageNavigation from '../../game/PageNavigation/PageNavigation';
import GameMenu from '../../game/GameMenu/GameMenu';
import LibraryScreen from '../LibraryScreen/LibraryScreen';
import ForgetScreen from '../ForgetScreen/ForgetScreen';  // Add this import
import { DisplayMode } from '../../../types/gameTypes';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { setDisplayMode } from '../../../store/slices/navigationSlice';
import { Book } from '../../../types/libraryTypes';
import './GameScreen.styles.css';
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
                return (
                    <div className={`chat-messages-container ${selectedBook.content.backgroundType}`}>
                        <div className="page-content">
                            {/* ... existing reading mode content ... */}
                        </div>
                        <PageNavigation
                            currentPage={currentPage}
                            totalPages={selectedBook.content.pages.length}
                            onNextPage={() => currentPage < selectedBook.content.pages.length - 1 && setCurrentPage(p => p + 1)}
                            onPrevPage={() => currentPage > 0 && setCurrentPage(p => p - 1)}
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

            case 'forget':
                return <ForgetScreen />;

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