import { useState } from 'react'
import './FinesPage.css'

const initialFines = [
  { id: 'FN-001', borrowId: 'BR-002', member: 'N.S. Fernando',   memberId: 'MEM-112', phone: '071 882 3891', book: 'Engineering Mechanics: Statics',           days: 10, amount: 10, paid: 0,  method: '-',    date: '15/09/2026', status: 'UNPAID' },
  { id: 'FN-002', borrowId: 'BR-005', member: 'K.M. Bandara',    memberId: 'MEM-342', phone: '077 234 5678', book: 'Data Structures in C++ (2nd Ed)',           days: 14, amount: 14, paid: 14, method: 'Cash', date: '14/09/2026', status: 'PAID'   },
  { id: 'FN-003', borrowId: 'BR-008', member: 'Sahan Alwis',     memberId: 'MEM-404', phone: '078 991 4455', book: 'Digital Signal Processing Concepts',        days: 7,  amount: 7,  paid: 0,  method: '-',    date: '13/09/2026', status: 'UNPAID' },
  { id: 'FN-004', borrowId: 'BR-011', member: 'Dilani Wickrama', memberId: 'MEM-084', phone: '071 987 6543', book: 'Modern Operating Systems (4th Ed)',          days: 3,  amount: 3,  paid: 3,  method: 'Card', date: '10/09/2026', status: 'WAIVED' },
  { id: 'FN-005', borrowId: 'BR-009', member: 'Kasun Perera',    memberId: 'MEM-881', phone: '076 554 1122', book: 'Discrete Mathematics & Its Applications',   days: 6,  amount: 6,  paid: 6,  method: 'Cash', date: '14/08/2026', status: 'PAID'   },
  { id: 'FN-006', borrowId: 'BR-017', member: 'N.S. Fernando',   memberId: 'MEM-112', phone: '071 882 3891', book: 'Algorithm Design: Foundations Vol. II',     days: 8,  amount: 8,  paid: 0,  method: '-',    date: '20/06/2026', status: 'UNPAID' },
  { id: 'FN-007', borrowId: 'BR-004', member: 'Sahan Alwis',     memberId: 'MEM-404', phone: '078 991 4455', book: 'Microelectronic Circuits',                  days: 5,  amount: 5,  paid: 5,  method: 'Card', date: '05/09/2026', status: 'PAID'   },
]

const STATUS_STYLE = {
  UNPAID: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  PAID:   { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  WAIVED: { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
}

/* ── Icons ── */
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const CoinsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/>
    <path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>
  </svg>
)
const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)
const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

/* ── Collect Modal ── */
function CollectModal({ fine, onClose, onCollect }) {
  const [method, setMethod] = useState('Cash')
  return (
    <div className="fn-overlay" onClick={onClose}>
      <div className="fn-modal" onClick={e => e.stopPropagation()}>
        <div className="fn-modal-header">
          <h3 className="fn-modal-title">Collect Fine</h3>
          <button className="fn-modal-close" onClick={onClose}><XIcon /></button>
        </div>
        <div className="fn-modal-body">
          <div className="fn-modal-amount">
            <span className="fn-modal-amt-label">Amount Due</span>
            <span className="fn-modal-amt-val">Rs. {fine.amount}.00</span>
          </div>
          <div className="fn-modal-info">
            <div className="fn-modal-row"><span>Member</span><strong>{fine.member}</strong></div>
            <div className="fn-modal-row"><span>Fine ID</span><strong>{fine.id}</strong></div>
            <div className="fn-modal-row"><span>Borrow ID</span><strong>{fine.borrowId}</strong></div>
            <div className="fn-modal-row"><span>Book</span><strong>{fine.book}</strong></div>
            <div className="fn-modal-row"><span>Overdue Days</span><strong style={{ color: '#ef4444' }}>{fine.days} days</strong></div>
          </div>
          <div className="fn-modal-method">
            <label className="fn-modal-label">Payment Method</label>
            <div className="fn-method-btns">
              {['Cash', 'Card', 'Online'].map(m => (
                <button
                  key={m}
                  className={`fn-method-btn${method === m ? ' fn-method-btn--active' : ''}`}
                  onClick={() => setMethod(m)}
                >{m}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="fn-modal-footer">
          <button className="fn-modal-ghost" onClick={onClose}>Cancel</button>
          <button className="fn-modal-confirm" onClick={() => onCollect(fine.id, method)}>
            Confirm — Rs. {fine.amount}.00
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Waive Modal ── */
function WaiveModal({ fine, onClose, onWaive }) {
  return (
    <div className="fn-overlay" onClick={onClose}>
      <div className="fn-modal fn-modal--sm" onClick={e => e.stopPropagation()}>
        <div className="fn-modal-header">
          <h3 className="fn-modal-title">Waive Fine</h3>
          <button className="fn-modal-close" onClick={onClose}><XIcon /></button>
        </div>
        <div className="fn-modal-body">
          <p className="fn-waive-desc">
            Are you sure you want to waive the fine of <strong>Rs. {fine.amount}.00</strong> for <strong>{fine.member}</strong>?
            This action cannot be undone.
          </p>
        </div>
        <div className="fn-modal-footer">
          <button className="fn-modal-ghost" onClick={onClose}>Cancel</button>
          <button className="fn-modal-waive" onClick={() => onWaive(fine.id)}>
            Yes, Waive Fine
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function FinesPage() {
  const [fines, setFines]             = useState(initialFines)
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatus]     = useState('All Status')
  const [collectTarget, setCollect]   = useState(null)
  const [waiveTarget, setWaive]       = useState(null)

  const totalAmount  = fines.reduce((s, f) => s + f.amount, 0)
  const totalPaid    = fines.filter(f => f.status === 'PAID').reduce((s, f) => s + f.paid, 0)
  const totalUnpaid  = fines.filter(f => f.status === 'UNPAID').reduce((s, f) => s + f.amount, 0)
  const unpaidCount  = fines.filter(f => f.status === 'UNPAID').length

  const filtered = fines.filter(f => {
    const q = search.toLowerCase()
    const matchSearch =
      f.id.toLowerCase().includes(q) ||
      f.borrowId.toLowerCase().includes(q) ||
      f.member.toLowerCase().includes(q) ||
      f.memberId.toLowerCase().includes(q) ||
      f.book.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'All Status' || f.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleCollect = (id, method) => {
    setFines(prev => prev.map(f =>
      f.id === id ? { ...f, status: 'PAID', paid: f.amount, method } : f
    ))
    setCollect(null)
  }

  const handleWaive = (id) => {
    setFines(prev => prev.map(f =>
      f.id === id ? { ...f, status: 'WAIVED', method: 'Waived' } : f
    ))
    setWaive(null)
  }

  return (
    <div className="fn">

      {/* Header */}
      <div className="fn-header">
        <div>
          <h2 className="fn-title">Fines</h2>
          <p className="fn-sub">Track and collect overdue fines &mdash; Rs. 1.00 charged per overdue day</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="fn-stats">
        <div className="fn-stat">
          <div className="fn-stat-icon fn-stat-icon--slate"><CoinsIcon /></div>
          <div className="fn-stat-body">
            <div className="fn-stat-label">TOTAL FINES</div>
            <div className="fn-stat-val">Rs. {totalAmount}.00</div>
            <div className="fn-stat-sub">across all records</div>
          </div>
        </div>
        <div className="fn-stat">
          <div className="fn-stat-icon fn-stat-icon--green"><CheckCircleIcon /></div>
          <div className="fn-stat-body">
            <div className="fn-stat-label">COLLECTED</div>
            <div className="fn-stat-val fn-stat-val--green">Rs. {totalPaid}.00</div>
            <div className="fn-stat-sub">successfully received</div>
          </div>
        </div>
        <div className="fn-stat fn-stat--danger">
          <div className="fn-stat-icon fn-stat-icon--red"><AlertIcon /></div>
          <div className="fn-stat-body">
            <div className="fn-stat-label">OUTSTANDING</div>
            <div className="fn-stat-val fn-stat-val--red">Rs. {totalUnpaid}.00</div>
            <div className="fn-stat-sub">{unpaidCount} unpaid fine{unpaidCount !== 1 ? 's' : ''}</div>
          </div>
        </div>
        <div className="fn-stat">
          <div className="fn-stat-icon fn-stat-icon--amber"><ClockIcon /></div>
          <div className="fn-stat-body">
            <div className="fn-stat-label">RATE</div>
            <div className="fn-stat-val fn-stat-val--amber">Rs. 1.00</div>
            <div className="fn-stat-sub">per overdue day</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="fn-toolbar">
        <div className="fn-search">
          <SearchIcon />
          <input
            placeholder="Search by Fine ID, Borrow ID, member name, member ID or book title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="fn-clear-btn" onClick={() => setSearch('')}>&#10005;</button>
          )}
        </div>
        <select className="fn-select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
          <option value="All Status">All Status</option>
          <option value="UNPAID">UNPAID</option>
          <option value="PAID">PAID</option>
          <option value="WAIVED">WAIVED</option>
        </select>
      </div>

      {/* Table */}
      <div className="fn-card">
        <table className="fn-table">
          <thead>
            <tr>
              <th>FINE ID</th>
              <th>BORROW ID</th>
              <th>MEMBER</th>
              <th>BOOK</th>
              <th>PHONE</th>
              <th>OVERDUE DAYS</th>
              <th>AMOUNT</th>
              <th>PAID</th>
              <th>METHOD</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="12" className="fn-empty">
                  No fine records found{search ? ` for "${search}"` : ''}
                </td>
              </tr>
            ) : (
              filtered.map(f => {
                const st = STATUS_STYLE[f.status]
                return (
                  <tr key={f.id}>
                    <td><span className="fn-id">{f.id}</span></td>
                    <td><span className="fn-borrow-id">{f.borrowId}</span></td>
                    <td>
                      <div className="fn-name">{f.member}</div>
                      <div className="fn-sub2">{f.memberId}</div>
                    </td>
                    <td className="fn-book">{f.book}</td>
                    <td className="fn-phone">{f.phone}</td>
                    <td>
                      <span className={f.days > 0 ? 'fn-days-red' : 'fn-days-ok'}>{f.days}</span>
                    </td>
                    <td><span className="fn-amount">Rs. {f.amount}.00</span></td>
                    <td>
                      <span className={f.paid > 0 ? 'fn-paid-val' : 'fn-paid-zero'}>Rs. {f.paid}.00</span>
                    </td>
                    <td className="fn-method">{f.method}</td>
                    <td className="fn-date">{f.date}</td>
                    <td>
                      <span
                        className="fn-status"
                        style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}
                      >
                        <span className="fn-sdot" style={{ background: st.color }} />
                        {f.status}
                      </span>
                    </td>
                    <td>
                      <div className="fn-actions">
                        {f.status === 'UNPAID' && (
                          <>
                            <button
                              className="fn-btn fn-btn--collect"
                              onClick={() => setCollect(f)}
                            >Collect</button>
                            <button
                              className="fn-btn fn-btn--waive"
                              onClick={() => setWaive(f)}
                            >Waive</button>
                          </>
                        )}
                        {f.status !== 'UNPAID' && (
                          <span className="fn-done-label">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
        <div className="fn-footer">
          <span>Showing {filtered.length} of {fines.length} fine records</span>
        </div>
      </div>

      {/* Modals */}
      {collectTarget && (
        <CollectModal
          fine={collectTarget}
          onClose={() => setCollect(null)}
          onCollect={handleCollect}
        />
      )}
      {waiveTarget && (
        <WaiveModal
          fine={waiveTarget}
          onClose={() => setWaive(null)}
          onWaive={handleWaive}
        />
      )}

    </div>
  )
}
