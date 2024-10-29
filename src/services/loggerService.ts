// src/services/loggerService.ts

interface LogStyles {
    word: string;
    message: string;
    variation: string;
    error: string;
    llm: string;
}

const styles: LogStyles = {
    word: 'color: #4CAF50; font-weight: bold',
    message: 'color: #2196F3',
    variation: 'color: #9C27B0; font-style: italic',
    error: 'color: #f44336; font-weight: bold',
    llm: 'color: #FF9800; font-weight: bold'
};

class GameLogger {
    static logWordDiscovery(word: string, context?: string) {
        console.group(`%c📚 Word Discovered: ${word}`, styles.word);
        console.log(`%cContext: ${context || 'Direct discovery'}`, styles.message);
        console.log(`%cTimestamp: ${new Date().toISOString()}`, styles.message);
        console.groupEnd();
    }

    static logVariationDiscovery(baseWord: string, variations: string[]) {
        console.group(`%c🔄 Variations for: ${baseWord}`, styles.variation);
        variations.forEach(variation => {
            console.log(`%c└─ ${variation}`, styles.variation);
        });
        console.groupEnd();
    }

    static logLLMRequest(prompt: string) {
        console.group(`%c🤖 LLM Request`, styles.llm);
        console.log(`%cPrompt: ${prompt}`, styles.message);
        console.log(`%cTimestamp: ${new Date().toISOString()}`, styles.message);
        console.groupEnd();
    }

    static logLLMResponse(response: string) {
        console.group(`%c🤖 LLM Response`, styles.llm);
        console.log(`%cRaw response: ${response}`, styles.message);
        console.log(`%cTimestamp: ${new Date().toISOString()}`, styles.message);
        console.groupEnd();
    }

    static logVocabularyUpdate(newWords: string[]) {
        console.group(`%c📝 Vocabulary Updated`, styles.message);
        console.log(`%cNew words added: ${newWords.join(', ')}`, styles.word);
        console.log(`%cTimestamp: ${new Date().toISOString()}`, styles.message);
        console.groupEnd();
    }

    static logError(context: string, error: any) {
        console.group(`%c❌ Error: ${context}`, styles.error);
        console.error(error);
        console.log(`%cTimestamp: ${new Date().toISOString()}`, styles.message);
        console.groupEnd();
    }

    static logGameState(state: any) {
        console.group(`%c🎮 Game State Update`, styles.message);
        console.log('Current state:', state);
        console.log(`%cTimestamp: ${new Date().toISOString()}`, styles.message);
        console.groupEnd();
    }
}

export default GameLogger;