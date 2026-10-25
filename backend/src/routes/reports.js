const router = require('express').Router()
const db     = require('../db')
const { requireAuth } = require('../middleware/auth')

const FINE_PER_DAY = () => parseFloat(process.env.FINE_PER_DAY || 1)

function diffDays(a, b) {
  return Math.floor((new Date(b) - new Date(a)) / 86400000)
}

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

/* ── helpers ── */
function whereDate(alias, filter, from, to) {
  if (filter === 'All Time' || !filter) return { clause: '', params: [] }
  const col = `${alias}.issued_date`
  if (filter === 'Today')      return { clause: `AND ${col} = date('now')`, params: [] }
  if (filter === 'This Week')  return { clause: `AND ${col} >= date('now','weekday 0','-6 days')`, params: [] }
  if (filter === 'This Month') return { clause: `AND strftime('%Y-%m',${col}) = strftime('%Y-%m','now')`, params: [] }
  if (filter === 'This Year')  return { clause: `AND strftime('%Y',${col}) = strftime('%Y','now')`, params: [] }
  if (filter === 'Custom Range' && from && to)
    return { clause: `AND ${col} BETWEEN ? AND ?`, params: [from, to] }
  return { clause: '', params: [] }
}

/* GET /api/reports/overview */
router.get('/overview', requireAuth, (req, res) => {
  refreshOverdue()
  const { filter, from, to } = req.query
  const { clause, params } = whereDate('b', filter, from, to)
  const kpis = db.prepare(`
    SELECT
      COUNT(*)                                                          AS total_issued,
      SUM(CASE WHEN b.status='RETURNED' THEN 1 ELSE 0 END)             AS total_returned,
      SUM(CASE WHEN b.status='OVERDUE'  THEN 1 ELSE 0 END)             AS total_overdue,
      SUM(CASE WHEN b.status='BORROWED' THEN 1 ELSE 0 END)             AS total_borrowed,
      COALESCE(SUM(b.fine),0)                                           AS total_fines,
      COUNT(DISTINCT b.member_id)                                       AS unique_members,
      COUNT(DISTINCT b.book_id)                                         AS unique_books
    FROM borrowings b WHERE 1=1 ${clause}
  `).get(...params)

  const monthly = db.prepare(`
    SELECT strftime('%Y-%m', b.issued_date) AS month,
           COUNT(*) AS issued,
           SUM(CASE WHEN b.status='RETURNED' THEN 1 ELSE 0 END) AS returned,
           COALESCE(SUM(b.fine),0) AS fines
    FROM borrowings b WHERE 1=1 ${clause}
    GROUP BY month ORDER BY month ASC
  `).all(...params)

  const statusPie = db.prepare(`
    SELECT b.status AS name, COUNT(*) AS value
    FROM borrowings b WHERE 1=1 ${clause}
    GROUP BY b.status
  `).all(...params)

  res.json({ kpis, monthly, statusPie })
})

/* GET /api/reports/overdue */
router.get('/overdue', requireAuth, (req, res) => {
  refreshOverdue()
  const { filter, from, to } = req.query
  const { clause, params } = whereDate('b', filter, from, to)
  const rows = db.prepare(`
    SELECT b.borrow_id AS id, m.name AS member, m.mem_id AS memberId,
           bk.title AS book, b.due_date AS due, b.overdue_days AS days, b.fine
    FROM borrowings b
    JOIN members m ON m.id = b.member_id
    JOIN books bk  ON bk.id = b.book_id
    WHERE b.status = 'OVERDUE' ${clause}
    ORDER BY b.overdue_days DESC
  `).all(...params)
  res.json(rows)
})

/* GET /api/reports/popular */
router.get('/popular', requireAuth, (req, res) => {
  const { filter, from, to } = req.query
  const { clause, params } = whereDate('b', filter, from, to)
  const rows = db.prepare(`
    SELECT bk.book_id, bk.title, bk.author, COUNT(*) AS borrowed,
           ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS rank
    FROM borrowings b
    JOIN books bk ON bk.id = b.book_id
    WHERE 1=1 ${clause}
    GROUP BY bk.id ORDER BY borrowed DESC LIMIT 10
  `).all(...params)
  res.json(rows)
})

/* GET /api/reports/members */
router.get('/members', requireAuth, (req, res) => {
  const { filter, from, to } = req.query
  const { clause, params } = whereDate('b', filter, from, to)
  const rows = db.prepare(`
    SELECT m.mem_id AS id, m.name,
           COUNT(*) AS borrowed,
           SUM(CASE WHEN b.status='RETURNED' THEN 1 ELSE 0 END) AS returned,
           SUM(CASE WHEN b.status='OVERDUE'  THEN 1 ELSE 0 END) AS overdue,
           COALESCE(SUM(b.fine),0) AS fines
    FROM borrowings b
    JOIN members m ON m.id = b.member_id
    WHERE 1=1 ${clause}
    GROUP BY m.id ORDER BY borrowed DESC
  `).all(...params)
  res.json(rows)
})

module.exports = router
