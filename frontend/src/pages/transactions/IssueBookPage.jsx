import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api/client'
import './IssueBookPage.css'

const BORROWING_PERIOD_DAYS = 14

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function parseDate(str) {
  if (!str) return new Date()
  if (str.includes('-')) {
    const [y, m, d] = str.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
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

const STATUS_STYLE = {
  BORROWED: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  OVERDUE:  { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
}

const BookIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const CheckIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
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
            const st = STATUS_STYLE[r.status] || STATUS_STYLE.BORROWED
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
  const [books, setBooks]               = useState([])
  const [members, setMembers]           = useState([])
  const [issuedRecords, setIssued]     = useState([])
  const [loading, setLoading]           = useState(true)

  const [step, setStep]                 = useState(1)
  const [phone, setPhone]               = useState('')
  const [searchErr, setSearchErr]       = useState('')
  const [member, setMember]             = useState(null)
  const [bookSearch, setBookSearch]     = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [success, setSuccess]           = useState(false)
  const [showModal, setShowModal]       = useState(false)

  const issueDate = new Date()
  const dueDate   = addDays(issueDate, BORROWING_PERIOD_DAYS)

  const loadAll = useCallback(async () => {
    try {
      setLoading(true)
      const [allBooks, allMembers, allBorrows] = await Promise.all([
        api.getBooks(),
        api.getMembers(),
        api.getBorrowings()
      ])

      setBooks(allBooks.map(b => ({
        ...b,
        dbId: b.id,
        id: b.book_id || `BK-${b.id}`,
      })))

      setMembers(allMembers)

      const active = allBorrows
        .filter(b => b.status === 'BORROWED' || b.status === 'OVERDUE')
        .map(b => ({
          id:       b.borrow_id || `BR-${b.id}`,
          book:     b.book_title,
          member:   b.member_name,
          memberId: b.mem_id,
          issued:   b.issued_date,
          due:      b.due_date,
          status:   b.status,
        }))

      setIssued(active)
    } catch (err) {
      console.error('Failed to load issue page data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const totalCatalogBooks = books.reduce((sum, b) => sum + (b.total || 0), 0)
  const availBooks        = books.reduce((sum, b) => sum + (b.available || 0), 0)
  const issuedBooks       = issuedRecords.length
  const dueRecords        = issuedRecords.filter(isDueRecord)
  const dueBooks          = dueRecords.length

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
    const q = phone.trim().replace(/\s/g, '').toLowerCase()
    if (!q) { setSearchErr('Please enter phone or ID'); return }

    const found = members.find(m =>
      (m.phone && m.phone.replace(/\s/g, '').includes(q)) ||
      (m.mem_id && m.mem_id.toLowerCase().includes(q)) ||
      (m.name && m.name.toLowerCase().includes(q))
    )

    if (!found) {
      setSearchErr('No registered member found with this phone number or ID.')
      return
    }

    setSearchErr('')
    setMember({
      dbId:   found.id,
      id:     found.mem_id || `MEM-${found.id}`,
      name:   found.name,
      phone:  found.phone,
      status: found.status,
    })
    setStep(2)
  }

  const handleConfirm = async () => {
    if (!member || !selectedBook) return
    try {
      await api.issueBorrowing({
        member_id: member.dbId || member.id,
        book_id:   selectedBook.dbId || selectedBook.id,
        due_date:  dueDate.toISOString().slice(0, 10),
      })
      await loadAll()
      setSuccess(true)
      setShowModal(false)
    } catch (err) {
      alert(err.message || 'Failed to issue book')
    }
  }

  const reset = () => {
    setStep(1)
    setPhone('')
    setMember(null)
    setSelectedBook(null)
    setSuccess(false)
    setShowModal(false)
  }

  if (success && member && selectedBook) {
    return (
      <div className="ib-page">
        <div className="ib-success-card">
          <div className="ib-success-icon">✓</div>
          <h2>Book Issued Successfully</h2>
          <p>
            <strong>{selectedBook.title}</strong> has been issued to <strong>{member.name}</strong> ({member.id}).
          </p>
          <div className="ib-success-meta">
            <span>Issue Date: <strong>{formatDate(issueDate)}</strong></span>
            <span>Due Date: <strong className="ib-due-text">{formatDate(dueDate)}</strong></span>
            <span>Borrowing Period: <strong>{BORROWING_PERIOD_DAYS} Days</strong></span>
          </div>
          <button className="ib-btn ib-btn--primary" onClick={reset}>
            Issue Another Book
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ib-page">
      {/* Header */}
      <div className="ib-header">
        <div>
          <h2 className="ib-title">Issue Book</h2>
          <p className="ib-subtitle">Search member, select book, and confirm issue</p>
        </div>
        <button type="button" className="ib-btn ib-btn--primary" onClick={openFindMember}>
          <IssuedIcon /> Issue Book
        </button>
      </div>

      {/* KPI Cards */}
      <div className="ib-kpi-row">
        <div className="ib-kpi">
          <div className="ib-kpi-icon ib-kpi-icon--blue"><BookIcon /></div>
          <div className="ib-kpi-body">
            <div className="ib-kpi-label">TOTAL BOOKS</div>
            <div className="ib-kpi-value">{totalCatalogBooks}</div>
            <div className="ib-kpi-sub">{books.length} unique titles in catalog</div>
          </div>
        </div>
        <div className="ib-kpi">
          <div className="ib-kpi-icon ib-kpi-icon--green"><CheckIcon /></div>
          <div className="ib-kpi-body">
            <div className="ib-kpi-label">AVAILABLE BOOKS</div>
            <div className="ib-kpi-value ib-kpi-value--green">{availBooks}</div>
            <div className="ib-kpi-sub">Ready for immediate issue</div>
          </div>
        </div>
        <div className="ib-kpi">
          <div className="ib-kpi-icon ib-kpi-icon--indigo"><IssuedIcon /></div>
          <div className="ib-kpi-body">
            <div className="ib-kpi-label">CURRENTLY ISSUED</div>
            <div className="ib-kpi-value">{issuedBooks}</div>
            <div className="ib-kpi-sub">Active loans in circulation</div>
          </div>
        </div>
        <div className={`ib-kpi${dueBooks > 0 ? ' ib-kpi--warn' : ''}`}>
          <div className="ib-kpi-icon ib-kpi-icon--red"><DueIcon /></div>
          <div className="ib-kpi-body">
            <div className="ib-kpi-label">DUE / OVERDUE</div>
            <div className={`ib-kpi-value${dueBooks > 0 ? ' ib-kpi-value--red' : ''}`}>{dueBooks}</div>
            <div className="ib-kpi-sub">Need to be returned</div>
          </div>
        </div>
      </div>

      {/* Toolbar / Search Bar */}
      <div className="ib-toolbar">
        <div className="ib-search">
          <SearchIcon />
          <input
            className="ib-toolbar-input"
            placeholder="Search member by phone or ID to start issuing..."
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && openFindMember()}
          />
          {phone && (
            <button
              type="button"
              className="ib-search-clear"
              onClick={() => setPhone('')}
              title="Clear"
            >
              ✕
            </button>
          )}
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
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading circulation records...</div>
        ) : (
          <>
            <IssuedList records={issuedRecords} />
            <DueList records={dueRecords} />
          </>
        )}
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
                  {step === 1 && 'Enter member phone number or ID to start issuing a book'}
                  {step === 2 && 'Choose an available book from the catalog'}
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
                  <label className="ib-label">Member Phone Number or ID</label>
                  <div className="ib-input-row">
                    <input
                      className="ib-input"
                      type="text"
                      placeholder="e.g. 076 554 1122 or MEM-001"
                      value={phone}
                      onChange={e => { setPhone(e.target.value); setSearchErr('') }}
                      autoFocus
                    />
                    <button type="submit" className="ib-btn ib-btn--primary">Search</button>
                  </div>
                  {searchErr && <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px' }}>{searchErr}</div>}
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                    Try: 076 554 1122 &bull; 071 882 3891 &bull; MEM-001
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
                    <span className="ib-active">{member.status || 'ACTIVE'}</span>
                  </div>
                  <div className="ib-input-row" style={{ marginTop: 16 }}>
                    <input
                      className="ib-input"
                      type="text"
                      placeholder="Search available books by title, author, or ISBN..."
                      value={bookSearch}
                      onChange={e => setBookSearch(e.target.value)}
                    />
                  </div>
                  <div className="ib-book-list">
                    {books
                      .filter(b => b.available > 0)
                      .filter(b => !bookSearch || b.title.toLowerCase().includes(bookSearch.toLowerCase()) || b.author.toLowerCase().includes(bookSearch.toLowerCase()))
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
