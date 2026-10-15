import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LibrarianDashboard.css'

/* ─── Icons ─── */
const PhoneIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.14 6.14l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const SearchIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const RefreshIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
const UserPlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
const BookOpenIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
const ReturnIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.89"/></svg>
const BooksIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const BellIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const ArrowDownIcon= () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
const SwapIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
const AlertIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const CheckIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const UserIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const DollarIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const ClockIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const XIcon        = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IssueIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
const ReportIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>

/* ─── Demo member data ─── */
const MEMBERS_DB = {
  '077 123 4567': {
    name: 'Kasun Perera', initials: 'KP', id: 'MEM-881',
    phone: '077 123 4567', dept: 'Faculty of Computing & Technology',
    type: 'Undergraduate', validity: '31 Dec 2026', status: 'ACTIVE',
    borrowed: 2, maxBorrow: 3, fine: 4.00,
    books: [
      { title: 'Discrete Mathematics & Its Applications', acc: 'ACC-88219', due: '22 Sep 2026', overdue: false },
      { title: 'Algorithm Design: Foundations Vol. II',   acc: 'ACC-74301', due: 'Yesterday',   overdue: true  },
    ],
  },
  '071 882 3891': {
    name: 'N.S. Fernando', initials: 'NF', id: 'MEM-112',
    phone: '071 882 3891', dept: 'Faculty of Engineering',
    type: 'Student', validity: '31 Dec 2026', status: 'ACTIVE',
    borrowed: 1, maxBorrow: 3, fine: 10.00,
    books: [
      { title: 'Engineering Mechanics: Statics', acc: 'ACC-33011', due: '08 Sep 2026', overdue: true },
    ],
  },
  '078 991 4455': {
    name: 'Sahan Alwis', initials: 'SA', id: 'MEM-404',
    phone: '078 991 4455', dept: 'Faculty of Science',
    type: 'Research Fellow', validity: '30 Jun 2027', status: 'ACTIVE',
    borrowed: 0, maxBorrow: 3, fine: 0,
    books: [],
  },
}

/* ─── Demo today's transactions ─── */
const TODAYS_ISSUES = [
  { patron: 'Kasun Perera',       memberId: 'MEM-881', type: 'Undergraduate',  book: 'Discrete Mathematics & Its Applications',    acc: 'ACC-88219', time: '10:42 AM', due: '22 Sep 2026' },
  { patron: 'Dilani Wickrama',    memberId: 'MEM-084', type: 'Research Fellow', book: 'Modern Operating Systems (4th Edition)',      acc: 'ACC-90412', time: '10:28 AM', due: '22 Sep 2026' },
  { patron: 'S. Rathnayake',      memberId: 'MEM-219', type: 'Undergraduate',  book: 'Introduction to Algorithms (CLRS)',           acc: 'ACC-31082', time: '09:55 AM', due: '22 Sep 2026' },
  { patron: 'Nethmi Jayawardene', memberId: 'MEM-512', type: 'Faculty Staff',  book: 'Artificial Intelligence: A Modern Approach', acc: 'ACC-11944', time: '09:12 AM', due: '22 Sep 2026' },
  { patron: 'H.M. Farook',        memberId: 'MEM-217', type: 'Student',        book: 'The C Programming Language',                  acc: 'ACC-22010', time: '08:50 AM', due: '22 Sep 2026' },
]

const TODAYS_RETURNS = [
  { patron: 'Dilani Wickrama', memberId: 'MEM-084', book: 'Calculus: Early Transcendentals',        acc: 'ACC-44201', time: '11:14 AM', fine: 0    },
  { patron: 'A.G. Perera',     memberId: 'MEM-331', book: 'Database System Concepts',               acc: 'ACC-55012', time: '10:50 AM', fine: 0    },
  { patron: 'K.M. Bandara',    memberId: 'MEM-391', book: 'Data Structures in C++ (2nd Ed)',        acc: 'ACC-62841', time: '10:33 AM', fine: 14   },
  { patron: 'Fathima Rizna',   memberId: 'MEM-405', book: 'Microelectronic Circuits',               acc: 'ACC-77103', time: '09:40 AM', fine: 0    },
]

const OVERDUE = [
  { name: 'K.M. Bandara',    phone: '077 123 4567', id: 'MEM-391', days: 14, fine: 14.00, book: 'Data Structures in C++ (2nd Ed)'  },
  { name: 'N.S. Fernando',   phone: '071 882 3891', id: 'MEM-112', days: 10, fine: 10.00, book: 'Engineering Mechanics: Statics'    },
  { name: 'Sahan Alwis',     phone: '078 991 4455', id: 'MEM-404', days: 7,  fine: 7.00,  book: 'Digital Signal Processing...'     },
  { name: 'M.A. Perera',     phone: '076 543 2198', id: 'MEM-302', days: 5,  fine: 5.00,  book: 'Clinical Pharmacology 6th Ed'     },
]

export default function LibrarianDashboard() {
  const navigate = useNavigate()

  /* Member lookup */
  const [query,       setQuery]      = useState('')
  const [member,      setMember]     = useState(null)
  const [notFound,    setNotFound]   = useState(false)
  const [activeTab,   setActiveTab]  = useState('issues')
  const [overdueList, setOverdue]    = useState(OVERDUE)
  const [toast,       setToast]      = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }

  /* ── Member search ── */
  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    const found = MEMBERS_DB[q] || Object.values(MEMBERS_DB).find(m => m.id.toLowerCase() === q.toLowerCase())
    if (found) { setMember(found); setNotFound(false) }
    else       { setMember(null);  setNotFound(true)  }
  }

  const clearSearch = () => { setQuery(''); setMember(null); setNotFound(false) }

  /* ── Overdue actions ── */
  const handleSms  = (name) => showToast(`SMS reminder sent to ${name}`)
  const handleCollect = (id) => {
    setOverdue(prev => prev.filter(o => o.id !== id))
    showToast('Fine collected & book returned')
  }

  /* ── Session info ── */
  const session   = (() => { try { return JSON.parse(sessionStorage.getItem('lms_user')) || {} } catch { return {} } })()
  const libName   = session.name || 'Librarian'
  const now       = new Date()
  const timeStr   = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const dateStr   = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  const fineRate  = (() => { try { return JSON.parse(localStorage.getItem('lms_fines'))?.finePerDay || '1.00' } catch { return '1.00' } })()

  const KPI = [
    { label: "Today's Issues",     value: TODAYS_ISSUES.length,  sub: '+2 this hour',       icon: <ArrowDownIcon />, color: 'blue'   },
    { label: "Today's Returns",    value: TODAYS_RETURNS.length, sub: 'Restocked & sorted', icon: <ReturnIcon />,    color: 'green'  },
    { label: 'Active Circulation', value: '625',                 sub: 'Total on loan',      icon: <SwapIcon />,      color: 'indigo' },
    { label: 'Overdue Books',      value: overdueList.length,    sub: 'Pending returns',    icon: <AlertIcon />,     color: 'red'    },
    { label: "Fine Rate",          value: `Rs. ${fineRate}`,     sub: 'per overdue day',    icon: <DollarIcon />,    color: 'amber'  },
    { label: "Today's Fines",      value: 'Rs. 450',             sub: 'Collected today',    icon: <ClockIcon />,     color: 'teal'   },
  ]

  return (
    <div className="ld">

      {/* ── Toast ── */}
      {toast && (
        <div className={`ld-toast ld-toast--${toast.type}`}>
          <CheckIcon /> {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="ld-header">
        <div className="ld-header-left">
          <div className="ld-header-title-row">
            <h2 className="ld-header-title">Librarian Desk</h2>
            <span className="ld-desk-badge">● Desk 01 · Active Session</span>
          </div>
          <p className="ld-header-sub">
            Welcome, <strong>{libName}</strong> &nbsp;·&nbsp; {dateStr} &nbsp;·&nbsp; {timeStr}
          </p>
        </div>
        <div className="ld-header-actions">
          <button className="ld-btn ld-btn--outline" onClick={() => navigate('/members')}>
            <UserPlusIcon /> Register Member
          </button>
          <button className="ld-btn ld-btn--outline" onClick={() => navigate('/books')}>
            <BooksIcon /> Catalog
          </button>
          <button className="ld-btn ld-btn--primary" onClick={() => navigate('/issue')}>
            <BookOpenIcon /> Issue Book
          </button>
          <button className="ld-btn ld-btn--success" onClick={() => navigate('/returns')}>
            <ReturnIcon /> Return Book
          </button>
          <button className="ld-btn ld-btn--ghost" onClick={() => navigate('/reports')}>
            <ReportIcon /> Reports
          </button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="ld-kpi-row">
        {KPI.map((k, i) => (
          <div key={i} className={`ld-kpi ld-kpi--${k.color}`}>
            <div className="ld-kpi-top">
              <span className="ld-kpi-label">{k.label}</span>
              <span className={`ld-kpi-icon-box ld-kpi-icon-box--${k.color}`}>{k.icon}</span>
            </div>
            <div className="ld-kpi-value">{k.value}</div>
            <div className="ld-kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="ld-main-grid">

        {/* ── LEFT: Member Lookup ── */}
        <div className="ld-left-col">

          {/* Find Member Card */}
          <div className="ld-find-card">
            <div className="ld-find-header">
              <div>
                <div className="ld-find-title">Find Member</div>
                <div className="ld-find-sub">Lookup by phone number or Member ID</div>
              </div>
              <span className="ld-rfid-badge">● RFID Ready</span>
            </div>

            <form onSubmit={handleSearch}>
              <label className="ld-input-label">PHONE NUMBER OR MEMBER ID</label>
              <div className="ld-phone-row">
                <span className="ld-phone-ico"><PhoneIcon /></span>
                <input
                  className="ld-phone-input"
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="077 123 4567 or MEM-881"
                  autoComplete="off"
                />
                {query && (
                  <button type="button" className="ld-clear-ico" onClick={clearSearch}><XIcon /></button>
                )}
              </div>
              <div className="ld-phone-hint">
                Try: <strong>077 123 4567</strong> · <strong>071 882 3891</strong> · <strong>078 991 4455</strong>
              </div>
              <div className="ld-search-row">
                <button type="submit" className="ld-search-btn"><SearchIcon /> Search Member</button>
                <button type="button" className="ld-refresh-btn" onClick={clearSearch}><RefreshIcon /></button>
              </div>
            </form>

            {/* Quick switch */}
            <div className="ld-quick-label">QUICK COUNTER SWITCH</div>
            <div className="ld-quick-list">
              {Object.values(MEMBERS_DB).map(m => (
                <button
                  key={m.id}
                  className="ld-quick-btn"
                  onClick={() => { setQuery(m.phone); setMember(m); setNotFound(false) }}
                >
                  {m.initials} · {m.id}
                </button>
              ))}
            </div>
          </div>

          {/* Member Result */}
          {notFound && !member && (
            <div className="ld-member-card ld-member-empty">
              <div className="ld-empty-icon"><UserIcon /></div>
              <div className="ld-empty-title">Member Not Found</div>
              <div className="ld-empty-sub">No member found for "<strong>{query}</strong>"</div>
              <button className="ld-act-btn ld-act-btn--primary" onClick={() => navigate('/members')}>
                <UserPlusIcon /> Register New Member
              </button>
            </div>
          )}

          {member && (
            <div className="ld-member-card">
              {/* Member top */}
              <div className="ld-member-top">
                <div className="ld-member-avatar">{member.initials}</div>
                <div className="ld-member-info">
                  <div className="ld-member-name-row">
                    <span className="ld-member-name">{member.name}</span>
                    <span className="ld-member-id">{member.id}</span>
                    <span className={`ld-status-pill ld-status-pill--${member.status === 'ACTIVE' ? 'green' : 'red'}`}>
                      {member.status}
                    </span>
                  </div>
                  <div className="ld-member-meta">
                    <span>{member.phone}</span>
                    <span>·</span>
                    <span>{member.type}</span>
                    <span>·</span>
                    <span>{member.dept}</span>
                  </div>
                  <div className="ld-member-validity">
                    Membership valid until: <strong>{member.validity}</strong>
                  </div>
                </div>
              </div>

              {/* Member stats */}
              <div className="ld-member-stats">
                <div className="ld-mstat">
                  <div className="ld-mstat-label">Borrowings</div>
                  <div className="ld-mstat-val">{member.borrowed} / {member.maxBorrow} books</div>
                  <div className="ld-mstat-bar">
                    <div className="ld-mstat-fill" style={{ width: `${(member.borrowed / member.maxBorrow) * 100}%` }} />
                  </div>
                </div>
                <div className={`ld-mstat${member.fine > 0 ? ' ld-mstat--warn' : ''}`}>
                  <div className="ld-mstat-label">Outstanding Fine</div>
                  <div className={`ld-mstat-fine${member.fine > 0 ? ' ld-mstat-fine--red' : ''}`}>
                    Rs. {member.fine.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Books in possession */}
              {member.books.length > 0 && (
                <>
                  <div className="ld-possession-label">
                    Currently in Possession ({member.books.length})
                  </div>
                  <div className="ld-books-row">
                    {member.books.map((b, i) => (
                      <div key={i} className={`ld-book-chip${b.overdue ? ' ld-book-chip--overdue' : ''}`}>
                        <div className="ld-book-chip-title">{b.title}</div>
                        <div className="ld-book-chip-meta">{b.acc} · Due: {b.due}</div>
                        {b.overdue && <span className="ld-overdue-tag">Overdue</span>}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {member.books.length === 0 && (
                <div className="ld-no-books">No books currently borrowed</div>
              )}

              {/* Member actions */}
              <div className="ld-member-actions">
                <button
                  className="ld-act-btn ld-act-btn--primary"
                  onClick={() => navigate('/issue')}
                  disabled={member.borrowed >= member.maxBorrow}
                >
                  <IssueIcon /> Issue Book
                  {member.borrowed >= member.maxBorrow && <span className="ld-act-tag">Limit Reached</span>}
                </button>
                <button
                  className="ld-act-btn ld-act-btn--success"
                  onClick={() => navigate('/returns')}
                  disabled={member.books.length === 0}
                >
                  <CheckIcon /> Process Return
                </button>
                <button className="ld-act-btn ld-act-btn--outline" onClick={() => navigate('/members')}>
                  <UserIcon /> View Profile
                </button>
                <button className="ld-act-btn ld-act-btn--ghost" onClick={clearSearch}>
                  <XIcon /> Clear
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── RIGHT: Transactions + Overdue ── */}
        <div className="ld-right-col">

          {/* Transactions Table */}
          <div className="ld-tx-card">
            <div className="ld-tx-header">
              <div className="ld-tx-tabs">
                <button
                  className={`ld-tx-tab${activeTab === 'issues' ? ' active' : ''}`}
                  onClick={() => setActiveTab('issues')}
                >
                  <ArrowDownIcon /> Today's Issues
                  <span className="ld-tx-count">{TODAYS_ISSUES.length}</span>
                </button>
                <button
                  className={`ld-tx-tab${activeTab === 'returns' ? ' active' : ''}`}
                  onClick={() => setActiveTab('returns')}
                >
                  <ReturnIcon /> Today's Returns
                  <span className="ld-tx-count">{TODAYS_RETURNS.length}</span>
                </button>
              </div>
              <button className="ld-tool-btn" onClick={() => navigate('/reports')}>
                <ReportIcon /> Full Log
              </button>
            </div>

            <table className="ld-table">
              <thead>
                <tr>
                  <th>PATRON / ID</th>
                  <th>BOOK TITLE</th>
                  <th>TIME</th>
                  <th>{activeTab === 'issues' ? 'DUE DATE' : 'FINE'}</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'issues' ? TODAYS_ISSUES : TODAYS_RETURNS).map((r, i) => (
                  <tr key={i}>
                    <td>
                      <div className="ld-table-name">{r.patron}</div>
                      <div className="ld-table-sub">{r.memberId} · {r.type}</div>
                    </td>
                    <td>
                      <div className="ld-table-book">{r.book}</div>
                      <div className="ld-table-acc">{r.acc}</div>
                    </td>
                    <td className="ld-table-time">{r.time}</td>
                    <td>
                      {activeTab === 'issues' ? (
                        <span className="ld-due-tag">{r.due}</span>
                      ) : (
                        <span className={r.fine > 0 ? 'ld-fine-red' : 'ld-fine-ok'}>
                          Rs. {r.fine}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ld-table-footer">
              <span>● Real-time sync active</span>
              <span>Last transaction: 2 mins ago</span>
            </div>
          </div>

          {/* Overdue & Fines Panel */}
          <div className="ld-overdue-card">
            <div className="ld-overdue-header">
              <div>
                <span className="ld-overdue-title"><AlertIcon /> Overdue &amp; Fines</span>
                <p className="ld-overdue-sub">Priority counter collection · Rs. {fineRate}/day</p>
              </div>
              <div className="ld-overdue-header-right">
                <span className="ld-overdue-count">{overdueList.length} Pending</span>
                <button
                  className="ld-batch-btn"
                  onClick={() => showToast(`SMS batch sent to ${overdueList.length} patrons`)}
                >
                  <BellIcon /> Batch SMS
                </button>
              </div>
            </div>

            <div className="ld-overdue-list">
              {overdueList.length === 0 ? (
                <div className="ld-overdue-empty">✓ No overdue borrowings — great work!</div>
              ) : overdueList.map((o, i) => (
                <div key={i} className="ld-overdue-item">
                  <div className="ld-overdue-top-row">
                    <div>
                      <div className="ld-overdue-name">{o.name}</div>
                      <div className="ld-overdue-meta">{o.phone} · {o.id}</div>
                    </div>
                    <span className={`ld-days-badge${o.days >= 14 ? ' ld-days-badge--red' : o.days >= 10 ? ' ld-days-badge--orange' : ' ld-days-badge--yellow'}`}>
                      {o.days}d Late
                    </span>
                  </div>
                  <div className="ld-overdue-book">{o.book}</div>
                  <div className="ld-overdue-fine-row">
                    <span className="ld-fine-amount">Rs. {o.fine.toFixed(2)} due</span>
                    <div className="ld-overdue-btns">
                      <button className="ld-sms-btn"     onClick={() => handleSms(o.name)}>
                        <BellIcon /> SMS
                      </button>
                      <button className="ld-collect-btn" onClick={() => navigate('/fines')}>
                        <DollarIcon /> Collect Fine
                      </button>
                      <button className="ld-return-btn"  onClick={() => handleCollect(o.id)}>
                        <CheckIcon /> Mark Returned
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ld-overdue-footer">
              <span>Fine rate: Rs. {fineRate} / calendar day</span>
              <button className="ld-fines-link" onClick={() => navigate('/fines')}>
                View All Fines →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
