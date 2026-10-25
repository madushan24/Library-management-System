import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api/client'
import './BorrowingsPage.css'

const S = {
  BORROWED: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  RETURNED: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  OVERDUE:  { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
}

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const BookIcon  = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)

const LayersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
)

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
)

export default function BorrowingsPage() {
  const [records, setRecords]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatus]   = useState('All Status')

  const loadBorrowings = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.getBorrowings()
      const formatted = data.map(b => ({
        id:       b.borrow_id || `BR-${String(b.id).padStart(3, '0')}`,
        dbId:     b.id,
        member:   b.member_name || 'Member',
        memberId: b.mem_id || 'MEM',
        book:     b.book_title || 'Book',
        issued:   b.issued_date || '-',
        due:      b.due_date || '-',
        returned: b.returned_date || '-',
        days:     b.overdue_days || 0,
        fine:     b.fine || 0,
        status:   b.status || 'BORROWED',
      }))
      setRecords(formatted)
    } catch (err) {
      console.error('Failed to load borrowings:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBorrowings()
  }, [loadBorrowings])

  const totalBorrowings = records.length
  const totalBorrowed   = records.filter(r => r.status === 'BORROWED').length
  const totalReturned   = records.filter(r => r.status === 'RETURNED').length
  const totalOverdue    = records.filter(r => r.status === 'OVERDUE').length

  const filtered = records.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = (r.id || '').toLowerCase().includes(q) ||
      (r.member || '').toLowerCase().includes(q) ||
      (r.memberId || '').toLowerCase().includes(q) ||
      (r.book || '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'All Status' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="brw">

      <div className="brw-header">
        <div>
          <h2 className="brw-title">Borrowings</h2>
          <p className="brw-sub">Complete borrowing history &mdash; records are never deleted</p>
        </div>
      </div>

      <div className="brw-stats">
        <div className="brw-stat">
          <div className="brw-stat-icon brw-stat-icon--blue"><BookIcon /></div>
          <div className="brw-stat-body">
            <div className="brw-stat-label">TOTAL RECORDS</div>
            <div className="brw-stat-val">{totalBorrowings}</div>
            <div className="brw-stat-sub">all borrowing transactions</div>
          </div>
        </div>
        <div className="brw-stat">
          <div className="brw-stat-icon brw-stat-icon--indigo"><LayersIcon /></div>
          <div className="brw-stat-body">
            <div className="brw-stat-label">CURRENTLY BORROWED</div>
            <div className="brw-stat-val">{totalBorrowed}</div>
            <div className="brw-stat-sub">books out on active loan</div>
          </div>
        </div>
        <div className="brw-stat brw-stat--warn">
          <div className="brw-stat-icon brw-stat-icon--red"><AlertIcon /></div>
          <div className="brw-stat-body">
            <div className="brw-stat-label">OVERDUE</div>
            <div className="brw-stat-val brw-stat-val--red">{totalOverdue}</div>
            <div className="brw-stat-sub">past due date &mdash; fines accruing</div>
          </div>
        </div>
        <div className="brw-stat">
          <div className="brw-stat-icon brw-stat-icon--green"><CheckIcon /></div>
          <div className="brw-stat-body">
            <div className="brw-stat-label">RETURNED</div>
            <div className="brw-stat-val brw-stat-val--green">{totalReturned}</div>
            <div className="brw-stat-sub">successfully returned</div>
          </div>
        </div>
      </div>

      <div className="brw-toolbar">
        <div className="brw-search">
          <SearchIcon />
          <input
            placeholder="Search by Borrow ID, member name, member ID or book title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="brw-clear-btn" onClick={() => setSearch('')}>&#10005;</button>
          )}
        </div>
        <select className="brw-select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
          <option value="All Status">All Status</option>
          <option value="BORROWED">BORROWED</option>
          <option value="RETURNED">RETURNED</option>
          <option value="OVERDUE">OVERDUE</option>
        </select>
      </div>

      <div className="brw-card">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading borrowings...</div>
        ) : (
          <table className="brw-table">
            <thead>
              <tr>
                <th>BORROW ID</th>
                <th>MEMBER</th>
                <th>BOOK</th>
                <th>ISSUE DATE</th>
                <th>DUE DATE</th>
                <th>RETURN DATE</th>
                <th>OVERDUE DAYS</th>
                <th>FINE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="brw-empty">No records found for "{search}"</td>
                </tr>
              ) : (
                filtered.map(r => {
                  const st = S[r.status] || S.BORROWED
                  return (
                    <tr key={r.id}>
                      <td><span className="brw-id">{r.id}</span></td>
                      <td>
                        <div className="brw-name">{r.member}</div>
                        <div className="brw-sub2">{r.memberId}</div>
                      </td>
                      <td className="brw-book">{r.book}</td>
                      <td className="brw-date">{r.issued}</td>
                      <td className="brw-date">{r.due}</td>
                      <td className="brw-date">{r.returned}</td>
                      <td>
                        <span className={r.days > 0 ? 'brw-days-red' : 'brw-days-ok'}>{r.days}</span>
                      </td>
                      <td>
                        <span className={r.fine > 0 ? 'brw-fine-red' : 'brw-fine-ok'}>Rs. {r.fine}</span>
                      </td>
                      <td>
                        <span className="brw-status" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                          <span className="brw-sdot" style={{ background: st.color }} />
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}
        <div className="brw-footer">
          <span>Showing {filtered.length} of {records.length} records &mdash; permanent history, never deleted</span>
        </div>
      </div>

    </div>
  )
}
