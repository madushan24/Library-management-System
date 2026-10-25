const router = require('express').Router()
const db     = require('../db')
const { requireAuth } = require('../middleware/auth')

/* GET /api/fines */
router.get('/', requireAuth, (req, res) => {
  const { status, search } = req.query
  let sql = `
    SELECT fp.*, b.borrow_id, b.fine AS amount, b.overdue_days AS days,
           m.name AS member_name, m.mem_id, m.phone,
           bk.title AS book_title, bk.book_id,
           b.due_date, b.returned_date
    FROM fine_payments fp
    JOIN borrowings b ON b.id = fp.borrow_id
    JOIN members m ON m.id = b.member_id
    JOIN books bk ON bk.id = b.book_id
    WHERE 1=1`
  const params = []
  if (status && status !== 'ALL') { sql += ` AND fp.status = ?`; params.push(status) }
  if (search) {
    sql += ` AND (m.name LIKE ? OR m.mem_id LIKE ? OR bk.title LIKE ? OR b.borrow_id LIKE ?)`
    const q = `%${search}%`
    params.push(q, q, q, q)
  }
  sql += ` ORDER BY fp.id DESC`
  res.json(db.prepare(sql).all(...params))
})

/* PATCH /api/fines/:borrowingId/pay */
router.patch('/:borrowingId/pay', requireAuth, (req, res) => {
  const { method } = req.body
  if (!method) return res.status(400).json({ error: 'Payment method is required' })

  const fp = db.prepare(`SELECT * FROM fine_payments WHERE borrow_id = (SELECT id FROM borrowings WHERE id = ? OR borrow_id = ?)`).get(req.params.borrowingId, req.params.borrowingId)
  if (!fp) return res.status(404).json({ error: 'Fine record not found' })
  if (fp.status === 'PAID') return res.status(409).json({ error: 'Fine already paid' })

  db.prepare(`UPDATE fine_payments SET status='PAID', method=?, paid_date=date('now') WHERE id=?`)
    .run(method, fp.id)

  res.json(db.prepare(`SELECT * FROM fine_payments WHERE id = ?`).get(fp.id))
})

/* PATCH /api/fines/:borrowingId/waive */
router.patch('/:borrowingId/waive', requireAuth, (req, res) => {
  const fp = db.prepare(`SELECT * FROM fine_payments WHERE borrow_id = (SELECT id FROM borrowings WHERE id = ? OR borrow_id = ?)`).get(req.params.borrowingId, req.params.borrowingId)
  if (!fp) return res.status(404).json({ error: 'Fine record not found' })
  if (fp.status !== 'UNPAID') return res.status(409).json({ error: 'Fine is not unpaid' })

  db.prepare(`UPDATE fine_payments SET status='WAIVED', method='Waived', paid_date=date('now') WHERE id=?`).run(fp.id)
  res.json(db.prepare(`SELECT * FROM fine_payments WHERE id = ?`).get(fp.id))
})

/* GET /api/fines/summary */
router.get('/summary', requireAuth, (req, res) => {
  const totals = db.prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN fp.status='UNPAID' THEN 1 ELSE 0 END) AS unpaid_count,
      SUM(CASE WHEN fp.status='PAID'   THEN 1 ELSE 0 END) AS paid_count,
      SUM(CASE WHEN fp.status='WAIVED' THEN 1 ELSE 0 END) AS waived_count,
      SUM(b.fine) AS total_fines,
      SUM(CASE WHEN fp.status='UNPAID' THEN b.fine ELSE 0 END) AS unpaid_total,
      SUM(CASE WHEN fp.status='PAID'   THEN b.fine ELSE 0 END) AS collected_total
    FROM fine_payments fp JOIN borrowings b ON b.id = fp.borrow_id
  `).get()
  res.json(totals)
})

module.exports = router
