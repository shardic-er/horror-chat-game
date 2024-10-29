import React, { useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addNewWord } from '../../store/vocabularySlice';
import RedactedWord from '../RedactedWord/RedactedWord';
import './ChatMessage.styles.css';

interface ChatMessageProps {
    content: string;
    style?: React.CSSProperties;
}

interface ParsedWord {
    fullWord: string;
    baseWord: string;
    prefix: string;
    suffix: string;
}

const parseWord = (word: string): ParsedWord => {
    const match = word.match(/^([^a-zA-Z0-9]*)([\w'-]+)([^a-zA-Z0-9]*)$/);

    if (!match) {
        return {
            fullWord: word,
            baseWord: '',
            prefix: word,
            suffix: ''
        };
    }

    const [, prefix, baseWord, suffix] = match;
    return {
        fullWord: word,
        baseWord: baseWord,
        prefix: prefix,
        suffix: suffix
    };
};

const ChatMessage: React.FC<ChatMessageProps> = ({ content, style }) => {
    const dispatch = useAppDispatch();
    const knownWords = useAppSelector((state) => state.vocabulary.knownWords);
    const wordSet = new Set(knownWords.map(word => word.toLowerCase()));
    const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

    const parsedWords = content.split(/\s+/).map(parseWord);
    const redactedIndices = parsedWords
        .map((parsed, index) => (parsed.baseWord && !wordSet.has(parsed.baseWord.toLowerCase()) ? index : -1))
        .filter(index => index !== -1);

    const moveToNextRedactedWord = useCallback((currentIndex: number | null, moveForward: boolean = true) => {
        if (redactedIndices.length === 0) return;

        if (currentIndex === null) {
            setActiveWordIndex(redactedIndices[0]);
            return;
        }

        const currentPosition = redactedIndices.indexOf(currentIndex);
        if (currentPosition === -1) return;

        let nextPosition;
        if (moveForward) {
            nextPosition = (currentPosition + 1) % redactedIndices.length;
        } else {
            nextPosition = (currentPosition - 1 + redactedIndices.length) % redactedIndices.length;
        }

        setActiveWordIndex(redactedIndices[nextPosition]);
    }, [redactedIndices]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            moveToNextRedactedWord(activeWordIndex, !e.shiftKey);
        }
    }, [activeWordIndex, moveToNextRedactedWord]);

    const handleCorrectGuess = async (word: string) => {
        await dispatch(addNewWord(word));
        moveToNextRedactedWord(activeWordIndex);
    };

    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div className="chat-message" style={style}>
            {parsedWords.map((parsed, index) => {
                const isRedacted = parsed.baseWord && !wordSet.has(parsed.baseWord.toLowerCase());
                const isActive = activeWordIndex === index;

                if (!parsed.baseWord) {
                    return (
                        <React.Fragment key={index}>
                            <span className="known-word">{parsed.fullWord}</span>
                            {index < parsedWords.length - 1 && ' '}
                        </React.Fragment>
                    );
                }

                return (
                    <React.Fragment key={index}>
                        {parsed.prefix && <span className="known-word">{parsed.prefix}</span>}
                        {isRedacted ? (
                            <RedactedWord
                                word={parsed.baseWord}
                                onCorrectGuess={handleCorrectGuess}
                                isActive={isActive}
                                onFocus={() => setActiveWordIndex(index)}
                                onBlur={() => setActiveWordIndex(null)}
                            />
                        ) : (
                            <span className="known-word">{parsed.baseWord}</span>
                        )}
                        {parsed.suffix && <span className="known-word">{parsed.suffix}</span>}
                        {index < parsedWords.length - 1 && ' '}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ChatMessage;