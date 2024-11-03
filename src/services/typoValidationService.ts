// src/services/typoValidationService.ts

import OpenAI from 'openai';
import GameLogger from './loggerService';

interface TypoValidationResponse {
    [word: string]: boolean;
}

interface ValidationAttempt {
    words: string[];
    rawResponse?: string;
    parsedResponse?: TypoValidationResponse;
    error?: Error;
    timestamp: string;
}

const VALIDATION_PROMPT = `As a linguistic expert, evaluate each word in the provided list and determine if it would be considered a typing mistake, erroneous form, or improper variation of a valid English word. Consider a word a typo/error if it:

1. Is a malformed conjugation (e.g., "runned" instead of "ran")
2. Uses incorrect suffixes (e.g., "quickedly")
3. Represents non-standard or improper variations
4. Contains common typing mistakes
5. Uses incorrect word formations

Respond only with a JSON object where keys are the input words and values are boolean (true if the word is a typo/error, false if it's a valid word).

For examples:
Input: ["firsted", "running", "quickedly", "cats"]
Output: {"firsted": true, "running": false, "quickedly": true, "cats": false}`;

export class TypoValidationService {
    private client: OpenAI;
    private validationHistory: ValidationAttempt[] = [];

    constructor(apiKey: string) {
        this.client = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true
        });
    }

    private logValidationAttempt(attempt: ValidationAttempt) {
        this.validationHistory.push(attempt);
        if (attempt.error) {
            GameLogger.logError('Validation Attempt Failed', {
                words: attempt.words,
                error: attempt.error,
                rawResponse: attempt.rawResponse
            });
        }
    }

    async validateWords(words: string[]): Promise<TypoValidationResponse> {
        const attempt: ValidationAttempt = {
            words,
            timestamp: new Date().toISOString()
        };

        try {
            // Log LLM request
            GameLogger.logLLMRequest(
                `Validating words: ${words.join(', ')}`
            );

            const response = await this.client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a linguistic expert focused on identifying improper word forms and typos."
                    },
                    {
                        role: "user",
                        content: `${VALIDATION_PROMPT}\n\nInput: ${JSON.stringify(words)}`
                    }
                ],
                temperature: 0.1,
                max_tokens: 150
            });

            const result = response.choices[0]?.message?.content;

            if (!result) {
                const error = new Error('No response from typo validation');
                attempt.error = error;
                this.logValidationAttempt(attempt);
                throw error;
            }

            attempt.rawResponse = result;
            GameLogger.logLLMResponse(result);

            try {
                const validationResponse = JSON.parse(result) as TypoValidationResponse;

                // Ensure all input words are in the response
                const finalResponse: TypoValidationResponse = {};
                words.forEach(word => {
                    finalResponse[word] = validationResponse[word] ?? false;
                });

                attempt.parsedResponse = finalResponse;
                this.logValidationAttempt(attempt);

                // Log which words were confirmed as typos
                const typos = Object.entries(finalResponse)
                    .filter(([_, isTypo]) => isTypo)
                    .map(([word]) => word);

                if (typos.length > 0) {
                    GameLogger.logVariationDiscovery('Confirmed Typos', typos);
                }

                return finalResponse;

            } catch (parseError) {
                attempt.error = parseError as Error;
                this.logValidationAttempt(attempt);
                GameLogger.logError('Response Parse Error', parseError);
                return words.reduce((acc, word) => ({ ...acc, [word]: false }), {});
            }
        } catch (error) {
            attempt.error = error as Error;
            this.logValidationAttempt(attempt);
            GameLogger.logError('Validation Request Failed', error);
            return words.reduce((acc, word) => ({ ...acc, [word]: false }), {});
        }
    }

    getValidationHistory(): ValidationAttempt[] {
        return this.validationHistory;
    }
}

export const createTypoValidationService = (apiKey: string) => {
    return new TypoValidationService(apiKey);
};