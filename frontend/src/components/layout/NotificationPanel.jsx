import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BORROWINGS, MEMBERS, BOOKS, FINE_PAYMENTS, formatDate } from '../../data/libraryData'
import './NotificationPanel.css'

/* ─── Build notifications from live data ─── */
function buildNotifications() {
  const notifs = []

  BORROWINGS.forEach(b => {
    const member = MEMBERS[b.memberId]?.name || b.memberId
    const book   = BOOKS[b.accNo]?.title     || b.accNo

    if (b.status === 'OVERDUE') {
      notifs.push({
        id:      `notif-overdue-${b.id}`,
        type:    'overdue',
        title:   'Overdue Book',
        message: `${member} — "${book}"`,
        detail:  `${b.overdueDays} days overdue · Fine: Rs. ${b.fine}.00`,
        time:    formatDate(b.dueDate),
        route:   '/borrowings',
        read:    false,
      })
    }

    if (b.fine > 0) {
      const pmt = FINE_PAYMENTS[b.id]
      if (pmt && pmt.status === 'UNPAID') {
        notifs.push({
          id:      `notif-fine-${b.id}`,
          type:    'fine',
          title:   'Unpaid Fine',
          message: `${member} owes Rs. ${b.fine}.00`,
          detail:  `${b.id} · Book: "${book}"`,
          time:    formatDate(b.dueDate),
          route:   '/fines',
          read:    false,
        })
      }
    }

    if (b.status === 'BORROWED') {
      notifs.push({
        id:      `notif-borrowed-${b.id}`,
        type:    'borrowed',
        title:   'Active Borrowing',
        message: `${member} — "${book}"`,
        detail:  `Due: ${formatDate(b.dueDate)}`,
        time:    formatDate(b.issuedDate),
        route:   '/borrowings',
        read:    true,
      })
    }
  })

  // sort: unread first, then by id desc
  return notifs.sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1
    return b.id.localeCompare(a.id)
  })
}

const ICONS = {
  overdue:  { emoji: '⏰', color: 'red'   },
  fine:     { emoji: '💰', color: 'amber' },
  borrowed: { emoji: '📚', color: 'blue'  },
}

export default function NotificationPanel({ onClose }) {
  const panelRef = useRef(null)
  const navigate = useNavigate()
  const notifications = buildNotifications()
  const unread = notifications.filter(n => !n.read).length

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
        {notifications.length === 0 ? (
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
