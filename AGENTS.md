# AGENTS — AI coding agent instructions

Purpose
- Short guidance for AI coding agents to be productive in this repository.

Quick commands
- Frontend (Expo / React Native):
  - Install dependencies: `cd frontend && yarn install`
  - Start Metro: `cd frontend && yarn start`
  - Run on Android: `cd frontend && yarn android`
  - Run on iOS: `cd frontend && yarn ios`
  - Run on web: `cd frontend && yarn web`
  - Lint: `cd frontend && yarn lint`
- Backend (FastAPI):
  - Create venv: `cd backend && python3 -m venv .venv`
  - Activate: `cd backend && source .venv/bin/activate`
  - Install deps: `cd backend && pip install -r requirements.txt`
  - Run development server: `cd backend && uvicorn server:app --reload --port 8000`

What to inspect first
- Root README: [README.md](README.md)
- Frontend README and Expo app config: [frontend/README.md](frontend/README.md), [frontend/app.json](frontend/app.json)
- Backend entry and dependencies: [backend/server.py](backend/server.py), [backend/requirements.txt](backend/requirements.txt)
- Data and UI patterns: [frontend/src/data](frontend/src/data), [frontend/app](frontend/app)
- Existing agent file for reference: [telugu-panchang-app2/AGENTS.md](telugu-panchang-app2/AGENTS.md)

Project conventions
- Frontend is an Expo app with Expo Router and Yarn v1.
- The frontend uses TypeScript and React Native; it bundles custom hooks, theme/context providers, and static data under `frontend/src`.
- `frontend/scripts/cmd-guard.js` enforces install-time checks; do not bypass it.
- Backend is a simple FastAPI app behind `backend/server.py`.
- Backend currently expects a `.env` file in `backend/` with `MONGO_URL`, `DB_NAME`, and optionally `CORS_ALLOWED_ORIGINS`.
- The backend app is mostly offline now, but maintains MongoDB client setup and CORS allow-list logic.
- Tests are in `tests/` and `backend/tests/` may exist; backend dependencies include `pytest`, `black`, `isort`, `flake8`, and `mypy`.

Agent behavior notes
- Prefer root `AGENTS.md` over `.github/copilot-instructions.md` for workspace guidance.
- Avoid editing generated or vendor-managed files unless the issue is clearly about project config.
- When running commands, use non-interactive flags and document required env vars.
- If backend or frontend behavior depends on local secret config, note the missing `.env` or local credentials.

Next steps
- If needed, add a `.github/copilot-instructions.md` for workflow-specific guidance or a custom skill for mobile/Expo setup.

Agent checklist
- **Run backend locally:** create a `.env` in [backend](backend) with `MONGO_URL` and `DB_NAME`, then `cd backend && uvicorn server:app --reload --port 8000`.
- **Run tests:** from repository root run `pytest -q` (backend tests are under [backend/tests](backend/tests)).
- **Frontend quick checks:** `cd frontend && yarn install` then `yarn start` to run the app or `yarn lint` to run linters.

Files changed
- **AGENTS.md:** added concise test and checklist notes useful for agent workflows.
