export interface AgentDto {
  agentId: number | null;
  name: string | null;
  lastName: string | null;
  phone: string | null;
  identification: string | null;
  email: string | null;
  birthday: Date | null;
  status: boolean | null;
  photo?: string;
  agentCode: number | null;
  rangeId: number | null;
  rangeName: string | null;
}

export interface AgentCreateDto {
  //agentId: number | null;
  name: string | null;
  lastName: string | null;
  phone: string | null;
  identification: string | null;
  email: string | null;
  birthday: Date | null;
  status: boolean | null;
  photo?: File | null;
  rangeId: number | null;
  agentCode: number | null;
}
