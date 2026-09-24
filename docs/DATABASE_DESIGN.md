# Database Design

## Tables

| Table | Important columns | Notes |
| --- | --- | --- |
| users | id, email, password_hash, full_name, role, status, created_at | Email is unique. |
| projects | id, name, description, owner_id, status, created_at, updated_at | `owner_id` references users. |
| project_members | id, project_id, user_id, joined_at | Unique pair `(project_id, user_id)`. |
| documents | id, project_id, uploaded_by, original_name, object_key, content_type, size_bytes, created_at | `object_key` points to MinIO/local storage. |

## Relationships

`User 1—N Project` through `projects.owner_id`.

`User N—N Project` through `project_members`.

`Project 1—N Document`; `User 1—N Document` through `uploaded_by`.

## Initial enums

- `Role`: `ADMIN`, `OWNER`, `USER`
- `ProjectStatus`: `ACTIVE`, `ARCHIVED`
- `UserStatus`: `ACTIVE`, `INACTIVE`
