export interface WeeklyRoster {
    id: number;
    startDate: string; // ISO YYYY-MM-DD (siempre lunes)
    isClosed: boolean;
    closedAt?: string;
    preparerName?: string;
    preparerRank?: string;
    approverName?: string;
    approverRank?: string;
    snapshotData?: string;
}

export interface CloseRosterRequest {
    date: string;
}

export interface CloneRosterRequest {
    fromDate: string;
    toDate: string;
}
