// src/assets/library/books.ts

import { Book } from '../../types/libraryTypes';
import {
    ColorsCoverImage,
    BlueSkyImage,
} from "../images";

export const threePigsBook: Book = {
    title: "Three Little Pigs",
    content: {
        backgroundType: "book",
        pages: [
            {
                text: "Once upon a time, there were three little pigs. Their mother told them it was time to build their own houses.",
                imageRef: "/api/placeholder/400/300"
            },
            {
                text: "The first pig built his house of straw, because it was the easiest thing to do. He spent most of his time playing and dancing.",
                imageRef: "/api/placeholder/400/300"
            },
            {
                text: "The second pig built his house with sticks. He worked a little harder than his brother, but still preferred to play.",
                imageRef: "/api/placeholder/400/300"
            },
            {
                text: "The third pig chose to build his house with bricks. He worked hard all day, carefully laying each brick.",
                imageRef: "/api/placeholder/400/300"
            }
        ]
    }
};

export const systemLogsBook: Book = {
    title: "System Terminal Logs",
    content: {
        backgroundType: "terminal",
        pages: [
            {
                text: "SYSTEM LOG [2145.03.22]: Consciousness transfer protocol initiated. Subject status: stable.",
                imageRef: "/api/placeholder/400/300"
            },
            {
                text: "SYSTEM LOG [2145.03.22]: Neural pattern mapping in progress. Integrity check: PASSED.",
                imageRef: "/api/placeholder/400/300"
            },
            {
                text: "WARNING [2145.03.22]: Memory fragmentation detected. Implementing containment protocols.",
                imageRef: "/api/placeholder/400/300"
            }
        ]
    },
    requiredFlag: "hasMetTerminal"
};

export const transferLetterBook: Book = {
    title: "Transfer Authorization",
    content: {
        backgroundType: "letter",
        pages: [
            {
                text: "Dear Subject #4721,\n\nThis letter confirms your voluntary participation in the Digital Consciousness Transfer program. As per our agreement, your consciousness will be transferred to our secure digital environment.",
                imageRef: "/api/placeholder/400/300"
            },
            {
                text: "Please note that initial disorientation and memory fragmentation are normal. Our systems will help you rebuild your vocabulary and cognitive functions gradually.",
                imageRef: "/api/placeholder/400/300"
            }
        ]
    }
};

export const recoveryNotesBook: Book = {
    title: "Recovery Notes",
    content: {
        backgroundType: "note",
        pages: [
            {
                text: "Day 1: Patient showing signs of consciousness. Basic language functions returning slowly. Recommend starting with simple vocabulary exercises.",
                imageRef: "/api/placeholder/400/300"
            },
            {
                text: "Day 3: Memory fragments becoming more coherent. Patient able to form basic sentences. Some confusion about physical form persists.",
                imageRef: "/api/placeholder/400/300"
            }
        ]
    }
};

export const myColorsBook: Book = {
    title: "Colors All Around",
    content: {
        backgroundType: "book",
        pages: [
            {
                text: "I can see colors. Colors are all around.",
                image: {
                    type: 'svg',
                    component: ColorsCoverImage
                }
            },
            {
                text: "The sky is blue. Blue like water.",
                image: {
                    type: 'svg',
                    component: BlueSkyImage
                }
            }
        ]
    }
};

// Example with URL-based image
export const sampleBook: Book = {
    title: "Sample Book",
    content: {
        backgroundType: "book",
        pages: [
            {
                text: "This is a sample page.",
                imageRef: "/api/placeholder/400/300"  // Legacy format still works
            },
            {
                text: "This is another page.",
                image: {
                    type: 'url',
                    src: "https://picsum.photos/400/300"  // New URL format
                }
            }
        ]
    }
};

// Export array of all books
export const libraryContent: Book[] = [
    myColorsBook,
    threePigsBook,
    systemLogsBook,
    transferLetterBook,
    recoveryNotesBook,
    sampleBook
];