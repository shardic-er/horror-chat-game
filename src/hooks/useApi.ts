import { useState, useCallback } from 'react';
import { getApiKey } from '../services/apiKeyService';

interface UseApiOptions {
    onError?: (error: Error) => void;
}

export const useApi = (options: UseApiOptions = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const callApi = useCallback(async <T>(
        apiFunction: (apiKey: string, ...args: any[]) => Promise<T>,
        ...args: any[]
    ): Promise<T | null> => {
        const apiKey = getApiKey();
        if (!apiKey) {
            const error = new Error('API key not found');
            setError(error);
            options.onError?.(error);
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await apiFunction(apiKey, ...args);
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Unknown error occurred');
            setError(error);
            options.onError?.(error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [options]);

    return { isLoading, error, callApi };
};