# Chronos Watches

Chronos Watches is a deployable full-stack catalogue for luxury watches with a **FastAPI backend** and a **React + TypeScript frontend**. The experience includes product filtering, accessible detail/cart modals, and an admin inventory panel backed by a JSON file for simple local persistence.

## Stack

- **Frontend:** React 18, TypeScript, Vite, MUI, Axios, React Hook Form, Zod, React Router, Vitest, Testing Library
- **Backend:** FastAPI, Pydantic, Uvicorn, Pytest, local JSON persistence with thread-safe locking
- **Deployment:** Dockerfiles for frontend/backend, Docker Compose, Render-friendly combined deployment via FastAPI static file serving

## Project structure

```text
chronos-watches/
  backend/
    main.py
    requirements.txt
    watches.json
    tests/
  frontend/
    src/
    package.json
    vite.config.ts
  docker-compose.yml
```

## Local setup

### Backend

```bash
python3 -m venv backend/.venv
backend/.venv/bin/pip install -r backend/requirements.txt
backend/.venv/bin/uvicorn main:app --reload --app-dir backend --port 8000
```

FastAPI docs are available at `http://localhost:8000/docs`.

### Frontend

```bash
npm install
npm run dev:frontend
```

Set `frontend/.env` as needed:

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_ADMIN_TOKEN=chronos-admin
```

The admin route is `/admin?token=chronos-admin` by default.

### Run both from the root

```bash
npm run dev
```

## Tests

```bash
npm run test -w frontend
cd backend && pytest
```

## Deployment notes

### Render: separate services

- **Backend service**
  - Build command: `pip install -r backend/requirements.txt`
  - Start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Frontend static site**
  - Build command: `npm install && npm run build -w frontend`
  - Publish directory: `frontend/dist`
  - Environment variable: `VITE_API_BASE_URL=https://<backend-service>.onrender.com`

### Render: combined service

Build the frontend first, then serve the compiled files from FastAPI:

```bash
npm install
npm run build -w frontend
pip install -r backend/requirements.txt
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

Because `backend/main.py` mounts `frontend/dist` when it exists, the built React app can be served by the backend in a single service.

## Accessibility highlights

- Descriptive image alt text for product cards and product modals
- Keyboard-focus-visible styling on interactive components
- Accessible MUI dialogs with labelled titles and managed focus
- Form validation with helper/error text and `aria-invalid` states in the admin panel
- High-contrast palette chosen to exceed 4.5:1 for primary text against light backgrounds

## Future improvements

- Replace the JSON file with SQLModel + SQLite or PostgreSQL
- Add authentication/authorization for admin access
- Add server-side pagination and richer watch metadata
