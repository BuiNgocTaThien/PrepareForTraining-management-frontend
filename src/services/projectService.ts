import { apiClient } from "./apiClient";
import type { ApiResponse, PaginatedData } from "../types/api";
import type { Project, ProjectMember } from "../types/project";

// ==========================================
// QUẢN LÝ DỰ ÁN (PROJECTS)
// ==========================================

export const listProjects = (page: number = 0, size: number = 20, filter: string = "", sort: string = "createdAt,desc", search: string = "") => {
  const queryParams = new URLSearchParams({ page: page.toString(), size: size.toString(), sort });
  if (filter) queryParams.append("filter", filter);
  if (search) queryParams.append("search", search);
  return apiClient<ApiResponse<PaginatedData<Project>>>(`/projects?${queryParams.toString()}`);
};

export const getProject = (id: string) =>
  apiClient<ApiResponse<Project>>(`/projects/${id}`);
export const createProject = (name: string, description: string) =>
  apiClient<ApiResponse<Project>>("/projects", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });

// ==========================================
// QUẢN LÝ THÀNH VIÊN DỰ ÁN (MEMBERS)
// ==========================================

export const listMembers = (id: string) =>
  apiClient<ApiResponse<ProjectMember[]>>(`/projects/${id}/members`);
export const addMember = (id: string, email: string) =>
  apiClient<ApiResponse<ProjectMember>>(`/projects/${id}/members`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
export const removeMember = (id: string, userId: number) =>
  apiClient<ApiResponse<null>>(`/projects/${id}/members/${userId}`, {
    method: "DELETE",
  });

export const updateProject = (id: string, name: string, description: string) =>
  apiClient<ApiResponse<Project>>(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, description }),
  });

export const archiveProject = (id: string) =>
  apiClient<ApiResponse<Project>>(`/projects/${id}`, {
    method: "DELETE",
  });

export const restoreProject = (id: string) =>
  apiClient<ApiResponse<Project>>(`/projects/${id}/restore`, {
    method: "PUT",
  });

export const togglePinProject = (id: string) =>
  apiClient<ApiResponse<Project>>(`/projects/${id}/pin`, {
    method: "PUT",
  });

export const toggleStarProject = (id: string) =>
  apiClient<ApiResponse<Project>>(`/projects/${id}/star`, {
    method: "PUT",
  });

// ==========================================
// QUẢN LÝ TÀI LIỆU (DOCUMENTS)
// ==========================================

export const uploadDocument = (projectId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";
  return fetch(`${API_BASE_URL}/projects/${projectId}/documents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: formData,
  }).then(res => {
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  });
};

export const listDocuments = (projectId: string) =>
  apiClient<ApiResponse<any>>(`/projects/${projectId}/documents`);

export const deleteDocument = (projectId: string, documentId: number) =>
  apiClient<ApiResponse<null>>(`/projects/${projectId}/documents/${documentId}`, {
    method: "DELETE",
  });

export const renameDocument = (projectId: string, documentId: number, newName: string) =>
  apiClient<ApiResponse<any>>(`/projects/${projectId}/documents/${documentId}/rename`, {
    method: "PUT",
    body: JSON.stringify({ newName }),
  });

export const downloadDocument = (projectId: string, documentId: number) => {
  // Download dùng fetch thay vì apiClient vì nó trả về file (Blob), không phải JSON
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";
  return fetch(`${API_BASE_URL}/projects/${projectId}/documents/${documentId}/download`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
  }).then(res => {
    if (!res.ok) throw new Error("Download failed");
    return res.blob().then(blob => ({ data: blob }));
  });
};

// ==========================================
// TÍCH HỢP AI CHATBOT
// ==========================================

export const askChatbot = (projectId: string, question: string) => {
  // Chatbot gọi sang một server khác (Cổng 8000 của Python FastAPI)
  return fetch(`http://localhost:8000/api/v1/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify({ projectId: parseInt(projectId), question })
  }).then(res => {
    if (!res.ok) throw new Error("Chatbot failed");
    return res.json();
  });
};

export const getDashboardStats = () =>
  apiClient<ApiResponse<{activeProjects: number; totalDocuments: number; totalMembers: number}>>(`/projects/stats`);
