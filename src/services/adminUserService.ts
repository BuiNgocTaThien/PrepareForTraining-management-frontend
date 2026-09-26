import { apiClient } from "./apiClient";
import type { ApiResponse, PaginatedData } from "../types/api";
import type { Role, User, UserStatus } from "../types/auth";
export const listUsers = (page: number = 0, size: number = 20, search: string = "") => {
  const query = new URLSearchParams({ page: page.toString(), size: size.toString() });
  if (search) query.append("search", search);
  return apiClient<ApiResponse<PaginatedData<User>>>(`/admin/users?${query.toString()}`);
};
export const createUser = (
  email: string,
  password: string,
  fullName: string,
  role: Role,
) =>
  apiClient<ApiResponse<User>>("/admin/users", {
    method: "POST",
    body: JSON.stringify({ email, password, fullName, role }),
  });
export const updateUserRole = (id: number, role: Role) =>
  apiClient<ApiResponse<User>>(`/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
export const updateUserStatus = (id: number, status: UserStatus) =>
  apiClient<ApiResponse<User>>(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
