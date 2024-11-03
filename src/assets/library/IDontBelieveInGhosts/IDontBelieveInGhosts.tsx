// src/assets/library/IDontBelieveInGhosts/IDontBelieveInGhosts.tsx

import { Book } from '../../../types/libraryTypes';
import page1 from './IDontBelieveInGhosts1.png';
import page2 from './IDontBelieveInGhosts2.png';
import page3 from './IDontBelieveInGhosts3.png';
import page4 from './IDontBelieveInGhosts4.png';
import page5 from './IDontBelieveInGhosts5.png';
import page6 from './IDontBelieveInGhosts6.png';
import page7 from './IDontBelieveInGhosts7.png';
import page8 from './IDontBelieveInGhosts8.png';
import page9 from './IDontBelieveInGhosts9.png';
import page10 from './IDontBelieveInGhosts10.png';

const IDontBelieveInGhosts: Book = {
    title: "I Don't Believe in Ghosts!",
    // beginner (vocabulary < 200 unique words)
    // basic(200-5000 words)
    // intermediate(5000-20000)
    // advanced (+20000)
    tags:['basic'],
    content: {
        backgroundType: "book",
        pages: [
            {
                text: "I Don't Believe in Ghosts!",
                image: {
                    type: 'url' as const,
                    src: page1
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20whimsical%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Depict%20a%20small%20boy%20named%20Ben%20standing%20confidently%20with%20his%20arms%20crossed%20in%20the%20middle%20of%20a%20dimly%20lit%20room.%20Ben%20has%20a%20defiant%20expression%20on%20his%20face.%20Subtle,%20faint%20shadowy%20shapes%20are%20present%20in%20the%20background,%20hinting%20at%20ghostly%20figures%20without%20being%20scary.%20Use%20warm,%20muted%20colors%20to%20create%20a%20slightly%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "\"Ghosts aren't real!\" Ben says. \"They can't be. They don't have bodies, so they can't feel things.\"\n\n\"How would they even know what it's like to be real?\"",
                image: {
                    type: 'url' as const,
                    src: page2
                },
                prompt: "https://image.pollinations.ai/prompt/create%20a%20scene%20in%20a%20friendly,%20colorful%20children's%20book%20style.%20Show%20Ben%20pointing%20to%20a%20simple%20illustration%20of%20a%20human%20body%20without%20any%20text%20or%20labels.%20Ben%20looks%20thoughtful%20and%20assertive.%20Behind%20him,%20include%20shadowy,%20translucent%20hands%20hovering%20just%20out%20of%20sight,%20subtly%20suggesting%20a%20ghostly%20presence.%20Use%20soft%20lines%20and%20gentle%20colors%20appropriate%20for%20young%20readers."
            },
            {
                text: "\"Ghosts can't talk,\" Ben says, \"because they don't have voices or mouths. So how would they say anything?\"\n\n\"Ghosts wouldn't know what to say anyway… right?\"",
                image: {
                    type: 'url' as const,
                    src: page3
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Show%20Ben%20yawning%20in%20a%20dark%20room.%20Behind%20him,%20faint,%20shadowy%20figures%20are%20murmuring%20in%20swirling%20letters%20that%20don't%20reach%20his%20ears.%20Use%20gentle%20colors%20and%20lines%20to%20create%20a%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "\"Ghosts can't think,\" Ben says. \"They don't have brains like people do.\"\n\n\"No brain means no thoughts. Nothing there… right?\"",
                image: {
                    type: 'url' as const,
                    src: page4
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Show%20Ben%20looking%20at%20a%20large,%20glowing%20brain%20diagram.%20Over%20his%20shoulder,%20shadowy%20forms%20seem%20to%20watch%20with%20quiet%20intent.%20Use%20gentle%20colors%20and%20lines%20to%20create%20a%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "\"Ghosts don't need to eat or sleep,\" Ben says. \"So they'd have nothing to do! They'd just… drift around.\"\n\n\"Why would they even stay?\"",
                image: {
                    type: 'url' as const,
                    src: page5
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Show%20Ben%20sitting%20at%20a%20dinner%20table,%20surrounded%20by%20empty%20chairs.%20The%20shadows%20in%20the%20chairs%20have%20faint,%20hungry%20shapes%20but%20no%20faces.%20Use%20gentle%20colors%20and%20lines%20to%20create%20a%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "\"Ghosts can't see you,\" Ben says, \"and they can't hear you, either! No eyes, no ears.\"\n\n\"So why would they even care where you are?\"",
                image: {
                    type: 'url' as const,
                    src: page6
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Show%20Ben%20lying%20in%20bed,%20the%20moon%20casting%20his%20shadow%20on%20the%20wall.%20His%20shadow%20is%20surrounded%20by%20faint,%20other%20shadows%20reaching%20toward%20it,%20though%20Ben%20doesn't%20seem%20to%20notice.%20Use%20gentle%20colors%20and%20lines%20to%20create%20a%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "\"Ghosts can't remember things,\" Ben insists. \"You need a memory for that.\"\n\n\"They wouldn't even remember they were here.\"",
                image: {
                    type: 'url' as const,
                    src: page7
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Show%20Ben%20looking%20at%20an%20old%20photo%20album.%20Shadows%20gather%20over%20his%20shoulder,%20peering%20at%20the%20images%20as%20if%20recognizing%20something%20long%20forgotten.%20Use%20gentle%20colors%20and%20lines%20to%20create%20a%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "\"Ghosts can't feel sad, or mad, or lonely. They're just… gone.\"\n\n\"They wouldn't even know they're ghosts… right?\"",
                image: {
                    type: 'url' as const,
                    src: page8
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Show%20Ben%20shrugging%20in%20his%20room.%20Faint%20ghostly%20figures%20around%20him%20have%20expressions%20that%20look%20almost%20sad,%20as%20though%20they're%20listening,%20but%20fading%20further%20with%20each%20word%20he%20speaks.%20Use%20gentle%20colors%20and%20lines%20to%20create%20a%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "But sometimes, late at night, Ben thinks he sees something moving.\n\n\"But ghosts aren't real. They can't be... right?\"",
                image: {
                    type: 'url' as const,
                    src: page9
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Show%20Ben%20lying%20wide-eyed%20in%20bed,%20surrounded%20by%20whispers%20and%20shadows%20stretching%20over%20his%20walls%20and%20floor.%20Use%20gentle%20colors%20and%20lines%20to%20create%20a%20mysterious%20yet%20child-friendly%20atmosphere."
            },
            {
                text: "There are no ghosts. Nothing to see, nothing to hear, nothing to remember. Just Ben. And his thoughts. Alone.",
                image: {
                    type: 'url' as const,
                    src: page10
                },
                prompt: "https://image.pollinations.ai/prompt/Create%20a%20children's%20book%20illustration%20in%20a%20soft,%20hand-drawn%20style.%20Show%20Ben%20in%20a%20dark%20room,%20his%20own%20shadow%20stretching%20impossibly%20long%20behind%20him%20as%20if%20someone%20or%20something%20is%20standing%20right%20behind%20him.%20Use%20gentle%20colors%20and%20lines%20to%20create%20a%20mysterious%20yet%20child-friendly%20atmosphere."
            }
        ]
    }
};

export default IDontBelieveInGhosts;