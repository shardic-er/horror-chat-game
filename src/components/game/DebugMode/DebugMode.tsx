import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Badge, Form, Card } from 'react-bootstrap';
import { addWord, removeWords } from '../../../store/slices/vocabularySlice';
import { updateUserState } from '../../../store/slices/gameSlice';
import { ProgressFlag } from '../../../types/gameTypes';

interface DebugModeProps {
    isActive: boolean;
}

interface ProgressFlagConfig {
    id: ProgressFlag;
    label: string;
    description: string;
}

const PROGRESS_FLAGS: ProgressFlagConfig[] = [
    {
        id: ProgressFlag.COMPLETED_DELETIONS,
        label: 'Completed Deletions',
        description: 'Marks typo deletion quota as complete (100 deletions)'
    }
];

const DebugMode: React.FC<DebugModeProps> = ({ isActive }) => {
    const dispatch = useAppDispatch();
    const [newWord, setNewWord] = useState('');
    const knownWords = useAppSelector(state => state.vocabulary.knownWords);
    const progressFlags = useAppSelector(state => state.game.currentUser?.progressFlags);

    const handleAddWord = (e: React.FormEvent) => {
        e.preventDefault();
        if (newWord.trim()) {
            dispatch(addWord(newWord.trim()));
            setNewWord('');
        }
    };

    const handleRemoveWord = (word: string) => {
        dispatch(removeWords([word]));
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

    if (!isActive) return null;

    return (
        <div className="debug-mode p-3">
            <Card bg="dark" text="light" className="mb-3">
                <Card.Header>
                    <h6 className="mb-0">Progress Flags</h6>
                </Card.Header>
                <Card.Body>
                    {PROGRESS_FLAGS.map(({ id, label, description }) => (
                        <div key={id} className="d-flex align-items-center gap-2 mb-2">
                            <Form.Check
                                type="switch"
                                id={id}
                                checked={progressFlags?.[id] ?? false}
                                onChange={() => handleFlagToggle(id)}
                                label={
                                    <div>
                                        <span className="me-2">{label}</span>
                                        <small className="text-muted">({description})</small>
                                    </div>
                                }
                                className="text-light"
                            />
                        </div>
                    ))}
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
    );
};

export default DebugMode;