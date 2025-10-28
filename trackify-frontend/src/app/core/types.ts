export type Role = 'ROLE_SALES' | 'ROLE_MANAGER' | 'ROLE_ADMIN';

export interface User {
  userId: number;       // not "id"
  username: string;
  email: string;
  roles: string[];
  status: string;
}


export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
