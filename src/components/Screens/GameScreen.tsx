import React from 'react';
import ChatMessage from '../ChatWindow/ChatMessage';
import VocabularyList from '../VocabularyList/VocabularyList';
import { Container, Row, Col } from 'react-bootstrap';
import './GameScreen.styles.css';

const GameScreen: React.FC = () => {
    const testMessage = "Once upon a time there were three little pigs who lived in the woods.";

    return (
        <Container fluid className="game-screen-container">
            <Row className="h-100">
                <Col xs={9} className="chat-area">
                    <div className="chat-container">
                        <ChatMessage content={testMessage} />
                    </div>
                </Col>
                <Col xs={3}>
                    <VocabularyList />
                </Col>
            </Row>
        </Container>
    );
};

export default GameScreen;