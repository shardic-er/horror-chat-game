import React from 'react';
import ChatMessage from '../ChatWindow/ChatMessage';
import VocabularyList from '../VocabularyList/VocabularyList';
import { Container, Row, Col } from 'react-bootstrap';

const GameScreen: React.FC = () => {
    // Temporary test message
    const testMessage = "Once upon a time there were three little pigs who lived in the woods.";

    return (
        <Container fluid className="h-100 py-3">
            <Row className="h-100">
                <Col xs={9} className="pe-3">
                    <ChatMessage content={testMessage} />
                </Col>
                <Col xs={3}>
                    <VocabularyList />
                </Col>
            </Row>
        </Container>
    );
};

export default GameScreen;