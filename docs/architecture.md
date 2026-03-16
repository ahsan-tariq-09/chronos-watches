# Chronos Watches Architecture

## Overview
Chronos Watches uses a **React + Vite frontend (JavaScript only)** and an **Express backend**.

- Backend API contract remains stable under `/api/watches`.
- Frontend consumes the API through a dedicated service layer.
- Business rules (premium verification, limited-edition limits, checkout constraints) are centralized in React hooks.

## Frontend Architecture

### Directory Layout

```text
frontend/
  src/
    App.jsx
    main.jsx
    components/
      AdminPanel.jsx
      CartModal.jsx
      EmptyState.jsx
      FilterPanel.jsx
      IdentityVerificationModal.jsx
      LoadingSkeleton.jsx
      ModalShell.jsx
      ProductCard.jsx
      ProductModal.jsx
      ToastAlert.jsx
    hooks/
      useCart.js
      useCatalog.js
      useModal.js
      useToast.js
    pages/
      HomePage.jsx
    services/
      api.js
    styles/
      app.css
    utils/
      constants.js
      filtering.js
      validation.js
```

### State and Composition

- `App.jsx` orchestrates API loading, modals, global notifications, and cross-cutting state wiring.
- `HomePage.jsx` composes browsing and admin sections while rendering loading/error/empty outcomes.
- `useCatalog` coordinates search, sorting, filter selections, and filtered output.
- `useCart` centralizes cart persistence and purchase constraints.
- `useModal` provides reusable modal open/close behavior with payload support.

### UX Patterns

- Skeleton loading cards for catalog fetches.
- Professional empty states with clear recovery actions.
- Reusable modal shell (ESC + backdrop close behavior).
- Inline validation feedback for admin and identity verification forms.
- Inventory admin search and stock filter for faster management.

## Backend Architecture

- Express API with CRUD endpoints on `/api/watches`.
- Validation and persistence are handled inside `backend/server.js` with `backend/db.json` storage.
- Production backend serves the built frontend bundle from `frontend/dist`.

## API Contract (Preserved)

- `GET /api/health`
- `GET /api/watches`
- `GET /api/watches/:id`
- `POST /api/watches`
- `PUT /api/watches/:id`
- `DELETE /api/watches/:id`
