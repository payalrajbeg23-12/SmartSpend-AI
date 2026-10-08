# SmartSpend AI — MVP Rebuild Plan

## Top-Level Overview

**Goal:** Rebuild SmartSpend AI as a modern full-stack web application using FastAPI (Python) for the backend and React + TypeScript for the frontend.

**Scope:**
- Replace `backend/` (Flask + ML) with a clean FastAPI application — same SQLite `finance.db` and `transactions` table schema, no ML/AI features.
- Replace `frontend/` (plain HTML/CSS/JS) with a Vite-scaffolded React + TypeScript single-page application.
- Feature parity: KPI summary cards, add/delete transaction form, spending-by-category donut chart, income vs expenses monthly bar chart, transaction table.
- Both servers run on localhost: FastAPI on port `8000`, React dev server on port `5173`.

**Non-Goals:**
- No AI/ML prediction features.
- No multi-user auth.
- No new features beyond what the current app provides.

**Approach:**
1. Scaffold and wire the FastAPI backend first (data layer → API layer).
2. Scaffold the React + TypeScript frontend with Vite.
3. Build React components (KPI cards, form, charts, table).
4. Connect frontend to FastAPI via fetch/Axios.
5. Update project-level documentation.

---

## Architecture Overview

```
SmartSpend-AI/
├── backend/                  ← FastAPI app (replaces Flask)
│   ├── main.py               ← FastAPI app entry point
│   ├── database.py           ← SQLite connection + init
│   ├── models.py             ← Pydantic request/response schemas
│   ├── routers/
│   │   ├── transactions.py   ← CRUD endpoints
│   │   └── dashboard.py      ← Aggregation/analytics endpoint
│   └── finance.db            ← Existing SQLite database (reused)
├── frontend/                 ← React + TypeScript (Vite)
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api/
│   │   │   └── client.ts     ← Typed API fetch functions
│   │   ├── components/
│   │   │   ├── KpiCards.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   ├── TransactionTable.tsx
│   │   │   ├── CategoryChart.tsx
│   │   │   └── MonthlyChart.tsx
│   │   ├── types/
│   │   │   └── index.ts      ← Shared TypeScript types
│   │   └── App.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── requirements.txt          ← Updated for FastAPI
├── smartspend-mvp-plan.md    ← This file
└── README.md                 ← Updated instructions
```

---

## API Contract

| Method | Path | Purpose | Request Body | Response |
|--------|------|---------|-------------|----------|
| GET | `/api/transactions` | List all transactions | — | `Transaction[]` |
| POST | `/api/transactions` | Add transaction | `TransactionCreate` | `Transaction` |
| DELETE | `/api/transactions/{id}` | Delete transaction | — | `{ "message": "deleted" }` |
| GET | `/api/dashboard` | Aggregated analytics | — | `DashboardData` |

**TransactionCreate schema:**
```json
{ "description": "string", "amount": 0.0, "type": "expense|income", "category": "string", "date": "YYYY-MM-DD" }
```

**DashboardData schema:**
```json
{
  "summary": { "income": 0.0, "expense": 0.0, "balance": 0.0 },
  "categories": { "Food": 0.0, ... },
  "monthly": { "2024-01": { "income": 0.0, "expense": 0.0 }, ... },
  "transactions": [ Transaction, ... ]
}
```

---

## Sub-Tasks

---

### Sub-Task 1 — FastAPI Backend: Database & Models

**Status:** `[ ] pending`

**Intent:**
Set up the FastAPI project foundation — the SQLite connection module and Pydantic schemas. This is the base that all route handlers depend on. The existing `finance.db` with its `transactions` table is reused as-is.

**Expected Outcomes:**
- `backend/database.py` provides `get_db()` (connection + row_factory) and `init_db()` (creates table if not exists).
- `backend/models.py` defines Pydantic models: `TransactionCreate`, `Transaction`, `SummaryStats`, `DashboardData`.
- Existing `backend/finance.db` data is preserved.
- Old files (`app.py`, `ml_model.py`) are removed.

**Todo List:**
- [ ] Delete `backend/app.py` and `backend/ml_model.py`.
- [ ] Create `backend/database.py` with `get_db()` and `init_db()` using `sqlite3`, row_factory set to `sqlite3.Row`.
- [ ] Create `backend/models.py` with Pydantic v2 models: `TransactionCreate`, `Transaction` (includes `id`), `SummaryStats`, `DashboardData`.
- [ ] Ensure `transactions` table DDL in `init_db()` matches the existing schema exactly: `id, description, amount, type, category, date`.

**Relevant Context:**
- Existing schema from `backend/app.py` (now deleted): `CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT NOT NULL, amount REAL NOT NULL, type TEXT NOT NULL, category TEXT NOT NULL, date TEXT NOT NULL)`
- Existing `finance.db` lives at `backend/finance.db` — must not be deleted or overwritten.
- Pydantic v2 is used (FastAPI ≥ 0.100 ships with it).

---

### Sub-Task 2 — FastAPI Backend: Routers & App Entry Point

**Status:** `[ ] pending`

**Intent:**
Implement the four API endpoints across two routers and wire them into the FastAPI app with CORS enabled. This replaces all of the old Flask route logic — same business logic, no ML.

**Expected Outcomes:**
- `backend/routers/transactions.py` implements `GET /api/transactions`, `POST /api/transactions`, `DELETE /api/transactions/{id}`.
- `backend/routers/dashboard.py` implements `GET /api/dashboard` — returns summary totals, per-category expense totals, per-month income/expense totals, and full transaction list.
- `backend/main.py` creates the FastAPI app, includes both routers, enables CORS for `http://localhost:5173`, and calls `init_db()` on startup.
- Running `uvicorn backend.main:app --reload --port 8000` from the project root starts the server.
- Interactive docs available at `http://localhost:8000/docs`.

**Todo List:**
- [ ] Create `backend/routers/` directory with an empty `__init__.py`.
- [ ] Create `backend/routers/transactions.py` — `GET` returns all rows, `POST` validates and inserts, `DELETE` removes by id and returns 404 if not found.
- [ ] Create `backend/routers/dashboard.py` — query all transactions, compute: `summary` (sum income/expense/balance), `categories` (sum expenses per category), `monthly` (sum income+expense per YYYY-MM key), return full `transactions` list.
- [ ] Create `backend/main.py` — instantiate `FastAPI`, add `CORSMiddleware` (allow origins `["http://localhost:5173"]`, allow all methods and headers), include routers with prefix `/api`, call `init_db()` via `@app.on_event("startup")`.
- [ ] Update `requirements.txt` to: `fastapi`, `uvicorn[standard]`, `pydantic` (remove flask, flask-cors, scikit-learn, numpy).

**Relevant Context:**
- Dashboard aggregation logic mirrors `app.py` lines 60-85 (defaultdict grouping by category and `date[:7]` for monthly key).
- CORS origin must be `http://localhost:5173` (Vite default dev port).
- No prediction or insight fields in dashboard response (ML removed).

---

### Sub-Task 3 — React + TypeScript Frontend: Scaffold & Types

**Status:** `[ ] pending`

**Intent:**
Bootstrap the React + TypeScript project using Vite inside `frontend/`, define all shared TypeScript types, and create the API client module. This gives a clean, typed foundation before any UI components are built. All old frontend files are removed.

**Expected Outcomes:**
- Old `frontend/index.html`, `frontend/script.js`, `frontend/style.css` are removed.
- Vite + React + TypeScript project is scaffolded in `frontend/` (`npm create vite@latest`).
- `frontend/src/types/index.ts` exports `Transaction`, `TransactionCreate`, `SummaryStats`, `DashboardData` interfaces matching the FastAPI Pydantic schemas.
- `frontend/src/api/client.ts` exports typed async functions: `fetchDashboard()`, `addTransaction(data)`, `deleteTransaction(id)`.
- `vite.config.ts` configures a dev proxy so `/api` requests are forwarded to `http://localhost:8000` (eliminates CORS issues in dev).
- `npm run dev` starts the frontend at `http://localhost:5173`.

**Todo List:**
- [ ] Remove `frontend/index.html`, `frontend/script.js`, `frontend/style.css`.
- [ ] Scaffold Vite project in `frontend/`: `npm create vite@latest . -- --template react-ts` (run from inside `frontend/`).
- [ ] Install Chart.js and react-chartjs-2: `npm install chart.js react-chartjs-2`.
- [ ] Create `frontend/src/types/index.ts` with TypeScript interfaces for all API shapes.
- [ ] Create `frontend/src/api/client.ts` with `fetchDashboard`, `addTransaction`, `deleteTransaction` using the native `fetch` API, base URL `/api` (goes through Vite proxy).
- [ ] Add proxy config to `vite.config.ts`: `server.proxy['/api'] = 'http://localhost:8000'`.

**Relevant Context:**
- TypeScript interfaces must exactly mirror the FastAPI `DashboardData` schema defined in Sub-Task 1.
- `react-chartjs-2` is the React wrapper for Chart.js — used in Sub-Tasks 4 and 5.
- Vite proxy avoids having to hardcode the backend URL in API calls.

---

### Sub-Task 4 — React Components: KPI Cards & Transaction Form/Table

**Status:** `[ ] pending`

**Intent:**
Build the data-entry and summary display components: the four KPI summary cards (Total Income, Total Expenses, Balance) and the Add Transaction form with validation, plus the sortable transaction table with a delete button per row.

**Expected Outcomes:**
- `KpiCards.tsx` renders three cards (income, expense, balance) formatted with `Intl.NumberFormat` using `en-IN` locale and `₹` currency.
- `TransactionForm.tsx` renders a controlled form with fields: description (text), amount (number), type (select: income/expense), category (select: 8 options), date (date picker). On submit it calls `addTransaction()` and triggers a dashboard refresh via a callback prop.
- `TransactionTable.tsx` renders a `<table>` listing all transactions with columns: Date, Description, Type, Category, Amount, Delete button. Delete calls `deleteTransaction(id)` and triggers refresh.
- All components are typed with explicit TypeScript prop interfaces.

**Todo List:**
- [ ] Create `frontend/src/components/KpiCards.tsx` — accepts `summary: SummaryStats` prop, renders 3 styled cards.
- [ ] Create `frontend/src/components/TransactionForm.tsx` — controlled form with local state, `onSuccess` callback prop, calls `addTransaction` from `client.ts`.
- [ ] Create `frontend/src/components/TransactionTable.tsx` — accepts `transactions: Transaction[]` and `onDelete` callback prop, renders table rows.
- [ ] Add basic CSS classes in `App.css` mirroring the existing layout: topbar, container, cards grid, panel, table-wrap.

**Relevant Context:**
- Categories list (from existing frontend): `Food, Transport, Shopping, Bills, Entertainment, Health, Education, Other`.
- Currency formatting from existing `script.js`: `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.
- `onSuccess` / `onDelete` callbacks will bubble up to `App.tsx` which re-fetches dashboard data.

---

### Sub-Task 5 — React Components: Charts & App Assembly

**Status:** `[ ] pending`

**Intent:**
Build the two chart components (category donut, monthly bar) using `react-chartjs-2`, then assemble all components in `App.tsx` with a single shared state driven by `fetchDashboard()`. This completes the full UI.

**Expected Outcomes:**
- `CategoryChart.tsx` renders a `Doughnut` chart from `react-chartjs-2` using `categories` data from dashboard.
- `MonthlyChart.tsx` renders a `Bar` chart using `monthly` data, with two datasets (Income, Expenses), x-axis as months.
- `App.tsx` holds a single `dashboardData` state, fetches on mount and after every add/delete, passes slices as props to all child components.
- The app renders correctly at `http://localhost:5173` — layout matches the original: topbar, KPI cards row, two-column section (form + donut), full-width monthly bar, full-width transaction table.
- No console errors or TypeScript compilation errors.

**Todo List:**
- [ ] Register all required Chart.js components globally in `main.tsx` (ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend).
- [ ] Create `frontend/src/components/CategoryChart.tsx` — accepts `categories: Record<string, number>` prop, renders `<Doughnut>`.
- [ ] Create `frontend/src/components/MonthlyChart.tsx` — accepts `monthly: Record<string, {income: number, expense: number}>` prop, renders `<Bar>`.
- [ ] Create `frontend/src/App.tsx` — `useState<DashboardData | null>`, `useEffect` calls `fetchDashboard()` on mount, `refresh` function passed as callback to form and table, layout renders all five component sections.
- [ ] Clean up Vite boilerplate: remove `App.tsx` default content, `assets/`, counter components.
- [ ] Verify `npm run build` compiles with zero TypeScript errors.

**Relevant Context:**
- Chart.js v4 requires explicit component registration — do it in `main.tsx` once via `Chart.register(...)`.
- Monthly bar chart datasets: `label: 'Income', backgroundColor: '#4CAF50'` and `label: 'Expenses', backgroundColor: '#f44336'` — matches existing color scheme.
- Chart data preparation: `Object.keys(monthly).sort()` for consistent month ordering on x-axis.

---

### Sub-Task 6 — Documentation Update

**Status:** `[ ] pending`

**Intent:**
Update `README.md` with accurate setup and run instructions for the new stack so any developer can clone and run the project from scratch.

**Expected Outcomes:**
- `README.md` reflects the new stack: Python + FastAPI backend, React + TypeScript + Vite frontend.
- Instructions cover: install Python deps, run FastAPI with uvicorn, install npm deps, run Vite dev server.
- ML references removed.
- Both localhost URLs documented: backend `http://localhost:8000`, frontend `http://localhost:5173`, docs `http://localhost:8000/docs`.

**Todo List:**
- [ ] Rewrite `README.md` with updated project description (no ML/AI).
- [ ] Add backend setup section: `pip install -r requirements.txt`, `uvicorn backend.main:app --reload --port 8000`.
- [ ] Add frontend setup section: `cd frontend`, `npm install`, `npm run dev`.
- [ ] Document the `/docs` Swagger UI endpoint.
- [ ] Remove all references to Flask, scikit-learn, and ML prediction.

**Relevant Context:**
- Existing `README.md` structure is a good template — reuse the numbered section format.

---

## Local Development — Run Order

1. **Start FastAPI backend:**
   ```
   cd SmartSpend-AI
   pip install -r requirements.txt
   uvicorn backend.main:app --reload --port 8000
   ```

2. **Start React frontend (separate terminal):**
   ```
   cd SmartSpend-AI/frontend
   npm install
   npm run dev
   ```

3. **Open browser:** `http://localhost:5173`
4. **API docs:** `http://localhost:8000/docs`

---

## Key Dependencies

| Layer | Package | Version | Purpose |
|-------|---------|---------|---------|
| Backend | `fastapi` | latest | REST API framework |
| Backend | `uvicorn[standard]` | latest | ASGI server |
| Backend | `pydantic` | v2 | Request/response validation |
| Frontend | `react` + `react-dom` | 18.x | UI framework |
| Frontend | `typescript` | 5.x | Type safety |
| Frontend | `vite` | 5.x | Dev server + bundler |
| Frontend | `chart.js` | 4.x | Charting |
| Frontend | `react-chartjs-2` | 5.x | React wrapper for Chart.js |

---

## Implementation Notes

- **No ML dependency:** `scikit-learn` and `numpy` are removed from `requirements.txt`. The "Predicted Next Month" KPI card from the original app is dropped (only 3 cards: Income, Expenses, Balance).
- **Proxy in Vite:** The `/api` proxy in `vite.config.ts` means all API calls in frontend code use relative paths (`/api/...`) — no hardcoded backend URL.
- **CORS:** FastAPI CORS middleware allows `http://localhost:5173`. In production this would need updating.
- **SQLite reuse:** `finance.db` is not touched during the backend rewrite — existing transaction data persists.
