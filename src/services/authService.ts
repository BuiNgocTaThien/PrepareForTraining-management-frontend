import { apiClient } from "./apiClient";
import type { ApiResponse } from "../types/api";
import type { AuthResult, User } from "../types/auth";

// ==========================================
// 🔒 ĐĂNG NHẬP VÀ ĐĂNG KÝ
// ==========================================

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

// Đăng nhập bằng Google (Truyền token lấy được từ Google lên Backend để xác thực)
export const loginWithGoogleApi = (accessToken: string) =>
  apiClient<ApiResponse<AuthResult>>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ accessToken }),
  });

// Lấy thông tin tài khoản đang đăng nhập hiện tại
export const getCurrentUser = () => apiClient<ApiResponse<User>>("/users/me");

// ==========================================
// 🔑 LẤY LẠI MẬT KHẨU (QUÊN MẬT KHẨU)
// ==========================================

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

// ==========================================
// 👤 CẬP NHẬT THÔNG TIN CÁ NHÂN (PROFILE)
// ==========================================

export const updateProfileApi = (fullName: string) =>
  apiClient<ApiResponse<User>>("/users/me/profile", {
    method: "PUT",
    body: JSON.stringify({ fullName }),
  });

export const changePasswordApi = (oldPassword: string, newPassword: string) =>
  apiClient<ApiResponse<string>>("/users/me/password", {
    method: "PUT",
    body: JSON.stringify({ oldPassword, newPassword }),
  });
