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

export default function IssueBookPage() {
  const [step, setStep]               = useState(1)
  const [phone, setPhone]             = useState('')
  const [member, setMember]           = useState(null)
  const [bookSearch, setBookSearch]   = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [success, setSuccess]         = useState(false)

  const issueDate = new Date()
  const dueDate   = addDays(issueDate, BORROWING_PERIOD_DAYS)

  const handleFindMember = (e) => {
    e.preventDefault()
    if (phone.trim()) {
      setMember({ id: 'MEM-881', name: 'Kasun Perera', phone, status: 'ACTIVE' })
      setStep(2)
    }
  }

  const handleConfirm = () => setSuccess(true)

  const reset = () => {
    setStep(1); setPhone(''); setMember(null)
    setSelectedBook(null); setSuccess(false)
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
        <p className="ib-sub">Issue a book to a member in 3 steps</p>
      </div>

      <div className="ib-steps">
        {['Find Member', 'Select Book', 'Confirm Issue'].map((s, i) => (
          <div key={i} className={`ib-step${step === i + 1 ? ' active' : step > i + 1 ? ' done' : ''}`}>
            <div className="ib-step-num">{step > i + 1 ? '&#10003;' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="ib-body">
        {step === 1 && (
          <div className="ib-card">
            <h3 className="ib-card-title">Step 1 - Find Member</h3>
            <form onSubmit={handleFindMember} className="ib-form">
              <label className="ib-label">Member Phone Number</label>
              <div className="ib-input-row">
                <input className="ib-input" type="text" placeholder="e.g. 0771234567"
                  value={phone} onChange={e => setPhone(e.target.value)} />
                <button type="submit" className="ib-btn ib-btn--primary">Find Member</button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && member && (
          <div className="ib-card">
            <div className="ib-found-member">
              <div className="ib-member-av">{member.name[0]}</div>
              <div>
                <div className="ib-member-name">{member.name}</div>
                <div className="ib-member-meta">{member.id} &bull; {member.phone}</div>
              </div>
              <span className="ib-active">ACTIVE</span>
            </div>
            <h3 className="ib-card-title" style={{ marginTop: 20 }}>Step 2 - Select Book</h3>
            <div className="ib-input-row">
              <input className="ib-input" type="text" placeholder="Search by title, ISBN or author..."
                value={bookSearch} onChange={e => setBookSearch(e.target.value)} />
            </div>
            <div className="ib-book-list">
              {mockBooks
                .filter(b => !bookSearch || b.title.toLowerCase().includes(bookSearch.toLowerCase()))
                .map(b => (
                  <div key={b.id}
                    className={`ib-book-item${selectedBook?.id === b.id ? ' selected' : ''}`}
                    onClick={() => setSelectedBook(b)}>
                    <div>
                      <div className="ib-book-name">{b.title}</div>
                      <div className="ib-book-auth">{b.author}</div>
                    </div>
                    <span className="ib-avail">{b.available} available</span>
                  </div>
                ))}
            </div>
            {selectedBook && (
              <button className="ib-btn ib-btn--primary" style={{ marginTop: 14 }}
                onClick={() => setStep(3)}>
                Continue
              </button>
            )}
          </div>
        )}

        {step === 3 && member && selectedBook && (
          <div className="ib-card">
            <h3 className="ib-card-title">Step 3 - Confirm Issue</h3>
            <div className="ib-confirm-grid">
              <div className="ib-confirm-row"><span>Member</span><strong>{member.name} ({member.id})</strong></div>
              <div className="ib-confirm-row"><span>Book</span><strong>{selectedBook.title}</strong></div>
              <div className="ib-confirm-row"><span>Issue Date</span><strong>{formatDate(issueDate)}</strong></div>
              <div className="ib-confirm-row"><span>Due Date</span><strong style={{ color: '#ef4444' }}>{formatDate(dueDate)}</strong></div>
              <div className="ib-confirm-row"><span>Borrowing Period</span><strong>{BORROWING_PERIOD_DAYS} Days</strong></div>
            </div>
            <div className="ib-confirm-actions">
              <button className="ib-btn ib-btn--ghost" onClick={() => setStep(2)}>Back</button>
              <button className="ib-btn ib-btn--success" onClick={handleConfirm}>Confirm Issue</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
