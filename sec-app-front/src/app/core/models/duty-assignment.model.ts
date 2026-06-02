export interface DutyAssignment {
  id: number;
  weekStartDate: string;
  agentId: number;
  agentName: string;
  agentRank: string;
  agentInstitution: string;
  agentPhone: string;
  shiftId: number;
  shiftName: string;
  shiftTimeRange: string;
  dutyPostId: number;
  dutyPostName: string;
}

export interface DutyAssignmentCreate {
  weekStartDate: string;
  agentId: number;
  shiftId: number;
  dutyPostId: number;
}
