const path = require('path')
const fs   = require('fs')
const createSchema = require('./schema')

const DB_PATH = path.join(__dirname, '../../data/lms.db')

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

let db
try {
  // Try built-in Node 22+ SQLite (no native build tools or C++ compiler needed)
  const { DatabaseSync } = require('node:sqlite')
  db = new DatabaseSync(DB_PATH)
  
  // Provide transaction compatibility method matching better-sqlite3
  if (typeof db.transaction !== 'function') {
    db.transaction = function (fn) {
      return function (...args) {
        db.exec('BEGIN')
        try {
          const res = fn(...args)
          db.exec('COMMIT')
          return res
        } catch (err) {
          db.exec('ROLLBACK')
          throw err
        }
      }
    }
  }
} catch {
  // Fallback to better-sqlite3 if present
  const Database = require('better-sqlite3')
  db = new Database(DB_PATH)
}

createSchema(db)

module.exports = db
