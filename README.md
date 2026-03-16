# Chronos Watches

Chronos Watches is a portfolio-ready ecommerce-style watch inventory application with a **React + Vite frontend** and an **Express backend**.

## Features

- Product grid with rich cards
- Search, sort, and multi-filter panel
- Product detail modal
- Cart modal with quantity controls
- Checkout flow
- Premium watch identity verification flow (required for watches priced above `$1000`)
- Limited edition purchase restriction (one per customer)
- Admin CRUD panel for inventory management
- Loading, empty, and error states

## Tech Stack

- Frontend: React (JavaScript), Vite, Bootstrap 5
- Backend: Express, JSON file persistence (`backend/db.json`)

## Project Structure

```text
chronos-watches/
  frontend/
    index.html
    package.json
    vite.config.js
    src/
      main.jsx
      App.jsx
      components/
      pages/
      services/
      hooks/
      utils/
      styles/
  backend/
    server.js
    db.json
  docs/
```

## Setup

### 1) Install dependencies

```bash
npm run install:all
```

### 2) Start backend and frontend (separate terminals)

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

- Frontend (Vite): `http://localhost:5173`
- Backend API: `http://localhost:3000`

The Vite dev server proxies `/api/*` calls to the backend.

## Production Build

### Build frontend

```bash
npm run build
```

### Start backend (serves built frontend from `frontend/dist`)

```bash
npm start
```

## API Endpoints (preserved)

- `GET /api/health`
- `GET /api/watches`
- `GET /api/watches/:id`
- `POST /api/watches`
- `PUT /api/watches/:id`
- `DELETE /api/watches/:id`
