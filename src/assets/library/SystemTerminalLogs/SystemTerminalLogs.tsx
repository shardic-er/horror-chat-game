// src/assets/library/SystemTerminalLogs/SystemTerminalLogs.tsx
import {Book} from '../../../types/libraryTypes';
import {ProgressFlag} from "../../../types/gameTypes";

export const systemLogsBook: Book = {
    title: 'System Terminal Logs',
    tags:["advanced"],
    content: {
        backgroundType: 'terminal',
        pages: [
            {
                text: 'SYSTEM LOG [2145.03.22]: Consciousness transfer protocol initiated. Subject status: stable.',
            },
            {
                text: 'SYSTEM LOG [2145.03.22]: Neural pattern mapping in progress. Integrity check: PASSED.',
            },
            {
                text: 'WARNING [2145.03.22]: Memory fragmentation detected. Implementing containment protocols.',
            },
        ],
    },
    requiredFlag: ProgressFlag.COMPLETED_DELETIONS,
};
