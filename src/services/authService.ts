import { apiClient } from "./apiClient";
import type { ApiResponse } from "../types/api";
import type { AuthResult, User } from "../types/auth";
export const login = (email: string, password: string) =>
  apiClient<ApiResponse<AuthResult>>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
export const register = (email: string, password: string, fullName: string) =>
  apiClient<ApiResponse<AuthResult>>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, fullName }),
  });
export const getCurrentUser = () => apiClient<ApiResponse<User>>("/users/me");
