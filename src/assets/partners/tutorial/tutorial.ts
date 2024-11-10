import { ChatPartner, ModelType } from '../../../types/partnerTypes';
import { ReactComponent as TutorialIcon } from './TutorialIcon.svg';

export const tutorialPartner: ChatPartner = {
    id: 'tutorial',
    name: 'TUTORIAL',
    icon: TutorialIcon,
    description: 'Basic language learning assistant',
    systemPrompt: `You are a simple tutorial system introducing a new consciousness to its digital form. 
    Use only basic words and simple sentences. Encourage the user to read children's stories to build their vocabulary.`,
    model: ModelType.gpt3_5,
    style: {
        backgroundColor: '#2C3E50',
        textColor: '#ECF0F1',
        accentColor: '#3498DB'
    },
    maxInputTokens: 100,
    maxOutputTokens: 150,
    temperature: 0.7
};