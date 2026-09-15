import './MemberProfileModal.css'

// ── Mock borrow history per member ──────────────────────────
const HISTORY = {
  'MEM-001': [
    { id: 'BR-001', book: 'Discrete Mathematics & Its Applications', isbn: '978-0-07-352332-2', issued: '08/09/2026', due: '15/09/2026', returned: '-',         days: 0,  fine: 0,   status: 'BORROWED'  },
    { id: 'BR-002', book: 'Algorithm Design: Foundations Vol. II',    isbn: '978-0-13-143542-6', issued: '01/08/2026', due: '08/08/2026', returned: '06/08/2026', days: 0,  fine: 0,   status: 'RETURNED'  },
    { id: 'BR-003', book: 'Introduction to Algorithms (CLRS)',        isbn: '978-0-26-203384-8', issued: '10/07/2026', due: '17/07/2026', returned: '20/07/2026', days: 3,  fine: 3,   status: 'RETURNED'  },
  ],
  'MEM-112': [
    { id: 'BR-010', book: 'Engineering Mechanics: Statics',           isbn: '978-0-13-291554-9', issued: '01/09/2026', due: '08/09/2026', returned: '-',         days: 10, fine: 10,  status: 'OVERDUE'   },
    { id: 'BR-011', book: 'Fluid Mechanics',                          isbn: '978-0-07-338032-2', issued: '10/08/2026', due: '17/08/2026', returned: '15/08/2026', days: 0,  fine: 0,   status: 'RETURNED'  },
  ],
  'MEM-342': [
    { id: 'BR-020', book: 'Data Structures in C++ (2nd Ed)',          isbn: '978-0-13-315912-0', issued: '25/08/2026', due: '01/09/2026', returned: '-',         days: 14, fine: 14,  status: 'OVERDUE'   },
  ],
}

const STATUS_STYLE = {
  ACTIVE:    { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  INACTIVE:  { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
  SUSPENDED: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
}

const BORROW_STYLE = {
  BORROWED: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  RETURNED: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  OVERDUE:  { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
}

// ── Icons ────────────────────────────────────────────────────
const XIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const PhoneIcon= () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.14 6.14l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const MailIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const MapIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IdIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 3h-2a2 2 0 0 0-4 0H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/></svg>
const CalIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const BookIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const IssueBtn = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>

export default function MemberProfileModal({ member, onClose }) {
  if (!member) return null

  const history = HISTORY[member.id] || []
  const totalBorrowed = history.length
  const totalReturned = history.filter(h => h.status === 'RETURNED').length
  const totalOverdue  = history.filter(h => h.status === 'OVERDUE').length
  const totalFine     = history.reduce((s, h) => s + h.fine, 0)
  const st = STATUS_STYLE[member.status] || STATUS_STYLE.ACTIVE

  return (
    <div className="mpm-backdrop" onClick={onClose}>
      <div className="mpm-panel" onClick={e => e.stopPropagation()}>

        {/* ── Header bar ── */}
        <div className="mpm-header">
          <span className="mpm-header-title">Member Profile</span>
          <button className="mpm-close" onClick={onClose}><XIcon /></button>
        </div>

        <div className="mpm-body">

          {/* ── Profile card ── */}
          <div className="mpm-profile-card">
            <div className="mpm-avatar-wrap">
              <div className="mpm-avatar" style={{ background: member.color }}>
                {member.initials}
              </div>
              <span className="mpm-status-dot" style={{ background: st.color }} />
            </div>
            <div className="mpm-profile-info">
              <div className="mpm-name">{member.name}</div>
              <div className="mpm-affil">{member.affil}</div>
              <div className="mpm-badges-row">
                <span className="mpm-id-badge">{member.id}</span>
                <span className="mpm-status-badge" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.color, display: 'inline-block', marginRight: 5 }} />
                  {member.status}
                </span>
              </div>
            </div>
            <button className="mpm-issue-btn"><IssueBtn /> Issue Book</button>
          </div>

          {/* ── Contact details ── */}
          <div className="mpm-section-card">
            <div className="mpm-section-title">Contact &amp; Identity</div>
            <div className="mpm-details-grid">
              <div className="mpm-detail-item">
                <span className="mpm-detail-icon"><PhoneIcon /></span>
                <div>
                  <div className="mpm-detail-label">Phone</div>
                  <div className="mpm-detail-val">{member.phone}</div>
                </div>
              </div>
              <div className="mpm-detail-item">
                <span className="mpm-detail-icon"><MailIcon /></span>
                <div>
                  <div className="mpm-detail-label">Email</div>
                  <div className="mpm-detail-val">{member.email || '—'}</div>
                </div>
              </div>
              <div className="mpm-detail-item">
                <span className="mpm-detail-icon"><IdIcon /></span>
                <div>
                  <div className="mpm-detail-label">NIC / Student ID</div>
                  <div className="mpm-detail-val">{member.nic || '—'}</div>
                </div>
              </div>
              <div className="mpm-detail-item">
                <span className="mpm-detail-icon"><CalIcon /></span>
                <div>
                  <div className="mpm-detail-label">Registered</div>
                  <div className="mpm-detail-val">{member.registered}</div>
                </div>
              </div>
              <div className="mpm-detail-item">
                <span className="mpm-detail-icon"><MapIcon /></span>
                <div>
                  <div className="mpm-detail-label">City</div>
                  <div className="mpm-detail-val">{member.city || 'Padiyathalawa'}</div>
                </div>
              </div>
              <div className="mpm-detail-item">
                <span className="mpm-detail-icon"><BookIcon /></span>
                <div>
                  <div className="mpm-detail-label">Currently Borrowed</div>
                  <div className="mpm-detail-val">{member.borrowed} / {member.maxBooks} books</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="mpm-stats-row">
            <div className="mpm-stat">
              <div className="mpm-stat-val">{totalBorrowed}</div>
              <div className="mpm-stat-label">Total Borrowed</div>
            </div>
            <div className="mpm-stat">
              <div className="mpm-stat-val mpm-green">{totalReturned}</div>
              <div className="mpm-stat-label">Returned</div>
            </div>
            <div className="mpm-stat">
              <div className="mpm-stat-val mpm-red">{totalOverdue}</div>
              <div className="mpm-stat-label">Overdue</div>
            </div>
            <div className="mpm-stat">
              <div className="mpm-stat-val mpm-orange">{member.borrowed}</div>
              <div className="mpm-stat-label">Active Loans</div>
            </div>
            <div className="mpm-stat mpm-stat--fine">
              <div className="mpm-stat-val mpm-red">Rs. {member.outstanding.toFixed(2)}</div>
              <div className="mpm-stat-label">Outstanding Fine</div>
            </div>
            <div className="mpm-stat">
              <div className="mpm-stat-val">Rs. {totalFine.toFixed(2)}</div>
              <div className="mpm-stat-label">Total Fines Ever</div>
            </div>
          </div>

          {/* ── Borrowing history ── */}
          <div className="mpm-section-card">
            <div className="mpm-section-title-row">
              <div className="mpm-section-title">Borrowing History</div>
              <span className="mpm-history-note">Permanent record — never deleted</span>
            </div>

            {history.length === 0 ? (
              <div className="mpm-empty">No borrowing history found.</div>
            ) : (
              <table className="mpm-table">
                <thead>
                  <tr>
                    <th>BORROW ID</th>
                    <th>BOOK</th>
                    <th>ISSUED</th>
                    <th>DUE</th>
                    <th>RETURNED</th>
                    <th>OVERDUE</th>
                    <th>FINE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => {
                    const bs = BORROW_STYLE[h.status]
                    return (
                      <tr key={h.id}>
                        <td><span className="mpm-bid">{h.id}</span></td>
                        <td>
                          <div className="mpm-book-title">{h.book}</div>
                          <div className="mpm-isbn">{h.isbn}</div>
                        </td>
                        <td className="mpm-date">{h.issued}</td>
                        <td className="mpm-date">{h.due}</td>
                        <td className="mpm-date">{h.returned}</td>
                        <td>
                          <span className={h.days > 0 ? 'mpm-days-red' : 'mpm-days-ok'}>
                            {h.days > 0 ? `${h.days}d` : '—'}
                          </span>
                        </td>
                        <td>
                          <span className={h.fine > 0 ? 'mpm-fine-red' : 'mpm-fine-ok'}>
                            Rs. {h.fine.toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <span className="mpm-bstatus" style={{ color: bs.color, background: bs.bg, border: `1px solid ${bs.border}` }}>
                            {h.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
