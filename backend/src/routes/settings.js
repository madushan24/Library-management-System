const router = require('express').Router()
const db     = require('../db')
const { requireAuth, requireAdmin } = require('../middleware/auth')

/* GET /api/settings */
router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare(`SELECT key, value FROM settings`).all()
  const result = {}
  rows.forEach(r => {
    try { result[r.key] = JSON.parse(r.value) } catch { result[r.key] = r.value }
  })
  res.json(result)
})

/* PUT /api/settings */
router.put('/', requireAuth, requireAdmin, (req, res) => {
  const upsert = db.prepare(`INSERT INTO settings (key, value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`)
  const trx = db.transaction(() => {
    for (const [key, value] of Object.entries(req.body)) {
      upsert.run(key, JSON.stringify(value))
    }
  })
  trx()
  res.json({ message: 'Settings saved' })
})

module.exports = router
