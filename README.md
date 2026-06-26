# GCOERAK Notes Catalog

A notes/PYQ/important-questions sharing portal for **Government College of Engineering and Research, Awasari Kh., Pune (SPPU)** — organized by year (1st–4th) and branch (Computer, E&TC, Mechanical, Automobile, Instrumentation, Civil). Anyone can browse and download. A free login is required to upload.

**Stack:** Node.js + Express + MongoDB (Mongoose) backend, with a plain HTML/CSS/JS frontend (no build step, no framework lock-in) served by the same backend.

```
gcoerak-notes-portal/
├── backend/             Express API + file storage + auth
│   ├── config/          DB connection + the YEAR/BRANCH/TYPE constants
│   ├── controllers/     Route handler logic
│   ├── middleware/      JWT auth guard, multer upload, error handler
│   ├── models/          Mongoose schemas (User, Note)
│   ├── routes/          Express routers
│   ├── utils/           JWT helper, admin-seed script
│   ├── uploads/         Uploaded files land here (gitignored)
│   └── server.js        App entry point
└── frontend/            Static site (served by the backend in dev/prod)
    ├── index.html        Browse/search/download (public)
    ├── login.html / register.html
    ├── upload.html        Upload form (requires login)
    ├── css/style.css
    └── js/                config, api client, auth, nav, page logic
```

## 1. Prerequisites

- **Node.js** 18+ — check with `node -v`
- **MongoDB** — either:
  - Local install ([mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)), or
  - Free cloud cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (recommended — no local install, works from anywhere)

## 2. Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:

- `MONGO_URI` — your local or Atlas connection string
- `JWT_SECRET` — any long random string (e.g. generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- Leave the rest as default for local development

## 3. Run it

```bash
npm run dev
```

Visit **http://localhost:5000** — the backend serves both the API (`/api/...`) and the frontend pages from this single server, so there's nothing else to start.

## 4. Try it out

1. Go to **Register**, create an account (branch/year are optional at signup).
2. Go to **Upload**, pick a year, branch, type (Notes / PYQ / Important Questions), attach a file, submit.
3. Go back to the home page — filter by year tabs, branch, type, or search by subject, then **Download**.
4. You (the uploader) will see a **Delete** button on your own cards.

## 5. Making yourself an admin (optional)

Admins can delete *any* upload, not just their own. After registering normally:

```bash
cd backend
# set ADMIN_EMAIL in .env to the email you registered with, then:
npm run seed:admin
```

This upgrades that account to `role: admin`.

## 6. Customizing branches/years/subjects

- **Years and branches** are defined in one place: `backend/config/constants.js`. Edit the `YEARS` and `BRANCHES` arrays if your college restructures programs — the frontend dropdowns pull from this automatically via `GET /api/meta`.
- **Subjects** are free text (typed by whoever uploads), so you don't need to maintain a subject list — students search by subject with the search box on the home page.

## 7. Restricting registration to college emails (optional)

If you want only people with a college email to register, set in `.env`:

```
ALLOWED_EMAIL_DOMAIN=gcoeara.ac.in
```

(Replace with your actual college domain — leave blank to allow any email, e.g. while your college hasn't issued student emails yet.)

## 8. Deploying so the whole college can use it

You need three things online: the database, the backend, and (already bundled) the frontend.

**Database — MongoDB Atlas (free tier is enough to start):**
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a database user + password.
3. Under Network Access, allow access from anywhere (`0.0.0.0/0`) for simplicity, or your host's IPs.
4. Copy the connection string into `MONGO_URI`.

**Backend — Render, Railway, or any Node host:**
1. Push this project to a GitHub repo.
2. Create a new **Web Service**, point it at the `backend` folder, build command `npm install`, start command `npm start`.
3. Add the same environment variables from your `.env` in the host's dashboard (never commit `.env` itself).
4. Once deployed, your site is live at the host's URL — both API and frontend, since the backend serves the frontend folder too.

**⚠️ Important: file storage on free hosts is usually *ephemeral*.** Render/Railway free tiers wipe the local disk (including `backend/uploads/`) on every redeploy or restart. For a small/early version this is fine — but once real students start uploading, do **one** of:
- Pay for a host with a **persistent disk** (Render's paid plans support this), or
- Swap local disk storage for cloud storage (**Cloudinary** or **AWS S3**) — only `middleware/upload.js` and the file-saving parts of `controllers/noteController.js` need to change; the rest of the app (auth, filtering, the frontend) stays the same.

If you'd like, I can also build the Cloudinary/S3 version once you've picked one — it's a fairly small change.

## 9. Security notes already built in

- Passwords are hashed with bcrypt, never stored in plain text.
- JWT-based sessions; tokens expire after 7 days by default (`JWT_EXPIRES_IN`).
- Only logged-in users can upload; only the uploader or an admin can delete a file.
- File uploads are restricted by extension (PDF/DOC/DOCX/PPT/PPTX/JPG/PNG) and size (15 MB default, configurable via `MAX_FILE_SIZE_MB`).
- Basic rate limiting on login/register to slow down brute-force attempts.
- `helmet` sets standard security headers; uploaded filenames are randomized on disk so people can't guess/overwrite each other's files.

## 10. Common next steps you may want

- Email verification before allowing upload.
- An admin dashboard page to review/remove flagged content.
- "Report this file" button.
- Subject-wise subscribe/notify (e.g. email when a new PYQ is added for your branch+year).

Happy to build any of these next — just ask.
