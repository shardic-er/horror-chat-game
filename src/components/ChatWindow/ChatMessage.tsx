import React, { useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addWord, incrementTokenLimit } from '../../store/vocabularySlice';

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
            dispatch(incrementTokenLimit());
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
        <div className="message-container text-light">
            {redactionStates.map((wordState, index) => {
                if (!wordState.isRedacted) {
                    return (
                        <span key={index} className="d-inline-block mx-1 my-1">
              {words[index]}
            </span>
                    );
                }

                const isActive = activeRedaction === index;
                return (
                    <span key={index} className="d-inline-block mx-1 my-1">
            {isActive ? (
                <input
                    ref={el => inputRefs.current[index] = el}
                    className="redaction-input"
                    style={{
                        width: `${Math.max(words[index].length * 0.8, 2)}em`,
                        background: '#2c3034',
                        border: '1px solid #495057',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        outline: 'none'
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
                    className="redaction-box"
                    style={{
                        background: '#2c3034',
                        border: '1px solid #495057',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        minWidth: '1.5em',
                        fontFamily: 'monospace'
                    }}
                >
                    {'█'.repeat(words[index].length)}
                </button>
            )}
          </span>
                );
            })}
            <style>
                {`
          .redaction-box:hover {
            background: #373b3e !important;
            border-color: #6c757d !important;
          }
          
          .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          }
          
          @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-2px, 0, 0); }
            40%, 60% { transform: translate3d(2px, 0, 0); }
          }
        `}
            </style>
        </div>
    );
};

export default ChatMessage;