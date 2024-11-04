// src/components/Screens/GameScreen/GameScreen.tsx

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import VocabularyList from '../../game/VocabularyList/VocabularyList';
import PageNavigation from '../../game/PageNavigation/PageNavigation';
import GameMenu from '../../game/GameMenu/GameMenu';
import LibraryScreen from '../LibraryScreen/LibraryScreen';
import ForgetScreen from '../ForgetScreen/ForgetScreen';
import { DisplayMode, PageImage } from '../../../types/gameTypes';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { setDisplayMode } from '../../../store/slices/navigationSlice';
import { Book } from '../../../types/libraryTypes';
import ChatWindow from "../../game/ChatWindow/ChatWindow";
import ChatInput from "../../game/ChatInput/ChatInput";
import ChatMessage from '../../game/ChatMessage/ChatMessage';
import './GameScreen.styles.css';
import StatsDisplay from "../../statsDisplay/StatsDisplay";

const GameScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isInputFull, setIsInputFull] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const currentMode = useAppSelector(state => state.navigation.displayMode);

    const handleModeSelect = (mode: DisplayMode) => {
        dispatch(setDisplayMode(mode));
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

    const renderBookImage = (image: PageImage) => {
        if (image.type === 'svg') {
            const SvgComponent = image.component;
            return <SvgComponent />;
        } else if (image.type === 'url') {
            return (
                <img
                    src={image.src}
                    alt={`Page ${currentPage + 1}`}
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
                const currentPageContent = selectedBook.content.pages[currentPage];
                if (!currentPageContent) return null;

                return (
                    <div className={`chat-messages-container ${selectedBook.content.backgroundType}`}>
                        <div className="page-content">
                            {currentPageContent.image && (
                                <div className="page-image-container">
                                    {renderBookImage(currentPageContent.image)}
                                </div>
                            )}
                            <ChatMessage
                                content={currentPageContent.text}
                                style={currentPageContent.customStyles}
                            />
                        </div>
                        <PageNavigation
                            currentPage={currentPage}
                            totalPages={selectedBook.content.pages.length}
                            onNextPage={() => currentPage < selectedBook.content.pages.length - 1 && setCurrentPage(p => p + 1)}
                            onPrevPage={() => currentPage > 0 && setCurrentPage(p => p - 1)}
                        />
                        <StatsDisplay />
                    </div>

                );
            case 'chat':
                return (
                    <div className="chat-area">
                        <div className="chat-messages-container">
                            <ChatWindow />
                        </div>
                        <ChatInput onInputLimitChange={setIsInputFull} />
                        <StatsDisplay />
                    </div>
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