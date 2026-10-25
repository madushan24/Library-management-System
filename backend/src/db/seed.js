/**
 * seed.js — Database initializer for Library Management System
 * Run: npm run seed
 *
 * This script sets up ONLY the essential defaults:
 *   - One admin user account
 *   - Default library settings
 *
 * All books, members, and borrowings are created through the application UI.
 */
require('dotenv').config()
const bcrypt = require('bcryptjs')
const db = require('./index')

console.log('Initializing LMS database...')

/* ── Clear ALL existing data (in dependency order) ── */
db.exec(`
  PRAGMA foreign_keys = OFF;
  DELETE FROM fine_payments;
  DELETE FROM borrowings;
  DELETE FROM books;
  DELETE FROM members;
  DELETE FROM users;
  DELETE FROM settings;
  DELETE FROM sqlite_sequence;
  PRAGMA foreign_keys = ON;
`)
console.log('Cleared all existing data.')

/* ── 1. Admin User ── */
const adminPasswordHash = bcrypt.hashSync('admin123', 10)

db.prepare(`
  INSERT INTO users (lib_id, name, username, email, phone, password, role, shift, status, joined_date, last_login)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'ADM-001',
  'System Administrator',
  'admin',
  'admin@library.lk',
  '',
  adminPasswordHash,
  'ADMIN',
  'Morning',
  'ACTIVE',
  new Date().toISOString().slice(0, 10),
  new Date().toISOString()
)
console.log('Created admin user. (username: admin, password: admin123)')

/* ── 2. Default Library Settings ── */
const insertSetting = db.prepare(`INSERT INTO settings (key, value) VALUES (?, ?)`)

const defaultSettings = {
  general: {
    libraryName: 'My Library',
    email: '',
    phone: '',
    address: '',
    currency: 'Rs.',
  },
  circulation: {
    loanPeriodDays: 14,
    maxBooksPerMember: 3,
    finePerDay: 1.00,
    gracePeriodDays: 2,
    allowRenewal: true,
  },
  notifications: {
    emailAlerts: false,
    overdueNoticeDaysBefore: 2,
  },
}

for (const [key, val] of Object.entries(defaultSettings)) {
  insertSetting.run(key, JSON.stringify(val))
}
console.log('Inserted default settings.')

console.log('\n✅ Database initialized successfully!')
console.log('   Admin login — username: admin  |  password: admin123')
console.log('\n   Now add your books, members, and librarians through the application.\n')
