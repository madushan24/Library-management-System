import { useState } from 'react'
import './MembersPage.css'

const members = [
  { id: 'MEM-001', name: 'Kasun Perera',      phone: '077 123 4567', email: 'kasun@gmail.com',    nic: '199812345678', status: 'ACTIVE',    borrowed: 2, registered: '12 Jan 2024' },
  { id: 'MEM-002', name: 'Dilani Wickrama',   phone: '071 987 6543', email: 'dilani@gmail.com',   nic: '200012349876', status: 'ACTIVE',    borrowed: 1, registered: '18 Feb 2024' },
  { id: 'MEM-003', name: 'Sahan Alwis',       phone: '078 991 4455', email: 'sahan@gmail.com',    nic: '199934561234', status: 'SUSPENDED', borrowed: 0, registered: '05 Mar 2024' },
  { id: 'MEM-004', name: 'N.S. Fernando',     phone: '071 882 3891', email: 'nsfern@gmail.com',   nic: '200145678901', status: 'ACTIVE',    borrowed: 3, registered: '20 Mar 2024' },
  { id: 'MEM-005', name: 'K.M. Bandara',      phone: '077 234 5678', email: 'kmbandara@gmail.com',nic: '199867890123', status: 'INACTIVE',  borrowed: 0, registered: '02 Apr 2024' },
]

const STATUS_COLOR = { ACTIVE: '#16a34a', INACTIVE: '#64748b', SUSPENDED: '#ef4444' }
const STATUS_BG    = { ACTIVE: '#f0fdf4', INACTIVE: '#f8fafc', SUSPENDED: '#fef2f2' }
const STATUS_BORDER= { ACTIVE: '#bbf7d0', INACTIVE: '#e2e8f0', SUSPENDED: '#fecaca' }

const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const PlusIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>

export default function MembersPage() {
  const [search, setSearch] = useState('')
  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search) ||
    m.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mp">
      <div className="mp-header">
        <div>
          <h2 className="mp-title">Members</h2>
          <p className="mp-sub">Manage library members and their borrowing status</p>
        </div>
        <button className="mp-add-btn"><PlusIcon /> Register Member</button>
      </div>

      <div className="mp-toolbar">
        <div className="mp-search">
          <SearchIcon />
          <input placeholder="Search by name, phone, member ID…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="mp-filters">
          <select className="mp-select"><option>All Status</option><option>ACTIVE</option><option>INACTIVE</option><option>SUSPENDED</option></select>
        </div>
      </div>

      <div className="mp-card">
        <table className="mp-table">
          <thead>
            <tr>
              <th>MEMBER ID</th><th>FULL NAME</th><th>PHONE</th><th>EMAIL</th><th>NIC</th>
              <th>REGISTERED</th><th>BORROWED</th><th>STATUS</th><th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id}>
                <td><span className="mp-id">{m.id}</span></td>
                <td><span className="mp-name">{m.name}</span></td>
                <td>{m.phone}</td>
                <td className="mp-email">{m.email}</td>
                <td>{m.nic}</td>
                <td>{m.registered}</td>
                <td><span className="mp-borrowed">{m.borrowed}</span></td>
                <td>
                  <span className="mp-status" style={{ color: STATUS_COLOR[m.status], background: STATUS_BG[m.status], border: `1px solid ${STATUS_BORDER[m.status]}` }}>
                    {m.status}
                  </span>
                </td>
                <td>
                  <div className="mp-actions">
                    <button className="mp-btn mp-btn--view">View</button>
                    <button className="mp-btn mp-btn--edit">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mp-footer">Showing {filtered.length} of {members.length} members</div>
      </div>
    </div>
  )
}
