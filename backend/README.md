# Python backend

The Flask API connects the React app to MySQL and persists the app's shared
`pako.*` store values in the `erp_store` table. The table is created
automatically the first time a database-backed API route is used.

## Requirements

- Python 3.10 or newer
- A running MySQL server and an existing database

Create the database once in MySQL, using the same name configured below:

```sql
CREATE DATABASE pako_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

In PowerShell, from the `backend` directory:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `.env` with the MySQL host, database name, username, and password. The
configured user needs permission to create the `erp_store` table and to select,
insert, and update rows in it. Keep `.env` private; it is excluded from Git.
Then start the API:

```powershell
python app.py
```

The API listens at `http://127.0.0.1:5000`. The React app's Vite development
server listens at `http://localhost:5173`; those local origins are allowed by
default. Set `FRONTEND_ORIGINS` to a comma-separated list if the frontend is
served from different origins.

## Frontend

From the `frontend` directory, install the npm dependencies if needed and run:

```powershell
npm run dev
```

By default, the frontend calls `http://127.0.0.1:5000`. To use another API
address, set `VITE_API_BASE_URL` in a frontend `.env` file and restart Vite.
The `/backend-test` route checks the MySQL connection.

## Backend tests

From the repository root, run the API tests without a live MySQL server:

```powershell
python -m unittest discover -s backend -p "test_*.py"
```

## API routes

- `GET /` - API health check
- `GET /api/test-db` - MySQL connectivity check
- `GET /api/store` - load all saved app values
- `PUT /api/store/<key>` - save a JSON value, with body `{"value": ...}`
