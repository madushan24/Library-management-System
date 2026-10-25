require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const authRoutes       = require('./src/routes/auth')
const booksRoutes      = require('./src/routes/books')
const membersRoutes    = require('./src/routes/members')
const borrowingsRoutes = require('./src/routes/borrowings')
const finesRoutes      = require('./src/routes/fines')
const usersRoutes      = require('./src/routes/users')
const reportsRoutes    = require('./src/routes/reports')
const settingsRoutes   = require('./src/routes/settings')

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

/* ── Routes ── */
app.use('/api/auth',       authRoutes)
app.use('/api/books',      booksRoutes)
app.use('/api/members',    membersRoutes)
app.use('/api/borrowings', borrowingsRoutes)
app.use('/api/fines',      finesRoutes)
app.use('/api/users',      usersRoutes)
app.use('/api/reports',    reportsRoutes)
app.use('/api/settings',   settingsRoutes)

/* ── Health ── */
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

/* ── Global error handler ── */
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`LMS API running on http://localhost:${PORT}`))
