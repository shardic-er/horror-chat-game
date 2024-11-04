// src/assets/library/NervousMervis/NervousMervis.tsx

import { Book } from '../../../types/libraryTypes';
import page1 from './NervousMervis1.png';
import page2 from './NervousMervis2.png';
import page3 from './NervousMervis3.png';
import page4 from './NervousMervis4.png';
import page5 from './NervousMervis5.png';
import page6 from './NervousMervis6.png';
import page7 from './NervousMervis7.png';
import page8 from './NervousMervis8.png';
import page9 from './NervousMervis9.png';
import page10 from './NervousMervis10.png';

const NervousMervis: Book = {
    title: "Nervous Mervis",
    tags: ['beginner'],
    content: {
        backgroundType: "book",
        pages: [
            {
                text: "Nervous Mervis",
                image: {
                    type: 'url' as const,
                    src: page1,
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft%2C%20hand-drawn%20style.%20Depict%20a%20boy%20with%20wide%20eyes%2C%20clutching%20his%20backpack%2C%20standing%20alone%20in%20a%20hallway%20that%20seems%20to%20stretch%20on%20forever.%20Use%20muted%20colors%20to%20convey%20a%20sense%20of%20anxiety%20and%20isolation%2C%20but%20keep%20the%20style%20child-friendly.",
            },
            {
                text: "Mervis is nervous. He worries every day.\n\n\"Oh, Mervis, you always worry too much,\" they say.",
                image: {
                    type: 'url' as const,
                    src: page2,
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft%2C%20hand-drawn%20style.%20Show%20Mervis%20sweating%2C%20pulling%20his%20collar%2C%20as%20other%20kids%20watch%20with%20wide%2C%20blank%20stares.%20Use%20muted%20colors%20to%20convey%20anxiety%2C%20and%20keep%20the%20style%20child-friendly.",
            },
            {
                text: "Today, Mervis is worried about school. What if he forgets his homework?\n\n\"Silly Mervis, no one else forgets,\" the other kids whisper with too-wide smiles.",
                image: {
                    type: 'url' as const,
                    src: page3,
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft%2C%20hand-drawn%20style.%20Show%20Mervis%20clutching%20his%20notebook%20tightly%2C%20his%20knuckles%20white%2C%20while%20the%20notebook%20page%20shows%20scribbles%20instead%20of%20words.%20Other%20kids%20are%20nearby%2C%20whispering%20with%20too-wide%20smiles.%20Use%20muted%20colors%20to%20convey%20anxiety%2C%20and%20keep%20the%20style%20child-friendly.",
            },
            {
                text: "Mervis is nervous about lunch, too. What if he drops his tray?\n\n\"Oh, poor Mervis,\" the lunch lady says, but she’s grinning.",
                image: {
                    type: 'url' as const,
                    src: page4,
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft%2C%20hand-drawn%20style.%20Show%20Mervis%20walking%20with%20his%20lunch%20tray%2C%20which%20seems%20too%20heavy%2C%20his%20hand%20trembling.%20The%20lunch%20lady%20watches%20him%2C%20grinning.%20Use%20muted%20colors%20to%20convey%20anxiety%2C%20and%20keep%20the%20style%20child-friendly.",
            },
            {
                text: "Mervis is nervous about recess. What if they laugh at him?\n\n\"Maybe they will,\" the book says. \"Maybe they should.\"",
                image: {
                    type: 'url' as const,
                    src: page5,
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft%2C%20hand-drawn%20style.%20Show%20Mervis%20standing%20alone%20in%20a%20shadowed%20part%20of%20the%20playground.%20Other%20kids%20stand%20nearby%2C%20laughing%2C%20though%20we%20can't%20see%20at%20what.%20Use%20muted%20colors%20to%20convey%20anxiety%2C%20and%20keep%20the%20style%20child-friendly.",
            },
            {
                text: "Mervis is nervous about reading time. What if he stumbles over a word?\n\n\"Poor Mervis,” the teacher says. “Everyone is waiting…\"",
                image: {
                    type: 'url' as const,
                    src: page6,
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft%2C%20hand-drawn%20style.%20Show%20Mervis%20reading%2C%20his%20face%20flushed%2C%20eyes%20wide%2C%20mouth%20halfway%20open%20as%20if%20he's%20struggling%20with%20a%20word.%20The%20teacher's%20smile%20is%20stretched%2C%20her%20gaze%20fixed%20too%20intently%20on%20him.%20Use%20muted%20colors%20to%20convey%20anxiety%2C%20and%20keep%20the%20style%20child-friendly.",
            },
            {
                text: "\"If you weren’t so nervous, you’d be better,\" says the book.\n\n\"You’re making everyone wait. Maybe it’s your fault, Mervis.\"",
                image: {
                    type: 'url' as const,
                    src: page7,
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft%2C%20hand-drawn%20style.%20Show%20Mervis%20frowning%2C%20looking%20at%20the%20book%20in%20his%20hands.%20The%20book's%20cover%20shows%20his%20own%20wide-eyed%20face%20reflected%20back.%20Use%20muted%20colors%20to%20convey%20anxiety%2C%20and%20keep%20the%20style%20child-friendly.",
            },
            {
                text: "Mervis tries to ignore his worries. “It’s okay,” he whispers.\n\n\"But it doesn’t go away, does it, Mervis?\"",
                image: {
                    type: 'url' as const,
                    src: page8,
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft%2C%20hand-drawn%20style.%20Show%20Mervis's%20face%2C%20pale%2C%20mouth%20turned%20down.%20He%20is%20sweating%20as%20he%20tries%20to%20focus.%20Use%20muted%20colors%20to%20convey%20anxiety%2C%20and%20keep%20the%20style%20child-friendly.",
            },
            {
                text: "Nervous Mervis. Scaredy Mervis. Why can’t you be brave?\n\nThe book ends with a whisper, “Some kids don’t get better… and maybe that’s fine.”",
                image: {
                    type: 'url' as const,
                    src: page9,
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft%2C%20hand-drawn%20style.%20Show%20Mervis%20sitting%20alone%20as%20the%20sun%20goes%20down%2C%20the%20shadows%20stretching%20longer%20and%20longer%20over%20him.%20Use%20muted%20colors%20to%20convey%20anxiety%20and%20acceptance%2C%20and%20keep%20the%20style%20child-friendly.",
            },
            {
                text: "Nervous Mervis always worries… and that’s just the way it is.",
                image: {
                    type: 'url' as const,
                    src: page10,
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft%2C%20hand-drawn%20style%20for%20the%20back%20cover.%20Show%20Mervis%20walking%20away%20down%20the%20long%20hallway%2C%20his%20figure%20small%2C%20clutching%20his%20backpack.%20Use%20muted%20colors%20to%20convey%20a%20sense%20of%20ongoing%20anxiety%2C%20and%20keep%20the%20style%20child-friendly.",
            },
        ],
    },
};

export default NervousMervis;
