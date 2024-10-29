// src/components/Screens/GameScreen.tsx

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import VocabularyList from '../VocabularyList/VocabularyList';
import PageNavigation from '../PageNavigation/PageNavigation';
import GameMenu from '../GameMenu/GameMenu';
import { DisplayMode, GameContent, PaginatedContent } from '../../types/gameTypes';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setDisplayMode } from '../../store/navigationSlice';
import './GameScreen.styles.css';
import ChatMessage from "../ChatWindow/ChatMessage";
import ChatWindow from "../ChatWindow/ChatWindow";
import ChatInput from "../ChatInput/ChatInput";

// Example content (this would normally come from a service)
const sampleContent: PaginatedContent = {
    backgroundType: "book",
    pages: [
        {
            text:"i'll they're i'm im ill theyre their there",
            imageRef: "https://picsum.photos/300",
            customStyles: {
                fontSize: '1.2rem',
                lineHeight: '1.8'
            }
        },
        {
            text: "The first pig built his house of straw, because it was the easiest thing to do. He spent most of his time playing and dancing.",
            imageRef: "https://picsum.photos/300"
        },
        {
            text: "The second pig built his house of sticks, thinking it would be stronger than straw. He worked a bit harder but still preferred leisure over labor.",
            imageRef: "https://picsum.photos/300"
        }
    ]
};

const GameScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isInputFull, setIsInputFull] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const currentMode = useAppSelector(state => state.navigation.displayMode);
    const currentPartnerId = useAppSelector(state => state.game.currentPartnerId);

    const handleModeSelect = (mode: DisplayMode) => {
        dispatch(setDisplayMode(mode));
    };

    const handleVocabWordSelect = (word: string) => {
        const event = new CustomEvent('vocab-word-selected', {
            detail: { word }
        });
        window.dispatchEvent(event);
    };

    const handleNextPage = () => {
        if (currentPage < sampleContent.pages.length - 1) {
            setCurrentPage(curr => curr + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(curr => curr - 1);
        }
    };

    const renderContent = () => {
        if (currentMode === 'reading') {
            const currentPageContent = sampleContent.pages[currentPage];
            return (
                <div className={`chat-messages-container ${sampleContent.backgroundType}`}>
                    <div className="page-content">
                        {currentPageContent.imageRef && (
                            <img
                                src={currentPageContent.imageRef}
                                alt={`Illustration for page ${currentPage + 1}`}
                                className="page-image"
                            />
                        )}
                        <ChatMessage
                            content={currentPageContent.text}
                            style={currentPageContent.customStyles}
                        />
                    </div>
                    <PageNavigation
                        currentPage={currentPage}
                        totalPages={sampleContent.pages.length}
                        onNextPage={handleNextPage}
                        onPrevPage={handlePrevPage}
                    />
                </div>
            );
        }

        return (
            <>
                <div className="chat-messages-container chat">
                    <ChatWindow />
                </div>
                <ChatInput onInputLimitChange={setIsInputFull} />
            </>
        );
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