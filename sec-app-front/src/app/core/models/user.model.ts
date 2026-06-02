export interface UserResponse {
  id: string;
  userName: string;
  fullName: string;
  identification?: string;
  email?: string;
  phoneNumber?: string;
  roles: string[];
}

export interface UserCreate {
  username: string;
  password: string;
  fullName: string;
  role: string;
  identification?: string;
  email?: string;
  phoneNumber?: string;
}

export interface UserUpdate {
  fullName: string;
  role: string;
  identification?: string;
  email?: string;
  phoneNumber?: string;
}
