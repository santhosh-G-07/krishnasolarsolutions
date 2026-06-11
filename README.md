# KSS - Krishna Solar Solutions

Local working website, customer application flow, and admin/employee/customer dashboard for Krishna Solar Solutions.

## Run Locally

```bash
pip install -r requirements.txt
python server.py
```

Open:

`http://localhost:3000`

The app uses PostgreSQL (configured via `.env`) and stores uploaded documents in `uploads/`.

If startup says PostgreSQL is configured but unavailable, make sure a PostgreSQL server is running on the `.env` host and port. For the default local setup, create the configured database/user or replace the `PG_*` values with a reachable `DATABASE_URL`. Connection startup uses `PG_CONNECT_TIMEOUT` or `DB_CONNECT_TIMEOUT` and defaults to 5 seconds.

## Main Pages

- `index.html`: public website, services, products, contact, reviews, and solar savings calculator.
- `auth.html`: separate login/register page (customer + employee + admin tabs).
- `apply.html`: protected customer application page. Customers must register and login before applying.
- `dashboard.html`: legacy role-based dashboard (still works).
- **`admin.html`**: new standalone Admin dashboard — login, overview stats, employee-wise breakdown, all applications with status tabs + employee filter + search, full employee CRUD, add/update/view application modals.
- **`employee.html`**: new standalone Employee dashboard — login, "All / My Applications" toggle, status tabs, only assigned rows are editable, add-customer with document upload.

Open one of these directly in the browser:

- `http://localhost:3000/admin.html`
- `http://localhost:3000/employee.html`

## What Is Included

- Hashed backend passwords using PBKDF2.
- PostgreSQL database backend (configured through `.env`).
- Customer registration with 10 digit Indian mobile validation and required email validation.
- Login blocked for customers who are not registered.
- Separate protected application page.
- Application validation for phone, email, full address, district, state, and 6 digit pincode.
- Real document upload handling for PDF/JPG/PNG/WebP files up to 5MB each.
- Admin notification queue for every new application.
- SMTP email sending when credentials are configured.
- Admin dashboard search, status filter, employee assignment, status editing, and notes.
- Employee dashboard for assigned work updates.
- Customer dashboard with application status timeline.
- Password show/hide controls.
- Mobile-friendly dashboard cards and filters.

## Admin Login

The seeded admin username is:

`admin`

The default local password is:

`kssadmin123`

Before real launch, start the server with a private password:

```powershell
$env:ADMIN_PASSWORD="your-strong-admin-password"
python server.py
```

## Email + OTP (Gmail SMTP)

Applications always create a notification record in the dashboard.  
Both application notifications and admin OTP emails use the same SMTP configuration.

```powershell
$env:MAIL_USERNAME="your-sender@gmail.com"
$env:MAIL_PASSWORD="your-gmail-app-password"
$env:MAIL_FROM="your-sender@gmail.com"
$env:MAIL_SERVER="smtp.gmail.com"
$env:MAIL_PORT="587"
$env:MAIL_STARTTLS="True"
$env:MAIL_SSL_TLS="False"
$env:ADMIN_EMAIL="admin-login-email@gmail.com"
$env:NOTIFICATION_EMAIL="admin-login-email@gmail.com"
python server.py
```

Backward-compatible keys (`SMTP_USER`, `SMTP_PASS`, `SMTP_HOST`, `SMTP_PORT`) also work.

Without SMTP values, data is still saved and OTP/email status is shown with configuration errors.

## Gemini Chatbot

Set Gemini values in environment:

```powershell
$env:GEMINI_API_KEY="your-gemini-api-key"
$env:GEMINI_MODEL="gemini-2.5-flash"
python server.py
```

The chatbot UI in `chatbot.js` calls `/api/chatbot`, which is handled by `server.py`.

## Using Supabase Postgres

This project can use either plain `PG_*` variables or a hosted Postgres connection string.

For Supabase, the easiest setup is:

```powershell
$env:DATABASE_URL="postgresql://..."
$env:PG_SSLMODE="require"
python server.py
```

For long-running backend apps, Supabase recommends using its connection string from the `Session pooler` / pooled connection settings.

## Railway + Supabase

This repo includes a [railway.toml](/E:/ksssss/kss/railway.toml) file so Railway starts the app with:

```bash
python server.py
```

Recommended Railway variables:

```text
HOST=0.0.0.0
DATABASE_URL=postgresql://...
PG_SSLMODE=require
ADMIN_EMAIL=you@example.com
NOTIFICATION_EMAIL=you@example.com
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_FROM=your-gmail@gmail.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
UPLOAD_DIR=/data/uploads
FRONTEND_URLS=https://your-project.vercel.app
ALLOW_VERCEL_ORIGINS=true
```

If you keep document uploads on Railway, attach a Volume and mount it to `/data`.

Railway health checks use `/api/health`, which confirms the backend process is alive without failing if Supabase is slow to wake. Supabase keepalive uses `/api/keepalive`, which runs a real `SELECT 1` against the database.

## Vercel React Frontend

The React frontend builds from `frontend/` and deploys from the repository root using `vercel.json`.

Add this environment variable in Vercel:

```text
VITE_API_BASE_URL=https://your-railway-backend.up.railway.app
```

Add the Vercel production URL to Railway:

```text
FRONTEND_URLS=https://your-project.vercel.app
```

For Vercel preview deployments, keep `ALLOW_VERCEL_ORIGINS=true`.

## Supabase Keepalive

This repo includes `.github/workflows/supabase-keepalive.yml`, scheduled twice per day at `03:00` and `15:00` UTC. It calls:

```text
https://your-railway-backend.up.railway.app/api/keepalive
```

In GitHub, add this repository secret:

```text
RAILWAY_BACKEND_URL=https://your-railway-backend.up.railway.app
```

You can also run it manually:

```powershell
$env:BACKEND_URL="https://your-railway-backend.up.railway.app"
npm run keepalive
```

## Hosting + Domain

Use the split deployment:

1. Deploy the React frontend to Vercel from the repository root.
2. Keep `server.py`, Supabase, SMTP, Gemini, and uploads on Railway.
3. Set `VITE_API_BASE_URL` in Vercel to the Railway public backend URL.
4. Set `FRONTEND_URLS` in Railway to the Vercel production/custom-domain URL.
5. Point the public website domain to Vercel.
6. Keep `HOST=0.0.0.0` on Railway and use Railway's provided `PORT`.

You can also split frontend/backend, but then:

1. Frontend can be on GitHub Pages/Vercel/Netlify.
2. Backend stays on Python host.
3. Frontend API URLs must point to backend domain, and you may need CORS handling.
