import { tutorialPartner } from './tutorial/tutorial';
import { terminalPartner } from './terminal/terminal';
import { archivistPartner } from './archivist/archivist';

export const CHAT_PARTNERS = [
    tutorialPartner,
    terminalPartner,
    archivistPartner
];

export * from '../../types/partnerTypes';