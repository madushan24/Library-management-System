# 📚 Library Management System

A full-stack web application for managing a library — books, members, borrowings, returns, fines, and staff — built with **React** on the frontend and **Node.js / Express** on the backend, using **SQLite** as the database.

---

## Features

### Admin
- Dashboard with key stats and charts (active borrowings, overdue books, fine collection, member activity)
- Manage librarian accounts (add, activate/deactivate)
- Full access to all modules below
- Library-wide settings (loan period, fine rate, grace period, etc.)

### Librarian
- Personal dashboard with shift-specific activity
- **Books** — add, edit, view detail, track availability
- **Members** — register, view profile, suspend/reactivate
- **Issue Book** — assign a book to a member with a due date
- **Return Book** — process returns, record book condition
- **Borrowings** — full history with overdue tracking
- **Fines** — view outstanding fines, mark as paid / waived
- **Reports** — exportable reports (PDF) for borrowings, fines, inventory

### Auth
- JWT-based authentication with role-based access (ADMIN / LIBRARIAN)
- Session stored in `sessionStorage`

---

## Screenshots

### Login
![Login Page](screenshots/login.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

### Librarian Dashboard
![Librarian Dashboard](screenshots/librarian-dashboard.png)

### Books Management
![Books Page](screenshots/books.png)

### Members Management
![Members Page](screenshots/members.png)

### Issue Book
![Issue Book](screenshots/issue-book.png)

### Return Book
![Return Book](screenshots/return-book.png)

### Borrowings
![Borrowings Page](screenshots/borrowings.png)

### Fines Management
![Fines Page](screenshots/fines.png)

### Reports
![Reports Page](screenshots/reports.png)

### Settings
![Settings Page](screenshots/settings.png)

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, React Router v7, Recharts, jsPDF      |
| Backend   | Node.js, Express 4                              |
| Database  | SQLite via `better-sqlite3`                     |
| Auth      | JWT (`jsonwebtoken`), password hashing (`bcryptjs`) |
| Dev Tools | Vite 7, Nodemon, ESLint                         |

---

## Project Structure

```
library-management-system/
├── backend/
│   ├── server.js              # Express entry point
│   ├── .env.example           # Environment variable template
│   └── src/
│       ├── db/
│       │   ├── index.js       # SQLite connection
│       │   ├── schema.js      # Table definitions
│       │   └── seed.js        # DB initializer (admin user + default settings)
│       ├── middleware/
│       │   └── auth.js        # JWT verification middleware
│       └── routes/
│           ├── auth.js
│           ├── books.js
│           ├── members.js
│           ├── borrowings.js
│           ├── fines.js
│           ├── users.js
│           ├── reports.js
│           └── settings.js
└── frontend/
    ├── index.html
    └── src/
        ├── App.jsx            # Routes & auth guard
        ├── api/               # Axios client & hooks
        ├── components/        # Reusable UI components
        │   ├── books/
        │   ├── members/
        │   └── layout/        # Sidebar, Navbar, Panels
        └── pages/
            ├── auth/
            ├── dashboard/
            ├── books/
            ├── members/
            ├── borrowings/
            ├── transactions/  # Issue & Return
            ├── fines/
            ├── reports/
            ├── librarians/
            └── settings/
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/library-management-system.git
cd library-management-system
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

`.env` values:

```env
PORT=5000
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=8h
FINE_PER_DAY=1
```

Initialize the database (creates tables + default admin account):

```bash
npm run seed
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

---

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

The app will open at `http://localhost:5173`.

---

## Default Login

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | `admin`  | `admin123` |

> Change the admin password after your first login.

---

## API Overview

All routes are prefixed with `/api`.

| Prefix            | Description              |
|-------------------|--------------------------|
| `/api/auth`       | Login / logout           |
| `/api/books`      | Book CRUD                |
| `/api/members`    | Member CRUD              |
| `/api/borrowings` | Issue & return books     |
| `/api/fines`      | Fine management          |
| `/api/users`      | Librarian management     |
| `/api/reports`    | Report data              |
| `/api/settings`   | Library settings         |
| `/api/health`     | Health check             |

---

## License

MIT
