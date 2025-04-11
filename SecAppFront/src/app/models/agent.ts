export interface AgentCreateDto {
  agentId?: number;
  name: string;
  lastName: string;
  phone: string;
  identification: string;
  email: string;
  birthday?: Date;
  status?: boolean;
  photo?: string;
  rangeId?: number;
}

export interface AgentDto {
  agentId: number;
  name: string;
  lastName: string;
  phone: string;
  identification: string;
  email?: string;
  birthday?: Date;
  status?: boolean;
  photo?: string;
  rangeId?: number;
}
