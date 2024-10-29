import React, { useState, useRef, useEffect } from 'react';
import './RedactedWord.styles.css';

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
    const [guess, setGuess] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setGuess('');
    }, [word, isActive]);

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive]);

    const checkGuess = (currentGuess: string) => {
        if (currentGuess.toLowerCase() === word.toLowerCase()) {
            onCorrectGuess(word);
            return true;
        }
        return false;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (!checkGuess(guess)) {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newGuess = e.target.value;
        if (newGuess.length <= word.length) {
            setGuess(newGuess);
            // Check if the guess is correct as soon as we have the right number of characters
            if (newGuess.length === word.length) {
                checkGuess(newGuess);
            }
        }
    };

    return (
        <span className="redacted-word-wrapper">
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
                    onClick={onFocus}
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