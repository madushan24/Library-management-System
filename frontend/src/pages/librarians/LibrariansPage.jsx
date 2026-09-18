import { useState } from 'react'
import './LibrariansPage.css'

const librarians = [
  { id: 'LIB-001', name: 'Chaminda Perera', username: 'chaminda.p', email: 'chaminda@library.lk', phone: '077 111 2233', status: 'ACTIVE',   created: '01 Jan 2024' },
  { id: 'LIB-002', name: 'Nirosha Silva',   username: 'nirosha.s',  email: 'nirosha@library.lk',  phone: '071 223 4455', status: 'ACTIVE',   created: '15 Feb 2024' },
  { id: 'LIB-003', name: 'Ruwan Fernando',  username: 'ruwan.f',    email: 'ruwan@library.lk',    phone: '076 334 5566', status: 'INACTIVE', created: '10 Mar 2024' },
]

const S = {
  ACTIVE:   { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  INACTIVE: { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
}

const PlusIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>

export default function LibrariansPage() {
  const [search, setSearch]   = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', username: '', email: '', phone: '', password: '' })

  const filtered = librarians.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="lbp">
      <div className="lbp-admin-banner">
        <span>&#128274;</span>
        <span>ADMIN ONLY &mdash; Librarian Management is restricted to Admin users only.</span>
      </div>

      <div className="lbp-header">
        <div>
          <h2 className="lbp-title">Librarian Management</h2>
          <p className="lbp-sub">Create and manage librarian accounts</p>
        </div>
        <button className="lbp-add-btn" onClick={() => setShowModal(true)}>
          <PlusIcon /> Add Librarian
        </button>
      </div>

      <div className="lbp-toolbar">
        <div className="lbp-search">
          <SearchIcon />
          <input placeholder="Search by name or username..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="lbp-card">
        <table className="lbp-table">
          <thead>
            <tr>
              <th>LIBRARIAN ID</th><th>FULL NAME</th><th>USERNAME</th>
              <th>EMAIL</th><th>PHONE</th><th>CREATED</th><th>STATUS</th><th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => {
              const st = S[l.status]
              return (
                <tr key={l.id}>
                  <td><span className="lbp-id">{l.id}</span></td>
                  <td>
                    <div className="lbp-name-row">
                      <div className="lbp-avatar">{l.name[0]}</div>
                      <span className="lbp-name">{l.name}</span>
                    </div>
                  </td>
                  <td className="lbp-username">{l.username}</td>
                  <td className="lbp-email">{l.email}</td>
                  <td>{l.phone}</td>
                  <td>{l.created}</td>
                  <td>
                    <span className="lbp-status" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                      {l.status}
                    </span>
                  </td>
                  <td>
                    <div className="lbp-actions">
                      <button className="lbp-btn lbp-btn--edit">Edit</button>
                      <button className="lbp-btn lbp-btn--reset">Reset PW</button>
                      <button className={`lbp-btn ${l.status === 'ACTIVE' ? 'lbp-btn--deact' : 'lbp-btn--act'}`}>
                        {l.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="lbp-footer">{filtered.length} librarians</div>
      </div>

      {showModal && (
        <div className="lbp-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="lbp-modal" onClick={e => e.stopPropagation()}>
            <div className="lbp-modal-header">
              <h3>Add New Librarian</h3>
              <button className="lbp-modal-close" onClick={() => setShowModal(false)}>&#10005;</button>
            </div>
            <div className="lbp-modal-body">
              {[
                { label: 'Full Name', key: 'name',     type: 'text',     ph: 'e.g. Chaminda Perera' },
                { label: 'Username',  key: 'username', type: 'text',     ph: 'e.g. chaminda.p'      },
                { label: 'Email',     key: 'email',    type: 'email',    ph: 'e.g. chaminda@library.lk' },
                { label: 'Phone',     key: 'phone',    type: 'text',     ph: '077 xxx xxxx'          },
                { label: 'Password',  key: 'password', type: 'password', ph: 'Min 8 characters'      },
              ].map(f => (
                <div key={f.key} className="lbp-field">
                  <label className="lbp-label">{f.label}</label>
                  <input className="lbp-input" type={f.type} placeholder={f.ph}
                    value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div className="lbp-modal-footer">
              <button className="lbp-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="lbp-save-btn">Create Librarian</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
