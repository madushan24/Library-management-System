import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import './NotificationPanel.css'

function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return y && m && d ? `${d}/${m}/${y}` : iso
}

const ICONS = {
  overdue:  { emoji: '⏰', color: 'red'   },
  fine:     { emoji: '💰', color: 'amber' },
  borrowed: { emoji: '📚', color: 'blue'  },
}

export default function NotificationPanel({ onClose }) {
  const panelRef = useRef(null)
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  /* close on outside click */
  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  /* fetch notifications from live backend */
  useEffect(() => {
    let active = true

    async function fetchNotifications() {
      try {
        const [borrows, fines] = await Promise.all([
          api.getBorrowings().catch(() => []),
          api.getFines().catch(() => [])
        ])

        if (!active) return

        const notifs = []

        // Overdue borrowings
        borrows.filter(b => b.status === 'OVERDUE').forEach(b => {
          notifs.push({
            id:      `notif-overdue-${b.id}`,
            type:    'overdue',
            title:   'Overdue Book',
            message: `${b.member_name || 'Member'} — "${b.book_title || 'Book'}"`,
            detail:  `${b.overdue_days || 0} days overdue · Fine: Rs. ${b.fine || 0}.00`,
            time:    formatDate(b.due_date),
            route:   '/borrowings',
            read:    false,
          })
        })

        // Unpaid fines
        fines.filter(f => f.status === 'UNPAID').forEach(f => {
          notifs.push({
            id:      `notif-fine-${f.id}`,
            type:    'fine',
            title:   'Unpaid Fine',
            message: `${f.member_name || 'Member'} owes Rs. ${f.amount || 0}.00`,
            detail:  `${f.borrow_id || 'Loan'} · Book: "${f.book_title || 'Book'}"`,
            time:    formatDate(f.due_date || f.returned_date),
            route:   '/fines',
            read:    false,
          })
        })

        // Active borrowings
        borrows.filter(b => b.status === 'BORROWED').slice(0, 10).forEach(b => {
          notifs.push({
            id:      `notif-borrowed-${b.id}`,
            type:    'borrowed',
            title:   'Active Borrowing',
            message: `${b.member_name || 'Member'} — "${b.book_title || 'Book'}"`,
            detail:  `Due: ${formatDate(b.due_date)}`,
            time:    formatDate(b.borrow_date),
            route:   '/borrowings',
            read:    true,
          })
        })

        // sort: unread first, then by id desc
        notifs.sort((a, b) => {
          if (a.read !== b.read) return a.read ? 1 : -1
          return b.id.localeCompare(a.id)
        })

        setNotifications(notifs)
      } catch (err) {
        console.error('Failed to load notifications:', err)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchNotifications()
    return () => { active = false }
  }, [])

  const unread = notifications.filter(n => !n.read).length

  function handleItemClick(route) {
    onClose()
    navigate(route)
  }

  return (
    <div className="np-panel" ref={panelRef}>
      {/* Header */}
      <div className="np-header">
        <div className="np-header-left">
          <span className="np-title">Notifications</span>
          {unread > 0 && <span className="np-unread-badge">{unread} new</span>}
        </div>
        <button className="np-close" onClick={onClose}>✕</button>
      </div>

      {/* List */}
      <div className="np-list">
        {loading ? (
          <div className="np-empty">
            <div>Loading notifications...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="np-empty">
            <div className="np-empty-icon">🔔</div>
            <div>No notifications</div>
          </div>
        ) : (
          notifications.map(n => {
            const { emoji, color } = ICONS[n.type] || ICONS.borrowed
            return (
              <div
                key={n.id}
                className={`np-item${n.read ? ' np-item--read' : ''}`}
                onClick={() => handleItemClick(n.route)}
              >
                <div className={`np-item-icon np-item-icon--${color}`}>{emoji}</div>
                <div className="np-item-body">
                  <div className="np-item-top">
                    <span className="np-item-title">{n.title}</span>
                    <span className="np-item-time">{n.time}</span>
                  </div>
                  <div className="np-item-msg">{n.message}</div>
                  <div className="np-item-detail">{n.detail}</div>
                </div>
                {!n.read && <div className="np-dot" />}
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="np-footer">
        <span className="np-footer-text">{notifications.length} total notifications</span>
      </div>
    </div>
  )
}
