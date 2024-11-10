import React from 'react';
import { PaginatedContent } from '../../../types/gameTypes';
import { ReactComponent as BookIcon } from './BookIcon.svg';
import { ReactComponent as TerminalIcon } from './TerminalIcon.svg';
import { ReactComponent as LetterIcon } from './LetterIcon.svg';
import { ReactComponent as NoteIcon } from './NoteIcon.svg';

interface ContentTypeIconProps {
    type: PaginatedContent['backgroundType'];
    className?: string;
}

const ContentTypeIcon: React.FC<ContentTypeIconProps> = ({ type, className = '' }) => {
    switch (type) {
        case 'book':
            return <BookIcon className={className} />;
        case 'terminal':
            return <TerminalIcon className={className} />;
        case 'letter':
            return <LetterIcon className={className} />;
        case 'note':
            return <NoteIcon className={className} />;
        default:
            return null;
    }
};

export default ContentTypeIcon;