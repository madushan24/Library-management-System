import { useState } from 'react'
import './ReturnBookPage.css'

const FINE_PER_DAY = 1

function calcFine(dueDate, returnDate) {
  const due  = new Date(dueDate)
  const ret  = new Date(returnDate)
  const days = Math.max(0, Math.ceil((ret - due) / (1000 * 60 * 60 * 24)))
  return { days, fine: days * FINE_PER_DAY }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB')
}

const borrowedBooks = [
  { id: 'BR-001', title: 'Discrete Mathematics & Its Applications', acc: 'ACC-88219', issued: '2026-09-08', due: '2026-09-15' },
  { id: 'BR-002', title: 'Algorithm Design: Foundations Vol. II',    acc: 'ACC-74301', issued: '2026-09-05', due: '2026-09-12' },
]

export default function ReturnBookPage() {
  const [phone, setPhone]       = useState('')
  const [member, setMember]     = useState(null)
  const [selected, setSelected] = useState(null)
  const [success, setSuccess]   = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const fineInfo = selected ? calcFine(selected.due, today) : null

  const handleFind = (e) => {
    e.preventDefault()
    if (phone.trim()) setMember({ id: 'MEM-881', name: 'Kasun Perera', phone })
  }

  const handleReturn = () => setSuccess(true)

  const reset = () => { setPhone(''); setMember(null); setSelected(null); setSuccess(false) }

  if (success) {
    return (
      <div className="rb">
        <div className="rb-success">
          <div className="rb-success-icon">&#10003;</div>
          <h2>Book Returned Successfully</h2>
          <p><strong>{selected.title}</strong> returned by <strong>{member.name}</strong></p>
          {fineInfo && fineInfo.fine > 0 && (
            <p className="rb-fine-note">Fine collected: <strong>Rs. {fineInfo.fine}.00</strong></p>
          )}
          <button className="rb-new-btn" onClick={reset}>Process Another Return</button>
        </div>
      </div>
    )
  }

  return (
    <div className="rb">
      <div className="rb-header">
        <h2 className="rb-title">Return Book</h2>
        <p className="rb-sub">Process returns and calculate overdue fines automatically</p>
      </div>

      {!member && (
        <div className="rb-card">
          <h3 className="rb-card-title">Find Member by Phone</h3>
          <form onSubmit={handleFind} className="rb-form">
            <div className="rb-input-row">
              <input className="rb-input" placeholder="Enter phone number..." value={phone}
                onChange={e => setPhone(e.target.value)} />
              <button type="submit" className="rb-btn rb-btn--primary">Find Member</button>
            </div>
          </form>
        </div>
      )}

      {member && !selected && (
        <div className="rb-card">
          <div className="rb-member-banner">
            <div className="rb-member-av">{member.name[0]}</div>
            <div>
              <div className="rb-member-name">{member.name}</div>
              <div className="rb-member-meta">{member.id} &bull; {member.phone}</div>
            </div>
          </div>
          <h3 className="rb-card-title" style={{ marginTop: 18 }}>Select Book to Return</h3>
          <div className="rb-book-list">
            {borrowedBooks.map(b => {
              const fi = calcFine(b.due, today)
              return (
                <div key={b.id} className="rb-book-item" onClick={() => setSelected(b)}>
                  <div>
                    <div className="rb-book-name">{b.title}</div>
                    <div className="rb-book-meta">
                      {b.acc} &bull; Issued: {formatDate(b.issued)} &bull; Due: {formatDate(b.due)}
                    </div>
                  </div>
                  <div className="rb-book-right">
                    {fi.days > 0
                      ? <span className="rb-overdue-badge">{fi.days}d overdue &mdash; Rs.{fi.fine}</span>
                      : <span className="rb-ok-badge">On time</span>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {member && selected && fineInfo && (
        <div className="rb-card">
          <h3 className="rb-card-title">Confirm Return</h3>
          <div className="rb-confirm-grid">
            <div className="rb-row"><span>Member</span><strong>{member.name}</strong></div>
            <div className="rb-row"><span>Book</span><strong>{selected.title}</strong></div>
            <div className="rb-row"><span>Issue Date</span><strong>{formatDate(selected.issued)}</strong></div>
            <div className="rb-row"><span>Due Date</span><strong>{formatDate(selected.due)}</strong></div>
            <div className="rb-row"><span>Return Date</span><strong>{formatDate(today)}</strong></div>
            <div className="rb-row">
              <span>Overdue Days</span>
              <strong style={{ color: fineInfo.days > 0 ? '#ef4444' : '#16a34a' }}>{fineInfo.days}</strong>
            </div>
            <div className="rb-row rb-row--fine">
              <span>Fine</span>
              <strong style={{ color: fineInfo.fine > 0 ? '#ef4444' : '#16a34a', fontSize: 18 }}>
                Rs. {fineInfo.fine}.00
              </strong>
            </div>
          </div>
          <div className="rb-confirm-actions">
            <button className="rb-btn rb-btn--ghost" onClick={() => setSelected(null)}>Back</button>
            <button className="rb-btn rb-btn--success" onClick={handleReturn}>Confirm Return</button>
          </div>
        </div>
      )}
    </div>
  )
}
