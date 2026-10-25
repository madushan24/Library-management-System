import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api/client'
import './ReturnsPage.css'

const FINE_PER_DAY = 1

const COND_STYLE = {
  Good:    { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  Damaged: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
}

/* ─── Utilities ─── */
function calcFine(dueISO) {
  if (!dueISO) return { days: 0, fine: 0 }
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const due   = new Date(dueISO); due.setHours(0, 0, 0, 0)
  const days  = Math.max(0, Math.floor((today - due) / 86400000))
  return { days, fine: days * FINE_PER_DAY }
}

function fmtISO(iso) {
  if (!iso) return '-'
  const parts = iso.split('-')
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
  return iso
}

function todayDisplay() { return fmtISO(new Date().toISOString().split('T')[0]) }

/* ─── Icons ─── */
const CheckCircleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
const BookOpenIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
const AlertIcon       = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const CoinsIcon       = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>
const SearchIcon      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const UserIcon        = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const XIcon           = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const RotateCCWIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>
const BookIcon2       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>

/* ─── Overdue Detail Modal ─── */
function OverdueDetailModal({ loan, onClose, onProcessReturn }) {
  const fi = calcFine(loan.due)
  const daysBadgeColor = fi.days >= 14 ? '#ef4444' : fi.days >= 7 ? '#ea580c' : '#d97706'

  return (
    <div className="ret-modal-backdrop" onClick={onClose}>
      <div className="ret-modal ret-modal--detail" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="ret-modal-header ret-modal-header--overdue">
          <div>
            <h3 className="ret-modal-title">Overdue Book — Full Details</h3>
            <p className="ret-modal-sub">Borrow record {loan.id} · {loan.memberId}</p>
          </div>
          <button className="ret-modal-close" onClick={onClose}><XIcon /></button>
        </div>

        <div className="ret-modal-body">

          {/* Overdue status banner */}
          <div className="ret-od-banner">
            <AlertIcon />
            <div>
              <div className="ret-od-banner-title">
                {fi.days} day{fi.days !== 1 ? 's' : ''} overdue — Fine accruing
              </div>
              <div className="ret-od-banner-sub">
                Rs. {FINE_PER_DAY}.00 per day · Total fine: <strong style={{color:'#ef4444'}}>Rs. {fi.fine}.00</strong>
              </div>
            </div>
            <span className="ret-od-days-pill" style={{background: daysBadgeColor}}>
              {fi.days}d Late
            </span>
          </div>

          {/* Details grid */}
          <div className="ret-od-grid">
            <div className="ret-od-section">
              <div className="ret-od-section-title"><BookIcon2 /> Book Information</div>
              <div className="ret-od-rows">
                <div className="ret-od-row">
                  <span className="ret-od-label">Book Title</span>
                  <strong className="ret-od-val">{loan.title}</strong>
                </div>
                <div className="ret-od-row">
                  <span className="ret-od-label">Accession / Book ID</span>
                  <strong className="ret-od-val ret-od-mono">{loan.acc}</strong>
                </div>
                <div className="ret-od-row">
                  <span className="ret-od-label">Borrow Record ID</span>
                  <strong className="ret-od-val ret-od-mono">{loan.id}</strong>
                </div>
              </div>
            </div>

            <div className="ret-od-section">
              <div className="ret-od-section-title"><UserIcon /> Member Information</div>
              <div className="ret-od-rows">
                <div className="ret-od-row">
                  <span className="ret-od-label">Member Name</span>
                  <strong className="ret-od-val">{loan.memberName || loan.memberId}</strong>
                </div>
                <div className="ret-od-row">
                  <span className="ret-od-label">Member ID</span>
                  <strong className="ret-od-val ret-od-mono">{loan.memberId}</strong>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="ret-modal-footer">
          <button className="ret-btn ret-btn--ghost" onClick={onClose}>Close</button>
          <button
            className="ret-btn ret-btn--primary"
            onClick={() => { onClose(); onProcessReturn(loan) }}
          >
            <RotateCCWIcon /> Process Return for this Book
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Sidebar: Recent Returns list ─── */
function RecentReturnsList({ records }) {
  return (
    <div className="ret-panel">
      <div className="ret-panel-header">
        <h3 className="ret-panel-title">Recent Returns</h3>
        <span className="ret-panel-badge ret-panel-badge--green">{records.length} returns</span>
      </div>
      <div className="ret-panel-body">
        {records.length === 0
          ? <p className="ret-panel-empty">No returns yet.</p>
          : records.slice(0, 8).map(r => (
            <div key={r.id} className="ret-panel-item">
              <div className="ret-panel-item-top">
                <span className="ret-panel-id">{r.id}</span>
                <span className={`ret-panel-cond ret-panel-cond--${(r.condition || 'Good').toLowerCase()}`}>{r.condition || 'Good'}</span>
              </div>
              <div className="ret-panel-book">{r.book}</div>
              <div className="ret-panel-meta">{r.member} &bull; {r.borrowId}</div>
              <div className="ret-panel-dates">
                <span>Returned: {r.returned}</span>
                {r.fine > 0
                  ? <span className="ret-panel-fine">Rs.{r.fine} fine</span>
                  : <span className="ret-panel-ontime">On time</span>
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

/* ─── Sidebar: Overdue list ─── */
function OverdueList({ loans, onViewDetail }) {
  const overdue = loans.filter(l => l.status === 'OVERDUE')
  return (
    <div className="ret-panel ret-panel--overdue">
      <div className="ret-panel-header">
        <h3 className="ret-panel-title">Overdue Books</h3>
        <span className="ret-panel-badge ret-panel-badge--red">{overdue.length} overdue</span>
      </div>
      <p className="ret-panel-click-hint">Click any item to view full details</p>
      <div className="ret-panel-body">
        {overdue.length === 0
          ? <p className="ret-panel-empty">No overdue books! 🎉</p>
          : overdue.map(l => {
            const fi = calcFine(l.due)
            const sev = fi.days >= 14 ? 'red' : fi.days >= 7 ? 'orange' : 'yellow'
            return (
              <div
                key={l.id}
                className="ret-panel-item ret-panel-item--overdue ret-panel-item--clickable"
                onClick={() => onViewDetail(l)}
                role="button"
                tabIndex={0}
              >
                <div className="ret-panel-item-top">
                  <span className="ret-panel-id">{l.id}</span>
                  <span className={`ret-panel-overdue-badge ret-panel-overdue-badge--${sev}`}>
                    {fi.days}d overdue
                  </span>
                </div>
                <div className="ret-panel-book">{l.title}</div>
                <div className="ret-panel-meta">{l.memberId} &bull; Due: {fmtISO(l.due)}</div>
                <div className="ret-panel-dates">
                  <span className="ret-panel-fine">Fine: Rs. {fi.fine}.00</span>
                  <span className="ret-panel-view-hint">View details &rarr;</span>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function ReturnsPage() {
  const [loans, setLoans]         = useState([])
  const [history, setHistory]     = useState([])
  const [members, setMembers]     = useState([])
  const [loading, setLoading]     = useState(true)

  const [step, setStep]           = useState(1)
  const [phone, setPhone]         = useState('')
  const [phoneErr, setPhoneErr]   = useState('')
  const [member, setMember]       = useState(null)
  const [selected, setSelected]   = useState(null)
  const [condition, setCondition] = useState('Good')
  const [success, setSuccess]     = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [detailLoan, setDetailLoan] = useState(null)

  const [search, setSearch]         = useState('')
  const [condFilter, setCondFilter] = useState('All Conditions')

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [allBorrows, allMembers] = await Promise.all([
        api.getBorrowings(),
        api.getMembers()
      ])

      setMembers(allMembers)

      const active = allBorrows
        .filter(b => b.status === 'BORROWED' || b.status === 'OVERDUE')
        .map(b => ({
          dbId:      b.id,
          id:        b.borrow_id || `BR-${b.id}`,
          memberId:  b.mem_id || `MEM-${b.member_id}`,
          memberName:b.member_name,
          title:     b.book_title,
          acc:       b.book_id || `BK-${b.book_id}`,
          issued:    b.issued_date,
          due:       b.due_date,
          status:    b.status,
        }))

      const returned = allBorrows
        .filter(b => b.status === 'RETURNED')
        .map(b => ({
          dbId:      b.id,
          id:        `RT-${String(b.id).padStart(3, '0')}`,
          borrowId:  b.borrow_id || `BR-${b.id}`,
          member:    b.member_name,
          memberId:  b.mem_id || `MEM-${b.member_id}`,
          book:      b.book_title,
          acc:       b.book_id || `BK-${b.book_id}`,
          issued:    fmtISO(b.issued_date),
          due:       fmtISO(b.due_date),
          returned:  fmtISO(b.returned_date),
          days:      b.overdue_days || 0,
          fine:      b.fine || 0,
          condition: b.condition || 'Good',
        }))

      setLoans(active)
      setHistory(returned)
    } catch (err) {
      console.error('Failed to load returns data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const fineInfo = selected ? calcFine(selected.due) : null

  /* KPIs */
  const totalActive   = loans.length
  const totalOverdue  = loans.filter(l => l.status === 'OVERDUE').length
  const totalReturned = history.length
  const totalFines    = history.reduce((s, r) => s + r.fine, 0)

  /* Member's active loans */
  const memberLoans = member ? loans.filter(l => l.memberId === (member.mem_id || member.id)) : []

  /* Filtered history table */
  const filteredHistory = history.filter(r => {
    const q = search.toLowerCase()
    const matchQ = (r.id || '').toLowerCase().includes(q) ||
      (r.borrowId || '').toLowerCase().includes(q) ||
      (r.member || '').toLowerCase().includes(q) ||
      (r.memberId || '').toLowerCase().includes(q) ||
      (r.book || '').toLowerCase().includes(q) ||
      (r.acc || '').toLowerCase().includes(q)
    const matchC = condFilter === 'All Conditions' || r.condition === condFilter
    return matchQ && matchC
  })

  /* Modal handlers */
  const openModal = () => { setStep(1); setShowModal(true) }

  const closeModal = () => {
    setShowModal(false); setPhone(''); setPhoneErr('')
    setMember(null); setSelected(null); setCondition('Good'); setStep(1)
  }

  const handleFindMember = (e) => {
    e.preventDefault()
    const q = phone.trim().replace(/\s/g, '').toLowerCase()
    if (!q) { setPhoneErr('Please enter phone or ID'); return }

    const found = members.find(m =>
      (m.phone && m.phone.replace(/\s/g, '').includes(q)) ||
      (m.mem_id && m.mem_id.toLowerCase().includes(q)) ||
      (m.name && m.name.toLowerCase().includes(q))
    )

    if (!found) {
      setPhoneErr('No member found with this phone number or ID.')
      return
    }

    setPhoneErr('')
    setMember(found)
    setStep(2)
  }

  const handleConfirmReturn = async () => {
    if (!selected) return
    try {
      await api.returnBorrowing(selected.dbId || selected.id, { condition })
      await loadData()
      setSuccess(true)
      setShowModal(false)
    } catch (err) {
      alert(err.message || 'Failed to process return')
    }
  }

  const reset = () => {
    setStep(1); setPhone(''); setPhoneErr(''); setMember(null)
    setSelected(null); setCondition('Good'); setSuccess(false); setShowModal(false)
  }

  /* Success screen */
  if (success && selected && member && fineInfo) {
    return (
      <div className="ret">
        <div className="ret-success">
          <div className="ret-success-icon">✓</div>
          <h2>Book Returned Successfully</h2>
          <p><strong>{selected.title}</strong> returned by <strong>{member.name}</strong></p>
          <p className="ret-success-meta">Return Date: {todayDisplay()} &nbsp;|&nbsp; Condition: {condition}</p>
          {fineInfo.fine > 0 ? (
            <div className="ret-success-fine">
              Fine calculated: <strong>Rs. {fineInfo.fine}.00</strong>
              <span>({fineInfo.days} overdue day{fineInfo.days !== 1 ? 's' : ''} × Rs.{FINE_PER_DAY}/day recorded in Fines ledger)</span>
            </div>
          ) : (
            <div className="ret-success-ontime">✓ No fine — returned on time</div>
          )}
          <button className="ret-new-btn" onClick={reset}>Process Another Return</button>
        </div>
      </div>
    )
  }

  return (
    <div className="ret">

      {/* Header */}
      <div className="ret-header">
        <div>
          <h2 className="ret-title">Returns</h2>
          <p className="ret-sub">Process book returns and track overdue fines</p>
        </div>
        <button className="ret-btn ret-btn--primary" onClick={openModal}>
          <RotateCCWIcon /> Process Return
        </button>
      </div>

      {/* KPI cards */}
      <div className="ret-stats">
        <div className="ret-stat">
          <div className="ret-stat-icon ret-stat-icon--blue"><BookOpenIcon /></div>
          <div className="ret-stat-body">
            <div className="ret-stat-label">Active Loans</div>
            <div className="ret-stat-val">{totalActive}</div>
            <div className="ret-stat-sub">books currently on loan</div>
          </div>
        </div>
        <div className="ret-stat ret-stat--warn">
          <div className="ret-stat-icon ret-stat-icon--red"><AlertIcon /></div>
          <div className="ret-stat-body">
            <div className="ret-stat-label">Overdue</div>
            <div className="ret-stat-val ret-stat-val--red">{totalOverdue}</div>
            <div className="ret-stat-sub">past due — fines accruing</div>
          </div>
        </div>
        <div className="ret-stat">
          <div className="ret-stat-icon ret-stat-icon--green"><CheckCircleIcon /></div>
          <div className="ret-stat-body">
            <div className="ret-stat-label">Total Returned</div>
            <div className="ret-stat-val ret-stat-val--green">{totalReturned}</div>
            <div className="ret-stat-sub">books successfully returned</div>
          </div>
        </div>
        <div className="ret-stat">
          <div className="ret-stat-icon ret-stat-icon--amber"><CoinsIcon /></div>
          <div className="ret-stat-body">
            <div className="ret-stat-label">Fines Recorded</div>
            <div className="ret-stat-val ret-stat-val--amber">Rs. {totalFines}</div>
            <div className="ret-stat-sub">from overdue returns</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="ret-toolbar">
        <div className="ret-search">
          <SearchIcon />
          <input
            className="ret-toolbar-input"
            placeholder="Search member by phone or ID to process a return..."
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && openModal()}
          />
        </div>
        <button type="button" className="ret-btn ret-btn--primary" onClick={openModal}>
          <UserIcon /> Find Member
        </button>
      </div>

      {/* Two-column panels */}
      <div className="ret-panels-row">
        <RecentReturnsList records={history} />
        <OverdueList
          loans={loans}
          onViewDetail={loan => setDetailLoan(loan)}
        />
      </div>

      {/* Return history table */}
      <div className="ret-card">
        <div className="ret-card-header">
          <div className="ret-card-title">Return History</div>
          <div className="ret-card-filters">
            <div className="ret-search-sm">
              <SearchIcon />
              <input
                placeholder="Search returns..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <button className="ret-clear-btn" onClick={() => setSearch('')}>&#10005;</button>}
            </div>
            <select className="ret-select" value={condFilter} onChange={e => setCondFilter(e.target.value)}>
              <option value="All Conditions">All Conditions</option>
              <option value="Good">Good</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading return history...</div>
        ) : (
          <table className="ret-table">
            <thead>
              <tr>
                <th>RETURN ID</th><th>BORROW ID</th><th>MEMBER</th><th>BOOK</th>
                <th>ACC. NO</th><th>ISSUE DATE</th><th>DUE DATE</th><th>RETURN DATE</th>
                <th>OVERDUE DAYS</th><th>FINE</th><th>CONDITION</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr><td colSpan="11" className="ret-empty">No return records found{search ? ` for "${search}"` : ''}</td></tr>
              ) : (
                filteredHistory.map(r => {
                  const cond = COND_STYLE[r.condition] || COND_STYLE.Good
                  return (
                    <tr key={r.id}>
                      <td><span className="ret-id">{r.id}</span></td>
                      <td><span className="ret-borrow-id">{r.borrowId}</span></td>
                      <td>
                        <div className="ret-name">{r.member}</div>
                        <div className="ret-sub2">{r.memberId}</div>
                      </td>
                      <td className="ret-book">{r.book}</td>
                      <td className="ret-acc">{r.acc}</td>
                      <td className="ret-date">{r.issued}</td>
                      <td className="ret-date">{r.due}</td>
                      <td className="ret-date ret-date--returned">{r.returned}</td>
                      <td><span className={r.days > 0 ? 'ret-days-red' : 'ret-days-ok'}>{r.days}</span></td>
                      <td><span className={r.fine > 0 ? 'ret-fine-red' : 'ret-fine-ok'}>Rs. {r.fine}</span></td>
                      <td>
                        <span className="ret-cond-badge" style={{ color: cond.color, background: cond.bg, border: `1px solid ${cond.border}` }}>
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
        )}
        <div className="ret-footer">Showing {filteredHistory.length} of {history.length} return records</div>
      </div>

      {/* 3-step Return Modal */}
      {showModal && (
        <div className="ret-modal-backdrop" onClick={closeModal}>
          <div className="ret-modal" onClick={e => e.stopPropagation()}>

            <div className="ret-modal-header">
              <div>
                <h3 className="ret-modal-title">
                  {step === 1 && 'Find Member'}
                  {step === 2 && 'Select Book to Return'}
                  {step === 3 && 'Confirm Return'}
                </h3>
                <p className="ret-modal-sub">
                  {step === 1 && "Enter the member's phone number or ID to look up their active loans"}
                  {step === 2 && "Choose the book being returned from this member's active loans"}
                  {step === 3 && 'Review return details, set book condition and confirm'}
                </p>
              </div>
              <button type="button" className="ret-modal-close" onClick={closeModal}><XIcon /></button>
            </div>

            {/* Step indicator */}
            <div className="ret-modal-steps">
              {['Find Member', 'Select Book', 'Confirm Return'].map((s, i) => (
                <div key={i} className={`ret-modal-step${step === i + 1 ? ' active' : step > i + 1 ? ' done' : ''}`}>
                  <div className="ret-modal-step-num">{step > i + 1 ? '✓' : i + 1}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div className="ret-modal-body">

              {/* Step 1 */}
              {step === 1 && (
                <form onSubmit={handleFindMember} className="ret-form">
                  <label className="ret-label">Member Phone Number or Member ID</label>
                  <div className="ret-input-row">
                    <input
                      className={`ret-input${phoneErr ? ' ret-input--error' : ''}`}
                      type="text"
                      placeholder="e.g. 076 554 1122 or MEM-001"
                      value={phone}
                      onChange={e => { setPhone(e.target.value); setPhoneErr('') }}
                      autoFocus
                    />
                    <button type="submit" className="ret-btn ret-btn--primary">Search</button>
                  </div>
                  {phoneErr && <div className="ret-field-error">{phoneErr}</div>}
                  <div className="ret-hint">Try: 076 554 1122 · 071 882 3891 · 077 234 5678</div>
                </form>
              )}

              {/* Step 2 */}
              {step === 2 && member && (
                <>
                  <div className="ret-found-member">
                    <div className="ret-member-av">{member.name[0]}</div>
                    <div>
                      <div className="ret-member-name">{member.name}</div>
                      <div className="ret-member-meta">{member.mem_id || member.id} &bull; {member.phone}</div>
                    </div>
                    <span className="ret-active-badge">{member.status || 'ACTIVE'}</span>
                  </div>

                  <div className="ret-section-label" style={{ marginTop: 18 }}>
                    Active Loans ({memberLoans.length})
                  </div>

                  {memberLoans.length === 0 ? (
                    <div className="ret-no-loans">
                      <div style={{ fontSize: 32 }}>📭</div>
                      <div style={{ fontWeight: 600, color: '#475569' }}>No active loans for this member.</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>All books have already been returned.</div>
                    </div>
                  ) : (
                    <div className="ret-book-list">
                      {memberLoans.map(loan => {
                        const fi = calcFine(loan.due)
                        return (
                          <div
                            key={loan.id}
                            className={`ret-book-item${selected?.id === loan.id ? ' selected' : ''}${loan.status === 'OVERDUE' ? ' overdue' : ''}`}
                            onClick={() => setSelected(loan)}
                          >
                            <div className="ret-book-item-left">
                              <div className="ret-book-top">
                                <span className="ret-book-id">{loan.id}</span>
                                <span className={`ret-book-status ret-book-status--${loan.status.toLowerCase()}`}>{loan.status}</span>
                              </div>
                              <div className="ret-book-name">{loan.title}</div>
                              <div className="ret-book-meta">{loan.acc} &bull; Issued: {fmtISO(loan.issued)} &bull; Due: {fmtISO(loan.due)}</div>
                            </div>
                            <div>
                              {fi.days > 0
                                ? <span className="ret-overdue-badge">{fi.days}d overdue &mdash; Rs.{fi.fine}</span>
                                : <span className="ret-ontime-badge">On time</span>
                              }
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}

              {/* Step 3 */}
              {step === 3 && member && selected && fineInfo && (
                <>
                  <div className="ret-confirm-grid">
                    <div className="ret-confirm-row"><span>Member</span><strong>{member.name} ({member.mem_id || member.id})</strong></div>
                    <div className="ret-confirm-row"><span>Book</span><strong>{selected.title}</strong></div>
                    <div className="ret-confirm-row"><span>Accession No.</span><strong>{selected.acc}</strong></div>
                    <div className="ret-confirm-row"><span>Issue Date</span><strong>{fmtISO(selected.issued)}</strong></div>
                    <div className="ret-confirm-row"><span>Due Date</span><strong style={{ color: fineInfo.days > 0 ? '#ef4444' : undefined }}>{fmtISO(selected.due)}</strong></div>
                    <div className="ret-confirm-row"><span>Return Date</span><strong>{todayDisplay()}</strong></div>
                    <div className="ret-confirm-row">
                      <span>Overdue Days</span>
                      <strong style={{ color: fineInfo.days > 0 ? '#ef4444' : '#16a34a' }}>{fineInfo.days} day{fineInfo.days !== 1 ? 's' : ''}</strong>
                    </div>
                    <div className="ret-confirm-row ret-confirm-row--fine">
                      <span>Fine</span>
                      <strong style={{ color: fineInfo.fine > 0 ? '#ef4444' : '#16a34a', fontSize: 18 }}>Rs. {fineInfo.fine}.00</strong>
                    </div>
                  </div>

                  <div className="ret-section-label" style={{ marginTop: 20 }}>Book Condition</div>
                  <div className="ret-condition-row">
                    {['Good', 'Damaged'].map(c => (
                      <button
                        key={c} type="button"
                        className={`ret-cond-btn ret-cond-btn--${c.toLowerCase()}${condition === c ? ' selected' : ''}`}
                        onClick={() => setCondition(c)}
                      >
                        {c === 'Good' ? '✓ Good' : '⚠ Damaged'}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="ret-modal-footer">
              {step > 1 && (
                <button type="button" className="ret-btn ret-btn--ghost" onClick={() => setStep(s => s - 1)}>Back</button>
              )}
              <button type="button" className="ret-btn ret-btn--ghost ret-modal-cancel" onClick={closeModal}>Cancel</button>
              {step === 2 && selected && memberLoans.length > 0 && (
                <button type="button" className="ret-btn ret-btn--primary" onClick={() => setStep(3)}>Continue</button>
              )}
              {step === 3 && (
                <button type="button" className="ret-btn ret-btn--success" onClick={handleConfirmReturn}>Confirm Return</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overdue Detail Modal */}
      {detailLoan && (
        <OverdueDetailModal
          loan={detailLoan}
          onClose={() => setDetailLoan(null)}
          onProcessReturn={(loan) => {
            const mem = members.find(m => m.mem_id === loan.memberId || m.id === loan.memberId)
            if (mem) {
              setMember(mem)
              setPhone(mem.phone)
              setStep(2)
              setShowModal(true)
            } else {
              setStep(1)
              setShowModal(true)
            }
          }}
        />
      )}

    </div>
  )
}
