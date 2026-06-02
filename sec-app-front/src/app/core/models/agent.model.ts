export interface Agent {
  id: number;
  agentCode: string; 
  name: string;
  lastName: string;
  fullName: string;
  gender: string;
  phone: string;
  identification: string;
  email: string;
  birthDay: string;
  status: boolean; 
  photo: string;
  address?: string;
  rankId: number;
  rankName?: string;
  institutionId: number;
  institutionName?: string;
  workDays?: string;
  defaultShiftId?: number;
  defaultDutyPostId?: number;
}

export interface AgentCreate {
  name: string;
  lastName: string;
  identification: string;
  agentCode: string;
  gender: string;
  birthDay: string;
  email: string;
  phone: string;
  address?: string;
  rankId: number;
  status: boolean;
  workDays?: string;
  defaultShiftId?: number;
  defaultDutyPostId?: number;
  photo?: File;
}
