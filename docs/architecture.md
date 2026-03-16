# Chronos Watches Architecture

## Overview
Chronos Watches is split into:
- **Frontend**: React + Vite (JavaScript)
- **Backend**: Express API with file-based persistence (`backend/db.json`)

The backend API contract is stable and the frontend consumes `/api/watches` through a service layer.

## Frontend Architecture

### Layers
- **App shell** (`src/App.jsx`)
  - Bootstraps data loading, global toast notifications, and modal orchestration.
- **Page composition** (`src/pages/HomePage.jsx`)
  - Organizes sections: header, filters, catalog, admin panel.
- **Hooks**
  - `useCatalog`: filter/search/sort coordination + derived product list.
  - `useCart`: cart persistence and business rules (limited edition, premium verification, checkout checks).
  - `useModal`: reusable modal open/close state with payload support.
  - `useToast`: ephemeral notification state.
- **Services**
  - `WatchAPI`: all backend communication and standardized error handling.
- **Components**
  - Reusable UI blocks: cards, filters, modals, admin panel, loading/empty states.

### State Strategy
No Redux is used. Localized hooks and top-level composition in `App.jsx` provide enough structure while keeping complexity low.

### Business Rules Preserved
- Limited edition watches: max quantity one per customer.
- Premium watches (`price > 1000`): require identity verification before checkout.
- Checkout prevents unverified premium item purchases.

## Backend Architecture
- Express server with CRUD endpoints on `/api/watches`.
- Payload validation in `server.js`.
- JSON file persistence (`db.json`) with read/write helper functions.
- In production mode, backend serves built frontend from `frontend/dist`.

## Data Flow
1. App boot -> `WatchAPI.getAllWatches()`.
2. `useCatalog` computes filtered/sorted products from raw list + filter state.
3. User actions (add to cart, admin CRUD, checkout) update local state and/or API.
4. Admin writes refresh catalog by re-fetching server data.

## UX/Resilience Patterns
- Loading skeletons for catalog fetch.
- Professional empty states with recovery actions.
- Inline form validation messages for admin and verification forms.
- Reusable modal shell with escape/backdrop close behavior.
