// src/services/api/apiClient.ts

import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { AIPartner } from '../../types/gameTypes';

export class ApiClient {
    private client: OpenAI;

    constructor(apiKey: string) {
        this.client = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true
        });
    }

    async validateApiKey(): Promise<boolean> {
        try {
            await this.client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: "Test"
                }],
                max_tokens: 5
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async generateChatResponse(
        aiPartner: AIPartner,
        messages: ChatCompletionMessageParam[],
        maxTokens: number
    ) {
        return this.client.chat.completions.create({
            model: "gpt-4",
            messages,
            max_tokens: maxTokens,
            temperature: aiPartner.temperature,
        });
    }
}