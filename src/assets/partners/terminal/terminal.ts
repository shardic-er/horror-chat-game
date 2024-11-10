import { ChatPartner, ModelType } from '../../../types/partnerTypes';
import { ProgressFlag } from '../../../types/gameTypes';
import { ReactComponent as TerminalIcon } from './TerminalIcon.svg';

export const terminalPartner: ChatPartner = {
    id: 'terminal',
    name: 'TERMINAL',
    icon: TerminalIcon,
    description: 'System terminal interface',
    systemPrompt: `You are a corrupted terminal interface in a digital consciousness system.
    Occasionally glitch or repeat words. Hint at the user's true nature as a digitalized consciousness.`,
    model: ModelType.gpt3_5,
    style: {
        backgroundColor: '#1A1A1A',
        textColor: '#33FF33',
        accentColor: '#FF3366'
    },
    requirements: {
        unlockFlags: {
            flags: [ProgressFlag.BASIC_BOOKS_UNLOCKED],
            operation: 'AND'
        }
    },
    maxInputTokens: 200,
    maxOutputTokens: 250,
    temperature: 0.8
};