import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useAppSelector } from '../../store/hooks';
import './ChatInput.styles.css';

interface ChatInputProps {
    onSend?: (message: string) => void;
    onInputLimitChange?: (isAtLimit: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, onInputLimitChange }) => {
    const [stagedWords, setStagedWords] = useState<string[]>([]);
    const [currentInput, setCurrentInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const knownWords = useAppSelector((state) => state.vocabulary.knownWords);
    const wordLimit = useAppSelector((state) => state.vocabulary.wordLimit);

    const isAtWordLimit = stagedWords.length >= wordLimit;

    // Notify parent of limit changes
    useEffect(() => {
        onInputLimitChange?.(isAtWordLimit);
    }, [isAtWordLimit, onInputLimitChange]);

    // Add event listener for vocabulary word selections
    useEffect(() => {
        const handleVocabWord = (event: CustomEvent<{ word: string }>) => {
            if (!isAtWordLimit) {
                const word = event.detail.word;
                setStagedWords([...stagedWords, word]);
                setCurrentInput('');
            }
        };

        window.addEventListener('vocab-word-selected', handleVocabWord as EventListener);

        return () => {
            window.removeEventListener('vocab-word-selected', handleVocabWord as EventListener);
        };
    }, [stagedWords, isAtWordLimit]);

    const suggestions = useMemo(() => {
        if (!currentInput || isAtWordLimit) return [];
        return knownWords
            .filter(word => word.toLowerCase().startsWith(currentInput.toLowerCase()))
            .slice(0, 5);
    }, [currentInput, knownWords, isAtWordLimit]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [stagedWords]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isAtWordLimit) return;

        const value = e.target.value.toLowerCase();

        if (!/^[a-z\s]*$/.test(value)) return;

        const lastWord = value.split(' ').pop() || '';
        const hasValidContinuation = knownWords.some(word =>
            word.toLowerCase().startsWith(lastWord.toLowerCase())
        );

        if (hasValidContinuation || lastWord === '') {
            setCurrentInput(lastWord);
        }
    };

    const confirmWord = (word: string) => {
        if (!isAtWordLimit) {
            setStagedWords([...stagedWords, word]);
            setCurrentInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isAtWordLimit && (e.key === 'Enter' || e.key === 'Tab' || e.key === ' ') && suggestions.length > 0) {
            e.preventDefault();
            confirmWord(suggestions[0]);
        } else if (e.key === 'Backspace' && !currentInput) {
            e.preventDefault();
            setStagedWords(prev => prev.slice(0, -1));
        } else if (e.key === 'Enter' && !currentInput && stagedWords.length > 0) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (stagedWords.length > 0) {
            onSend?.(stagedWords.join(' '));
            setStagedWords([]);
            setCurrentInput('');
        }
    };

    return (
        <Card className={`chat-input-container ${isAtWordLimit ? 'at-limit-container' : ''}`}>
            <Card.Body className="p-2">
                <div className="input-flex-container">
                    <div className="input-area">
                        <div className="sentence-builder">
                            <div className="staged-words">
                                {stagedWords.map((word, index) => (
                                    <Badge
                                        key={index}
                                        bg="secondary"
                                        className="word-badge"
                                        tabIndex={-1}  // Prevent focus
                                    >
                                        {word}
                                    </Badge>
                                ))}
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={currentInput}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder={isAtWordLimit ? 'Press Enter to send' : `${wordLimit} words maximum`}
                                    className={`inline-input ${isAtWordLimit ? 'at-limit' : ''}`}
                                    aria-label="Word input"
                                />
                            </div>
                            <button
                                onClick={handleSendMessage}
                                className="send-button"
                                disabled={stagedWords.length === 0}
                                aria-label="Send message"
                            >
                                →
                            </button>
                        </div>
                        {suggestions.length > 0 && currentInput && !isAtWordLimit && (
                            <div className="suggestions-container">
                                {suggestions.map((word) => (
                                    <div
                                        key={word}
                                        className="suggestion-item"
                                        onClick={() => confirmWord(word)}
                                        role="option"
                                        aria-selected="false"
                                    >
                                        {word}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ChatInput;