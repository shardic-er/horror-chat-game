import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getApiKey, saveApiKey, validateApiKey } from '../../../services/apiKeyService';
import './MenuScreen.styles.css';

interface MenuScreenProps {
    onStartChat?: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onStartChat }) => {
    const dispatch = useDispatch();
    const [apiKey, setApiKey] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const savedKey = getApiKey();
        if (savedKey) {
            validateApiKey(savedKey).then(isValid => {
                if (isValid && onStartChat) {
                    onStartChat();
                }
                setIsChecking(false);
            });
        } else {
            setIsChecking(false);
        }
    }, [onStartChat]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsValidating(true);
        setError(null);

        try {
            const isValid = await validateApiKey(apiKey);
            if (isValid) {
                saveApiKey(apiKey);
                if (onStartChat) {
                    onStartChat();
                }
            } else {
                setError('Invalid API key. Please check your key and try again.');
            }
        } catch (err) {
            setError('Failed to validate API key. Please try again.');
        } finally {
            setIsValidating(false);
        }
    };

    if (isChecking) {
        return (
            <div className="menu-container">
                <div className="loading-spinner">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            </div>
        );
    }

    return (
        <div className="menu-container">
            <Card className="api-key-card">
                <Card.Header>
                    <h2 className="text-center">Digital Consciousness Recovery Interface</h2>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Enter your OpenAI API Key</Form.Label>
                            <Form.Control
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-..."
                                required
                                className="api-key-input"
                            />
                            <Form.Text className="text-muted">
                                Your API key will be stored locally and used only for this application.
                            </Form.Text>
                        </Form.Group>
                        {error && (
                            <Alert variant="danger" className="mb-3">
                                {error}
                            </Alert>
                        )}
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isValidating || !apiKey}
                            className="w-100"
                        >
                            {isValidating ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Validating...
                                </>
                            ) : (
                                'Enter Interface'
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default MenuScreen;