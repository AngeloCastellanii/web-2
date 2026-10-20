# Sistema de Nómina (MVP)

Backend Node + frontend React. Session, Security, Reflex y ValidationMap.

## Estructura

- `schema.dbml` / `schmema.dbml` — modelado de datos
- `backend/` — API Node + PostgreSQL
- `frontend/` — React + Vite

## Requisitos

- Node.js + pnpm
- PostgreSQL local

## Configuración (secretos)

Los passwords **no** van en el repo.

```bash
cd backend
copy config.example.json config.local.json
```

Edita `backend/config.local.json` y pon tu password de Postgres (ese archivo está en `.gitignore`).

También puedes usar la variable `PGPASSWORD`.

## Base de datos

```bash
createdb -U postgres payroll
psql -U postgres -d payroll -f backend/sql/schema.sql
psql -U postgres -d payroll -f backend/sql/seed.sql
```

## Backend

```bash
cd backend
pnpm install
pnpm start
```

API: `http://localhost:8000`

## Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

App: `http://localhost:5173`

## Login demo

- Correo: `admin@payroll.local`
- Contraseña: `admin123`
