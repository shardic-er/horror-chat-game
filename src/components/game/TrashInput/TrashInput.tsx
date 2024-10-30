// src/components/game/TrashInput/TrashInput.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Badge, Card, Spinner } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { forgetWords } from '../../../store/slices/vocabularySlice';
import './TrashInput.styles.css';

const TrashInput: React.FC = () => {
    const dispatch = useAppDispatch();
    const [stagedWords, setStagedWords] = useState<string[]>([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const knownWords = useAppSelector((state) => state.vocabulary.knownWords);
    const forgottenWords = useAppSelector((state) => state.vocabulary.forgottenWords);
    const wordLimit = useAppSelector((state) => state.vocabulary.wordLimit);

    const isAtWordLimit = stagedWords.length >= wordLimit;

    // Listen for word selections from vocabulary list
    useEffect(() => {
        const handleVocabWord = (event: CustomEvent<{ word: string, mode: string }>) => {
            if (event.detail.mode === 'forget' && !isAtWordLimit) {
                const word = event.detail.word;
                // Check if word is already staged
                if (!stagedWords.includes(word)) {
                    setStagedWords(prev => [...prev, word]);
                    setCurrentInput('');
                }
            }
        };

        window.addEventListener('vocab-word-selected', handleVocabWord as EventListener);
        return () => {
            window.removeEventListener('vocab-word-selected', handleVocabWord as EventListener);
        };
    }, [stagedWords, isAtWordLimit]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [stagedWords]);

    const suggestions = React.useMemo(() => {
        if (!currentInput || isAtWordLimit) return [];
        return knownWords
            .filter(word => {
                const lowercaseWord = word.toLowerCase();
                return lowercaseWord.startsWith(currentInput.toLowerCase()) &&
                    !forgottenWords.includes(lowercaseWord) &&
                    !stagedWords.includes(word);
            })
            .slice(0, 5);
    }, [currentInput, knownWords, forgottenWords, stagedWords, isAtWordLimit]);

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
        if (!isAtWordLimit &&
            !forgottenWords.includes(word.toLowerCase()) &&
            !stagedWords.includes(word)) {
            setStagedWords(prev => [...prev, word]);
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
            handleDelete();
        }
    };

    const handleDelete = async () => {
        if (stagedWords.length > 0 && !isProcessing) {
            setIsProcessing(true);
            await dispatch(forgetWords(stagedWords));
            setStagedWords([]);
            setCurrentInput('');
            setIsProcessing(false);
        }
    };

    return (
        <Card className="trash-input-container">
            <Card.Body className="p-2">
                <div className="input-flex-container">
                    <div className="input-area">
                        <div className="trash-sentence-builder">
                            <div className="staged-words">
                                {stagedWords.map((word, index) => (
                                    <Badge
                                        key={index}
                                        bg="danger"
                                        className="word-badge"
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
                                    placeholder={isAtWordLimit ? 'Press Enter to forget' : 'An elephant never forgets...'}
                                    className={`inline-input ${isAtWordLimit ? 'at-limit' : ''}`}
                                    disabled={isProcessing}
                                />
                            </div>
                            <button
                                onClick={handleDelete}
                                className="delete-button"
                                disabled={stagedWords.length === 0 || isProcessing}
                                aria-label="Delete words"
                            >
                                {isProcessing ? (
                                    <Spinner
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="delete-icon"
                                    >
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                )}
                            </button>
                        </div>
                        {suggestions.length > 0 && currentInput && !isAtWordLimit && (
                            <div className="suggestions-container">
                                {suggestions.map((word) => (
                                    <div
                                        key={word}
                                        className="suggestion-item"
                                        onClick={() => confirmWord(word)}
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

export default TrashInput;