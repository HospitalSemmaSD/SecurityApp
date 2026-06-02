export interface AuditLog {
    id: number;
    userName: string;
    action: string;
    entityType: string;
    entityId: string;
    details: string;
    timestamp: string;
}
