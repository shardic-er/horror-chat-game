import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ChatMessage from '../ChatWindow/ChatMessage';
import ChatInput from '../ChatInput/ChatInput';
import VocabularyList from '../VocabularyList/VocabularyList';
import PageNavigation from '../PageNavigation/PageNavigation';
import GameMenu from '../GameMenu/GameMenu';
import { PaginatedContent, GameContent } from '../../types/gameTypes';
import './GameScreen.styles.css';

// Example content (this would normally come from props or a service)
const sampleContent: GameContent = {
    mode: 'reading',
    content: {
        backgroundType: "book",
        pages: [
            {
                text: "Once upon a time there were three little pigs who lived in the woods.",
                imageRef: "/api/placeholder/400/300",
                customStyles: {
                    fontSize: '1.2rem',
                    lineHeight: '1.8'
                }
            },
            {
                text: "The first pig built his house of straw, because it was the easiest thing to do."
            },
            {
                text: "The second pig built his house of sticks, thinking it would be stronger than straw.",
                imageRef: "/api/placeholder/400/300"
            }
        ]
    }
};

const GameScreen: React.FC = () => {
    const [isInputFull, setIsInputFull] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentMode, setCurrentMode] = useState<GameContent['mode']>('reading');

    const paginatedContent = currentMode === 'reading'
        ? sampleContent.content as PaginatedContent
        : null;

    const handleVocabWordSelect = (word: string) => {
        const event = new CustomEvent('vocab-word-selected', {
            detail: { word }
        });
        window.dispatchEvent(event);
    };

    const handleNextPage = () => {
        if (paginatedContent && currentPage < paginatedContent.pages.length - 1) {
            setCurrentPage(curr => curr + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(curr => curr - 1);
        }
    };

    const renderContent = () => {
        if (currentMode === 'reading' && paginatedContent) {
            const currentPageContent = paginatedContent.pages[currentPage];
            return (
                <>
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
                        totalPages={paginatedContent.pages.length}
                        onNextPage={handleNextPage}
                        onPrevPage={handlePrevPage}
                    />
                </>
            );
        }

        return (
            <div className="chat-content">
                <ChatMessage content="Hello! How can I help you today?" />
            </div>
        );
    };

    return (
        <Container fluid className="game-screen-container">
            <Row className="h-100">
                <Col xs="auto" className="p-0">
                    <GameMenu
                        currentMode={currentMode}
                        onModeSelect={setCurrentMode}
                    />
                </Col>
                <Col xs className="d-flex flex-column chat-area">
                    <div className={`chat-messages-container ${paginatedContent?.backgroundType}`}>
                        {renderContent()}
                    </div>
                    {currentMode === 'chat' && (
                        <ChatInput
                            onSend={message => console.log('Sending:', message)}
                            onInputLimitChange={setIsInputFull}
                        />
                    )}
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