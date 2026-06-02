export interface RosterTemplate {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
}

export interface RosterTemplateCreate {
    name: string;
    description?: string;
    jsonData: string;
}

export interface RosterTemplateData {
    jsonData: string;
}
