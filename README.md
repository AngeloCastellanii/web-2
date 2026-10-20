# Payroll System (MVP)

Sistema de nómina con arquitectura CursoNode: `Session` + `Security` + `/proccess` + BOs.

## Estructura

- `schema.dbml` — modelado en inglés
- `backend/` — Node.js + Express + PostgreSQL
- `frontend/` — React + Vite

## Requisitos

- Node.js + pnpm
- PostgreSQL local

## Base de datos

Ajusta usuario/password en `backend/config.json` (por defecto `postgres`/`postgres`, puerto `5432`).

```bash
createdb -U postgres payroll
psql -U postgres -d payroll -f backend/sql/schema.sql
psql -U postgres -d payroll -f backend/sql/seed.sql
```

También puedes usar `PGPASSWORD` si tu password local es distinta.

## Backend

```bash
cd backend
pnpm install
pnpm start
```

API en `http://localhost:8000`

## Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

App en `http://localhost:5173`

## Login demo

- Email: `admin@payroll.local`
- Password: `admin123`
