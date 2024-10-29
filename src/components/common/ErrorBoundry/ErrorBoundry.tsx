// src/components/common/ErrorBoundary/ErrorBoundary.tsx

import React, { Component, ErrorInfo } from 'react';
import { Card, Button } from 'react-bootstrap';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to your error reporting service
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Card className="m-3 bg-dark text-light border-danger">
                    <Card.Header className="bg-danger text-white">
                        <h4 className="mb-0">Something went wrong</h4>
                    </Card.Header>
                    <Card.Body>
                        <p>An error occurred in this part of the application.</p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-3">
                                <h5>Error Details:</h5>
                                <pre className="bg-dark text-danger p-3 rounded">
                                    {this.state.error.toString()}
                                </pre>
                                {this.state.errorInfo && (
                                    <pre className="bg-dark text-warning p-3 rounded mt-2" style={{ maxHeight: '200px', overflow: 'auto' }}>
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}
                        <Button
                            variant="primary"
                            onClick={this.handleReset}
                            className="mt-3"
                        >
                            Try Again
                        </Button>
                    </Card.Body>
                </Card>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;