export interface AgentDto {
  agentId: number | null;
  name: string | null;
  lastName: string | null;
  phone: string | null;
  identification: string | null;
  email?: string;
  birthday: Date | null;
  status: boolean | null;
  photo?: string;
  agentCode: number | null;
  rangeId: number | null;
  rangeName: string | null;
}

export interface AgentCreateDto {
  //agentId: number | null;
  name: string;
  lastName: string;
  phone: string;
  identification: string;
  email?: string;
  birthday: Date;
  status: boolean;
  photo?: File;
  rangeId: number;
  institutionId: number;
  agentCode: number;
}

export interface AgentAutoCompleDto {
  id: number;
  name: string;
  lastName: string;
  phone: string;
  photo: string;
}
