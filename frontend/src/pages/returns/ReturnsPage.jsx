import { useState } from 'react'
import './ReturnsPage.css'

const records = [
  {
    id: 'RT-001', borrowId: 'BR-003',
    member: 'Dilani Wickrama', memberId: 'MEM-084',
    book: 'Modern Operating Systems (4th Ed)', accNo: 'ACC-30491',
    issued: '20/08/2026', due: '27/08/2026', returned: '27/08/2026',
    days: 0, fine: 0, condition: 'Good',
  },
  {
    id: 'RT-002', borrowId: 'BR-006',
    member: 'Fathima Rizna', memberId: 'MEM-405',
    book: 'Microelectronic Circuits', accNo: 'ACC-61027',
    issued: '05/09/2026', due: '12/09/2026', returned: '11/09/2026',
    days: 0, fine: 0, condition: 'Good',
  },
  {
    id: 'RT-003', borrowId: 'BR-009',
    member: 'Kasun Perera', memberId: 'MEM-881',
    book: 'Discrete Mathematics & Its Applications', accNo: 'ACC-88219',
    issued: '01/08/2026', due: '08/08/2026', returned: '14/08/2026',
    days: 6, fine: 6, condition: 'Good',
  },
  {
    id: 'RT-004', borrowId: 'BR-011',
    member: 'Sahan Alwis', memberId: 'MEM-404',
    book: 'Data Structures in C++ (2nd Ed)', accNo: 'ACC-55103',
    issued: '10/07/2026', due: '17/07/2026', returned: '25/07/2026',
    days: 8, fine: 8, condition: 'Damaged',
  },
  {
    id: 'RT-005', borrowId: 'BR-014',
    member: 'K.M. Bandara', memberId: 'MEM-342',
    book: 'Engineering Mechanics: Statics', accNo: 'ACC-44871',
    issued: '15/07/2026', due: '22/07/2026', returned: '22/07/2026',
    days: 0, fine: 0, condition: 'Good',
  },
  {
    id: 'RT-006', borrowId: 'BR-017',
    member: 'N.S. Fernando', memberId: 'MEM-112',
    book: 'Algorithm Design: Foundations Vol. II', accNo: 'ACC-74301',
    issued: '05/06/2026', due: '12/06/2026', returned: '20/06/2026',
    days: 8, fine: 8, condition: 'Good',
  },
  {
    id: 'RT-007', borrowId: 'BR-020',
    member: 'Dilani Wickrama', memberId: 'MEM-084',
    book: 'Digital Signal Processing Concepts', accNo: 'ACC-92011',
    issued: '01/05/2026', due: '08/05/2026', returned: '07/05/2026',
    days: 0, fine: 0, condition: 'Good',
  },
]

const CONDITION = {
  Good:    { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  Damaged: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
}

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)

const BookOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const CoinsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/>
    <path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>
  </svg>
)

export default function ReturnsPage() {
  const [search, setSearch]               = useState('')
  const [conditionFilter, setCondition]   = useState('All Conditions')

  const totalReturned = records.length
  const onTime        = records.filter(r => r.days === 0).length
  const withFines     = records.filter(r => r.fine > 0).length
  const totalFinesAmt = records.reduce((s, r) => s + r.fine, 0)

  const filtered = records.filter(r => {
    const q = search.toLowerCase()
    const matchSearch =
      r.id.toLowerCase().includes(q) ||
      r.borrowId.toLowerCase().includes(q) ||
      r.member.toLowerCase().includes(q) ||
      r.memberId.toLowerCase().includes(q) ||
      r.book.toLowerCase().includes(q) ||
      r.accNo.toLowerCase().includes(q)
    const matchCond = conditionFilter === 'All Conditions' || r.condition === conditionFilter
    return matchSearch && matchCond
  })

  return (
    <div className="ret">

      <div className="ret-header">
        <div>
          <h2 className="ret-title">Returns</h2>
          <p className="ret-sub">Complete return history &mdash; all books successfully returned by members</p>
        </div>
      </div>

      <div className="ret-stats">
        <div className="ret-stat">
          <div className="ret-stat-icon ret-stat-icon--green"><CheckCircleIcon /></div>
          <div className="ret-stat-body">
            <div className="ret-stat-label">TOTAL RETURNS</div>
            <div className="ret-stat-val ret-stat-val--green">{totalReturned}</div>
            <div className="ret-stat-sub">books successfully returned</div>
          </div>
        </div>
        <div className="ret-stat">
          <div className="ret-stat-icon ret-stat-icon--blue"><BookOpenIcon /></div>
          <div className="ret-stat-body">
            <div className="ret-stat-label">RETURNED ON TIME</div>
            <div className="ret-stat-val">{onTime}</div>
            <div className="ret-stat-sub">no fine charged</div>
          </div>
        </div>
        <div className="ret-stat ret-stat--warn">
          <div className="ret-stat-icon ret-stat-icon--red"><AlertIcon /></div>
          <div className="ret-stat-body">
            <div className="ret-stat-label">LATE RETURNS</div>
            <div className="ret-stat-val ret-stat-val--red">{withFines}</div>
            <div className="ret-stat-sub">returned after due date</div>
          </div>
        </div>
        <div className="ret-stat">
          <div className="ret-stat-icon ret-stat-icon--amber"><CoinsIcon /></div>
          <div className="ret-stat-body">
            <div className="ret-stat-label">TOTAL FINES COLLECTED</div>
            <div className="ret-stat-val ret-stat-val--amber">Rs. {totalFinesAmt}</div>
            <div className="ret-stat-sub">from overdue returns</div>
          </div>
        </div>
      </div>

      <div className="ret-toolbar">
        <div className="ret-search">
          <SearchIcon />
          <input
            placeholder="Search by Return ID, Borrow ID, member, book or accession no..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="ret-clear-btn" onClick={() => setSearch('')}>&#10005;</button>
          )}
        </div>
        <select className="ret-select" value={conditionFilter} onChange={e => setCondition(e.target.value)}>
          <option value="All Conditions">All Conditions</option>
          <option value="Good">Good</option>
          <option value="Damaged">Damaged</option>
        </select>
      </div>

      <div className="ret-card">
        <table className="ret-table">
          <thead>
            <tr>
              <th>RETURN ID</th>
              <th>BORROW ID</th>
              <th>MEMBER</th>
              <th>BOOK</th>
              <th>ACCESSION NO</th>
              <th>ISSUE DATE</th>
              <th>DUE DATE</th>
              <th>RETURN DATE</th>
              <th>OVERDUE DAYS</th>
              <th>FINE</th>
              <th>CONDITION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="11" className="ret-empty">
                  No return records found{search ? ` for "${search}"` : ''}
                </td>
              </tr>
            ) : (
              filtered.map(r => {
                const cond = CONDITION[r.condition] || CONDITION.Good
                return (
                  <tr key={r.id}>
                    <td><span className="ret-id">{r.id}</span></td>
                    <td><span className="ret-borrow-id">{r.borrowId}</span></td>
                    <td>
                      <div className="ret-name">{r.member}</div>
                      <div className="ret-sub2">{r.memberId}</div>
                    </td>
                    <td className="ret-book">{r.book}</td>
                    <td className="ret-acc">{r.accNo}</td>
                    <td className="ret-date">{r.issued}</td>
                    <td className="ret-date">{r.due}</td>
                    <td className="ret-date ret-date--returned">{r.returned}</td>
                    <td>
                      <span className={r.days > 0 ? 'ret-days-red' : 'ret-days-ok'}>{r.days}</span>
                    </td>
                    <td>
                      <span className={r.fine > 0 ? 'ret-fine-red' : 'ret-fine-ok'}>Rs. {r.fine}</span>
                    </td>
                    <td>
                      <span
                        className="ret-cond-badge"
                        style={{ color: cond.color, background: cond.bg, border: `1px solid ${cond.border}` }}
                      >
                        <span className="ret-cdot" style={{ background: cond.color }} />
                        {r.condition}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
        <div className="ret-footer">
          <span>Showing {filtered.length} of {records.length} return records &mdash; permanent history, never deleted</span>
        </div>
      </div>

    </div>
  )
}
