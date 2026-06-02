export interface Responsible {
  id: number;
  fullName: string;
  rank: string;
  position: string;
  isActive: boolean;
}

export interface ResponsibleCreate {
  fullName: string;
  rank: string;
  position: string;
}
