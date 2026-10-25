import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import NotificationPanel from './NotificationPanel'
import ProfilePanel from './ProfilePanel'
import { api } from '../../api/client'
import './Navbar.css'

/* ─── Icons ─── */
const BellIcon    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const RefreshIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
const ChevronIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
const ClockIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>

const PAGE_TITLES = {
  '/dashboard':  'Dashboard',
  '/librarian':  'Librarian Dashboard',
  '/books':      'Books',
  '/members':    'Members',
  '/borrowings': 'Borrowings',
  '/returns':    'Returns',
  '/issue':      'Issue Book',
  '/fines':      'Fines',
  '/reports':    'Reports',
  '/librarians': 'Librarians',
  '/settings':   'Settings',
}

/* ─── Live clock hook ─── */
function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

/* ─── Format helpers ─── */
function fmtTime(d) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}
function fmtDate(d) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Navbar() {
  const location  = useLocation()
  const title     = PAGE_TITLES[location.pathname] || 'Dashboard'
  const stored    = sessionStorage.getItem('lms_user')
  const session   = stored ? JSON.parse(stored) : { name: 'Admin User', role: 'ADMIN', initials: 'AU' }

  const [showNotif,   setShowNotif]   = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const now = useClock()

  const loadOverdue = useCallback(() => {
    api.getBorrowings({ status: 'OVERDUE' })
      .then(rows => setUnreadCount(rows?.length || 0))
      .catch(() => setUnreadCount(0))
  }, [])

  useEffect(() => {
    loadOverdue()
  }, [loadOverdue, location.pathname])

  return (
    <header className="navbar">
      {/* ── Left: Page title + badge ── */}
      <div className="navbar-left">
        <h1 className="navbar-title">{title}</h1>
        {location.pathname === '/dashboard' && (
          <span className="navbar-badge">ADMIN TERMINAL</span>
        )}
        {location.pathname === '/librarian' && (
          <span className="navbar-badge navbar-badge--green">LIBRARIAN DESK</span>
        )}
      </div>

      {/* ── Center: Date & Time ── */}
      <div className="navbar-center">
        <div className="navbar-datetime">
          <span className="navbar-datetime-icon"><ClockIcon /></span>
          <div className="navbar-datetime-body">
            <span className="navbar-datetime-time">{fmtTime(now)}</span>
            <span className="navbar-datetime-sep">·</span>
            <span className="navbar-datetime-date">{fmtDate(now)}</span>
          </div>
        </div>
      </div>

      {/* ── Right: Actions + profile ── */}
      <div className="navbar-right">

        {/* DB Status */}
        <div className="navbar-sync">
          <span className="navbar-sync-dot" />
          <span className="navbar-sync-text">Live DB</span>
        </div>

        {/* Refresh */}
        <button
          className="navbar-icon-btn"
          title="Refresh view"
          onClick={() => window.location.reload()}
        >
          <RefreshIcon />
        </button>

        {/* Notifications */}
        <div className="navbar-notif-wrap">
          <button
            className={`navbar-icon-btn${showNotif ? ' navbar-icon-btn--active' : ''}`}
            title="Notifications"
            onClick={() => { setShowNotif(p => !p); setShowProfile(false) }}
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="navbar-notif-badge">{unreadCount}</span>
            )}
          </button>
          {showNotif && (
            <NotificationPanel onClose={() => setShowNotif(false)} />
          )}
        </div>

        {/* User Pill */}
        <div className="navbar-profile-wrap">
          <button
            className={`navbar-user-pill${showProfile ? ' navbar-user-pill--active' : ''}`}
            onClick={() => { setShowProfile(p => !p); setShowNotif(false) }}
            title="Profile & Settings"
          >
            <div className="navbar-user-avatar">
              {session.initials || session.name?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="navbar-user-info">
              <span className="navbar-user-name">{session.name || 'System Admin'}</span>
              <span className="navbar-user-role">{session.role || 'ADMIN'}</span>
            </div>
            <span className={`navbar-chevron${showProfile ? ' navbar-chevron--up' : ''}`}>
              <ChevronIcon />
            </span>
          </button>
          {showProfile && (
            <ProfilePanel session={session} onClose={() => setShowProfile(false)} />
          )}
        </div>

      </div>
    </header>
  )
}
