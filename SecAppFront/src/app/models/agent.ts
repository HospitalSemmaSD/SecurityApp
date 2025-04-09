export interface AgentCreateDto {
  name: string;
  lastName: string;
  phone: string;
  identification: string;
  email: string;
  birthday?: Date;
  status?: boolean;
  photo: string;
  rangeId?: number;
}
