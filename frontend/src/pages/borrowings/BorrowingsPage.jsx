import './BorrowingsPage.css'

const records = [
  { id: 'BR-001', member: 'Kasun Perera',    memberId: 'MEM-881', book: 'Discrete Mathematics', issued: '08/09/2026', due: '15/09/2026', returned: '-',         days: 0, fine: 0, status: 'BORROWED' },
  { id: 'BR-002', member: 'N.S. Fernando',   memberId: 'MEM-112', book: 'Engineering Mechanics', issued: '01/09/2026', due: '08/09/2026', returned: '-',         days: 7, fine: 7, status: 'OVERDUE'  },
  { id: 'BR-003', member: 'Dilani Wickrama', memberId: 'MEM-084', book: 'Modern OS (4th Ed)',    issued: '20/08/2026', due: '27/08/2026', returned: '27/08/2026', days: 0, fine: 0, status: 'RETURNED' },
  { id: 'BR-004', member: 'Sahan Alwis',     memberId: 'MEM-404', book: 'Digital Signal Proc.', issued: '10/09/2026', due: '17/09/2026', returned: '-',         days: 0, fine: 0, status: 'BORROWED' },
]

const S = {
  BORROWED: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  RETURNED: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  OVERDUE:  { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
}

export default function BorrowingsPage() {
  return (
    <div className="brw">
      <div className="brw-header">
        <div>
          <h2 className="brw-title">Borrowings</h2>
          <p className="brw-sub">Complete borrowing history &mdash; records are never deleted</p>
        </div>
      </div>
      <div className="brw-card">
        <table className="brw-table">
          <thead>
            <tr>
              <th>BORROW ID</th><th>MEMBER</th><th>BOOK</th><th>ISSUE DATE</th>
              <th>DUE DATE</th><th>RETURN DATE</th><th>OVERDUE DAYS</th><th>FINE</th><th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => {
              const st = S[r.status]
              return (
                <tr key={r.id}>
                  <td><span className="brw-id">{r.id}</span></td>
                  <td>
                    <div className="brw-name">{r.member}</div>
                    <div className="brw-sub2">{r.memberId}</div>
                  </td>
                  <td className="brw-book">{r.book}</td>
                  <td>{r.issued}</td>
                  <td>{r.due}</td>
                  <td>{r.returned}</td>
                  <td><span style={{ color: r.days > 0 ? '#ef4444' : '#16a34a', fontWeight: 700 }}>{r.days}</span></td>
                  <td><span style={{ color: r.fine > 0 ? '#ef4444' : '#16a34a', fontWeight: 700 }}>Rs.{r.fine}</span></td>
                  <td>
                    <span className="brw-status" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="brw-footer">
          {records.length} records &mdash; permanent history, never deleted
        </div>
      </div>
    </div>
  )
}
