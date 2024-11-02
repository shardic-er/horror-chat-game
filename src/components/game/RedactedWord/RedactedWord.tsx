// src/components/RedactedWord/RedactedWord.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { addNewWord } from '../../../store/slices/vocabularySlice';
import './RedactedWord.styles.css';
import GameLogger from "../../../services/loggerService";

interface RedactedWordProps {
    word: string;
    onCorrectGuess: (word: string) => void;
    isActive: boolean;
    onFocus: () => void;
    onBlur: () => void;
}

const RedactedWord: React.FC<RedactedWordProps> = ({
                                                       word,
                                                       onCorrectGuess,
                                                       isActive,
                                                       onFocus,
                                                       onBlur
                                                   }) => {
    const dispatch = useAppDispatch();
    const [guess, setGuess] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLSpanElement>(null);

    // Auto-focus when becoming active
    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive]);

    const triggerWordDiscovery = (discoveredWord: string) => {
        GameLogger.logWordDiscovery(discoveredWord, 'RedactedWord guess');
        const discoveryEvent = new CustomEvent('wordDiscovered', {
            detail: {
                words: [discoveredWord],
                sourceElement: containerRef.current
            }
        });
        document.dispatchEvent(discoveryEvent);
    };

    const checkGuess = async (currentGuess: string) => {
        const normalizedGuess = currentGuess.toLowerCase();
        const normalizedWord = word.toLowerCase();

        if (normalizedGuess === normalizedWord) {
            try {
                GameLogger.logGameState({
                    type: 'Correct Guess',
                    word: normalizedWord,
                    guess: normalizedGuess
                });

                // First add the word to vocabulary
                await dispatch(addNewWord(normalizedWord));

                // Then trigger animation
                triggerWordDiscovery(normalizedWord);

                // Finally call the success callback
                onCorrectGuess(normalizedWord);
                return true;
            } catch (error) {
                GameLogger.logError('checkGuess', error);
                return false;
            }
        }
        return false;
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newGuess = e.target.value;
        if (newGuess.length <= word.length) {
            setGuess(newGuess);
            // Check if the guess is correct as soon as we have the right number of characters
            if (newGuess.length === word.length) {
                await checkGuess(newGuess);
            }
        }
    };

    const handleButtonClick = () => {
        onFocus();
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (!await checkGuess(guess)) {
                inputRef.current?.classList.add('shake');
                setTimeout(() => {
                    inputRef.current?.classList.remove('shake');
                }, 500);
                setGuess('');
            }
        } else if (e.key === 'Escape') {
            onBlur();
        } else if (e.key === 'Backspace' && !guess) {
            onBlur();
        }
    };

    return (
        <span className="redacted-word-wrapper" ref={containerRef}>
            {isActive ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={guess}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={onBlur}
                    className="redacted-word-input"
                    style={{
                        width: `${word.length}ch`
                    }}
                    maxLength={word.length}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                />
            ) : (
                <button
                    onClick={handleButtonClick}
                    className="redacted-word-mask"
                    style={{
                        width: `${word.length}ch`
                    }}
                >
                    {'█'.repeat(word.length)}
                </button>
            )}
        </span>
    );
};

export default RedactedWord;