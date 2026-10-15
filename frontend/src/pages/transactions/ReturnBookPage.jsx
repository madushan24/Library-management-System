import { useState } from 'react'
import './ReturnBookPage.css'

const FINE_PER_DAY = 1

/* ─── Mock data (mirrors BORROWINGS active loans) ─── */
const MEMBERS_DB = {
  '076 554 1122': { id: 'MEM-881', name: 'Kasun Perera',    phone: '076 554 1122', status: 'ACTIVE' },
  '071 882 3891': { id: 'MEM-112', name: 'N.S. Fernando',   phone: '071 882 3891', status: 'ACTIVE' },
  '071 987 6543': { id: 'MEM-084', name: 'Dilani Wickrama', phone: '071 987 6543', status: 'ACTIVE' },
  '078 991 4455': { id: 'MEM-404', name: 'Sahan Alwis',     phone: '078 991 4455', status: 'ACTIVE' },
  '077 234 5678': { id: 'MEM-342', name: 'K.M. Bandara',    phone: '077 234 5678', status: 'ACTIVE' },
  '075 112 3344': { id: 'MEM-405', name: 'Fathima Rizna',   phone: '075 112 3344', status: 'ACTIVE' },
}

const ACTIVE_LOANS = [
  { id: 'BR-001', memberId: 'MEM-881', title: 'Discrete Mathematics & Its Applications', acc: 'ACC-88219', issued: '2026-10-08', due: '2026-10-15', status: 'BORROWED' },
  { id: 'BR-002', memberId: 'MEM-112', title: 'Engineering Mechanics: Statics',           acc: 'ACC-44871', issued: '2026-10-01', due: '2026-10-08', status: 'OVERDUE'  },
  { id: 'BR-003', memberId: 'MEM-404', title: 'Digital Signal Processing Concepts',       acc: 'ACC-92011', issued: '2026-10-10', due: '2026-10-17', status: 'BORROWED' },
  { id: 'BR-004', memberId: 'MEM-342', title: 'Data Structures in C++ (2nd Ed)',          acc: 'ACC-55103', issued: '2026-10-15', due: '2026-10-22', status: 'BORROWED' },
  { id: 'BR-008', memberId: 'MEM-112', title: 'Introduction to Algorithms (CLRS)',        acc: 'ACC-19203', issued: '2026-09-10', due: '2026-09-17', status: 'OVERDUE'  },
  { id: 'BR-009', memberId: 'MEM-342', title: 'Discrete Mathematics & Its Applications', acc: 'ACC-88219', issued: '2026-09-25', due: '2026-10-02', status: 'OVERDUE'  },
]

const RECENT_RETURNS = [
  { id: 'RT-001', borrowId: 'BR-005', member: 'Dilani Wickrama', book: 'Modern Operating Systems (4th Ed)', returned: '27/09/2026', fine: 0,  condition: 'Good'    },
  { id: 'RT-002', borrowId: 'BR-006', member: 'Fathima Rizna',   book: 'Microelectronic Circuits',         returned: '11/09/2026', fine: 0,  condition: 'Good'    },
  { id: 'RT-003', borrowId: 'BR-007', member: 'Kasun Perera',    book: 'Algorithm Design Vol. II',         returned: '14/09/2026', fine: 6,  condition: 'Good'    },
  { id: 'RT-004', borrowId: 'BR-010', member: 'Sahan Alwis',     book: 'Engineering Mechanics: Statics',   returned: '22/09/2026', fine: 0,  condition: 'Good'    },
  { id: 'RT-005', borrowId: 'BR-013', member: 'Fathima Rizna',   book: 'Microelectronic Circuits',         returned: '01/09/2026', fine: 5,  condition: 'Damaged' },
]

/* ─── Helpers ─── */
function calcFine(dueISO) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const due   = new Date(dueISO); due.setHours(0, 0, 0, 0)
  const days  = Math.max(0, Math.floor((today - due) / 86400000))
  return { days, fine: days * FINE_PER_DAY }
}

function fmt(isoStr) {
  if (!isoStr) return '-'
  const [y, m, d] = isoStr.split('-')
  return `${d}/${m}/${y}`
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

/* ─── Icons ─── */
const BookIcon      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const CheckIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
const AlertIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const SearchIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const UserIcon      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const XIcon         = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const RotateCCWIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>

/* ─── Recent Returns sidebar panel ─── */
function RecentReturnsList({ records }) {
  return (
    <div className="rb-list-panel">
      <div className="rb-list-header">
        <h3 className="rb-list-title">Recent Returns</h3>
        <span className="rb-list-count">{records.length} returns</span>
      </div>
      <div className="rb-list-body">
        {records.length === 0 ? (
          <p className="rb-list-empty">No returns recorded yet.</p>
        ) : (
          records.map(r => (
            <div key={r.id} className="rb-list-item">
              <div className="rb-list-item-top">
                <span className="rb-list-id">{r.id}</span>
                <span className={`rb-list-cond rb-list-cond--${r.condition.toLowerCase()}`}>
                  {r.condition}
                </span>
              </div>
              <div className="rb-list-book">{r.book}</div>
              <div className="rb-list-member">{r.member} &bull; {r.borrowId}</div>
              <div className="rb-list-dates">
                <span>Returned: {r.returned}</span>
                {r.fine > 0
                  ? <span className="rb-list-fine">Fine: Rs.{r.fine}</span>
                  : <span className="rb-list-ontime">On time</span>
                }
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ─── Active Overdue loans sidebar panel ─── */
function OverdueList({ loans }) {
  const overdue = loans.filter(l => l.status === 'OVERDUE')
  return (
    <div className="rb-list-panel rb-list-panel--overdue">
      <div className="rb-list-header">
        <h3 className="rb-list-title">Overdue Books</h3>
        <span className="rb-list-count rb-list-count--red">{overdue.length} overdue</span>
      </div>
      <div className="rb-list-body">
        {overdue.length === 0 ? (
          <p className="rb-list-empty">No overdue books right now. 🎉</p>
        ) : (
          overdue.map(l => {
            const fi = calcFine(l.due)
            return (
              <div key={l.id} className="rb-list-item rb-list-item--overdue">
                <div className="rb-list-item-top">
                  <span className="rb-list-id">{l.id}</span>
                  <span className="rb-list-overdue-badge">{fi.days}d overdue</span>
                </div>
                <div className="rb-list-book">{l.title}</div>
                <div className="rb-list-member">{l.memberId} &bull; Due: {fmt(l.due)}</div>
                <div className="rb-list-dates">
                  <span className="rb-list-fine">Fine accruing: Rs.{fi.fine}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function ReturnBookPage() {
  const [step, setStep]           = useState(1)
  const [phone, setPhone]         = useState('')
  const [phoneErr, setPhoneErr]   = useState('')
  const [member, setMember]       = useState(null)
  const [selected, setSelected]   = useState(null)
  const [condition, setCondition] = useState('Good')
  const [success, setSuccess]     = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [recentReturns, setRecentReturns] = useState(RECENT_RETURNS)
  const [activeLoans, setActiveLoans]     = useState(ACTIVE_LOANS)

  const today    = todayISO()
  const fineInfo = selected ? calcFine(selected.due) : null

  /* KPI counts */
  const totalActive  = activeLoans.length
  const totalOverdue = activeLoans.filter(l => l.status === 'OVERDUE').length
  const todayReturns = recentReturns.filter(r => r.returned === fmt(today)).length

  /* Member's active loans */
  const memberLoans = member
    ? activeLoans.filter(l => l.memberId === member.id)
    : []

  /* ── Handlers ── */
  const openModal = () => { setStep(1); setShowModal(true) }

  const closeModal = () => {
    setShowModal(false)
    setPhone(''); setPhoneErr(''); setMember(null)
    setSelected(null); setCondition('Good'); setStep(1)
  }

  const handleFindMember = (e) => {
    e.preventDefault()
    const normalized = phone.trim()
    const found = MEMBERS_DB[normalized]
    if (!found) { setPhoneErr('No member found with this phone number.'); return }
    setPhoneErr('')
    setMember(found)
    setStep(2)
  }

  const handleConfirmReturn = () => {
    /* Build new return record */
    const newReturn = {
      id:       `RT-${String(recentReturns.length + 1).padStart(3, '0')}`,
      borrowId: selected.id,
      member:   member.name,
      book:     selected.title,
      returned: fmt(today),
      fine:     fineInfo.fine,
      condition,
    }
    setRecentReturns(prev => [newReturn, ...prev])
    setActiveLoans(prev => prev.filter(l => l.id !== selected.id))
    setSuccess(true)
    setShowModal(false)
  }

  const reset = () => {
    setStep(1); setPhone(''); setPhoneErr(''); setMember(null)
    setSelected(null); setCondition('Good'); setSuccess(false); setShowModal(false)
  }

  /* ── Success screen ── */
  if (success && selected && member && fineInfo) {
    return (
      <div className="rb">
        <div className="rb-success">
          <div className="rb-success-icon">✓</div>
          <h2>Book Returned Successfully</h2>
          <p><strong>{selected.title}</strong> returned by <strong>{member.name}</strong></p>
          <p className="rb-success-meta">
            Return Date: {fmt(today)}&nbsp;|&nbsp;Condition: {condition}
          </p>
          {fineInfo.fine > 0 ? (
            <div className="rb-success-fine">
              Fine collected: <strong>Rs. {fineInfo.fine}.00</strong>
              <span>({fineInfo.days} overdue day{fineInfo.days !== 1 ? 's' : ''} × Rs.{FINE_PER_DAY}/day)</span>
            </div>
          ) : (
            <div className="rb-success-noFine">✓ No fine — returned on time</div>
          )}
          <button className="rb-new-btn" onClick={reset}>Process Another Return</button>
        </div>
      </div>
    )
  }

  return (
    <div className="rb">

      {/* Header */}
      <div className="rb-header">
        <div>
          <h2 className="rb-title">Return Book</h2>
          <p className="rb-sub">Process returns and calculate overdue fines automatically</p>
        </div>
        <button className="rb-btn rb-btn--primary" onClick={openModal}>
          <RotateCCWIcon /> Process Return
        </button>
      </div>

      {/* KPI cards */}
      <div className="rb-kpi-row">
        <div className="rb-kpi">
          <div className="rb-kpi-icon rb-kpi-icon--blue"><BookIcon /></div>
          <div className="rb-kpi-body">
            <div className="rb-kpi-label">Active Loans</div>
            <div className="rb-kpi-value">{totalActive}</div>
            <div className="rb-kpi-sub">books currently on loan</div>
          </div>
        </div>
        <div className="rb-kpi rb-kpi--warn">
          <div className="rb-kpi-icon rb-kpi-icon--red"><AlertIcon /></div>
          <div className="rb-kpi-body">
            <div className="rb-kpi-label">Overdue</div>
            <div className="rb-kpi-value rb-kpi-value--red">{totalOverdue}</div>
            <div className="rb-kpi-sub">past due — fines accruing</div>
          </div>
        </div>
        <div className="rb-kpi">
          <div className="rb-kpi-icon rb-kpi-icon--green"><CheckIcon /></div>
          <div className="rb-kpi-body">
            <div className="rb-kpi-label">Today's Returns</div>
            <div className="rb-kpi-value rb-kpi-value--green">{todayReturns}</div>
            <div className="rb-kpi-sub">processed today</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rb-toolbar">
        <div className="rb-toolbar-search">
          <SearchIcon />
          <input
            className="rb-toolbar-input"
            type="text"
            placeholder="Search member by phone number to process a return..."
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && openModal()}
          />
        </div>
        <button type="button" className="rb-btn rb-btn--primary" onClick={openModal}>
          <UserIcon /> Find Member
        </button>
      </div>

      {/* Two-column lists */}
      <div className="rb-lists-row">
        <RecentReturnsList records={recentReturns} />
        <OverdueList loans={activeLoans} />
      </div>

      {/* ── 3-step Return Modal ── */}
      {showModal && (
        <div className="rb-modal-backdrop" onClick={closeModal}>
          <div className="rb-modal" onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="rb-modal-header">
              <div>
                <h3 className="rb-modal-title">
                  {step === 1 && 'Find Member'}
                  {step === 2 && 'Select Book to Return'}
                  {step === 3 && 'Confirm Return'}
                </h3>
                <p className="rb-modal-sub">
                  {step === 1 && 'Enter the member\'s phone number to look up their active loans'}
                  {step === 2 && 'Choose the book being returned from the member\'s active loans'}
                  {step === 3 && 'Review return details, set condition, and confirm'}
                </p>
              </div>
              <button type="button" className="rb-modal-close" onClick={closeModal}><XIcon /></button>
            </div>

            {/* Step indicator */}
            <div className="rb-modal-steps">
              {['Find Member', 'Select Book', 'Confirm Return'].map((s, i) => (
                <div key={i} className={`rb-modal-step${step === i + 1 ? ' active' : step > i + 1 ? ' done' : ''}`}>
                  <div className="rb-modal-step-num">{step > i + 1 ? '✓' : i + 1}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            {/* Modal body */}
            <div className="rb-modal-body">

              {/* Step 1 — Find member by phone */}
              {step === 1 && (
                <form onSubmit={handleFindMember} className="rb-form">
                  <label className="rb-label">Member Phone Number</label>
                  <div className="rb-input-row">
                    <input
                      className={`rb-input${phoneErr ? ' rb-input--error' : ''}`}
                      type="text"
                      placeholder="e.g. 076 554 1122"
                      value={phone}
                      onChange={e => { setPhone(e.target.value); setPhoneErr('') }}
                      autoFocus
                    />
                    <button type="submit" className="rb-btn rb-btn--primary">Search</button>
                  </div>
                  {phoneErr && <div className="rb-field-error">{phoneErr}</div>}
                  <div className="rb-hint">
                    Try: 076 554 1122 · 071 882 3891 · 077 234 5678
                  </div>
                </form>
              )}

              {/* Step 2 — Select book from member's active loans */}
              {step === 2 && member && (
                <>
                  {/* Member banner */}
                  <div className="rb-found-member">
                    <div className="rb-member-av">{member.name[0]}</div>
                    <div>
                      <div className="rb-member-name">{member.name}</div>
                      <div className="rb-member-meta">{member.id} &bull; {member.phone}</div>
                    </div>
                    <span className="rb-active-badge">ACTIVE</span>
                  </div>

                  <div className="rb-section-label" style={{ marginTop: 18 }}>
                    Active Loans ({memberLoans.length})
                  </div>

                  {memberLoans.length === 0 ? (
                    <div className="rb-no-loans">
                      <div className="rb-no-loans-icon">📭</div>
                      <div>No active loans for this member.</div>
                      <div className="rb-no-loans-sub">All books have already been returned.</div>
                    </div>
                  ) : (
                    <div className="rb-book-list">
                      {memberLoans.map(loan => {
                        const fi = calcFine(loan.due)
                        return (
                          <div
                            key={loan.id}
                            className={`rb-book-item${selected?.id === loan.id ? ' selected' : ''}${loan.status === 'OVERDUE' ? ' overdue' : ''}`}
                            onClick={() => setSelected(loan)}
                          >
                            <div className="rb-book-item-left">
                              <div className="rb-book-top">
                                <span className="rb-book-id">{loan.id}</span>
                                <span className={`rb-book-status rb-book-status--${loan.status.toLowerCase()}`}>
                                  {loan.status}
                                </span>
                              </div>
                              <div className="rb-book-name">{loan.title}</div>
                              <div className="rb-book-meta">
                                {loan.acc} &bull; Issued: {fmt(loan.issued)} &bull; Due: {fmt(loan.due)}
                              </div>
                            </div>
                            <div className="rb-book-item-right">
                              {fi.days > 0
                                ? <span className="rb-overdue-badge">{fi.days}d overdue &mdash; Rs.{fi.fine}</span>
                                : <span className="rb-ontime-badge">On time</span>
                              }
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}

              {/* Step 3 — Confirm return */}
              {step === 3 && member && selected && fineInfo && (
                <>
                  <div className="rb-confirm-grid">
                    <div className="rb-confirm-row"><span>Member</span><strong>{member.name} ({member.id})</strong></div>
                    <div className="rb-confirm-row"><span>Book</span><strong>{selected.title}</strong></div>
                    <div className="rb-confirm-row"><span>Accession No.</span><strong>{selected.acc}</strong></div>
                    <div className="rb-confirm-row"><span>Issue Date</span><strong>{fmt(selected.issued)}</strong></div>
                    <div className="rb-confirm-row"><span>Due Date</span><strong className={fineInfo.days > 0 ? 'rb-text-red' : ''}>{fmt(selected.due)}</strong></div>
                    <div className="rb-confirm-row"><span>Return Date</span><strong>{fmt(today)}</strong></div>
                    <div className="rb-confirm-row">
                      <span>Overdue Days</span>
                      <strong className={fineInfo.days > 0 ? 'rb-text-red' : 'rb-text-green'}>
                        {fineInfo.days} day{fineInfo.days !== 1 ? 's' : ''}
                      </strong>
                    </div>
                    <div className="rb-confirm-row rb-confirm-row--fine">
                      <span>Fine</span>
                      <strong className={fineInfo.fine > 0 ? 'rb-text-red' : 'rb-text-green'} style={{ fontSize: 18 }}>
                        Rs. {fineInfo.fine}.00
                      </strong>
                    </div>
                  </div>

                  {/* Book condition */}
                  <div className="rb-section-label" style={{ marginTop: 20 }}>Book Condition</div>
                  <div className="rb-condition-row">
                    {['Good', 'Damaged'].map(c => (
                      <button
                        key={c}
                        type="button"
                        className={`rb-cond-btn rb-cond-btn--${c.toLowerCase()}${condition === c ? ' selected' : ''}`}
                        onClick={() => setCondition(c)}
                      >
                        {c === 'Good' ? '✓ Good' : '⚠ Damaged'}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Modal footer */}
            <div className="rb-modal-footer">
              {step > 1 && (
                <button type="button" className="rb-btn rb-btn--ghost" onClick={() => setStep(s => s - 1)}>
                  Back
                </button>
              )}
              <button type="button" className="rb-btn rb-btn--ghost rb-modal-cancel" onClick={closeModal}>
                Cancel
              </button>
              {step === 2 && selected && memberLoans.length > 0 && (
                <button type="button" className="rb-btn rb-btn--primary" onClick={() => setStep(3)}>
                  Continue
                </button>
              )}
              {step === 3 && (
                <button type="button" className="rb-btn rb-btn--success" onClick={handleConfirmReturn}>
                  Confirm Return
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
