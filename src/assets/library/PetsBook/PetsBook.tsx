// src/assets/library/PetsBook/PetsBook.tsx
import React from 'react';
import { Book } from '../../../types/libraryTypes';
import { ReactComponent as PetsCoverImage } from './PetsCoverImage.svg';

export const petsBook: Book = {
    title: 'My Pets',
    content: {
        backgroundType: 'book',
        pages: [
            {
                text: 'I have two pets: a dog and a cat.',
                image: {
                    type: 'svg',
                    component: PetsCoverImage,
                },
            },
            // Add more pages if needed
        ],
    },
};
