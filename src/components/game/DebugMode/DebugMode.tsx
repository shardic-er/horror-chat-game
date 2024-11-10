// src/components/game/DebugMode/DebugMode.tsx

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Badge, Form, Card } from 'react-bootstrap';
import { addWord, removeWords } from '../../../store/slices/vocabularySlice';
import { updateUserState } from '../../../store/slices/gameSlice';
import { ProgressFlag } from '../../../types/gameTypes';
import { loadUser, saveUser } from '../../../services/userService';
import {
    PROGRESS_FLAG_DATA
} from '../../../assets/progressFlags/progressFlags';
import './DebugMode.styles.css';

interface DebugModeProps {
    isActive: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement>;
}

const DebugMode: React.FC<DebugModeProps> = ({ isActive, onClose, anchorRef }) => {
    const dispatch = useAppDispatch();
    const [newWord, setNewWord] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const knownWords = useAppSelector(state => state.vocabulary.knownWords);
    const forgottenWords = useAppSelector(state => state.vocabulary.forgottenWords);
    const progressFlags = useAppSelector(state => state.game.currentUser?.progressFlags);

    const persistVocabularyChanges = (updatedKnownWords: string[], updatedForgottenWords: string[]) => {
        const currentUser = loadUser();
        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                vocabulary: updatedKnownWords,
                forgottenWords: updatedForgottenWords
            };
            saveUser(updatedUser);
        }
    };

    const handleAddWord = (e: React.FormEvent) => {
        e.preventDefault();
        if (newWord.trim()) {
            const wordToAdd = newWord.trim().toLowerCase();
            if (!knownWords.includes(wordToAdd)) {
                const updatedKnownWords = [...knownWords, wordToAdd];
                dispatch(addWord(wordToAdd));
                persistVocabularyChanges(updatedKnownWords, forgottenWords);
            }
            setNewWord('');
        }
    };

    const handleRemoveWord = (word: string) => {
        const lowerWord = word.toLowerCase();
        const updatedKnownWords = knownWords.filter(w => w.toLowerCase() !== lowerWord);
        const updatedForgottenWords = [...forgottenWords, lowerWord];
        dispatch(removeWords([word]));
        persistVocabularyChanges(updatedKnownWords, updatedForgottenWords);
    };

    const handleFlagToggle = (flag: ProgressFlag) => {
        if (progressFlags) {
            const updatedFlags = {
                ...progressFlags,
                [flag]: !progressFlags[flag]
            };
            dispatch(updateUserState({ progressFlags: updatedFlags }));
        }
    };

    useEffect(() => {
        const calculatePosition = () => {
            if (!anchorRef.current) return;

            const buttonRect = anchorRef.current.getBoundingClientRect();
            const PANEL_WIDTH = 350;
            const PANEL_MARGIN = 10;

            let left = buttonRect.right + PANEL_MARGIN;
            let top = buttonRect.top;

            if (left + PANEL_WIDTH > window.innerWidth) {
                left = buttonRect.left - PANEL_WIDTH - PANEL_MARGIN;
            }

            const PANEL_HEIGHT = Math.min(600, window.innerHeight - 100);
            if (top + PANEL_HEIGHT > window.innerHeight) {
                top = Math.max(0, window.innerHeight - PANEL_HEIGHT - PANEL_MARGIN);
            }

            setPosition({ top, left });
        };

        if (isActive) {
            calculatePosition();
            window.addEventListener('resize', calculatePosition);
            return () => window.removeEventListener('resize', calculatePosition);
        }
    }, [isActive, anchorRef]);

    if (!isActive) return null;

    // Get all progress flags from the enum
    const allProgressFlags = Object.values(ProgressFlag);

    return createPortal(
        <div className="debug-mode-overlay" onClick={onClose}>
            <div
                className="debug-mode-panel"
                style={{
                    top: `${position.top}px`,
                    left: `${position.left}px`
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="debug-mode-header">
                    <h6 className="mb-0">Debug Controls</h6>
                    <button
                        className="close-button"
                        onClick={onClose}
                        aria-label="Close debug panel"
                    >
                        ×
                    </button>
                </div>

                <div className="debug-mode-content">
                    <Card bg="dark" text="light" className="mb-3">
                        <Card.Header>
                            <h6 className="mb-0">Progress Flags</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="debug-flags-grid">
                                {allProgressFlags.map((flag) => {
                                    const FlagIcon = PROGRESS_FLAG_DATA[flag as ProgressFlag].Icon;
                                    const isActive = progressFlags?.[flag as ProgressFlag] ?? false;
                                    const flagData = PROGRESS_FLAG_DATA[flag as ProgressFlag];

                                    return (
                                        <div key={flag} className="flag-item">
                                            <button
                                                className={`flag-icon-button ${isActive ? 'active' : ''}`}
                                                onClick={() => handleFlagToggle(flag as ProgressFlag)}
                                                title={isActive ? 'Click to deactivate' : 'Click to activate'}
                                            >
                                                <FlagIcon />
                                            </button>
                                            <div className="flag-text-content">
                                                <span className="flag-name">{flagData.name}</span>
                                                <span className="flag-description">{flagData.debugDescription}</span>
                                                <span className="flag-condition">{flagData.unlockCondition}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card.Body>
                    </Card>

                    <Card bg="dark" text="light">
                        <Card.Header>
                            <h6 className="mb-0">Vocabulary Management</h6>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleAddWord} className="mb-3">
                                <Form.Group className="d-flex gap-2">
                                    <Form.Control
                                        type="text"
                                        value={newWord}
                                        onChange={(e) => setNewWord(e.target.value)}
                                        placeholder="Add word..."
                                        size="sm"
                                        className="debug-input"
                                    />
                                    <button type="submit" className="btn btn-sm btn-danger">
                                        Add
                                    </button>
                                </Form.Group>
                            </Form>

                            <div className="word-list">
                                <div className="d-flex flex-wrap gap-2">
                                    {knownWords.map((word, index) => (
                                        <Badge
                                            key={index}
                                            bg="secondary"
                                            className="debug-word-badge"
                                            onClick={() => handleRemoveWord(word)}
                                            role="button"
                                        >
                                            {word} ×
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DebugMode;