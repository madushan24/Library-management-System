import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import './LibrarianDashboard.css'

/* ─── Icons ─── */
const PhoneIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.14 6.14l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const SearchIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const RefreshIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
const UserPlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
const BookOpenIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
const ReturnIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.89"/></svg>
const BooksIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
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

export default function LibrarianDashboard() {
  const navigate = useNavigate()

  const [membersList, setMembersList] = useState([])
  const [borrowings, setBorrowings]   = useState([])
  const [fines, setFines]             = useState([])
  const [loading, setLoading]         = useState(true)

  /* Member lookup */
  const [query,       setQuery]      = useState('')
  const [member,      setMember]     = useState(null)
  const [memberLoans, setMemberLoans]= useState([])
  const [notFound,    setNotFound]   = useState(false)
  const [activeTab,   setActiveTab]  = useState('issues')
  const [toast,       setToast]      = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }

  const loadAll = useCallback(async () => {
    try {
      setLoading(true)
      const [mems, borrows, allFines] = await Promise.all([
        api.getMembers().catch(() => []),
        api.getBorrowings().catch(() => []),
        api.getFines().catch(() => [])
      ])
      setMembersList(mems)
      setBorrowings(borrows)
      setFines(allFines)
    } catch (err) {
      console.error('Failed to load desk data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  /* Member search */
  const handleSearch = async (e) => {
    e?.preventDefault()
    const q = query.trim().replace(/\s/g, '').toLowerCase()
    if (!q) return

    const found = membersList.find(m =>
      (m.phone && m.phone.replace(/\s/g, '').includes(q)) ||
      (m.mem_id && m.mem_id.toLowerCase().includes(q)) ||
      (m.name && m.name.toLowerCase().includes(q))
    )

    if (found) {
      setMember(found)
      setNotFound(false)
      // fetch member's live loans
      try {
        const full = await api.getMember(found.id)
        setMemberLoans(full.history?.filter(h => h.status === 'BORROWED' || h.status === 'OVERDUE') || [])
      } catch {
        setMemberLoans([])
      }
    } else {
      setMember(null)
      setMemberLoans([])
      setNotFound(true)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setMember(null)
    setMemberLoans([])
    setNotFound(false)
  }

  const handleSms = (name) => showToast(`SMS reminder queued for ${name}`)
  
  const handleCollect = async (borrowId) => {
    try {
      await api.payFine(borrowId, { method: 'Cash' })
      showToast('Fine payment collected successfully')
      await loadAll()
    } catch (err) {
      showToast(err.message || 'Failed to collect fine', 'error')
    }
  }

  /* Session info */
  const session   = (() => { try { return JSON.parse(sessionStorage.getItem('lms_user')) || {} } catch { return {} } })()
  const libName   = session.name || 'Librarian'
  const now       = new Date()
  const timeStr   = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const dateStr   = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  const todaysIssues = borrowings.filter(b => b.status === 'BORROWED' || b.status === 'OVERDUE')
  const todaysReturns = borrowings.filter(b => b.status === 'RETURNED')
  const overdueList   = borrowings.filter(b => b.status === 'OVERDUE')
  const totalFinesUnpaid = fines.filter(f => f.status === 'UNPAID').reduce((s, f) => s + (f.amount || 0), 0)

  const KPI = [
    { label: "Active Issues",      value: todaysIssues.length,  sub: 'Currently on loan',  icon: <ArrowDownIcon />, color: 'blue'   },
    { label: "Returned Books",     value: todaysReturns.length, sub: 'Restocked in catalog', icon: <ReturnIcon />,    color: 'green'  },
    { label: 'Active Patrons',     value: membersList.length,   sub: 'Registered members', icon: <SwapIcon />,      color: 'indigo' },
    { label: 'Overdue Books',      value: overdueList.length,   sub: 'Pending returns',    icon: <AlertIcon />,     color: 'red'    },
    { label: "Fine Rate",          value: 'Rs. 1.00',           sub: 'per overdue day',    icon: <DollarIcon />,    color: 'amber'  },
    { label: "Unpaid Fines",       value: `Rs. ${totalFinesUnpaid}`, sub: 'Due collection', icon: <ClockIcon />,     color: 'teal'   },
  ]

  return (
    <div className="ld">

      {/* Toast */}
      {toast && (
        <div className={`ld-toast ld-toast--${toast.type}`}>
          <CheckIcon /> {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="ld-header">
        <div className="ld-header-left">
          <div className="ld-header-title-row">
            <h2 className="ld-header-title">Librarian Desk</h2>
            <span className="ld-desk-badge">Desk 01 · Live SQLite Session</span>
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

      {/* KPI Row */}
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

      {/* Main Grid */}
      <div className="ld-main-grid">

        {/* LEFT: Member Lookup */}
        <div className="ld-left-col">

          {/* Find Member Card */}
          <div className="ld-find-card">
            <div className="ld-find-header">
              <div>
                <div className="ld-find-title">Find Member</div>
                <div className="ld-find-sub">Lookup by phone number, ID, or name</div>
              </div>
              <span className="ld-rfid-badge">Database Search</span>
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
                  placeholder="076 554 1122 or MEM-001"
                  autoComplete="off"
                />
                {query && (
                  <button type="button" className="ld-clear-ico" onClick={clearSearch}><XIcon /></button>
                )}
              </div>
              <div className="ld-phone-hint">
                Try: <strong>076 554 1122</strong> · <strong>071 882 3891</strong> · <strong>MEM-001</strong>
              </div>
              <div className="ld-search-row">
                <button type="submit" className="ld-search-btn"><SearchIcon /> Search Member</button>
                <button type="button" className="ld-refresh-btn" onClick={clearSearch}><RefreshIcon /></button>
              </div>
            </form>

            {/* Quick switch */}
            <div className="ld-quick-label">QUICK COUNTER SELECTION</div>
            <div className="ld-quick-list">
              {membersList.slice(0, 6).map(m => (
                <button
                  key={m.id}
                  className="ld-quick-btn"
                  onClick={() => { setQuery(m.phone); setMember(m); setNotFound(false) }}
                >
                  {m.name?.slice(0, 2).toUpperCase()} · {m.mem_id || m.id}
                </button>
              ))}
            </div>
          </div>

          {/* Member Card if found */}
          {member && (
            <div className="ld-member-card">
              <div className="ld-member-top">
                <div className="ld-avatar">{member.name?.slice(0, 2).toUpperCase()}</div>
                <div>
                  <div className="ld-member-name">{member.name}</div>
                  <div className="ld-member-meta">{member.mem_id || member.id} &bull; {member.affiliation || 'Member'}</div>
                </div>
                <span className="ld-status-pill">{member.status || 'ACTIVE'}</span>
              </div>
              <div className="ld-member-stats">
                <div className="ld-mstat">
                  <span className="ld-mstat-val">{member.borrowed || 0} / {member.max_books || 3}</span>
                  <span className="ld-mstat-lbl">Books Borrowed</span>
                </div>
                <div className="ld-mstat">
                  <span className="ld-mstat-val ld-fine">Rs. {Number(member.outstanding || 0).toFixed(2)}</span>
                  <span className="ld-mstat-lbl">Fines Due</span>
                </div>
              </div>
              <div className="ld-member-actions">
                <button className="ld-btn ld-btn--primary ld-btn--sm" onClick={() => navigate('/issue')}>
                  <IssueIcon /> Issue Book
                </button>
                <button className="ld-btn ld-btn--success ld-btn--sm" onClick={() => navigate('/returns')}>
                  <ReturnIcon /> Return Book
                </button>
              </div>
            </div>
          )}

          {notFound && (
            <div className="ld-notfound-card">
              <AlertIcon />
              <div>
                <strong>No member found for "{query}"</strong>
                <p>Verify phone number or register a new member profile.</p>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT: Tabs & Transactions */}
        <div className="ld-right-col">
          <div className="ld-desk-card">
            <div className="ld-desk-header">
              <div className="ld-tabs">
                <button
                  className={`ld-tab${activeTab === 'issues' ? ' active' : ''}`}
                  onClick={() => setActiveTab('issues')}
                >
                  Active Borrowings ({todaysIssues.length})
                </button>
                <button
                  className={`ld-tab${activeTab === 'returns' ? ' active' : ''}`}
                  onClick={() => setActiveTab('returns')}
                >
                  Return History ({todaysReturns.length})
                </button>
                <button
                  className={`ld-tab${activeTab === 'overdue' ? ' active' : ''}`}
                  onClick={() => setActiveTab('overdue')}
                >
                  Overdue Recall ({overdueList.length})
                </button>
              </div>
            </div>

            <div className="ld-desk-body">
              {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading records...</div>
              ) : activeTab === 'issues' ? (
                <div className="ld-tx-list">
                  {todaysIssues.map(b => (
                    <div key={b.id} className="ld-tx-item">
                      <div className="ld-tx-av"><BookOpenIcon /></div>
                      <div className="ld-tx-info">
                        <div className="ld-tx-book">{b.book_title}</div>
                        <div className="ld-tx-patron">{b.member_name} ({b.mem_id})</div>
                      </div>
                      <div className="ld-tx-due">
                        <span>Due: {b.due_date}</span>
                        <span className={`ld-badge ld-badge--${b.status.toLowerCase()}`}>{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeTab === 'returns' ? (
                <div className="ld-tx-list">
                  {todaysReturns.map(b => (
                    <div key={b.id} className="ld-tx-item">
                      <div className="ld-tx-av ld-tx-av--green"><ReturnIcon /></div>
                      <div className="ld-tx-info">
                        <div className="ld-tx-book">{b.book_title}</div>
                        <div className="ld-tx-patron">{b.member_name} ({b.mem_id})</div>
                      </div>
                      <div className="ld-tx-due">
                        <span>Returned: {b.returned_date || b.issued_date}</span>
                        <span className="ld-badge ld-badge--returned">{b.condition || 'Good'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ld-tx-list">
                  {overdueList.map(b => (
                    <div key={b.id} className="ld-tx-item ld-tx-item--overdue">
                      <div className="ld-tx-av ld-tx-av--red"><AlertIcon /></div>
                      <div className="ld-tx-info">
                        <div className="ld-tx-book">{b.book_title}</div>
                        <div className="ld-tx-patron">{b.member_name} ({b.mem_id})</div>
                      </div>
                      <div className="ld-tx-due">
                        <span style={{ color: '#ef4444', fontWeight: 600 }}>{b.overdue_days}d Overdue</span>
                        <span style={{ color: '#ef4444' }}>Rs. {b.fine}.00</span>
                      </div>
                      <div className="ld-tx-actions">
                        <button className="ld-tx-btn" onClick={() => handleSms(b.member_name)}>SMS</button>
                        <button className="ld-tx-btn ld-tx-btn--collect" onClick={() => handleCollect(b.borrow_id || b.id)}>Collect</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
