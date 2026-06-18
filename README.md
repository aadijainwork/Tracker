# Engineering Hub

A personal productivity dashboard for software engineers — track projects, tasks, meetings, and links in one place.

---

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React 18, Vite, React Router v6 |
| Backend  | Node.js, Express        |
| Database | SQLite (via Prisma ORM) |

---

## Project Structure

```
engineering-hub/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database models
│   │   └── seed.js             # Example seed data
│   └── src/
│       ├── index.js            # Express server entry point
│       ├── lib/
│       │   └── prisma.js       # Prisma client singleton
│       └── routes/
│           ├── dashboard.js
│           ├── projects.js
│           ├── tasks.js
│           ├── meetings.js
│           └── links.js
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── index.js        # API integration layer
    │   ├── components/
    │   │   ├── layout/
    │   │   │   └── Sidebar.jsx
    │   │   └── ui/
    │   │       ├── Modal.jsx
    │   │       └── ConfirmDialog.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Projects.jsx
    │   │   ├── ProjectDetail.jsx
    │   │   ├── Tasks.jsx
    │   │   ├── Meetings.jsx
    │   │   └── Links.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   └── utils.js
    ├── index.html
    └── vite.config.js
```

---

## Quick Start

You need **Node.js 18+** installed.

### 1. Set up the backend

```bash
cd engineering-hub/backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations (creates dev.db)
npx prisma migrate dev --name init

# Seed with example data
node prisma/seed.js

# Start the API server (port 3001)
npm run dev
```

The backend will be running at `http://localhost:3001`.

---

### 2. Set up the frontend

Open a **second terminal**:

```bash
cd engineering-hub/frontend

# Install dependencies
npm install

# Start the dev server (port 5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Endpoints

### Dashboard
| Method | Path            | Description          |
|--------|-----------------|----------------------|
| GET    | /api/dashboard  | Stats + recent data  |

### Projects
| Method | Path               | Description       |
|--------|--------------------|-------------------|
| GET    | /api/projects      | List all projects |
| GET    | /api/projects/:id  | Get one project   |
| POST   | /api/projects      | Create project    |
| PUT    | /api/projects/:id  | Update project    |
| DELETE | /api/projects/:id  | Delete project    |

### Tasks
| Method | Path             | Description                           |
|--------|------------------|---------------------------------------|
| GET    | /api/tasks       | List tasks (filter: ?status= &projectId=) |
| GET    | /api/tasks/:id   | Get one task                          |
| POST   | /api/tasks       | Create task                           |
| PUT    | /api/tasks/:id   | Update task                           |
| DELETE | /api/tasks/:id   | Delete task                           |

### Meetings
| Method | Path                | Description        |
|--------|---------------------|--------------------|
| GET    | /api/meetings       | List all meetings  |
| GET    | /api/meetings/:id   | Get one meeting    |
| POST   | /api/meetings       | Create meeting     |
| PUT    | /api/meetings/:id   | Update meeting     |
| DELETE | /api/meetings/:id   | Delete meeting     |

### Links
| Method | Path            | Description                      |
|--------|-----------------|----------------------------------|
| GET    | /api/links      | List links (filter: ?projectId=) |
| POST   | /api/links      | Create link                      |
| PUT    | /api/links/:id  | Update link                      |
| DELETE | /api/links/:id  | Delete link                      |

---

## Database

The SQLite database file is created at `backend/prisma/dev.db` when you run migrations.

Useful Prisma commands:

```bash
# Open Prisma Studio (visual DB browser)
npx prisma studio

# Reset database and re-seed
npx prisma migrate reset

# Re-generate client after schema changes
npx prisma generate
```

---

## Environment Variables

The backend reads from `backend/.env`:

```env
DATABASE_URL="file:./dev.db"
PORT=3001
```

The frontend proxies `/api` requests to `http://localhost:3001` via Vite's dev server proxy — no separate `.env` needed for development.

---

## Task Statuses & Priorities

**Statuses:** `TODO` → `IN_PROGRESS` → `DONE` (or `BLOCKED`)

**Priorities:** `LOW` · `MEDIUM` · `HIGH` · `CRITICAL`

**Project statuses:** `ACTIVE` · `ON_HOLD` · `COMPLETED`
