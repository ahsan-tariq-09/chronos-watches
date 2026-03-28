# Chronos Watches Architecture

## Overview

Chronos Watches now uses a **FastAPI backend** with a **React + TypeScript frontend**.

- The backend persists catalogue data in `backend/watches.json` and protects file reads/writes with a process-local lock.
- The frontend consumes the API through an Axios wrapper and uses typed models shared across pages/components.
- The application is deployable as split services or as one combined service where FastAPI serves `frontend/dist`.

## Frontend architecture

```text
frontend/
  src/
    App.tsx
    main.tsx
    api/
      client.ts
      watches.ts
    components/
      AdminPanel.tsx
      CartModal.tsx
      FilterPanel.tsx
      LoadingSkeleton.tsx
      ProductCard.tsx
      ProductModal.tsx
    pages/
      HomePage.tsx
    types/
      watch.ts
    utils/
      filtering.ts
      watchFormSchema.ts
```

### State and composition

- `App.tsx` owns data fetching, filter state, cart state, modal state, and admin CRUD refresh behavior.
- `HomePage.tsx` renders the catalogue summary, filter sidebar, skeleton cards, empty state, and responsive product grid.
- `FilterPanel.tsx` derives unique values for brand/style/movement/material/strap filters from live watch data.
- `AdminPanel.tsx` uses React Hook Form + Zod for accessible validation and edit/add flows.

## Backend architecture

```text
backend/
  main.py
  watches.json
  tests/
    test_main.py
```

- `main.py` defines the FastAPI app, Pydantic models, CRUD routes, CORS handling, and optional static-file serving for the built frontend.
- `WatchStore` encapsulates file-backed persistence, validation parsing, and thread-safe read/write access.
- `tests/test_main.py` exercises health, list, create, update, delete, and validation scenarios with `TestClient`.

## API contract

- `GET /health`
- `GET /watches`
- `GET /watches/{watch_id}`
- `POST /watches`
- `PUT /watches/{watch_id}`
- `DELETE /watches/{watch_id}`

## Deployment

- `frontend/Dockerfile` builds the Vite app and serves it with `vite preview`.
- `backend/Dockerfile` runs Uvicorn and can serve `frontend/dist` when the built assets are copied in.
- `docker-compose.yml` wires the services together for local containerized testing.
