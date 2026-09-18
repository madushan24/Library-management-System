import { useState } from 'react'
import './IssueBookPage.css'

const BORROWING_PERIOD_DAYS = 7

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const mockBooks = [
  { id: 'BK-001', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson', available: 2 },
  { id: 'BK-003', title: 'Discrete Mathematics', author: 'Kenneth H. Rosen', available: 3 },
  { id: 'BK-006', title: 'The C Programming Language', author: 'Kernighan & Ritchie', available: 4 },
]

const catalogStats = [
  { total: 5 }, { total: 4 }, { total: 6 }, { total: 3 },
  { total: 2 }, { total: 4 }, { total: 3 },
]

const issuedRecords = [
  { id: 'BR-001', member: 'Kasun Perera',    memberId: 'MEM-881', book: 'Discrete Mathematics',     issued: '08/09/2026', due: '15/09/2026', status: 'BORROWED' },
  { id: 'BR-002', member: 'N.S. Fernando',   memberId: 'MEM-112', book: 'Engineering Mechanics',  issued: '01/09/2026', due: '08/09/2026', status: 'OVERDUE'  },
  { id: 'BR-004', member: 'Sahan Alwis',     memberId: 'MEM-404', book: 'Digital Signal Proc.',   issued: '10/09/2026', due: '17/09/2026', status: 'BORROWED' },
]

function parseDate(str) {
  const [d, m, y] = str.split('/').map(Number)
  return new Date(y, m - 1, d)
}

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function getOverdueDays(dueStr) {
  const diff = startOfDay(new Date()) - startOfDay(parseDate(dueStr))
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

function isDueRecord(record) {
  return record.status === 'OVERDUE' || getOverdueDays(record.due) > 0
}

const totalBooks  = catalogStats.reduce((sum, b) => sum + b.total, 0)
const issuedBooks = issuedRecords.length
const dueRecords  = issuedRecords.filter(isDueRecord)
const dueBooks    = dueRecords.length

const STATUS_STYLE = {
  BORROWED: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  OVERDUE:  { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
}

const BookIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const IssuedIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
const DueIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const SearchIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const UserIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const XIcon      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

function IssuedList({ records }) {
  return (
    <div className="ib-list-panel">
      <div className="ib-list-header">
        <h3 className="ib-list-title">Issued Books</h3>
        <span className="ib-list-count">{records.length} active</span>
      </div>
      <div className="ib-list-body">
        {records.length === 0 ? (
          <p className="ib-list-empty">No books currently issued.</p>
        ) : (
          records.map(r => {
            const st = STATUS_STYLE[r.status]
            const overdueDays = getOverdueDays(r.due)
            return (
              <div key={r.id} className="ib-list-item">
                <div className="ib-list-item-top">
                  <span className="ib-list-id">{r.id}</span>
                  <span className="ib-list-status" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                    {r.status}
                  </span>
                </div>
                <div className="ib-list-book">{r.book}</div>
                <div className="ib-list-member">{r.member} &bull; {r.memberId}</div>
                <div className="ib-list-dates">
                  <span>Issued: {r.issued}</span>
                  <span className={overdueDays > 0 ? 'ib-list-due--overdue' : ''}>Due: {r.due}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function DueList({ records }) {
  return (
    <div className="ib-list-panel ib-list-panel--due">
      <div className="ib-list-header">
        <h3 className="ib-list-title">Due Books</h3>
        <span className="ib-list-count ib-list-count--red">{records.length} overdue</span>
      </div>
      <div className="ib-list-body">
        {records.length === 0 ? (
          <p className="ib-list-empty">No overdue books right now.</p>
        ) : (
          records.map(r => {
            const overdueDays = getOverdueDays(r.due)
            return (
              <div key={r.id} className="ib-list-item ib-list-item--due">
                <div className="ib-list-item-top">
                  <span className="ib-list-id">{r.id}</span>
                  <span className="ib-list-overdue">{overdueDays}d overdue</span>
                </div>
                <div className="ib-list-book">{r.book}</div>
                <div className="ib-list-member">{r.member} &bull; {r.memberId}</div>
                <div className="ib-list-dates">
                  <span>Due: {r.due}</span>
                  <span className="ib-list-fine">Fine: Rs.{overdueDays}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default function IssueBookPage() {
  const [step, setStep]                 = useState(1)
  const [phone, setPhone]               = useState('')
  const [member, setMember]             = useState(null)
  const [bookSearch, setBookSearch]     = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [success, setSuccess]           = useState(false)
  const [showModal, setShowModal]       = useState(false)

  const issueDate = new Date()
  const dueDate   = addDays(issueDate, BORROWING_PERIOD_DAYS)

  const openFindMember = () => {
    setStep(1)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    if (step === 1) setPhone('')
  }

  const handleFindMember = (e) => {
    e.preventDefault()
    if (phone.trim()) {
      setMember({ id: 'MEM-881', name: 'Kasun Perera', phone, status: 'ACTIVE' })
      setStep(2)
    }
  }

  const handleConfirm = () => {
    setSuccess(true)
    setShowModal(false)
  }

  const reset = () => {
    setStep(1)
    setPhone('')
    setMember(null)
    setSelectedBook(null)
    setBookSearch('')
    setSuccess(false)
    setShowModal(false)
  }

  if (success) {
    return (
      <div className="ib">
        <div className="ib-success">
          <div className="ib-success-icon">&#10003;</div>
          <h2>Book Issued Successfully</h2>
          <p><strong>{selectedBook.title}</strong> issued to <strong>{member.name}</strong></p>
          <p className="ib-success-dates">
            Issue Date: {formatDate(issueDate)} &nbsp;|&nbsp; Due Date: {formatDate(dueDate)}
          </p>
          <button className="ib-new-btn" onClick={reset}>Issue Another Book</button>
        </div>
      </div>
    )
  }

  return (
    <div className="ib">
      <div className="ib-header">
        <h2 className="ib-title">Issue Book</h2>
        <p className="ib-sub">Issue a book to a member and track active loans</p>
      </div>

      <div className="ib-kpi-row">
        <div className="ib-kpi">
          <div className="ib-kpi-icon ib-kpi-icon--blue"><BookIcon /></div>
          <div className="ib-kpi-body">
            <div className="ib-kpi-label">Total Books</div>
            <div className="ib-kpi-value">{totalBooks}</div>
            <div className="ib-kpi-sub">{catalogStats.length} titles in catalog</div>
          </div>
        </div>
        <div className="ib-kpi">
          <div className="ib-kpi-icon ib-kpi-icon--indigo"><IssuedIcon /></div>
          <div className="ib-kpi-body">
            <div className="ib-kpi-label">Issued Books</div>
            <div className="ib-kpi-value">{issuedBooks}</div>
            <div className="ib-kpi-sub">Currently on loan to members</div>
          </div>
        </div>
        <div className="ib-kpi ib-kpi--warn">
          <div className="ib-kpi-icon ib-kpi-icon--red"><DueIcon /></div>
          <div className="ib-kpi-body">
            <div className="ib-kpi-label">Due Books</div>
            <div className="ib-kpi-value ib-kpi-value--red">{dueBooks}</div>
            <div className="ib-kpi-sub">Past due date — return pending</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="ib-toolbar">
        <div className="ib-toolbar-search">
          <SearchIcon />
          <input
            className="ib-toolbar-input"
            type="text"
            placeholder="Search member by phone number..."
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && openFindMember()}
          />
        </div>
        <button type="button" className="ib-btn ib-btn--primary" onClick={openFindMember}>
          <UserIcon /> Find Member
        </button>
        {member && (
          <div className="ib-toolbar-member">
            <span className="ib-toolbar-member-label">Selected:</span>
            <strong>{member.name}</strong>
            <span className="ib-toolbar-member-id">{member.id}</span>
            <button type="button" className="ib-toolbar-continue" onClick={() => { setStep(2); setShowModal(true) }}>
              Continue Issue
            </button>
          </div>
        )}
      </div>

      {/* Lists — left & right */}
      <div className="ib-lists-row">
        <IssuedList records={issuedRecords} />
        <DueList records={dueRecords} />
      </div>

      {/* Issue flow modal */}
      {showModal && (
        <div className="ib-modal-backdrop" onClick={closeModal}>
          <div className="ib-modal" onClick={e => e.stopPropagation()}>
            <div className="ib-modal-header">
              <div>
                <h3 className="ib-modal-title">
                  {step === 1 && 'Find Member'}
                  {step === 2 && 'Select Book'}
                  {step === 3 && 'Confirm Issue'}
                </h3>
                <p className="ib-modal-sub">
                  {step === 1 && 'Enter member phone number to start issuing a book'}
                  {step === 2 && 'Choose a book from the available catalog'}
                  {step === 3 && 'Review details before confirming the issue'}
                </p>
              </div>
              <button type="button" className="ib-modal-close" onClick={closeModal}><XIcon /></button>
            </div>

            <div className="ib-modal-steps">
              {['Find Member', 'Select Book', 'Confirm Issue'].map((s, i) => (
                <div key={i} className={`ib-modal-step${step === i + 1 ? ' active' : step > i + 1 ? ' done' : ''}`}>
                  <div className="ib-modal-step-num">{step > i + 1 ? '✓' : i + 1}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div className="ib-modal-body">
              {step === 1 && (
                <form onSubmit={handleFindMember} className="ib-form">
                  <label className="ib-label">Member Phone Number</label>
                  <div className="ib-input-row">
                    <input
                      className="ib-input"
                      type="text"
                      placeholder="e.g. 0771234567"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className="ib-btn ib-btn--primary">Search</button>
                  </div>
                </form>
              )}

              {step === 2 && member && (
                <>
                  <div className="ib-found-member">
                    <div className="ib-member-av">{member.name[0]}</div>
                    <div>
                      <div className="ib-member-name">{member.name}</div>
                      <div className="ib-member-meta">{member.id} &bull; {member.phone}</div>
                    </div>
                    <span className="ib-active">ACTIVE</span>
                  </div>
                  <div className="ib-input-row" style={{ marginTop: 16 }}>
                    <input
                      className="ib-input"
                      type="text"
                      placeholder="Search by title, ISBN or author..."
                      value={bookSearch}
                      onChange={e => setBookSearch(e.target.value)}
                    />
                  </div>
                  <div className="ib-book-list">
                    {mockBooks
                      .filter(b => !bookSearch || b.title.toLowerCase().includes(bookSearch.toLowerCase()))
                      .map(b => (
                        <div
                          key={b.id}
                          className={`ib-book-item${selectedBook?.id === b.id ? ' selected' : ''}`}
                          onClick={() => setSelectedBook(b)}
                        >
                          <div>
                            <div className="ib-book-name">{b.title}</div>
                            <div className="ib-book-auth">{b.author}</div>
                          </div>
                          <span className="ib-avail">{b.available} available</span>
                        </div>
                      ))}
                  </div>
                </>
              )}

              {step === 3 && member && selectedBook && (
                <div className="ib-confirm-grid">
                  <div className="ib-confirm-row"><span>Member</span><strong>{member.name} ({member.id})</strong></div>
                  <div className="ib-confirm-row"><span>Book</span><strong>{selectedBook.title}</strong></div>
                  <div className="ib-confirm-row"><span>Issue Date</span><strong>{formatDate(issueDate)}</strong></div>
                  <div className="ib-confirm-row"><span>Due Date</span><strong className="ib-due-text">{formatDate(dueDate)}</strong></div>
                  <div className="ib-confirm-row"><span>Borrowing Period</span><strong>{BORROWING_PERIOD_DAYS} Days</strong></div>
                </div>
              )}
            </div>

            <div className="ib-modal-footer">
              {step > 1 && (
                <button type="button" className="ib-btn ib-btn--ghost" onClick={() => setStep(s => s - 1)}>
                  Back
                </button>
              )}
              <button type="button" className="ib-btn ib-btn--ghost ib-modal-cancel" onClick={closeModal}>
                Cancel
              </button>
              {step === 2 && selectedBook && (
                <button type="button" className="ib-btn ib-btn--primary" onClick={() => setStep(3)}>
                  Continue
                </button>
              )}
              {step === 3 && (
                <button type="button" className="ib-btn ib-btn--success" onClick={handleConfirm}>
                  Confirm Issue
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
