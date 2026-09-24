# Implementation Plan

## Phase 0 — Foundation

- [ ] Install Java 21, Maven, Node.js LTS, PostgreSQL, and an IDE.
- [ ] Configure local PostgreSQL and `application-local.yml`.
- [ ] Run BE health endpoint and FE starter page.

## Phase 1 — Data model and authentication

- [ ] Create entities, repositories, Flyway migrations, role enums.
- [ ] Implement register/login, BCrypt, JWT filter, security configuration.
- [ ] Add `GET /users/me`, error handling, unit tests.

## Phase 2 — Projects and membership

- [ ] Implement project CRUD with ownership checks.
- [ ] Implement member add/list/remove with duplicate protection.
- [ ] Build Login, Register, Dashboard, Project Detail pages.

## Phase 3 — Documents

- [ ] Create storage abstraction: `FileStorageService`.
- [ ] Implement local storage first, then MinIO.
- [ ] Add upload/list/download/delete endpoints and security tests.
- [ ] Build document browser and upload component.

## Phase 4 — Quality and delivery

- [ ] Finish Swagger annotations and README run instructions.
- [ ] Add Docker Compose for PostgreSQL, MinIO, BE, and FE.
- [ ] Test authorization with Admin, Owner, and User accounts.
- [ ] Prepare demo data, screenshots, and presentation.

## Definition of done for every feature

The endpoint is validated, authorized, documented in Swagger, manually tested, and has its FE state (loading/error/empty/success) handled.
