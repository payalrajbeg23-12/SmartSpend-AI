# SmartSpend AI

A personal finance tracker built with **FastAPI** (Python) and **React + TypeScript** (Vite).

Track your income and expenses, visualise spending by category, and monitor monthly cash flow — all in a clean single-page UI.

---

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Backend  | Python · FastAPI · SQLite |
| Frontend | React 18 · TypeScript · Vite · Chart.js |

---

## Project Structure

```
SmartSpend-AI/
├── backend/
│   ├── main.py               ← FastAPI app entry point
│   ├── database.py           ← SQLite connection + init
│   ├── models.py             ← Pydantic request/response schemas
│   ├── routers/
│   │   ├── transactions.py   ← CRUD endpoints
│   │   └── dashboard.py      ← Aggregation/analytics endpoint
│   └── finance.db            ← SQLite database
├── frontend/
│   └── src/
│       ├── main.tsx          ← Entry point + Chart.js registration
│       ├── App.tsx           ← Root component
│       ├── api/client.ts     ← Typed API fetch functions
│       ├── components/       ← KpiCards, TransactionForm, TransactionTable, CategoryChart, MonthlyChart
│       └── types/index.ts    ← Shared TypeScript interfaces
├── requirements.txt
└── README.md
```

---

## Setup & Run

### 1 · Backend (FastAPI)

```bash
# From the project root
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**  
Interactive API docs (Swagger UI): **http://localhost:8000/docs**

### 2 · Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

> Both servers must be running at the same time. The Vite dev server proxies all `/api` requests to the FastAPI backend, so no CORS configuration is needed in development.

---

## API Reference

| Method | Endpoint                    | Description                  |
|--------|-----------------------------|------------------------------|
| GET    | `/api/transactions`         | List all transactions        |
| POST   | `/api/transactions`         | Add a new transaction        |
| DELETE | `/api/transactions/{id}`    | Delete a transaction by ID   |
| GET    | `/api/dashboard`            | Aggregated analytics data    |

---

## Features

- **KPI Cards** — Total Income, Total Expenses, Balance
- **Add Transaction Form** — description, amount, type (income/expense), category, date
- **Spending by Category** — doughnut chart of expense breakdown
- **Income vs Expenses** — monthly grouped bar chart
- **Transaction Table** — full history with per-row delete
