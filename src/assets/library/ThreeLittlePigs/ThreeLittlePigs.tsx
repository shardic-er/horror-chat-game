// src/assets/library/ThreeLittlePigs/ThreeLittlePigs.tsx
import { Book } from '../../../types/libraryTypes';

export const threePigsBook: Book = {
    title: 'Three Little Pigs',
    content: {
        backgroundType: 'book',
        pages: [
            {
                text: 'Once upon a time, there were three little pigs. Their mother told them it was time to build their own houses.',
                image: {
                    type: 'url',
                    src: '/api/placeholder/400/300', // Assuming placeholder images for now
                },
            },
            {
                text: 'The first pig built his house of straw, because it was the easiest thing to do. He spent most of his time playing and dancing.',
                image: {
                    type: 'url',
                    src: '/api/placeholder/400/300',
                },
            },
            {
                text: 'The second pig built his house with sticks. He worked a little harder than his brother, but still preferred to play.',
                image: {
                    type: 'url',
                    src: '/api/placeholder/400/300',
                },
            },
            {
                text: 'The third pig chose to build his house with bricks. He worked hard all day, carefully laying each brick.',
                image: {
                    type: 'url',
                    src: '/api/placeholder/400/300',
                },
            },
        ],
    },
};
