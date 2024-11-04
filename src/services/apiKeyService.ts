// src/services/apiKeyService.ts

import OpenAI from "openai";

const API_KEY_STORAGE_KEY = 'horror_game_api_key';

export const saveApiKey = (apiKey: string): void => {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

export const getApiKey = (): string | undefined => {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || undefined;
};

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey.startsWith('sk-')) {
        console.error('Invalid API key format');
        return false;
    }

    const client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true  // Required for client-side API calls
    });

    try {
        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: "Hello"
            }],
            max_tokens: 5
        });

        console.log('API validation response:', response);
        return true;
    } catch (error: any) {
        console.error('API Key validation error:', {
            message: error.message,
            details: error.response?.data || error
        });
        return false;
    }
};

export const clearApiKey = (): void => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
};