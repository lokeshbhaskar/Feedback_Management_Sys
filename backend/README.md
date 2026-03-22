# Feedback Management System - Backend

This backend powers authentication, feedback collection, API key ingestion, team management, analytics, and account settings for the Feedback Management System.

## 1) Tech Stack

### FastAPI
- **Why used**: Fast to build APIs, excellent typing support, automatic docs (`/docs`), and simple dependency injection.
- **How it helps here**: Clean route definitions for auth, feedback, API keys, team, users, and analytics.

### SQLAlchemy (ORM)
- **Why used**: Maps Python models to relational tables and keeps DB operations structured.
- **How it helps here**: All entities (`User`, `Company`, `Feedback`, `APIKey`, `Team`) are model-driven and queryable with clear relationships.

### PostgreSQL + psycopg2
- **Why used**: Reliable relational DB for multi-entity transactional workflows.
- **How it helps here**: Stores users, companies, API keys, feedback records, and analytics source data.

### Pydantic
- **Why used**: Request/response validation and typed schemas.
- **How it helps here**: Ensures correct payloads for login, feedback creation, team invite, role updates, etc.

### Passlib + bcrypt + SHA-256 prehash
- **Why used**: Secure password hashing and verification.
- **How it helps here**: Passwords are never stored in plaintext; compare and update flows are secure.

### python-jose (JWT)
- **Why used**: Token generation/verification for authenticated routes.
- **How it helps here**: Owner/team dashboard APIs are protected using Bearer JWT.

### python-dotenv
- **Why used**: Environment-based configuration.
- **How it helps here**: Keeps DB and JWT settings outside code.

## 2) Project Structure

- `app/main.py`: FastAPI app bootstrapping, CORS, router registration.
- `app/models/`: SQLAlchemy table models.
- `app/schemas/`: Pydantic request/response schemas.
- `app/services/`: Business logic.
- `app/controllers/`: Thin orchestration layer between routes and services.
- `app/routers/`: API endpoints grouped by domain.
- `app/dependencies/`: Auth and API key dependency guards.
- `app/database/postgresql.py`: DB engine/session/base configuration.
- `app/utils/`: Security and JWT helpers.

## 3) Environment Variables

Create a `.env` file in `backend/`:

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=feedback_db
JWT_SECRET=replace_with_strong_secret
```

## 4) Setup and Run

1. Create and activate virtual environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start server:
```bash
uvicorn app.main:app --reload
```

4. Open API docs:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## 5) How the Backend Works (Step-by-Step)

### A) Auth and Session Flow
1. `POST /auth/signup-owner`: Creates `Company` + owner `User`.
2. `POST /auth/login`: Verifies password and returns JWT.
3. `GET /auth/me`: Reads JWT, fetches current user/company profile.

### B) Feedback Flow (Dashboard users)
1. Public form submits to `POST /feedback/public`.
2. Feedback content is stored with metadata envelope (category/name/email/archive/reply metadata).
3. Dashboard calls `GET /feedback` for parsed, structured items.
4. Team can `PATCH /feedback/{id}/archive` or `PATCH /feedback/{id}/reply`.
5. CSV export available at `GET /feedback/export`.

### C) API Key Ingestion Flow
1. Owner generates key via `POST /api-keys`.
2. Backend stores only hashed key, not plaintext.
3. External systems submit feedback to `POST /feedback/ingest` with:
   - `X-API-Key: <key>` or
   - `Authorization: Bearer <key>`
4. API key dependency validates active key and maps company automatically.

### D) Team Management Flow
1. `GET /team/members`: List workspace users.
2. `POST /team/invite`: Create member/admin user in same company.
3. `PATCH /team/members/{id}/role`: Toggle role.
4. `DELETE /team/members/{id}`: Remove member with owner/self safeguards.

### E) Analytics Flow
1. Frontend requests `GET /analytics/summary?range_key=7d|30d|all`.
2. Backend aggregates from feedback records:
   - total, archived, avg rating, response rate
   - category breakdown
   - rating distribution
   - daily trend
3. Returns compact summary DTO optimized for dashboard rendering.

### F) Account Management Flow
1. `PATCH /users/me/password`: Verify current password and update hash.
2. `DELETE /users/me`:
   - Non-owner: delete own account.
   - Owner: delete whole workspace (users, feedback, api keys, teams, company).

## 6) API Endpoints Overview

### Auth
- `POST /auth/signup-owner`
- `POST /auth/login`
- `GET /auth/me`

### Users
- `POST /users/signup`
- `PATCH /users/me/password`
- `DELETE /users/me`

### Feedback
- `POST /feedback/public`
- `POST /feedback/ingest`
- `GET /feedback`
- `PATCH /feedback/{feedback_id}/archive`
- `PATCH /feedback/{feedback_id}/reply`
- `GET /feedback/export`

### API Keys
- `GET /api-keys`
- `POST /api-keys`
- `PATCH /api-keys/{key_id}/revoke`

### Team
- `GET /team/members`
- `POST /team/invite`
- `PATCH /team/members/{member_id}/role`
- `DELETE /team/members/{member_id}`

### Analytics
- `GET /analytics/summary`

## 7) Testing

Run tests:
```bash
cd backend
source venv/bin/activate
python -m unittest backend/tests/test_auth.py backend/tests/test_feedback.py backend/tests/test_analytics.py
```

## 8) Notes and Future Improvements

- Add Alembic migrations for production-safe schema evolution.
- Move `datetime.utcnow()` to timezone-aware timestamps.
- Add rate limits for ingest endpoints.
- Add invitation email/token flow for team onboarding.
- Add pagination for large feedback datasets.

---
If you are onboarding a new teammate: start with `app/main.py`, then `routers -> controllers -> services -> models` in that order.
