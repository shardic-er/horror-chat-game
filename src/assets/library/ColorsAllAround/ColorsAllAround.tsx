// src/assets/library/ColorsAllAround/ColorsAllAround.tsx

import { Book } from '../../../types/libraryTypes';
import { ReactComponent as ColorsCover } from './ColorsCover.svg';
import { ReactComponent as BlueSky } from './BlueSky.svg';
import { ReactComponent as GreenGrass } from './GreenGrass.svg';
import { ReactComponent as YellowSun } from './YellowSun.svg';
import { ReactComponent as RedApple } from './RedApple.svg';

const ColorsAllAround: Book = {
    title: "Colors All Around",
    tags:["advanced"],
    content: {
        backgroundType: "book",
        pages: [
            {
                text: "I can see colors. Colors are all around.",
                image: {
                    type: 'svg' as const,
                    component: ColorsCover
                }
            },
            {
                text: "The sky is blue. Blue like water.",
                image: {
                    type: 'svg' as const,
                    component: BlueSky
                }
            },
            {
                text: "The grass is green. Green like trees.",
                image: {
                    type: 'svg' as const,
                    component: GreenGrass
                }
            },
            {
                text: "The sun is yellow. Yellow like a flower.",
                image: {
                    type: 'svg' as const,
                    component: YellowSun
                }
            },
            {
                text: "The apple is red. Red like a rose.",
                image: {
                    type: 'svg' as const,
                    component: RedApple
                }
            }
        ]
    }
};

export default ColorsAllAround;