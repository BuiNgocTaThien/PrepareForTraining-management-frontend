# Software Requirements Specification

## 1. Product overview

PrepareForTraining Management is a personal project knowledge-base system. Authenticated users create projects, manage members, and store project documents. The first release focuses on document metadata and file upload/download; AI chat is an optional later phase.

## 2. Roles

| Role | Permissions |
| --- | --- |
| ADMIN | Manage all users and projects. |
| OWNER | Create projects, manage projects they own, invite/remove members. |
| USER | View projects they belong to; upload, view, and download documents there. |

## 3. MVP functional requirements

1. A visitor can register and log in with email and password.
2. The API returns a JWT access token after successful login.
3. An OWNER can create, update, archive, and view their projects.
4. An OWNER can add an existing user to a project and remove a member.
5. A project member can list documents, upload an allowed file, view document metadata, and download it.
6. The system supports PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX, MD, TXT, JPG, PNG, GIF, SVG, BMP, MP4, MOV, and AVI.
7. Users only access projects of which they are members, except ADMIN.
8. Swagger documents every completed endpoint.

## 4. Non-functional requirements

- All endpoints are prefixed `/api/v1` and exchange JSON, except multipart upload/download.
- Passwords are BCrypt-hashed; never return passwords in API responses.
- Validate input; return consistent error responses.
- Enforce maximum file size and server-side file-type allowlist.
- Store file metadata in PostgreSQL; store file bytes in MinIO or local storage during development.

## 5. Out of scope for MVP

Email invitations, OCR/transcription, full-text semantic search, chatbot AI, cloud deployment, Kubernetes, and Terraform.
