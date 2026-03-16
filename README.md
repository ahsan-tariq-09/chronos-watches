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

> The repository uses **npm workspaces**, so root install pulls frontend + backend dependencies together.

### 2) Run development servers

#### One command (recommended)

```bash
npm run dev
```

This starts backend + frontend concurrently.

#### Or run separately (two terminals)

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

## Common Windows Troubleshooting

If you see errors like `'vite' is not recognized` or `'nodemon' is not recognized`:

1. Ensure you are in the project root (`chronos-watches/`).
2. Run a fresh install from root:

```bash
npm install
```

3. Then run:

```bash
npm run dev
```

If issues persist, remove `node_modules` and lockfile in root + workspaces, then reinstall:

```bash
# PowerShell
Remove-Item -Recurse -Force .\node_modules, .\frontend\node_modules, .\backend\node_modules -ErrorAction SilentlyContinue
Remove-Item -Force .\package-lock.json, .\frontend\package-lock.json, .\backend\package-lock.json -ErrorAction SilentlyContinue
npm install
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
