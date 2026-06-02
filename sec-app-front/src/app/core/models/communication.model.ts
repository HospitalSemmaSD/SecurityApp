export interface ShiftIncident {
    id: number;
    title: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High';
    shiftName?: string;
    dutyPostName?: string;
    reportedByUserName: string;
    createdAt: string;
}

export interface ShiftIncidentCreate {
    title: string;
    description: string;
    severity: string;
    shiftId?: number;
    dutyPostId?: number;
}

export interface InternalNotice {
    id: number;
    title: string;
    content: string;
    isUrgent: boolean;
    authorUserName: string;
    createdAt: string;
}

export interface InternalNoticeCreate {
    title: string;
    content: string;
    isUrgent: boolean;
    expirationDate?: string;
}
