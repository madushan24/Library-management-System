import { NavLink, useNavigate } from 'react-router-dom'
import './Sidebar.css'

const BookIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const GridIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
const UsersIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const ArrowDownIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
const ArrowUpIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 7 12 3 16 7"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
const DollarIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const BarChartIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const UserCheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
const SettingsIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
const LogoutIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>

// Shared nav items (both roles)
const SHARED_NAV = [
  {
    group: 'LIBRARY',
    items: [
      { to: '/books',   label: 'Books',   icon: <BookIcon />  },
      { to: '/members', label: 'Members', icon: <UsersIcon /> },
    ]
  },
  {
    group: 'TRANSACTIONS',
    items: [
      { to: '/issue',      label: 'Issue Book', icon: <ArrowDownIcon /> },
      { to: '/borrowings', label: 'Borrowings', icon: <ArrowDownIcon /> },
      { to: '/returns',    label: 'Returns',    icon: <ArrowUpIcon />   },
    ]
  },
  {
    group: 'FINANCE',
    items: [
      { to: '/fines',   label: 'Fines',   icon: <DollarIcon />   },
      { to: '/reports', label: 'Reports', icon: <BarChartIcon /> },
    ]
  },
]

// Admin-only nav
const ADMIN_NAV = [
  {
    group: 'ADMINISTRATION',
    items: [
      { to: '/librarians', label: 'Librarians', icon: <UserCheckIcon /> },
      { to: '/settings',   label: 'Settings',   icon: <SettingsIcon />  },
    ]
  },
]

export default function Sidebar() {
  const navigate = useNavigate()

  // Read role from session
  const stored  = sessionStorage.getItem('lms_user')
  const session = stored ? JSON.parse(stored) : { role: 'ADMIN' }
  const isAdmin = session.role === 'ADMIN'

  // Dashboard link points to role-appropriate page
  const dashTo    = isAdmin ? '/dashboard' : '/librarian'
  const dashLabel = isAdmin ? 'Dashboard'  : 'Dashboard'

  const handleLogout = () => {
    sessionStorage.removeItem('lms_user')
    navigate('/login')
  }

  const allNav = [
    { group: null, items: [{ to: dashTo, label: dashLabel, icon: <GridIcon /> }] },
    ...SHARED_NAV,
    ...(isAdmin ? ADMIN_NAV : []),
  ]

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon"><BookIcon /></div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-title">LIBRARY</span>
          <span className="sidebar-brand-sub">MANAGEMENT</span>
        </div>
        <div className="sidebar-brand-badge">
          {isAdmin ? 'Admin Portal' : 'Librarian Portal'}
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {allNav.map((section, i) => (
          <div key={i} className="sidebar-section">
            {section.group && <span className="sidebar-group-label">{section.group}</span>}
            {section.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogoutIcon />
          <span>Logout</span>
        </button>
        <div className="sidebar-status">
          <span className="sidebar-dot" />
          <span>Online</span>
          <span className="sidebar-version">v4.2 LTS</span>
        </div>
      </div>
    </aside>
  )
}
