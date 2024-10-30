// src/assets/library/books.ts
import { Book } from '../../types/libraryTypes';

import { threePigsBook } from './ThreeLittlePigs/ThreeLittlePigs';
import { systemLogsBook } from './SystemTerminalLogs/SystemTerminalLogs';
import { transferLetterBook } from './TransferAuthorization/TransferAuthorization';
import { recoveryNotesBook } from './RecoveryNotes/RecoveryNotes';
import { countingNumbersBook } from './CountingNumbers/CountingNumbers';
import { shapesBook } from './ShapesBook/ShapesBook';
import { petsBook } from './PetsBook/PetsBook';
import { allAboutLoveBook } from "./LoveIsYou/LoveIsYou";
import ColorsAllAround from "./ColorsAllAround/ColorsAllAround";

export const libraryContent: Book[] = [
    ColorsAllAround,
    threePigsBook,
    systemLogsBook,
    transferLetterBook,
    recoveryNotesBook,
    countingNumbersBook,
    shapesBook,
    petsBook,
    allAboutLoveBook,
];
