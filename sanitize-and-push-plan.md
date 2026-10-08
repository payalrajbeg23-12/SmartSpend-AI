# SmartSpend AI — Sanitize & Push to GitHub Plan

## Top-Level Overview

**Goal:** Clean up the repository so it is safe, minimal, and professional for GitHub, then initialize a git repo and push an initial commit.

**Scope:**
- Create a root-level `.gitignore` that excludes `venv/`, `node_modules/`, `__pycache__/`, `.pyc` files, and other dev artifacts.
- Remove the stray `backend/venv/` directory (a nested venv that should not exist in the project — it's a leftover).
- Initialize a git repository, stage all clean files, and make an initial commit.
- Push to a new GitHub remote (user will provide the remote URL).

**Non-Goals:**
- No code changes — only repository hygiene.
- No restructuring of the project layout.
- `backend/finance.db` is intentionally included (empty DB, makes app work on fresh clone).
- `smartspend-mvp-plan.md` is intentionally included (architecture reference).

---

## Sub-Tasks

---

### Sub-Task 1 — Create `.gitignore`

**Status:** `[ ] pending`

**Intent:**
There is currently no `.gitignore` at the project root. Without it, `git add .` would accidentally commit `venv/`, `node_modules/`, `__pycache__/`, `.pyc` files, and other noise. This must exist before any `git init`.

**Expected Outcomes:**
- `d:\SmartSpend-AI\.gitignore` exists and covers all common Python + Node + Vite artifacts.
- The root `venv/` folder is excluded.
- `backend/venv/` is excluded.
- `frontend/node_modules/` is excluded.
- `__pycache__/` and `*.pyc` are excluded everywhere.
- `frontend/dist/` (future build output) is excluded.
- `backend/finance.db` is explicitly NOT ignored (keep it).

**Todo List:**
- [ ] Create `.gitignore` at the project root with sections for: Python artifacts (`__pycache__/`, `*.pyc`, `*.pyo`, `*.pyd`), virtual environments (`venv/`, `.venv/`, `backend/venv/`), Node artifacts (`node_modules/`, `frontend/dist/`, `frontend/.vite/`), OS files (`.DS_Store`, `Thumbs.db`), and IDE files (`.vscode/`, `.idea/`).

**Relevant Context:**
- Root `venv/` is at `d:\SmartSpend-AI\venv\` — it already has its own internal `venv/.gitignore` but that only applies inside the venv directory itself, not to git.
- `backend/venv/` is a nested venv found at `backend\venv\` — this should be excluded by the gitignore pattern `backend/venv/`.
- `frontend/node_modules/` exists and is populated.
- No `.env` files or secrets found — nothing extra to redact.

---

### Sub-Task 2 — Remove `backend/venv/` (nested venv)

**Status:** `[ ] pending`

**Intent:**
There is a second virtual environment directory at `backend/venv/`. This is an artifact from earlier development (the old Flask app likely ran from inside `backend/`). It is not needed — the project now runs from the root using `d:\SmartSpend-AI\venv\`. Deleting it removes ~100MB+ of library files that would otherwise need to be gitignored.

**Expected Outcomes:**
- `backend/venv/` directory is deleted.
- `backend/` only contains: `__init__.py`, `database.py`, `main.py`, `models.py`, `routers/`, `finance.db`, `__pycache__/` (which gitignore will exclude).

**Todo List:**
- [ ] Delete the `backend/venv/` directory entirely.

**Relevant Context:**
- The active venv is `d:\SmartSpend-AI\venv\` — this is what the `uvicorn` command uses.
- `backend/venv/` is safe to delete; it is not referenced anywhere in the application code.

---

### Sub-Task 3 — Initialize Git Repo & Make Initial Commit

**Status:** `[ ] pending`

**Intent:**
There is no git repository initialized yet (no `.git/` folder found). This sub-task initializes git, stages all the clean project files (`.gitignore` will exclude artifacts), and creates an initial commit with a clean history.

**Expected Outcomes:**
- `git init` creates a local repo.
- `git add .` stages only the meaningful files (verified by `.gitignore`).
- `git status` shows no untracked noise (`venv/`, `node_modules/`, `__pycache__/` are all excluded).
- Initial commit is created with message: `Initial commit — SmartSpend AI MVP (FastAPI + React + TypeScript)`.

**Todo List:**
- [ ] Run `git init` from `d:\SmartSpend-AI`.
- [ ] Run `git add .` to stage all non-ignored files.
- [ ] Verify staged files with `git status` — confirm `venv/`, `node_modules/`, `__pycache__/` are NOT staged.
- [ ] Run `git commit -m "Initial commit — SmartSpend AI MVP (FastAPI + React + TypeScript)"`.

**Relevant Context:**
- Git must be installed on the system (`git --version`).
- No prior commits exist — this will be the first and only commit.

---

### Sub-Task 4 — Add GitHub Remote & Push

**Status:** `[ ] pending`

**Intent:**
Connect the local repo to a GitHub remote and push the initial commit. The user must first create an empty GitHub repository (no README, no gitignore — so there are no conflicts).

**Expected Outcomes:**
- Remote `origin` is added pointing to the user's GitHub repo URL.
- `git push -u origin main` (or `master`) pushes the initial commit.
- The GitHub repo shows the full project with all source files, no `venv/`, no `node_modules/`.

**Todo List:**
- [ ] Ask the user to create a new empty GitHub repository (no auto-init).
- [ ] Run `git remote add origin <REPO_URL>` with the URL the user provides.
- [ ] Run `git branch -M main` to ensure the branch is named `main`.
- [ ] Run `git push -u origin main`.

**Relevant Context:**
- GitHub URL format: `https://github.com/<username>/<repo>.git` or SSH `git@github.com:<username>/<repo>.git`.
- If the user has 2FA on GitHub and uses HTTPS, they need a Personal Access Token (PAT) as the password, not their account password.
- The user should create the GitHub repo with **zero files** (no auto-generated README/gitignore) to avoid merge conflicts on first push.

---

## Files That Will Be Committed

```
SmartSpend-AI/
├── .gitignore                ← NEW
├── README.md
├── requirements.txt
├── smartspend-mvp-plan.md
├── sanitize-and-push-plan.md
├── data/
│   └── sample_transactions.csv
├── backend/
│   ├── __init__.py
│   ├── database.py
│   ├── finance.db
│   ├── main.py
│   ├── models.py
│   └── routers/
│       ├── __init__.py
│       ├── dashboard.py
│       └── transactions.py
└── frontend/
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    └── src/
        ├── App.css
        ├── App.tsx
        ├── main.tsx
        ├── api/client.ts
        ├── components/
        │   ├── CategoryChart.tsx
        │   ├── KpiCards.tsx
        │   ├── MonthlyChart.tsx
        │   ├── TransactionForm.tsx
        │   └── TransactionTable.tsx
        └── types/index.ts
```

## Files That Will NOT Be Committed (excluded by `.gitignore`)

```
venv/                     ← Python virtual environment (root)
backend/venv/             ← Nested venv (deleted in Sub-Task 2)
backend/__pycache__/      ← Compiled Python bytecode
backend/routers/__pycache__/
frontend/node_modules/    ← npm packages (restored via npm install)
frontend/dist/            ← Vite build output (future)
```
