import React, { useEffect, useRef } from 'react';
import { Alert } from 'react-bootstrap';
import { useAppSelector } from '../../../store/hooks';
import ChatMessage from '../ChatMessage/ChatMessage';
import ChatPartnerSelector from '../ChatPartnerSelector/ChatPartnerSelector';
import './ChatWindow.styles.css';

const ChatWindow: React.FC = () => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentPartnerId = useAppSelector(state => state.game.currentPartnerId);
    const chatHistory = useAppSelector(state =>
        currentPartnerId ? state.game.chatHistories[currentPartnerId]?.messages : []
    );
    const chatError = useAppSelector(state => state.game.chatState.error);
    const chatState = useAppSelector(state => state.game.chatState);
    const isLoading = chatState.isLoading && chatState.loadingPartnerId === currentPartnerId;


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    return (
        <div className="chat-window-container">
            <ChatPartnerSelector />
            <div className="messages-container">
                {chatHistory?.map((message) => (
                    <div
                        key={message.id}
                        className={`message-wrapper ${message.sender === 'user' ? 'user' : 'ai'}`}
                    >
                        <ChatMessage
                            content={message.content}
                            style={message.metadata?.isError ? { color: 'var(--bs-danger)' } : undefined}
                        />
                    </div>
                ))}
                {chatError && (
                    <Alert variant="danger" className="m-2">
                        Error: {chatError.message}
                    </Alert>
                )}
                {isLoading && (
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatWindow;