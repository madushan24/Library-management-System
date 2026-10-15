import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import NotificationPanel from './NotificationPanel'
import ProfilePanel from './ProfilePanel'
import { BORROWINGS, FINE_PAYMENTS } from '../../data/libraryData'
import './Navbar.css'

const SearchIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const BellIcon    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const RefreshIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>

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

/* count real unread: overdue + unpaid fines */
function getUnreadCount() {
  const overdue = BORROWINGS.filter(b => b.status === 'OVERDUE').length
  const unpaidFines = BORROWINGS.filter(b => b.fine > 0 && FINE_PAYMENTS[b.id]?.status === 'UNPAID').length
  return overdue + unpaidFines
}

export default function Navbar() {
  const location  = useLocation()
  const title     = PAGE_TITLES[location.pathname] || 'Dashboard'
  const stored    = sessionStorage.getItem('lms_user')
  const session   = stored ? JSON.parse(stored) : { name: 'Admin User', role: 'ADMIN', initials: 'AU' }
  const [showNotif,   setShowNotif]   = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const unreadCount = getUnreadCount()

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">{title}</h1>
        {location.pathname === '/dashboard' && (
          <span className="navbar-badge">ADMIN TERMINAL</span>
        )}
        {location.pathname === '/librarian' && (
          <span className="navbar-badge navbar-badge--green">LIBRARIAN DESK</span>
        )}
      </div>

      <div className="navbar-center">
        <div className="navbar-search">
          <SearchIcon />
          <input type="text" placeholder="Search catalog, ISBN, patron ID or shelfmark..." />
          <span className="navbar-search-kbd">Ctrl+K</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-notif-wrap">
          <button
            className={`navbar-icon-btn${showNotif ? ' navbar-icon-btn--active' : ''}`}
            onClick={() => { setShowNotif(v => !v); setShowProfile(false) }}
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="navbar-badge-dot">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
          {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
        </div>
        <button className="navbar-icon-btn">
          <RefreshIcon />
        </button>
        <div className="navbar-user-wrap">
          <div
            className={`navbar-user${showProfile ? ' navbar-user--active' : ''}`}
            onClick={() => { setShowProfile(v => !v); setShowNotif(false) }}
          >
            <div className="navbar-user-info">
              <span className="navbar-user-name">{session.name}</span>
              <span className="navbar-user-role">{session.role}</span>
            </div>
            <div className="navbar-avatar">{session.initials}</div>
          </div>
          {showProfile && (
            <ProfilePanel session={session} onClose={() => setShowProfile(false)} />
          )}
        </div>
      </div>
    </header>
  )
}
