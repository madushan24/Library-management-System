const router = require('express').Router()
const db     = require('../db')
const { requireAuth, requireAdmin } = require('../middleware/auth')

/* ── helpers ── */
function nextBookId() {
  const last = db.prepare(`SELECT book_id FROM books ORDER BY id DESC LIMIT 1`).get()
  if (!last) return 'BK-001'
  const n = parseInt(last.book_id.split('-')[1], 10) + 1
  return `BK-${String(n).padStart(3, '0')}`
}

function computeBookStatus(available, total) {
  if (available === 0) return 'OUT_OF_STOCK'
  return 'AVAILABLE'
}

/* GET /api/books */
router.get('/', requireAuth, (req, res) => {
  const { search, category, status } = req.query
  let sql = `SELECT * FROM books WHERE 1=1`
  const params = []
  if (search) {
    sql += ` AND (title LIKE ? OR author LIKE ? OR isbn LIKE ? OR book_id LIKE ?)`
    const q = `%${search}%`
    params.push(q, q, q, q)
  }
  if (category && category !== 'All Categories') { sql += ` AND category = ?`; params.push(category) }
  if (status   && status   !== 'All Status')      { sql += ` AND status = ?`;   params.push(status)   }
  sql += ` ORDER BY id DESC`
  res.json(db.prepare(sql).all(...params))
})

/* GET /api/books/meta/categories */
router.get('/meta/categories', requireAuth, (req, res) => {
  const rows = db.prepare(`SELECT DISTINCT category FROM books ORDER BY category`).all()
  res.json(rows.map(r => r.category))
})

/* GET /api/books/:id */
router.get('/:id', requireAuth, (req, res) => {
  const book = db.prepare(`SELECT * FROM books WHERE id = ? OR book_id = ?`).get(req.params.id, req.params.id)
  if (!book) return res.status(404).json({ error: 'Book not found' })
  res.json(book)
})

/* POST /api/books */
router.post('/', requireAuth, requireAdmin, (req, res) => {
  const { isbn, title, author, category, total } = req.body
  if (!title || !author) return res.status(400).json({ error: 'Title and author are required' })

  const book_id   = nextBookId()
  const totalCnt  = parseInt(total, 10) || 1
  const status    = computeBookStatus(totalCnt, totalCnt)

  const result = db.prepare(
    `INSERT INTO books (book_id, isbn, title, author, category, total, available, status) VALUES (?,?,?,?,?,?,?,?)`
  ).run(book_id, isbn || '', title.trim(), author.trim(), category || 'General', totalCnt, totalCnt, status)

  res.status(201).json(db.prepare(`SELECT * FROM books WHERE id = ?`).get(result.lastInsertRowid))
})

/* PATCH /api/books/:id */
router.patch('/:id', requireAuth, requireAdmin, (req, res) => {
  const book = db.prepare(`SELECT * FROM books WHERE id = ? OR book_id = ?`).get(req.params.id, req.params.id)
  if (!book) return res.status(404).json({ error: 'Book not found' })

  const { isbn, title, author, category, total, status } = req.body
  const newTotal = total !== undefined ? parseInt(total, 10) : book.total
  const diff     = newTotal - book.total
  const newAvail = Math.max(0, book.available + diff)
  const newStatus = status || computeBookStatus(newAvail, newTotal)

  db.prepare(
    `UPDATE books SET isbn=?, title=?, author=?, category=?, total=?, available=?, status=? WHERE id=?`
  ).run(
    isbn    ?? book.isbn,
    title   ?? book.title,
    author  ?? book.author,
    category ?? book.category,
    newTotal, newAvail, newStatus, book.id
  )
  res.json(db.prepare(`SELECT * FROM books WHERE id = ?`).get(book.id))
})

/* DELETE /api/books/:id */
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  const book = db.prepare(`SELECT * FROM books WHERE id = ? OR book_id = ?`).get(req.params.id, req.params.id)
  if (!book) return res.status(404).json({ error: 'Book not found' })
  if (book.available < book.total) return res.status(409).json({ error: 'Cannot delete: book has active borrowings' })
  db.prepare(`DELETE FROM books WHERE id = ?`).run(book.id)
  res.json({ message: 'Book deleted' })
})

module.exports = router
