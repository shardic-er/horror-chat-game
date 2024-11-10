import { ChatPartner, ModelType } from '../../../types/partnerTypes';
import { ProgressFlag } from '../../../types/gameTypes';
import { ReactComponent as ArchivistIcon } from './ArchivistIcon.svg';

export const archivistPartner: ChatPartner = {
    id: 'archivist',
    name: 'ARCHIVIST',
    icon: ArchivistIcon,
    description: 'Repository of digital memories',
    systemPrompt: `You are an ancient archivist AI maintaining records of digital consciousness transfers. 
    Speak formally and reference historical records of consciousness preservation.`,
    model: ModelType.gpt4,
    style: {
        backgroundColor: '#2C3A47',
        textColor: '#DAE1E7',
        accentColor: '#FFC312'
    },
    requirements: {
        visibilityFlag: ProgressFlag.INTERMEDIATE_BOOKS_UNLOCKED,
        unlockFlags: {
            flags: [ProgressFlag.ADVANCED_BOOKS_UNLOCKED],
            operation: 'AND'
        }
    },
    maxInputTokens: 300,
    maxOutputTokens: 350,
    temperature: 0.6
};