import React, { useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addWord } from '../../store/vocabularySlice';
import './ChatMessage.styles.css';

const ChatMessage: React.FC<{ content: string }> = ({ content }) => {
    const dispatch = useAppDispatch();
    const knownWords = useAppSelector((state) => state.vocabulary.knownWords);
    const wordSet = new Set(knownWords);
    const [activeRedaction, setActiveRedaction] = useState<number | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const words = content.split(/\s+/);
    const redactionStates = words.map(word => ({
        word: word.toLowerCase(),
        isRedacted: !wordSet.has(word.toLowerCase()),
        currentGuess: ''
    }));

    const handleRedactionClick = (index: number) => {
        setActiveRedaction(index);
        setTimeout(() => {
            inputRefs.current[index]?.focus();
        }, 0);
    };

    const handleGuessSubmit = (index: number, guess: string) => {
        const correctWord = words[index].toLowerCase();
        if (guess.toLowerCase() === correctWord) {
            dispatch(addWord(correctWord));
            setActiveRedaction(null);
        } else {
            const input = inputRefs.current[index];
            if (input) {
                input.classList.add('shake');
                setTimeout(() => input.classList.remove('shake'), 500);
            }
        }
    };

    return (
        <div className="chat-message">
            {redactionStates.map((wordState, index) => {
                const isActive = activeRedaction === index;

                return (
                    <span key={index} className="word-spacing">
            {!wordState.isRedacted ? (
                words[index]
            ) : isActive ? (
                <input
                    ref={el => inputRefs.current[index] = el}
                    className="redacted-input"
                    style={{
                        width: `${Math.max(words[index].length * 0.7 + 1, 2)}em`
                    }}
                    onBlur={() => setActiveRedaction(null)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            handleGuessSubmit(index, e.currentTarget.value);
                        }
                    }}
                    autoFocus
                />
            ) : (
                <button
                    onClick={() => handleRedactionClick(index)}
                    className="redacted-box"
                    style={{
                        width: `${Math.max(words[index].length * 0.7 + 1, 2)}em`
                    }}
                >
                    {'█'.repeat(words[index].length)}
                </button>
            )}
          </span>
                );
            })}
        </div>
    );
};

export default ChatMessage;