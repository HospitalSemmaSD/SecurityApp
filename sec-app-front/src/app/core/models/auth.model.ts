export interface UserCredentials {
  username: string; 
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenExpiration: string;
}