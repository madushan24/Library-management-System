const router = require('express').Router()
const db     = require('../db')
const { requireAuth } = require('../middleware/auth')

const FINE_PER_DAY = () => parseFloat(process.env.FINE_PER_DAY || 1)

function nextBorrowId() {
  const last = db.prepare(`SELECT borrow_id FROM borrowings ORDER BY id DESC LIMIT 1`).get()
  if (!last) return 'BR-001'
  const n = parseInt(last.borrow_id.split('-')[1], 10) + 1
  return `BR-${String(n).padStart(3, '0')}`
}

function diffDays(a, b) {
  return Math.floor((new Date(b) - new Date(a)) / 86400000)
}

/* Recalculate overdue status for all BORROWED records — called on every read */
function refreshOverdue() {
  const today = new Date().toISOString().slice(0, 10)
  const overdue = db.prepare(
    `SELECT * FROM borrowings WHERE status = 'BORROWED' AND due_date < ?`
  ).all(today)

  const stmt = db.prepare(
    `UPDATE borrowings SET status='OVERDUE', overdue_days=?, fine=? WHERE id=?`
  )
  const trx = db.transaction(() => {
    for (const b of overdue) {
      const days = diffDays(b.due_date, today)
      const fine = Math.round(days * FINE_PER_DAY())
      stmt.run(days, fine, b.id)
    }
  })
  trx()
}

/* GET /api/borrowings */
router.get('/', requireAuth, (req, res) => {
  refreshOverdue()
  const { status, search, memberId } = req.query
  let sql = `
    SELECT b.*, m.name AS member_name, m.mem_id, bk.title AS book_title, bk.book_id,
           u1.name AS issued_by_name, u2.name AS returned_by_name
    FROM borrowings b
    JOIN members m  ON m.id = b.member_id
    JOIN books   bk ON bk.id = b.book_id
    LEFT JOIN users u1 ON u1.id = b.issued_by
    LEFT JOIN users u2 ON u2.id = b.returned_by
    WHERE 1=1`
  const params = []

  if (status && status !== 'ALL') { sql += ` AND b.status = ?`; params.push(status) }
  if (memberId)                   { sql += ` AND m.mem_id = ?`; params.push(memberId) }
  if (search) {
    sql += ` AND (m.name LIKE ? OR m.mem_id LIKE ? OR bk.title LIKE ? OR b.borrow_id LIKE ?)`
    const q = `%${search}%`
    params.push(q, q, q, q)
  }
  sql += ` ORDER BY b.id DESC`
  res.json(db.prepare(sql).all(...params))
})

/* GET /api/borrowings/:id */
router.get('/:id', requireAuth, (req, res) => {
  const row = db.prepare(`
    SELECT b.*, m.name AS member_name, m.mem_id, bk.title AS book_title, bk.book_id
    FROM borrowings b
    JOIN members m  ON m.id = b.member_id
    JOIN books   bk ON bk.id = b.book_id
    WHERE b.id = ? OR b.borrow_id = ?
  `).get(req.params.id, req.params.id)
  if (!row) return res.status(404).json({ error: 'Borrowing not found' })
  res.json(row)
})

/* POST /api/borrowings  — issue a book */
router.post('/', requireAuth, (req, res) => {
  const { member_id, book_id, due_date } = req.body
  if (!member_id || !book_id || !due_date)
    return res.status(400).json({ error: 'member_id, book_id and due_date are required' })

  const member = db.prepare(`SELECT * FROM members WHERE id = ? OR mem_id = ?`).get(member_id, member_id)
  if (!member) return res.status(404).json({ error: 'Member not found' })
  if (member.status === 'SUSPENDED') return res.status(409).json({ error: 'Member is suspended' })

  const book = db.prepare(`SELECT * FROM books WHERE id = ? OR book_id = ?`).get(book_id, book_id)
  if (!book) return res.status(404).json({ error: 'Book not found' })
  if (book.available < 1) return res.status(409).json({ error: 'No copies available' })

  const activeBorrows = db.prepare(
    `SELECT COUNT(*) as c FROM borrowings WHERE member_id = ? AND status IN ('BORROWED','OVERDUE')`
  ).get(member.id)
  if (activeBorrows.c >= member.max_books)
    return res.status(409).json({ error: `Member has reached the max borrowing limit (${member.max_books})` })

  const already = db.prepare(
    `SELECT id FROM borrowings WHERE member_id = ? AND book_id = ? AND status IN ('BORROWED','OVERDUE')`
  ).get(member.id, book.id)
  if (already) return res.status(409).json({ error: 'Member already has this book borrowed' })

  const borrow_id = nextBorrowId()
  const issued_date = new Date().toISOString().slice(0, 10)

  const trx = db.transaction(() => {
    const result = db.prepare(
      `INSERT INTO borrowings (borrow_id, member_id, book_id, issued_date, due_date, issued_by)
       VALUES (?,?,?,?,?,?)`
    ).run(borrow_id, member.id, book.id, issued_date, due_date, req.user.id)

    db.prepare(`UPDATE books SET available = available - 1, status = CASE WHEN available - 1 = 0 THEN 'OUT_OF_STOCK' ELSE status END WHERE id = ?`)
      .run(book.id)

    return result.lastInsertRowid
  })

  const rowid = trx()
  const created = db.prepare(`
    SELECT b.*, m.name AS member_name, m.mem_id, bk.title AS book_title, bk.book_id
    FROM borrowings b
    JOIN members m ON m.id = b.member_id JOIN books bk ON bk.id = b.book_id
    WHERE b.id = ?
  `).get(rowid)

  res.status(201).json(created)
})

/* PATCH /api/borrowings/:id/return */
router.patch('/:id/return', requireAuth, (req, res) => {
  const row = db.prepare(
    `SELECT b.*, bk.available AS book_avail FROM borrowings b JOIN books bk ON bk.id = b.book_id
     WHERE b.id = ? OR b.borrow_id = ?`
  ).get(req.params.id, req.params.id)

  if (!row) return res.status(404).json({ error: 'Borrowing not found' })
  if (row.status === 'RETURNED') return res.status(409).json({ error: 'Book already returned' })

  const { condition } = req.body
  const returned_date = new Date().toISOString().slice(0, 10)
  const overdue_days  = Math.max(0, diffDays(row.due_date, returned_date))
  const fine          = Math.round(overdue_days * FINE_PER_DAY())

  const trx = db.transaction(() => {
    db.prepare(
      `UPDATE borrowings SET status='RETURNED', returned_date=?, overdue_days=?, fine=?, condition=?, returned_by=? WHERE id=?`
    ).run(returned_date, overdue_days, fine, condition || 'Good', req.user.id, row.id)

    db.prepare(`UPDATE books SET available = available + 1, status = 'AVAILABLE' WHERE id = ?`)
      .run(row.book_id)

    if (fine > 0) {
      const existing = db.prepare(`SELECT id FROM fine_payments WHERE borrow_id = ?`).get(row.id)
      if (!existing)
        db.prepare(`INSERT INTO fine_payments (borrow_id, status) VALUES (?, 'UNPAID')`).run(row.id)
    }
  })
  trx()

  res.json(db.prepare(`
    SELECT b.*, m.name AS member_name, m.mem_id, bk.title AS book_title, bk.book_id
    FROM borrowings b JOIN members m ON m.id = b.member_id JOIN books bk ON bk.id = b.book_id
    WHERE b.id = ?
  `).get(row.id))
})

module.exports = router
