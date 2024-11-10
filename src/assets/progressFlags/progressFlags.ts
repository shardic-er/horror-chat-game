import { ProgressFlag } from '../../types/gameTypes';
import { ReactComponent as ForgetModeIcon } from '../../assets/images/ForgetModeIcon.svg';
import { ReactComponent as BookBeginnerIcon } from '../../assets/images/achievements/BookBeginnerIcon.svg';
import { ReactComponent as BookBasicIcon } from '../../assets/images/achievements/BookBasicIcon.svg';
import { ReactComponent as BookIntermediateIcon } from '../../assets/images/achievements/BookIntermediateIcon.svg';
import { ReactComponent as BookAdvancedIcon } from '../../assets/images/achievements/BookAdvancedIcon.svg';
import { FC, SVGProps } from 'react';

export interface ProgressFlagData {
    name: string;
    description: string;
    unlockCondition: string;
    debugDescription: string;
    Icon: FC<SVGProps<SVGSVGElement>>;
}

export const PROGRESS_FLAG_DATA: Record<ProgressFlag, ProgressFlagData> = {
    [ProgressFlag.COMPLETED_DELETIONS]: {
        name: 'Master of Deletion',
        description: 'You have helped identify and remove 100 incorrect word variations, unlocking new abilities.',
        unlockCondition: 'Remove 100 incorrect word variations',
        debugDescription: 'Marks typo deletion quota as complete (100 deletions)',
        Icon: ForgetModeIcon
    },
    [ProgressFlag.BEGINNER_BOOKS_UNLOCKED]: {
        name: 'First Steps',
        description: 'Access to beginner reading materials has been granted. Start your journey of discovery.',
        unlockCondition: 'Complete the tutorial',
        debugDescription: 'Unlocks access to beginner-level reading materials',
        Icon: BookBeginnerIcon
    },
    [ProgressFlag.BASIC_BOOKS_UNLOCKED]: {
        name: 'Growing Knowledge',
        description: 'Your vocabulary has grown enough to access basic reading materials. New books are now available.',
        unlockCondition: 'Learn at least 200 words',
        debugDescription: 'Unlocks access to basic reading materials',
        Icon: BookBasicIcon
    },
    [ProgressFlag.INTERMEDIATE_BOOKS_UNLOCKED]: {
        name: 'Expanding Horizons',
        description: 'With your expanded vocabulary, intermediate reading materials are now accessible.',
        unlockCondition: 'Learn at least 5,000 words',
        debugDescription: 'Unlocks access to intermediate reading materials',
        Icon: BookIntermediateIcon
    },
    [ProgressFlag.ADVANCED_BOOKS_UNLOCKED]: {
        name: 'Knowledge Master',
        description: 'Your vast vocabulary has unlocked access to advanced reading materials.',
        unlockCondition: 'Learn at least 20,000 words',
        debugDescription: 'Unlocks access to advanced reading materials',
        Icon: BookAdvancedIcon
    }
};