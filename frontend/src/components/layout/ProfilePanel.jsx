import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProfilePanel.css'

const ROLE_LABELS = {
  ADMIN:     { label: 'Administrator', color: 'blue'  },
  LIBRARIAN: { label: 'Librarian',     color: 'green' },
}

const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)
const LogOutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

export default function ProfilePanel({ session: sessionProp, onClose }) {
  const panelRef = useRef(null)
  const navigate = useNavigate()

  /* fallback: read from sessionStorage if no prop passed */
  const session = sessionProp || (() => {
    try { return JSON.parse(sessionStorage.getItem('lms_user') || '{}') } catch { return {} }
  })()

  const initials = session.initials || session.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'AD'
  const roleInfo = ROLE_LABELS[session.role] || { label: session.role || 'Staff', color: 'blue' }

  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  function handleLogout() {
    sessionStorage.removeItem('lms_user')
    onClose()
    navigate('/login')
  }

  function handleSettings() {
    onClose()
    navigate('/settings#profile')
  }

  return (
    <div className="pp-panel" ref={panelRef}>
      {/* Avatar + name */}
      <div className="pp-identity">
        <div className="pp-avatar">{initials}</div>
        <div className="pp-info">
          <div className="pp-name">{session.name || 'User'}</div>
          <span className={`pp-role pp-role--${roleInfo.color}`}>{roleInfo.label}</span>
        </div>
      </div>

      {/* Details */}
      <div className="pp-details">
        <div className="pp-row">
          <span className="pp-row-label">Username</span>
          <span className="pp-row-val">{session.username || session.name?.split(' ')[0]?.toLowerCase() || '—'}</span>
        </div>
        <div className="pp-row">
          <span className="pp-row-label">Role</span>
          <span className="pp-row-val">{roleInfo.label}</span>
        </div>
        <div className="pp-row">
          <span className="pp-row-label">Session</span>
          <span className="pp-row-val pp-row-val--green">Active</span>
        </div>
      </div>

      <div className="pp-divider" />

      {/* Actions */}
      <div className="pp-actions">
        <button className="pp-action-btn" onClick={handleSettings}>
          <SettingsIcon /> Settings
        </button>
        <button className="pp-action-btn pp-action-btn--logout" onClick={handleLogout}>
          <LogOutIcon /> Sign Out
        </button>
      </div>
    </div>
  )
}
