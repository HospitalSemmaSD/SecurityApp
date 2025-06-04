export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  token?: string; // Optional, for JWT or session token
  isActive?: boolean; // Optional, to indicate if the user is active
}
