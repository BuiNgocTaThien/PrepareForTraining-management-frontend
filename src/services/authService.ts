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
export const loginWithGoogleApi = (accessToken: string) =>
  apiClient<ApiResponse<AuthResult>>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ accessToken }),
  });
export const getCurrentUser = () => apiClient<ApiResponse<User>>("/users/me");

export const forgotPasswordApi = (email: string) =>
  apiClient<ApiResponse<string>>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const resetPasswordApi = (token: string, newPassword: string) =>
  apiClient<ApiResponse<string>>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
