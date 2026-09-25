export type ProjectStatus = "ACTIVE" | "ARCHIVED";
export interface Project {
  id: number;
  name: string;
  description: string | null;
  ownerId: number;
  ownerName: string;
  status: ProjectStatus;
  isPinned?: boolean;
  isStarred?: boolean;
  imageCount?: number;
  documentCount?: number;
  videoCount?: number;
  audioCount?: number;
}
export interface ProjectMember {
  userId: number;
  email: string;
  fullName: string;
  role: string;
  joinedAt: string;
}

export interface Document {
  id: number;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploaderName: string;
  createdAt: string;
}
