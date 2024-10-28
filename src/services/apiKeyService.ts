import Cookies from 'js-cookie';
import OpenAI from 'openai';

const API_KEY_COOKIE = 'horror_game_api_key';

export const saveApiKey = (apiKey: string): void => {
    Cookies.set(API_KEY_COOKIE, apiKey, { expires: 365 });
};

export const getApiKey = (): string | undefined => {
    return Cookies.get(API_KEY_COOKIE);
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
            model: "gpt-3.5-turbo",  // Using 3.5-turbo as it's more widely available
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