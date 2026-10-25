/**
 * seed.js — Database seeder for Library Management System
 * Run: npm run seed
 */
require('dotenv').config()
const bcrypt = require('bcryptjs')
const db = require('./index')

console.log('Seeding LMS database...')

/* ── Clear existing data (in dependency order) ── */
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

/* ── 1. Users ── */
const defaultPasswordHash = bcrypt.hashSync('admin123', 10)
const staffPasswordHash   = bcrypt.hashSync('lib123456', 10)

const insertUser = db.prepare(`
  INSERT INTO users (lib_id, name, username, email, phone, password, role, shift, status, joined_date, last_login)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const users = [
  ['ADM-001', 'System Administrator', 'admin', 'admin@library.lk', '077 000 0001', defaultPasswordHash, 'ADMIN', 'Morning', 'ACTIVE', '2024-01-01', new Date().toISOString()],
  ['LIB-001', 'Chaminda Perera', 'chaminda.p', 'chaminda@library.lk', '077 111 2233', staffPasswordHash, 'LIBRARIAN', 'Morning', 'ACTIVE', '2024-01-01', '2026-10-15 08:30:00'],
  ['LIB-002', 'Nirosha Silva', 'nirosha.s', 'nirosha@library.lk', '071 223 4455', staffPasswordHash, 'LIBRARIAN', 'Evening', 'ACTIVE', '2024-02-15', '2026-10-14 16:15:00'],
  ['LIB-003', 'Ruwan Fernando', 'ruwan.f', 'ruwan@library.lk', '076 334 5566', staffPasswordHash, 'LIBRARIAN', 'Morning', 'INACTIVE', '2024-03-10', '2026-10-10 11:45:00'],
  ['LIB-004', 'Amali Jayasinghe', 'amali.j', 'amali@library.lk', '078 445 6677', staffPasswordHash, 'LIBRARIAN', 'Afternoon', 'ACTIVE', '2024-05-20', '2026-10-15 13:20:00'],
  ['LIB-005', 'Kasun Rathnayake', 'kasun.r', 'kasunr@library.lk', '075 556 7788', staffPasswordHash, 'LIBRARIAN', 'Evening', 'ACTIVE', '2024-07-12', '2026-10-13 17:00:00'],
]

for (const u of users) {
  insertUser.run(...u)
}
console.log(`Seeded ${users.length} users.`)

/* ── 2. Members ── */
const insertMember = db.prepare(`
  INSERT INTO members (mem_id, name, affiliation, phone, email, nic, address, registered, max_books, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const members = [
  ['MEM-001', 'Kasun Perera', 'Faculty of Science', '076 554 1122', 'kasun.p@email.com', '199512345678', 'No 45, Kandy Rd, Kurunegala', '2024-02-10', 3, 'ACTIVE'],
  ['MEM-002', 'N.S. Fernando', 'Faculty of Engineering', '071 882 3891', 'fernando.ns@email.com', '199422345678', '12/A Sea Ave, Colombo 03', '2024-03-01', 4, 'ACTIVE'],
  ['MEM-003', 'Dilani Wickrama', 'Faculty of Medicine', '071 987 6543', 'dilani.w@email.com', '199654321098', '88 Temple Rd, Galle', '2024-04-12', 3, 'ACTIVE'],
  ['MEM-004', 'Sahan Alwis', 'Department of Computing', '078 991 4455', 'sahan.a@email.com', '199788123456', '34 Highlevel Rd, Nugegoda', '2024-05-18', 3, 'ACTIVE'],
  ['MEM-005', 'K.M. Bandara', 'Faculty of Arts', '077 234 5678', 'bandara.km@email.com', '199211334455', '55 Peradeniya Rd, Kandy', '2024-06-25', 3, 'ACTIVE'],
  ['MEM-006', 'Fathima Rizna', 'Faculty of Management', '075 112 3344', 'fathima.r@email.com', '199877665544', '19 Main St, Matale', '2024-08-01', 3, 'ACTIVE'],
]

for (const m of members) {
  insertMember.run(...m)
}
console.log(`Seeded ${members.length} members.`)

/* ── 3. Books ── */
const insertBook = db.prepare(`
  INSERT INTO books (book_id, isbn, title, author, category, total, available, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`)

const books = [
  ['BK-001', '978-0-07-352332-2', 'Discrete Mathematics & Its Applications', 'Kenneth H. Rosen', 'Mathematics', 5, 3, 'AVAILABLE'],
  ['BK-002', '978-0-13-468599-1', 'Modern Operating Systems', 'Andrew Tanenbaum', 'Comp Science', 4, 1, 'AVAILABLE'],
  ['BK-003', '978-0-262-03384-8', 'Introduction to Algorithms', 'Cormen, Leiserson', 'Computing', 6, 3, 'AVAILABLE'],
  ['BK-004', '978-0-13-602772-8', 'Microelectronic Circuits', 'Sedra & Smith', 'Engineering', 3, 2, 'AVAILABLE'],
  ['BK-005', '978-0-07-464765-7', 'Principles of Economics', 'N. Gregory Mankiw', 'Economics', 2, 0, 'MAINTENANCE'],
  ['BK-006', '978-0-13-110362-7', 'The C Programming Language', 'Kernighan & Ritchie', 'Computing', 4, 4, 'AVAILABLE'],
  ['BK-007', '978-0-20-163361-0', 'Clean Code', 'Robert C. Martin', 'Software Eng', 3, 0, 'OUT_OF_STOCK'],
  ['BK-008', '978-0-13-187374-2', 'Digital Signal Processing Concepts', 'John G. Proakis', 'Engineering', 4, 3, 'AVAILABLE'],
]

for (const b of books) {
  insertBook.run(...b)
}
console.log(`Seeded ${books.length} books.`)

/* ── 4. Borrowings & Fine Payments ── */
const insertBorrowing = db.prepare(`
  INSERT INTO borrowings (borrow_id, member_id, book_id, issued_date, due_date, returned_date, overdue_days, fine, condition, status, issued_by, returned_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const insertFine = db.prepare(`
  INSERT INTO fine_payments (borrow_id, status, method, paid_date)
  VALUES (?, ?, ?, ?)
`)

// Active loans
// BK-001 has 2 borrowed, 3 available (total 5) -> 1 to MEM-001 (BORROWED), 1 to MEM-005 (OVERDUE)
// BK-002 has 3 borrowed, 1 available (total 4) -> 1 to MEM-002 (OVERDUE), 1 to MEM-004 (BORROWED), 1 to MEM-003 (BORROWED)
// BK-003 has 3 borrowed, 3 available (total 6) -> 1 to MEM-002 (OVERDUE), 2 past returned
// BK-004 has 1 borrowed, 2 available (total 3) -> 1 to MEM-006 (BORROWED)
// BK-007 has 3 borrowed, 0 available (total 3) -> 1 to MEM-001 (OVERDUE), 1 to MEM-003 (BORROWED), 1 to MEM-005 (BORROWED)

const borrowings = [
  // borrow_id, member_id, book_id, issued, due, returned, overdue_days, fine, condition, status, issued_by, returned_by
  ['BR-001', 1, 1, '2026-10-18', '2026-11-01', null, 0, 0, 'Good', 'BORROWED', 2, null],
  ['BR-002', 2, 2, '2026-09-20', '2026-10-04', null, 21, 21, 'Good', 'OVERDUE', 2, null],
  ['BR-003', 4, 2, '2026-10-20', '2026-11-03', null, 0, 0, 'Good', 'BORROWED', 3, null],
  ['BR-004', 3, 2, '2026-10-15', '2026-10-29', null, 0, 0, 'Good', 'BORROWED', 2, null],
  ['BR-005', 2, 3, '2026-09-28', '2026-10-12', null, 13, 13, 'Good', 'OVERDUE', 5, null],
  ['BR-006', 5, 1, '2026-09-15', '2026-09-29', null, 26, 26, 'Good', 'OVERDUE', 2, null],
  ['BR-007', 6, 4, '2026-10-22', '2026-11-05', null, 0, 0, 'Good', 'BORROWED', 3, null],
  ['BR-008', 1, 7, '2026-10-01', '2026-10-15', null, 10, 10, 'Good', 'OVERDUE', 2, null],
  ['BR-009', 3, 7, '2026-10-16', '2026-10-30', null, 0, 0, 'Good', 'BORROWED', 5, null],
  ['BR-010', 5, 7, '2026-10-21', '2026-11-04', null, 0, 0, 'Good', 'BORROWED', 3, null],

  // Past returned records
  ['BR-011', 3, 8, '2026-09-01', '2026-09-15', '2026-09-14', 0, 0, 'Good', 'RETURNED', 2, 2],
  ['BR-012', 4, 3, '2026-08-10', '2026-08-24', '2026-09-01', 8, 8, 'Good', 'RETURNED', 2, 3],
  ['BR-013', 5, 6, '2026-08-15', '2026-08-29', '2026-08-29', 0, 0, 'Good', 'RETURNED', 3, 3],
  ['BR-014', 6, 3, '2026-09-05', '2026-09-19', '2026-09-25', 6, 6, 'Damaged', 'RETURNED', 5, 2],
]

for (const b of borrowings) {
  const result = insertBorrowing.run(...b)
  const borrowDbId = result.lastInsertRowid
  const fine = b[7]
  const status = b[9]

  if (status === 'OVERDUE' && fine > 0) {
    insertFine.run(borrowDbId, 'UNPAID', '-', null)
  } else if (status === 'RETURNED' && fine > 0) {
    // 50% paid, 50% waived
    if (b[0] === 'BR-012') {
      insertFine.run(borrowDbId, 'PAID', 'Cash', '2026-09-01')
    } else {
      insertFine.run(borrowDbId, 'WAIVED', 'Waived', '2026-09-25')
    }
  }
}
console.log(`Seeded ${borrowings.length} borrowings and fine records.`)

/* ── 5. Settings ── */
const insertSetting = db.prepare(`
  INSERT INTO settings (key, value)
  VALUES (?, ?)
`)

const defaultSettings = {
  general: {
    libraryName: 'Public Library PADIYATHALAWA',
    email: 'library@padiyathalawa.lk',
    phone: '063 224 4550',
    address: 'Main Street, Padiyathalawa, Eastern Province, Sri Lanka',
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
    emailAlerts: true,
    overdueNoticeDaysBefore: 2,
  }
}

for (const [key, val] of Object.entries(defaultSettings)) {
  insertSetting.run(key, JSON.stringify(val))
}
console.log('Seeded settings.')

console.log('\n Database seeding completed successfully!')
console.log(' Default Admin:  username: admin      password: admin123')
console.log(' Default Staff:  username: chaminda.p password: lib123456\n')
