import { useState } from 'react'
import './FinesPage.css'

const fines = [
  { id: 'FN-001', member: 'N.S. Fernando',   phone: '071 882 3891', book: 'Engineering Mechanics',  days: 10, amount: 10, paid: 0,  method: '-',    date: '15/09/2026', status: 'UNPAID' },
  { id: 'FN-002', member: 'K.M. Bandara',    phone: '077 234 5678', book: 'Data Structures in C++', days: 14, amount: 14, paid: 14, method: 'Cash', date: '14/09/2026', status: 'PAID'   },
  { id: 'FN-003', member: 'Sahan Alwis',     phone: '078 991 4455', book: 'Digital Signal Proc.',   days: 7,  amount: 7,  paid: 0,  method: '-',    date: '13/09/2026', status: 'UNPAID' },
  { id: 'FN-004', member: 'Dilani Wickrama', phone: '071 987 6543', book: 'Modern Operating Sys.',  days: 3,  amount: 3,  paid: 3,  method: 'Card', date: '10/09/2026', status: 'WAIVED' },
]

const S = {
  UNPAID: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  PAID:   { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  WAIVED: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
}

export default function FinesPage() {
  const [list] = useState(fines)
  const total   = list.reduce((s, f) => s + f.amount, 0)
  const paid    = list.filter(f => f.status === 'PAID').reduce((s, f) => s + f.paid, 0)
  const unpaid  = list.filter(f => f.status === 'UNPAID').reduce((s, f) => s + f.amount, 0)

  return (
    <div className="fn">
      <div className="fn-header">
        <h2 className="fn-title">Fines</h2>
        <p className="fn-sub">Track and collect overdue fines — Rs. 1.00 per day</p>
      </div>

      <div className="fn-stats">
        <div className="fn-stat"><div className="fn-stat-label">TOTAL FINES</div><div className="fn-stat-val">Rs. {total}.00</div></div>
        <div className="fn-stat fn-stat--paid"><div className="fn-stat-label">PAID</div><div className="fn-stat-val fn-green">Rs. {paid}.00</div></div>
        <div className="fn-stat fn-stat--unpaid"><div className="fn-stat-label">UNPAID</div><div className="fn-stat-val fn-red">Rs. {unpaid}.00</div></div>
        <div className="fn-stat"><div className="fn-stat-label">TODAY'S COLLECTION</div><div className="fn-stat-val">Rs. 0.00</div></div>
      </div>

      <div className="fn-card">
        <table className="fn-table">
          <thead>
            <tr><th>FINE ID</th><th>MEMBER</th><th>PHONE</th><th>BOOK</th><th>OVERDUE DAYS</th><th>AMOUNT</th><th>PAID</th><th>METHOD</th><th>DATE</th><th>STATUS</th><th>ACTION</th></tr>
          </thead>
          <tbody>
            {list.map(f => {
              const st = S[f.status]
              return (
                <tr key={f.id}>
                  <td><span className="fn-id">{f.id}</span></td>
                  <td><span className="fn-name">{f.member}</span></td>
                  <td className="fn-phone">{f.phone}</td>
                  <td className="fn-book">{f.book}</td>
                  <td><span className="fn-days">{f.days}</span></td>
                  <td><span className="fn-amount">Rs. {f.amount}.00</span></td>
                  <td>Rs. {f.paid}.00</td>
                  <td>{f.method}</td>
                  <td>{f.date}</td>
                  <td><span className="fn-status" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>{f.status}</span></td>
                  <td>{f.status === 'UNPAID' && <button className="fn-collect-btn">Collect</button>}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="fn-footer">{list.length} fine records</div>
      </div>
    </div>
  )
}
