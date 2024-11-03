// src/assets/library/ShapesBook/ShapesBook.tsx
import React from 'react';
import { Book } from '../../../types/libraryTypes';
import { ReactComponent as ShapesCoverImage } from './ShapesCoverImage.svg';
import { ReactComponent as CircleImage } from './CircleImage.svg';

export const shapesBook: Book = {
    title: 'Shapes Around Us',
    tags:["beginner"],
    content: {
        backgroundType: 'book',
        pages: [
            {
                text: 'Shapes are everywhere! Let\'s explore them.',
                image: {
                    type: 'svg',
                    component: ShapesCoverImage,
                },
            },
            {
                text: 'This is a circle. It is round.',
                image: {
                    type: 'svg',
                    component: CircleImage,
                },
            },
        ],
    },
};
