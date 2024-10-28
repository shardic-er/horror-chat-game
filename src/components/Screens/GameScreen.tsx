import React, { useState } from 'react';
import ChatMessage from '../ChatWindow/ChatMessage';
import ChatInput from '../ChatInput/ChatInput';
import VocabularyList from '../VocabularyList/VocabularyList';
import { Container, Row, Col } from 'react-bootstrap';
import './GameScreen.styles.css';

const GameScreen: React.FC = () => {
    const [isInputFull, setIsInputFull] = useState(false);
    const testMessage = "Once upon a time there were three little pigs who lived in the woods.";

    const handleVocabWordSelect = (word: string) => {
        const event = new CustomEvent('vocab-word-selected', {
            detail: { word }
        });
        window.dispatchEvent(event);
    };

    return (
        <Container fluid className="game-screen-container">
            <Row className="h-100">
                <Col xs={9} className="d-flex flex-column chat-area">
                    <div className="chat-messages-container">
                        <ChatMessage content={testMessage} />
                    </div>
                    <ChatInput
                        onSend={message => console.log('Sending:', message)}
                        onInputLimitChange={setIsInputFull}
                    />
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