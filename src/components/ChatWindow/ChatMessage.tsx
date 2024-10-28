import React, { useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addWord, incrementTokenLimit } from '../../store/vocabularySlice';

interface ChatMessageProps {
    content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content }) => {
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
        <div className="p-4 bg-gray-800 rounded-lg leading-relaxed">
            {redactionStates.map((wordState, index) => {
                if (!wordState.isRedacted) {
                    return (
                        <span key={index} className="inline-block mx-2 my-1">
              {words[index]}
            </span>
                    );
                }

                const isActive = activeRedaction === index;
                return (
                    <span key={index} className="inline-block mx-2 my-1 relative">
            {isActive ? (
                <input
                    ref={el => inputRefs.current[index] = el}
                    className="bg-gray-700 text-white px-2 py-1 rounded"
                    style={{ width: `${Math.max(words[index].length * 0.75, 2)}em` }}
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
                    className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
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