export type Role = "ADMIN" | "OWNER" | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE";
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  status: UserStatus;
}
export interface AuthResult {
  accessToken: string;
  tokenType: string;
  user: User;
}
