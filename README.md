# Chronos Watches

Chronos Watches is a portfolio-grade ecommerce watch inventory app with a **React + Vite frontend (JavaScript)** and an **Express backend**.

## Highlights

- Product grid with polished cards and stock-aware actions
- Coordinated search, sort, and multi-filter panel
- Product detail modal + cart modal with reusable modal handling
- Checkout flow with premium watch identity verification
- Limited edition quantity restriction (max one per customer)
- Admin CRUD panel with inventory search, stock filtering, and inline validation
- Loading skeletons, resilient error states, and clear empty states

## Tech Stack

- **Frontend**: React (JavaScript), Vite, Bootstrap 5
- **Backend**: Express, JSON file persistence (`backend/db.json`)

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
    architecture.md
```

## Setup

### 1) Install dependencies (from project root)

```bash
npm install
```

### 2) Run development servers

In two terminals:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

- Frontend (Vite): `http://localhost:5173`
- Backend API: `http://localhost:3000`

Vite proxies `/api/*` calls to the backend.

## Production

### Build frontend

```bash
npm run build
```

### Start backend (serves `frontend/dist`)

```bash
npm start
```

## API Endpoints (Preserved)

- `GET /api/health`
- `GET /api/watches`
- `GET /api/watches/:id`
- `POST /api/watches`
- `PUT /api/watches/:id`
- `DELETE /api/watches/:id`

## Architecture Notes

See `docs/architecture.md` for frontend state boundaries, hook responsibilities, and business rule ownership.
