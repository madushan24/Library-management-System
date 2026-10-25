/**
 * schema.js — SQLite table definitions
 * Run once at startup via db/index.js
 */
module.exports = function createSchema(db) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    -- ── Users (Admin + Librarians) ──────────────────────────────────
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      lib_id      TEXT    UNIQUE,                  -- e.g. LIB-001 or ADM-001
      name        TEXT    NOT NULL,
      username    TEXT    NOT NULL UNIQUE,
      email       TEXT    NOT NULL UNIQUE,
      phone       TEXT,
      password    TEXT    NOT NULL,                -- bcrypt hash
      role        TEXT    NOT NULL DEFAULT 'LIBRARIAN', -- ADMIN | LIBRARIAN
      shift       TEXT    DEFAULT 'Morning',
      status      TEXT    NOT NULL DEFAULT 'ACTIVE',   -- ACTIVE | INACTIVE
      joined_date TEXT    NOT NULL DEFAULT (date('now')),
      last_login  TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- ── Members ─────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS members (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      mem_id      TEXT    UNIQUE,                  -- e.g. MEM-001
      name        TEXT    NOT NULL,
      affiliation TEXT,
      phone       TEXT    NOT NULL UNIQUE,
      email       TEXT,
      nic         TEXT,
      address     TEXT,
      registered  TEXT    NOT NULL DEFAULT (date('now')),
      max_books   INTEGER NOT NULL DEFAULT 3,
      status      TEXT    NOT NULL DEFAULT 'ACTIVE', -- ACTIVE | INACTIVE | SUSPENDED
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- ── Books ───────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS books (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id     TEXT    UNIQUE,                  -- e.g. BK-001
      isbn        TEXT,
      title       TEXT    NOT NULL,
      author      TEXT    NOT NULL,
      category    TEXT    NOT NULL DEFAULT 'General',
      total       INTEGER NOT NULL DEFAULT 1,
      available   INTEGER NOT NULL DEFAULT 1,
      status      TEXT    NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE | OUT_OF_STOCK | MAINTENANCE
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- ── Borrowings ──────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS borrowings (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      borrow_id     TEXT    UNIQUE,                -- e.g. BR-001
      member_id     INTEGER NOT NULL REFERENCES members(id),
      book_id       INTEGER NOT NULL REFERENCES books(id),
      issued_date   TEXT    NOT NULL DEFAULT (date('now')),
      due_date      TEXT    NOT NULL,
      returned_date TEXT,
      overdue_days  INTEGER NOT NULL DEFAULT 0,
      fine          INTEGER NOT NULL DEFAULT 0,
      condition     TEXT    DEFAULT 'Good',        -- Good | Damaged (on return)
      status        TEXT    NOT NULL DEFAULT 'BORROWED', -- BORROWED | RETURNED | OVERDUE
      issued_by     INTEGER REFERENCES users(id),
      returned_by   INTEGER REFERENCES users(id),
      created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- ── Fine Payments ────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS fine_payments (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      borrow_id   INTEGER NOT NULL UNIQUE REFERENCES borrowings(id),
      status      TEXT    NOT NULL DEFAULT 'UNPAID', -- UNPAID | PAID | WAIVED
      method      TEXT    DEFAULT '-',               -- Cash | Card | Online | Waived
      paid_date   TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- ── Settings ────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `)
}
