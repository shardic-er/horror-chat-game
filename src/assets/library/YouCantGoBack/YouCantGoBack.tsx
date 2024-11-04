// src/assets/library/YouCantGoBack/YouCantGoBack.tsx

import { Book } from '../../../types/libraryTypes';
import page1 from './YouCantGoBack1.png';
import page2 from './YouCantGoBack2.png';
import page3 from './YouCantGoBack3.png';
import page4 from './YouCantGoBack4.png';
import page5 from './YouCantGoBack5.png';
import page6 from './YouCantGoBack6.png';
import page7 from './YouCantGoBack7.png';
import page8 from './YouCantGoBack8.png';
import page9 from './YouCantGoBack9.png';
import backCover from './YouCantGoBackBackCover.png';

const YouCantGoBack: Book = {
    title: "You Can’t Go Back",
    tags: ['basic'],
    content: {
        backgroundType: "book",
        pages: [
            {
                text: "You Can’t Go Back",
                image: {
                    type: 'url' as const,
                    src: page1
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20cover%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Depict%20a%20small%20boy%2C%20Charlie%2C%20looking%20wistfully%20out%20the%20window%20of%20a%20new%2C%20unfamiliar%20house.%20Shadows%20in%20the%20room%20are%20long%20and%20strange%2C%20hinting%20at%20his%20unease.%20Use%20warm%2C%20muted%20colors%20to%20create%20a%20slightly%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "Charlie missed his old home. He missed his old bed, his old toys, and the little tree outside his window. “Can we go back?” he asked.\n\n“You can’t go back, Charlie. The old house is gone now,” they said.",
                image: {
                    type: 'url' as const,
                    src: page2
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Show%20Charlie%20sitting%20on%20the%20edge%20of%20his%20bed,%20hugging%20an%20old%20stuffed%20toy,%20staring%20down%20at%20his%20feet.%20The%20room%20should%20appear%20new%20and%20unfamiliar%2C%20with%20subtle%20shadows%20hinting%20at%20his%20unease.%20Use%20warm%2C%20muted%20colors%20to%20create%20a%20slightly%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "At school, Charlie felt small and out of place. “Can I go back to my old school?” he whispered.\n\n“You can’t go back, Charlie. Your old school isn’t there anymore,” they said with a strange smile.",
                image: {
                    type: 'url' as const,
                    src: page3
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Depict%20Charlie%20alone%20in%20a%20big%20classroom,%20surrounded%20by%20blurred%2C%20unfamiliar%20faces.%20His%20expression%20should%20be%20anxious%20and%20lost.%20Use%20warm%2C%20muted%20colors%20to%20create%20a%20slightly%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "Charlie’s new doctor’s office was cold and smelled strange. “Can I see my old doctor instead?” he asked.\n\n“You can’t go back, Charlie. Your old doctor is gone now,” they told him, with a voice that seemed almost too cheerful.",
                image: {
                    type: 'url' as const,
                    src: page4
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Show%20a%20shadowy%20doctor’s%20office%2C%20with%20Charlie%20shivering%20on%20the%20exam%20table.%20The%20doctor’s%20face%20should%20be%20half-hidden%20in%20shadow.%20Use%20warm%2C%20muted%20colors%20to%20create%20a%20slightly%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "At night, Charlie missed his old room. “Can I just go back to my old room, even for a little while?”\n\n“You can’t go back, Charlie. It’s gone,” came the answer, a whisper that seemed to drift from somewhere else in the room.",
                image: {
                    type: 'url' as const,
                    src: page5
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Show%20Charlie%20under%20a%20blanket%20in%20a%20big%2C%20strange%20bed.%20His%20eyes%20should%20be%20wide%20open%2C%20staring%20into%20the%20darkness%20as%20if%20he’s%20waiting%20for%20something%20to%20move.%20Use%20warm%2C%20muted%20colors%20to%20create%20a%20slightly%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "Charlie began to forget what his old home looked like. “Can you tell me about it?” he asked.\n\n“It’s better if you forget, Charlie,” they said. “The past doesn’t need you anymore.”",
                image: {
                    type: 'url' as const,
                    src: page6
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Show%20Charlie%20sitting%20alone%20in%20his%20room,%20holding%20a%20blurry%20picture%20of%20his%20old%20home.%20Details%20of%20the%20house%20should%20fade%20into%20shadows.%20Use%20warm%2C%20muted%20colors%20to%20create%20a%20slightly%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "Each night, Charlie asked, “Can I go back?” but the answer was always the same.\n\n“You’re here now, Charlie. There’s no going back.”",
                image: {
                    type: 'url' as const,
                    src: page7
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Depict%20a%20dimly%20lit%20hallway%20outside%20Charlie’s%20room,%20stretching%20into%20darkness.%20From%20his%20bed,%20Charlie%20should%20be%20staring%20at%20it%2C%20hoping%20for%20something%20beyond%20the%20shadows.%20Use%20warm%2C%20muted%20colors%20to%20create%20a%20slightly%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "One night, Charlie whispered, “But I don’t like it here. I want to go back.”\n\n“You’ll learn to like it, Charlie,” they said, their voices all around him, soft and gentle. “Soon, you won’t even remember the way back.”",
                image: {
                    type: 'url' as const,
                    src: page8
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Show%20Charlie%20lying%20down,%20eyes%20closed,%20with%20shadows%20around%20him%20deepening%20and%20reaching%20out%20toward%20him.%20Use%20warm%2C%20muted%20colors%20to%20create%20a%20slightly%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "And after that, Charlie stopped asking.",
                image: {
                    type: 'url' as const,
                    src: page9
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Show%20Charlie%20sitting%20quietly%20in%20his%20room,%20with%20a%20calm%20expression.%20The%20room%20should%20have%20a%20peaceful%20ambiance%20with%20subtle%20shadows.%20Use%20warm%2C%20muted%20colors%20to%20create%20a%20slightly%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "You can’t go back. Some places are gone for good, even if you don’t want them to be.",
                image: {
                    type: 'url' as const,
                    src: backCover
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20back%20cover%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Depict%20a%20simple%20scene%20that%20conveys%20finality%2C%20such%20as%20a%20closed%20door%20or%20a%20faded%20image%20of%20a%20house.%20Use%20warm%2C%20muted%20colors%20to%20maintain%20a%20slightly%20mysterious%20yet%20child-friendly%20atmosphere."
            }
        ]
    }
};

export default YouCantGoBack;
