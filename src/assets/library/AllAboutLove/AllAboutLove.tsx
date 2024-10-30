// src/assets/library/AllAboutLove/AllAboutLove.tsx

import { Book } from '../../../types/libraryTypes';
import { ReactComponent as LoveCover } from './LoveCover.svg';
import { ReactComponent as WarmLove } from './WarmLove.svg';
import { ReactComponent as HugLove } from './HugLove.svg';
import { ReactComponent as SoftLove } from './SoftLove.svg';
import { ReactComponent as SafeLove } from './SafeLove.svg';
import { ReactComponent as HappyLove } from './HappyLove.svg';
import { ReactComponent as KindLove } from './KindLove.svg';
import { ReactComponent as HereLove } from './HereLove.svg';
import { ReactComponent as YouLove } from './YouLove.svg';
import { ReactComponent as BackCover } from './BackCover.svg';

const AllAboutLove: Book = {
    title: "All About Love",
    content: {
        backgroundType: "book",
        pages: [
            {
                text: "All About Love",
                image: {
                    type: 'svg' as const,
                    component: LoveCover
                }
            },
            {
                text: "Love is warm.",
                image: {
                    type: 'svg' as const,
                    component: WarmLove
                }
            },
            {
                text: "Love is hugs.",
                image: {
                    type: 'svg' as const,
                    component: HugLove
                }
            },
            {
                text: "Love is soft.",
                image: {
                    type: 'svg' as const,
                    component: SoftLove
                }
            },
            {
                text: "Love is safe.",
                image: {
                    type: 'svg' as const,
                    component: SafeLove
                }
            },
            {
                text: "Love is happy.",
                image: {
                    type: 'svg' as const,
                    component: HappyLove
                }
            },
            {
                text: "Love is kind.",
                image: {
                    type: 'svg' as const,
                    component: KindLove
                }
            },
            {
                text: "Love is here.",
                image: {
                    type: 'svg' as const,
                    component: HereLove
                }
            },
            {
                text: "Love is you.",
                image: {
                    type: 'svg' as const,
                    component: YouLove
                }
            },
            {
                text: "Love is all around!",
                image: {
                    type: 'svg' as const,
                    component: BackCover
                }
            }
        ]
    }
};

export default AllAboutLove;