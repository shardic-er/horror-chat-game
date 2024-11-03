// src/assets/library/CountingNumbers/CountingNumbers.tsx
import React from 'react';
import { Book } from '../../../types/libraryTypes';
import { ReactComponent as CountingCoverImage } from './CountingCoverImage.svg';
import { ReactComponent as OneBirdImage } from './OneBirdImage.svg';
import { ReactComponent as TwoCatsImage } from './TwoCatsImage.svg';

export const countingNumbersBook: Book = {
    title: 'Counting Numbers',
    tags:["beginner"],
    content: {
        backgroundType: 'book',
        pages: [
            {
                text: 'Let\'s start counting! One, two, three...',
                image: {
                    type: 'svg',
                    component: CountingCoverImage,
                },
            },
            {
                text: 'One bird is flying in the sky.',
                image: {
                    type: 'svg',
                    component: OneBirdImage,
                },
            },
            {
                text: 'Two cats are sitting on the wall.',
                image: {
                    type: 'svg',
                    component: TwoCatsImage,
                },
            },
        ],
    },
};
