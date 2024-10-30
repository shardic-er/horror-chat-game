import React from 'react';
import {Book} from "../../../types/libraryTypes";

// Page 1: Illustration of a heart
const HeartIllustration: React.FC = () => (
    <svg width="200" height="200" viewBox="0 0 24 24">
        <path
            d="M12 21s-7-4.35-11-10.5C1 6.14 3.14 3 6.5 3A5.5 5.5 0 0112 7.5 5.5 5.5 0 0117.5 3C20.86 3 23 6.14 23 10.5 19 16.65 12 21 12 21z"
            fill="red"
        />
    </svg>
);

// Page 2: Illustration of a parent holding a baby, both smiling
const ParentHoldingBabyIllustration: React.FC = () => (
    <svg width="200" height="200" viewBox="0 0 64 64">
        {/* Parent */}
        <circle cx="32" cy="20" r="12" fill="#FFD1C1" />
        {/* Baby */}
        <circle cx="42" cy="40" r="8" fill="#FFC1C1" />
        {/* Parent's Body */}
        <path d="M20 32 C20 48, 44 48, 44 32" fill="#FFD1C1" />
    </svg>
);

// Page 3: Illustration of two animals hugging
const AnimalsHuggingIllustration: React.FC = () => (
    <svg width="200" height="200" viewBox="0 0 64 64">
        {/* Animal 1 */}
        <circle cx="24" cy="32" r="12" fill="#C1FFD1" />
        {/* Animal 2 */}
        <circle cx="40" cy="32" r="12" fill="#C1D1FF" />
        {/* Arms */}
        <path d="M28 32 L36 32" stroke="#000" strokeWidth="2" />
    </svg>
);

// Page 4: Illustration of a cozy blanket
const CozyBlanketIllustration: React.FC = () => (
    <svg width="200" height="200" viewBox="0 0 64 64">
        <rect x="16" y="24" width="32" height="20" fill="#FFEDC1" />
        <path d="M16 24 L48 44" stroke="#FFA" strokeWidth="2" />
        <path d="M48 24 L16 44" stroke="#FFA" strokeWidth="2" />
    </svg>
);

// Page 5: Illustration of a child holding a parent’s hand
const ChildHoldingHandIllustration: React.FC = () => (
    <svg width="200" height="200" viewBox="0 0 64 64">
        {/* Parent */}
        <circle cx="20" cy="24" r="8" fill="#FFD1C1" />
        {/* Child */}
        <circle cx="40" cy="32" r="6" fill="#FFC1C1" />
        {/* Hands */}
        <path d="M24 28 L36 34" stroke="#000" strokeWidth="2" />
    </svg>
);

// Page 6: Illustration of a smiling baby and a smiling parent
const SmilingFacesIllustration: React.FC = () => (
    <svg width="200" height="200" viewBox="0 0 64 64">
        {/* Parent Face */}
        <circle cx="24" cy="32" r="10" fill="#FFD1C1" />
        <path d="M20 34 Q24 38, 28 34" stroke="#000" strokeWidth="2" fill="none" />
        {/* Baby Face */}
        <circle cx="40" cy="32" r="6" fill="#FFC1C1" />
        <path d="M38 34 Q40 36, 42 34" stroke="#000" strokeWidth="1.5" fill="none" />
    </svg>
);

// Page 7: Illustration of two children sharing a toy
const SharingToyIllustration: React.FC = () => (
    <svg width="200" height="200" viewBox="0 0 64 64">
        {/* Child 1 */}
        <circle cx="22" cy="32" r="8" fill="#C1FFD1" />
        {/* Child 2 */}
        <circle cx="42" cy="32" r="8" fill="#C1D1FF" />
        {/* Toy */}
        <circle cx="32" cy="32" r="4" fill="#FFD1C1" />
    </svg>
);

// Page 8: Illustration of a family or friends together
const FamilyTogetherIllustration: React.FC = () => (
    <svg width="200" height="200" viewBox="0 0 64 64">
        {/* Person 1 */}
        <circle cx="16" cy="32" r="8" fill="#FFD1C1" />
        {/* Person 2 */}
        <circle cx="32" cy="32" r="8" fill="#FFC1C1" />
        {/* Person 3 */}
        <circle cx="48" cy="32" r="8" fill="#FFD1C1" />
    </svg>
);

// Page 9: Illustration of a baby looking in a mirror
const BabyInMirrorIllustration: React.FC = () => (
    <svg width="200" height="200" viewBox="0 0 64 64">
        {/* Baby */}
        <circle cx="24" cy="32" r="8" fill="#FFC1C1" />
        {/* Mirror */}
        <rect x="36" y="24" width="12" height="16" fill="#E1E1E1" stroke="#000" />
        {/* Reflection */}
        <circle cx="42" cy="32" r="6" fill="#FFC1C1" />
    </svg>
);

// Back Cover: Illustration of hearts floating around a smiling baby
const HeartsAroundBabyIllustration: React.FC = () => (
    <svg width="200" height="200" viewBox="0 0 64 64">
        {/* Baby */}
        <circle cx="32" cy="32" r="10" fill="#FFC1C1" />
        {/* Hearts */}
        <path
            d="M20 20s-2-2.35-5-5.5C15 11.14 17.14 9 20.5 9A3.5 3.5 0 0124 12.5 3.5 3.5 0 0127.5 9C30.86 9 33 11.14 33 14.5 30 17.65 20 20 20 20z"
            fill="red"
        />
        <path
            d="M44 20s-2-2.35-5-5.5C39 11.14 41.14 9 44.5 9A3.5 3.5 0 0148 12.5 3.5 3.5 0 0151.5 9C54.86 9 57 11.14 57 14.5 54 17.65 44 20 44 20z"
            fill="red"
        />
    </svg>
);

// Book pages array
const pages = [
    {
        title: 'All About Love',
        illustration: <HeartIllustration />,
    },
    {
        text: 'Love is warm.',
        illustration: <ParentHoldingBabyIllustration />,
    },
    {
        text: 'Love is hugs.',
        illustration: <AnimalsHuggingIllustration />,
    },
    {
        text: 'Love is soft.',
        illustration: <CozyBlanketIllustration />,
    },
    {
        text: 'Love is safe.',
        illustration: <ChildHoldingHandIllustration />,
    },
    {
        text: 'Love is happy.',
        illustration: <SmilingFacesIllustration />,
    },
    {
        text: 'Love is kind.',
        illustration: <SharingToyIllustration />,
    },
    {
        text: 'Love is here.',
        illustration: <FamilyTogetherIllustration />,
    },
    {
        text: 'Love is you.',
        illustration: <BabyInMirrorIllustration />,
    },
    {
        text: 'Love is all around!',
        illustration: <HeartsAroundBabyIllustration />,
    },
];

export const allAboutLoveBook: Book = {
    title: 'All About Love',
    content: {
        backgroundType: 'book',
        pages: [
            {
                text: 'All About Love',
                image: {
                    type: 'svg',
                    component: HeartIllustration,
                },
            },
            {
                text: 'Love is warm.',
                image: {
                    type: 'svg',
                    component: ParentHoldingBabyIllustration,
                },
            },
            {
                text: 'Love is hugs.',
                image: {
                    type: 'svg',
                    component: AnimalsHuggingIllustration,
                },
            },
            {
                text: 'Love is soft.',
                image: {
                    type: 'svg',
                    component: CozyBlanketIllustration,
                },
            },
            {
                text: 'Love is safe.',
                image: {
                    type: 'svg',
                    component: ChildHoldingHandIllustration,
                },
            },
            {
                text: 'Love is happy.',
                image: {
                    type: 'svg',
                    component: SmilingFacesIllustration,
                },
            },
            {
                text: 'Love is kind.',
                image: {
                    type: 'svg',
                    component: SharingToyIllustration,
                },
            },
            {
                text: 'Love is here.',
                image: {
                    type: 'svg',
                    component: FamilyTogetherIllustration,
                },
            },
            {
                text: 'Love is you.',
                image: {
                    type: 'svg',
                    component: BabyInMirrorIllustration,
                },
            },
            {
                text: 'Love is all around!',
                image: {
                    type: 'svg',
                    component: HeartsAroundBabyIllustration,
                },
            },
        ],
    },
};

