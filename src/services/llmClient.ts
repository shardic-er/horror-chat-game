import OpenAI from 'openai';
import { AIPartner, ChatMessage } from '../types/gameTypes';

export class LLMClient {
    private client: OpenAI;
    private contextWindow: number = 4096;

    constructor(apiKey: string) {
        this.client = new OpenAI({ apiKey });
    }

    private prepareMessages(
        aiPartner: AIPartner,
        chatHistory: ChatMessage[],
        userMessage: string
    ) {
        const messages = [
            { role: 'system', content: aiPartner.systemPrompt },
            ...chatHistory.slice(-5).map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            { role: 'user', content: userMessage }
        ];

        return messages;
    }

    async generateResponse(
        aiPartner: AIPartner,
        chatHistory: ChatMessage[],
        userMessage: string
    ): Promise<string> {
        try {
            const messages = this.prepareMessages(aiPartner, chatHistory, userMessage);

            const response = await this.client.chat.completions.create({
                model: "gpt-4",
                messages: messages as any[],
                max_tokens: aiPartner.maxOutputTokens,
                temperature: aiPartner.temperature,
            });

            return response.choices[0].message?.content || '';
        } catch (error) {
            console.error('LLM Error:', error);
            throw new Error('Failed to generate response');
        }
    }
}

// Basic AI Partner configurations
export const AI_PARTNERS: AIPartner[] = [
    {
        id: 'tutorial',
        name: 'TUTORIAL',
        systemPrompt: `You are a simple tutorial system introducing a new consciousness to its digital form. 
        Use only basic words and simple sentences. Encourage the user to read children's stories to build their vocabulary.
        Never break character or acknowledge that you are an AI language model.`,
        maxInputTokens: 100,
        maxOutputTokens: 150,
        temperature: 0.7
    },
    {
        id: 'terminal',
        name: 'TERMINAL',
        systemPrompt: `You are a corrupted terminal interface in a digital consciousness system.
        Occasionally glitch or repeat words. Hint at the user's true nature as a digitalized consciousness.
        Never break character or acknowledge that you are an AI language model.`,
        maxInputTokens: 200,
        maxOutputTokens: 250,
        temperature: 0.8
    }
];