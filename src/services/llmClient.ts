// src/services/llmClient.ts

import OpenAI from 'openai';
import { AIPartner, ChatMessage } from '../types/gameTypes';
import GameLogger from "./loggerService";

export type OpenAIModel = 'gpt-4' | 'gpt-4-turbo-preview' | 'gpt-3.5-turbo';

export class LLMClient {
    private client: OpenAI;
    private contextWindow: number = 4096;

    constructor(apiKey: string) {
        this.client = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true
        });
    }

    async generateResponse(
        aiPartner: AIPartner,
        chatHistory: ChatMessage[],
        userMessage: string,
        model: OpenAIModel = 'gpt-4'
    ): Promise<string> {
        try {
            const messages = this.prepareMessages(aiPartner, chatHistory, userMessage);

            GameLogger.logLLMRequest(JSON.stringify({
                model,
                partner: aiPartner.name,
                userMessage,
                systemPrompt: aiPartner.systemPrompt,
                contextLength: messages.length
            }, null, 2));

            const response = await this.client.chat.completions.create({
                model,
                messages: messages as any[],
                max_tokens: aiPartner.maxOutputTokens,
                temperature: aiPartner.temperature,
            });

            const responseContent = response.choices[0].message?.content || '';
            GameLogger.logLLMResponse(responseContent);

            return responseContent;
        } catch (error) {
            GameLogger.logError('LLM Generation Error', error);
            throw error;
        }
    }

    private prepareMessages(
        aiPartner: AIPartner,
        chatHistory: ChatMessage[],
        userMessage: string
    ) {
        return [
            { role: 'system', content: aiPartner.systemPrompt },
            ...chatHistory.slice(-5).map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            { role: 'user', content: userMessage }
        ];
    }
}