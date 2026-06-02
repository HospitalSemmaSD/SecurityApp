export interface Rank {
  id: number;
  name: string;
  institutionId: number;
  institutionName: string; 
}

export interface RankCreate {
  name: string;
  institutionId: number;
}

export interface GroupedRanks {
  institutionName: string;
  ranks: Rank[];
}