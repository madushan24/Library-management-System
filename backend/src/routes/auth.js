const router  = require('express').Router()
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const db      = require('../db')
const { requireAuth } = require('../middleware/auth')

/* POST /api/auth/login */
router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' })

  const user = db.prepare(
    `SELECT * FROM users WHERE (username = ? OR email = ?) AND status = 'ACTIVE'`
  ).get(username, username)

  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid credentials' })

  /* Update last_login */
  db.prepare(`UPDATE users SET last_login = datetime('now') WHERE id = ?`).run(user.id)

  const payload = { id: user.id, lib_id: user.lib_id, name: user.name, username: user.username, role: user.role }
  const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' })

  res.json({
    token,
    user: {
      id:       user.id,
      lib_id:   user.lib_id,
      name:     user.name,
      username: user.username,
      email:    user.email,
      role:     user.role,
      initials: user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
    }
  })
})

/* GET /api/auth/me */
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare(`SELECT id, lib_id, name, username, email, phone, role, shift, status, joined_date, last_login FROM users WHERE id = ?`).get(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

/* PATCH /api/auth/profile */
router.patch('/profile', requireAuth, (req, res) => {
  const { name, username, password } = req.body
  const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  let newHash = user.password
  if (password) {
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
    newHash = bcrypt.hashSync(password, 10)
  }

  db.prepare(`UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?`)
    .run(name || user.name, username || user.username, newHash, user.id)

  res.json({ message: 'Profile updated' })
})

module.exports = router
