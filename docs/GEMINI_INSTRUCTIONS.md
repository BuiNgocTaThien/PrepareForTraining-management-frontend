# Context for Gemini or another coding assistant

You are contributing to a personal project named **PrepareForTraining Management**. Read `SRS.md`, `DATABASE_DESIGN.md`, `API_CONTRACT.md`, and `IMPLEMENTATION_PLAN.md` before modifying code.

## Technical constraints

- Backend: Java 21, Spring Boot, Maven, PostgreSQL, JPA, Spring Security, JWT, Swagger/OpenAPI.
- Frontend: React, TypeScript, Vite, React Router.
- API prefix: `/api/v1`; use the shared `ApiResponse` response envelope.
- Keep BE and FE separate. Never place frontend code inside the backend project.
- Use DTOs; do not expose JPA entities directly from controllers.
- Every protected action must check role **and** project membership/ownership.

## Working rules

1. Implement only the current phase unless asked otherwise.
2. Before changing an API, update `API_CONTRACT.md` and the matching FE service/type.
3. Use clear, small commits and do not hardcode secrets.
4. Explain files created/changed and commands needed to run or test them.
5. Ask before adding AI, email, cloud, or other out-of-scope services.

## First requested task

Implement Phase 1 in the backend: entities, repositories, database migrations, register/login, JWT, exception handling, Swagger annotations, and tests. Then report the routes, sample requests, and required local configuration.
