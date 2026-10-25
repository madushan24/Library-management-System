const router = require('express').Router()
const bcrypt = require('bcryptjs')
const db     = require('../db')
const { requireAuth, requireAdmin } = require('../middleware/auth')

function nextLibId() {
  const last = db.prepare(`SELECT lib_id FROM users WHERE role = 'LIBRARIAN' ORDER BY id DESC LIMIT 1`).get()
  if (!last || !last.lib_id) return 'LIB-001'
  const n = parseInt(last.lib_id.split('-')[1], 10) + 1
  return `LIB-${String(n).padStart(3, '0')}`
}

const SAFE_COLS = `id, lib_id, name, username, email, phone, role, shift, status, joined_date, last_login, created_at`

/* GET /api/users — all librarians (admin only) */
router.get('/', requireAuth, requireAdmin, (req, res) => {
  const { search, status } = req.query
  let sql = `SELECT ${SAFE_COLS} FROM users WHERE role = 'LIBRARIAN'`
  const params = []
  if (search) {
    sql += ` AND (name LIKE ? OR username LIKE ? OR email LIKE ? OR phone LIKE ? OR lib_id LIKE ?)`
    const q = `%${search}%`
    params.push(q, q, q, q, q)
  }
  if (status && status !== 'All Status') { sql += ` AND status = ?`; params.push(status) }
  sql += ` ORDER BY id DESC`
  res.json(db.prepare(sql).all(...params))
})

/* GET /api/users/:id */
router.get('/:id', requireAuth, requireAdmin, (req, res) => {
  const u = db.prepare(`SELECT ${SAFE_COLS} FROM users WHERE id = ? OR lib_id = ?`).get(req.params.id, req.params.id)
  if (!u) return res.status(404).json({ error: 'User not found' })
  res.json(u)
})

/* POST /api/users — create librarian */
router.post('/', requireAuth, requireAdmin, (req, res) => {
  const { name, username, email, phone, password, role, shift } = req.body
  if (!name || !username || !email || !password)
    return res.status(400).json({ error: 'name, username, email and password are required' })
  if (password.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters' })

  const exists = db.prepare(`SELECT id FROM users WHERE username = ? OR email = ?`).get(username, email)
  if (exists) return res.status(409).json({ error: 'Username or email already exists' })

  const lib_id = nextLibId()
  const hash   = bcrypt.hashSync(password, 10)
  const result = db.prepare(
    `INSERT INTO users (lib_id, name, username, email, phone, password, role, shift)
     VALUES (?,?,?,?,?,?,?,?)`
  ).run(lib_id, name.trim(), username.trim(), email.trim(), phone || '', hash, role || 'LIBRARIAN', shift || 'Morning')

  const user = db.prepare(`SELECT ${SAFE_COLS} FROM users WHERE id = ?`).get(result.lastInsertRowid)
  res.status(201).json(user)
})

/* PATCH /api/users/:id */
router.patch('/:id', requireAuth, requireAdmin, (req, res) => {
  const u = db.prepare(`SELECT * FROM users WHERE id = ? OR lib_id = ?`).get(req.params.id, req.params.id)
  if (!u) return res.status(404).json({ error: 'User not found' })

  const { name, username, email, phone, shift, role, status } = req.body
  db.prepare(
    `UPDATE users SET name=?, username=?, email=?, phone=?, shift=?, role=?, status=? WHERE id=?`
  ).run(
    name     ?? u.name,
    username ?? u.username,
    email    ?? u.email,
    phone    ?? u.phone,
    shift    ?? u.shift,
    role     ?? u.role,
    status   ?? u.status,
    u.id
  )
  res.json(db.prepare(`SELECT ${SAFE_COLS} FROM users WHERE id = ?`).get(u.id))
})

/* PATCH /api/users/:id/reset-password */
router.patch('/:id/reset-password', requireAuth, requireAdmin, (req, res) => {
  const { password } = req.body
  if (!password || password.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  const u = db.prepare(`SELECT id FROM users WHERE id = ? OR lib_id = ?`).get(req.params.id, req.params.id)
  if (!u) return res.status(404).json({ error: 'User not found' })
  db.prepare(`UPDATE users SET password = ? WHERE id = ?`).run(bcrypt.hashSync(password, 10), u.id)
  res.json({ message: 'Password reset successfully' })
})

/* PATCH /api/users/:id/toggle-status */
router.patch('/:id/toggle-status', requireAuth, requireAdmin, (req, res) => {
  const u = db.prepare(`SELECT id, status FROM users WHERE id = ? OR lib_id = ?`).get(req.params.id, req.params.id)
  if (!u) return res.status(404).json({ error: 'User not found' })
  const next = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  db.prepare(`UPDATE users SET status = ? WHERE id = ?`).run(next, u.id)
  res.json({ status: next })
})

/* DELETE /api/users/:id */
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  const u = db.prepare(`SELECT id FROM users WHERE id = ? OR lib_id = ?`).get(req.params.id, req.params.id)
  if (!u) return res.status(404).json({ error: 'User not found' })
  db.prepare(`DELETE FROM users WHERE id = ?`).run(u.id)
  res.json({ message: 'User deleted' })
})

module.exports = router
