# API Contract — v1

Base URL: `http://localhost:8080/api/v1`. Protected endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Role / access | Purpose |
| --- | --- | --- | --- |
| POST | /auth/register | Public | Register a user. |
| POST | /auth/login | Public | Get JWT token. |
| GET | /users/me | Authenticated | Get current profile. |
| GET | /projects | Authenticated | List projects visible to current user. |
| POST | /projects | OWNER, ADMIN | Create a project. |
| GET | /projects/{id} | Member, ADMIN | Project details. |
| PUT | /projects/{id} | Owner, ADMIN | Update project. |
| DELETE | /projects/{id} | Owner, ADMIN | Archive project. |
| GET | /projects/{id}/members | Member, ADMIN | List members. |
| POST | /projects/{id}/members | Owner, ADMIN | Add member by user ID/email. |
| DELETE | /projects/{id}/members/{userId} | Owner, ADMIN | Remove member. |
| GET | /projects/{id}/documents | Member, ADMIN | List document metadata. |
| POST | /projects/{id}/documents | Member, ADMIN | Multipart upload with field `file`. |
| GET | /documents/{id}/download | Member, ADMIN | Download the original file. |
| DELETE | /documents/{id} | Uploader, Owner, ADMIN | Delete document and stored object. |

## Response envelope

```json
{ "success": true, "message": "Success", "data": {} }
```

## Auth examples

`POST /auth/register`

```json
{ "email": "owner@example.com", "password": "Password123!", "fullName": "Project Owner", "role": "OWNER" }
```

`POST /auth/login`

```json
{ "email": "owner@example.com", "password": "Password123!" }
```

Implement the exact DTOs and validation rules before building pages that call an endpoint.
