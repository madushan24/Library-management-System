const router = require('express').Router()
const db     = require('../db')
const { requireAuth, requireAdmin } = require('../middleware/auth')

function nextMemId() {
  const last = db.prepare(`SELECT mem_id FROM members ORDER BY id DESC LIMIT 1`).get()
  if (!last) return 'MEM-001'
  const n = parseInt(last.mem_id.split('-')[1], 10) + 1
  return `MEM-${String(n).padStart(3, '0')}`
}

/* GET /api/members */
router.get('/', requireAuth, (req, res) => {
  const { search, status, hasFines } = req.query
  let sql = `
    SELECT m.*,
      (SELECT COUNT(*) FROM borrowings b WHERE b.member_id = m.id AND b.status IN ('BORROWED','OVERDUE')) AS borrowed,
      (SELECT COALESCE(SUM(b.fine),0) FROM borrowings b
        LEFT JOIN fine_payments fp ON fp.borrow_id = b.id
        WHERE b.member_id = m.id AND b.fine > 0 AND (fp.status IS NULL OR fp.status = 'UNPAID')) AS outstanding
    FROM members m WHERE 1=1`
  const params = []

  if (search) {
    sql += ` AND (m.name LIKE ? OR m.phone LIKE ? OR m.mem_id LIKE ? OR m.nic LIKE ? OR m.email LIKE ?)`
    const q = `%${search}%`
    params.push(q, q, q, q, q)
  }
  if (status && status !== 'All Statuses') { sql += ` AND m.status = ?`; params.push(status) }
  if (hasFines === 'true') sql += ` AND outstanding > 0`
  sql += ` ORDER BY m.id DESC`

  res.json(db.prepare(sql).all(...params))
})

/* GET /api/members/:id */
router.get('/:id', requireAuth, (req, res) => {
  const m = db.prepare(
    `SELECT m.*,
      (SELECT COUNT(*) FROM borrowings b WHERE b.member_id = m.id AND b.status IN ('BORROWED','OVERDUE')) AS borrowed,
      (SELECT COALESCE(SUM(b.fine),0) FROM borrowings b
        LEFT JOIN fine_payments fp ON fp.borrow_id = b.id
        WHERE b.member_id = m.id AND b.fine > 0 AND (fp.status IS NULL OR fp.status = 'UNPAID')) AS outstanding
    FROM members m WHERE m.id = ? OR m.mem_id = ?`
  ).get(req.params.id, req.params.id)
  if (!m) return res.status(404).json({ error: 'Member not found' })

  const history = db.prepare(
    `SELECT b.*, bk.title AS book_title, bk.book_id
     FROM borrowings b JOIN books bk ON bk.id = b.book_id
     WHERE b.member_id = ? ORDER BY b.id DESC`
  ).all(m.id)

  res.json({ ...m, history })
})

/* POST /api/members */
router.post('/', requireAuth, (req, res) => {
  const { name, affiliation, phone, email, nic, address, max_books } = req.body
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' })

  const mem_id = nextMemId()
  const result = db.prepare(
    `INSERT INTO members (mem_id, name, affiliation, phone, email, nic, address, max_books)
     VALUES (?,?,?,?,?,?,?,?)`
  ).run(mem_id, name.trim(), affiliation || '', phone.trim(), email || '', nic || '', address || '', max_books || 3)

  res.status(201).json(db.prepare(`SELECT * FROM members WHERE id = ?`).get(result.lastInsertRowid))
})

/* PATCH /api/members/:id */
router.patch('/:id', requireAuth, (req, res) => {
  const m = db.prepare(`SELECT * FROM members WHERE id = ? OR mem_id = ?`).get(req.params.id, req.params.id)
  if (!m) return res.status(404).json({ error: 'Member not found' })

  const { name, affiliation, phone, email, nic, address, max_books, status } = req.body
  db.prepare(
    `UPDATE members SET name=?, affiliation=?, phone=?, email=?, nic=?, address=?, max_books=?, status=? WHERE id=?`
  ).run(
    name         ?? m.name,
    affiliation  ?? m.affiliation,
    phone        ?? m.phone,
    email        ?? m.email,
    nic          ?? m.nic,
    address      ?? m.address,
    max_books    ?? m.max_books,
    status       ?? m.status,
    m.id
  )
  res.json(db.prepare(`SELECT * FROM members WHERE id = ?`).get(m.id))
})

/* DELETE /api/members/:id — admin only */
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  const m = db.prepare(`SELECT * FROM members WHERE id = ? OR mem_id = ?`).get(req.params.id, req.params.id)
  if (!m) return res.status(404).json({ error: 'Member not found' })
  const active = db.prepare(`SELECT COUNT(*) as c FROM borrowings WHERE member_id = ? AND status IN ('BORROWED','OVERDUE')`).get(m.id)
  if (active.c > 0) return res.status(409).json({ error: 'Cannot delete: member has active borrowings' })
  db.prepare(`DELETE FROM members WHERE id = ?`).run(m.id)
  res.json({ message: 'Member deleted' })
})

module.exports = router
