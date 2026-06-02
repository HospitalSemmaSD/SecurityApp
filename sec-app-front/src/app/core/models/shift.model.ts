export interface Shift {
  id: number;
  name: string;
  startTime: string; 
  endTime: string;
  timeRange?: string;
}

export interface ShiftCreate {
  name: string;
  startTime: string;
  endTime: string;
}
