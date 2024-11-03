// src/assets/library/RecoveryNotes/RecoveryNotes.tsx
import { Book } from '../../../types/libraryTypes';

export const recoveryNotesBook: Book = {
    tags:["beginner"],
    title: 'Recovery Notes',
    content: {
        backgroundType: 'note',
        pages: [
            {
                text: 'Day 1: Patient showing signs of consciousness. Basic language functions returning slowly. Recommend starting with simple vocabulary exercises.',
            },
            {
                text: 'Day 3: Memory fragments becoming more coherent. Patient able to form basic sentences. Some confusion about physical form persists.',
            },
        ],
    },
};
