# Chronos Watches

Chronos Watches is a full-stack luxury watch catalogue with a **FastAPI backend** and a **React + TypeScript frontend**. It includes product browsing, filtering, cart functionality, and an admin inventory panel backed by a local JSON file. The Project is currently in development and the website has not been deployed, I have added screenshots in meantime to show how it would look like.


## Stack

- **Frontend:** React 18, TypeScript, Vite, MUI, Axios, React Hook Form, Zod, React Router, Vitest, Testing Library
- **Backend:** FastAPI, Pydantic, Uvicorn, Pytest, local JSON persistence
- **Deployment:** Docker, Docker Compose, Render-friendly setup

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
  package.json

```

Prerequisites

Make sure these are installed:

Node.js 18 or newer

npm

Python 3.10 or newer

Check installed versions:

Windows
node -v
npm -v
py --version
Linux / macOS
node -v
npm -v
python3 --version
Environment variables

Create a file at frontend/.env with:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_ADMIN_TOKEN=chronos-admin
```
The default admin route is:
```
/admin?token=chronos-admin
```
You need two terminals:

one for the backend

one for the frontend

1) Start the backend
Windows (PowerShell)
```
cd C:\GitHub\chronos-watches

py -m venv backend\.venv
.\backend\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
python -m uvicorn main:app --reload --app-dir backend --port 8000
```
If PowerShell blocks script execution, run this first in the same terminal:
```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
Then activate again:
```
.\backend\.venv\Scripts\Activate.ps1
Linux / macOS
cd /path/to/chronos-watches

python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
python -m uvicorn main:app --reload --app-dir backend --port 8000
```
FastAPI docs will be available at:

http://localhost:8000/docs
2) Start the frontend
Windows (PowerShell)
cd C:\GitHub\chronos-watches\frontend
npm install
npm run dev
Linux / macOS
cd /path/to/chronos-watches/frontend
npm install
npm run dev

The frontend will usually open at:

http://localhost:5173
Run from the project root

If your root package.json already includes scripts for both frontend and backend, you can also run from the root.

Windows (PowerShell)
cd C:\GitHub\chronos-watches
npm install
npm run dev
Linux / macOS
cd /path/to/chronos-watches
npm install
npm run dev

This only works if the root package.json is correctly configured to start both services.

Tests
Frontend tests
Windows (PowerShell)
cd C:\GitHub\chronos-watches\frontend
npm test
Linux / macOS
cd /path/to/chronos-watches/frontend
npm test
Backend tests
Windows (PowerShell)
cd C:\GitHub\chronos-watches
.\backend\.venv\Scripts\Activate.ps1
pytest backend\tests
Linux / macOS
cd /path/to/chronos-watches
source backend/.venv/bin/activate
pytest backend/tests
Common issues
Windows path issue

Build command:
```
pip install -r backend/requirements.txt
```
Start command:
```
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```
Render: frontend static site

Build command:
```
npm install && npm run build -w frontend
```
Publish directory:

frontend/dist

Environment variable:

VITE_API_BASE_URL=https://<your-backend-service>.onrender.com
Render: combined service

If serving the built frontend through FastAPI:
```
npm install
npm run build -w frontend
pip install -r backend/requirements.txt
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

I also recommend checking out the following repositories from which i took inspiration for this project:

- [broader e-commerce page structure and merchandising ideas](https://github.com/react-shop/react-ecommerce)
- [strong cart state and catalog interaction pattern by jeffersonRibeiro](https://github.com/jeffersonRibeiro/react-shopping-cart)

## Future improvements

- Replace local JSON storage with SQLite or PostgreSQL

- Add real authentication for admin access

- Add pagination and richer product metadata

- Add CI for frontend and backend tests



