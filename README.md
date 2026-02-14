# HealthConnect

This repository is organized into separate frontend and backend applications.

## Structure

- `frontend/`: React + Vite + Tailwind client (MVC-style UI architecture).
- `backend/`: Express + Prisma + MongoDB API (MVC architecture).

## Frontend MVC Mapping

- `frontend/src/models`: data models and state contracts.
- `frontend/src/services`: API/data access services.
- `frontend/src/controllers`: UI controllers (state + orchestration hooks).
- `frontend/src/views`: pages and components.

## Backend MVC Mapping

- `backend/src/models`: database-facing model operations.
- `backend/src/controllers`: request handlers.
- `backend/src/routes`: route definitions.
- `backend/src/services`: business/service logic.

## Run

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```
