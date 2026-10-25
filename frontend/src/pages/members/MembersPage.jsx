import { useState, useEffect, useCallback } from 'react'
import RegisterMemberModal from '../../components/members/RegisterMemberModal'
import MemberProfileModal from '../../components/members/MemberProfileModal'
import { api } from '../../api/client'
import './MembersPage.css'

const COLORS = ['#3b82f6', '#8b5cf6', '#64748b', '#10b981', '#ef4444', '#f59e0b', '#1e3a8a', '#0891b2']

const STATUS_STYLE = {
  ACTIVE:    { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', dot: '#16a34a' },
  INACTIVE:  { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', dot: '#94a3b8' },
  SUSPENDED: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', dot: '#ef4444' },
}

const SearchIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const PlusIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const ExportIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const SmsIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const MailIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const PrintIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
const EyeIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const BookIcon    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const UsersIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const AlertIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const NewUserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
const FilterIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
const CalIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const BookIcon2   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>

export default function MembersPage() {
  const [members, setMembers]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('All Statuses')
  const [hasFines, setHasFines]   = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.getMembers()
      const formatted = data.map((m, idx) => ({
        ...m,
        dbId: m.id,
        id: m.mem_id || `MEM-${String(m.id).padStart(3, '0')}`,
        initials: m.name ? m.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'M',
        color: COLORS[idx % COLORS.length],
        affil: m.affiliation || 'General Patron',
        maxBooks: m.max_books || 3,
        borrowed: m.borrowed || 0,
        outstanding: Number(m.outstanding) || 0,
        registered: m.registered || m.created_at?.slice(0, 10),
      }))
      setMembers(formatted)
    } catch (err) {
      console.error('Failed to load members:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMembers()
  }, [loadMembers])

  const handleRegister = async (form) => {
    try {
      await api.createMember({
        name: `${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone,
        email: form.email,
        nic: form.nic,
        address: [form.address, form.city].filter(Boolean).join(', '),
        status: form.status || 'ACTIVE',
      })
      await loadMembers()
      setShowModal(false)
    } catch (err) {
      alert(err.message || 'Failed to register member')
    }
  }

  const filtered = members.filter(m => {
    const q = search.toLowerCase()
    const matchSearch = (m.name || '').toLowerCase().includes(q) ||
                        (m.phone || '').includes(q) ||
                        (m.id || '').toLowerCase().includes(q) ||
                        (m.nic || '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'All Statuses' || m.status === statusFilter
    const matchFines  = !hasFines || m.outstanding > 0
    return matchSearch && matchStatus && matchFines
  })

  const totalBorrowing = members.filter(m => m.borrowed > 0).length
  const totalOverdue   = members.filter(m => m.outstanding > 0).length
  const totalFines     = members.reduce((s, m) => s + m.outstanding, 0)

  return (
    <div className="mp">
      <div className="mp-header">
        <div className="mp-header-left">
          <div className="mp-title-row">
            <h2 className="mp-title">Members</h2>
            <span className="mp-enrolled-badge">{members.length} Enrolled</span>
          </div>
          <p className="mp-sub">Manage academic library patrons, access credentials, and ongoing circulation ledgers.</p>
        </div>
        <div className="mp-header-actions">
          <button className="mp-export-btn"><ExportIcon /> Export</button>
          <button className="mp-register-btn" onClick={() => setShowModal(true)}><PlusIcon /> Register Member</button>
        </div>
      </div>

      <div className="mp-kpi-row">
        <div className="mp-kpi">
          <div className="mp-kpi-icon mp-kpi-icon--blue"><UsersIcon /></div>
          <div className="mp-kpi-body">
            <div className="mp-kpi-label">TOTAL REGISTERED</div>
            <div className="mp-kpi-value">{members.length}</div>
            <div className="mp-kpi-sub"><span className="mp-green">Active patrons</span> in SQLite database</div>
          </div>
        </div>
        <div className="mp-kpi">
          <div className="mp-kpi-icon mp-kpi-icon--indigo"><BookIcon2 /></div>
          <div className="mp-kpi-body">
            <div className="mp-kpi-label">ACTIVE BORROWERS</div>
            <div className="mp-kpi-value">{totalBorrowing}</div>
            <div className="mp-kpi-sub">
              <span className="mp-blue">
                {members.length > 0 ? ((totalBorrowing / members.length) * 100).toFixed(1) : 0}% ratio
              </span> Holdings currently issued
            </div>
          </div>
        </div>
        <div className="mp-kpi mp-kpi--danger">
          <div className="mp-kpi-icon mp-kpi-icon--red"><AlertIcon /></div>
          <div className="mp-kpi-body">
            <div className="mp-kpi-label">OVERDUE / FINES</div>
            <div className="mp-kpi-value">{totalOverdue} <span className="mp-action-req">! Action req.</span></div>
            <div className="mp-kpi-sub">Rs. {totalFines.toFixed(2)} total unpaid</div>
          </div>
        </div>
        <div className="mp-kpi">
          <div className="mp-kpi-icon mp-kpi-icon--green"><NewUserIcon /></div>
          <div className="mp-kpi-body">
            <div className="mp-kpi-label">ACTIVE STATUS</div>
            <div className="mp-kpi-value">{members.filter(m => m.status === 'ACTIVE').length}</div>
            <div className="mp-kpi-sub"><span className="mp-green">In good standing</span></div>
          </div>
        </div>
      </div>

      <div className="mp-toolbar">
        <div className="mp-search">
          <SearchIcon />
          <input
            placeholder="Search by name, phone, member ID (e.g. MEM-001) or NIC..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="mp-kbd">Search</span>
        </div>
        <div className="mp-filter-select">
          <FilterIcon />
          <select value={statusFilter} onChange={e => setStatus(e.target.value)}>
            <option value="All Statuses">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>
        <label className="mp-fines-check">
          <input type="checkbox" checked={hasFines} onChange={e => setHasFines(e.target.checked)} />
          Has Fines
        </label>
      </div>

      <div className="mp-sub-toolbar">
        <div className="mp-count-info">
          <span>Showing 1-{filtered.length} of {members.length} members</span>
          <span className="mp-sync"><span className="mp-sync-dot" /> Live SQLite Database Connected</span>
        </div>
        <div className="mp-bulk-btns">
          <button className="mp-bulk-btn"><SmsIcon /> Bulk SMS Notice</button>
          <button className="mp-bulk-btn"><MailIcon /> Broadcast Email</button>
          <button className="mp-bulk-btn"><PrintIcon /> Print Cards</button>
        </div>
      </div>

      <div className="mp-card">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading members...</div>
        ) : (
          <table className="mp-table">
            <thead>
              <tr>
                <th><input type="checkbox" className="mp-chk" /></th>
                <th>MEMBER ID</th>
                <th>MEMBER NAME &amp; AFFILIATION</th>
                <th>CONTACT PHONE</th>
                <th>INSTITUTIONAL EMAIL</th>
                <th>REGISTERED</th>
                <th>BORROWINGS</th>
                <th>OUTSTANDING</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No members found
                  </td>
                </tr>
              ) : (
                filtered.map(m => {
                  const st = STATUS_STYLE[m.status] || STATUS_STYLE.ACTIVE
                  const isMax = m.borrowed > 0 && m.borrowed >= m.maxBooks
                  return (
                    <tr key={m.id}>
                      <td><input type="checkbox" className="mp-chk" /></td>
                      <td><span className={`mp-id${m.status === "SUSPENDED" ? " mp-id--sus" : ""}`}>{m.id}</span></td>
                      <td>
                        <div className="mp-name-cell">
                          <div className="mp-avatar" style={{ background: m.color }}>{m.initials}</div>
                          <div>
                            <div className="mp-name">{m.name}</div>
                            <div className="mp-affil">{m.affil}</div>
                          </div>
                        </div>
                      </td>
                      <td className="mp-phone">{m.phone}</td>
                      <td className="mp-email">{m.email || '-'}</td>
                      <td className="mp-date">{m.registered || '-'}</td>
                      <td>
                        {m.borrowed > 0
                          ? <span className={`mp-borrow-chip${isMax ? " mp-borrow-chip--max" : ""}`}><BookIcon /> {m.borrowed} / {m.maxBooks} Books{isMax ? " (Max)" : ""}</span>
                          : <span className="mp-borrow-none">0 Books</span>
                        }
                      </td>
                      <td><span className={m.outstanding > 0 ? "mp-fine-red" : "mp-fine-zero"}>Rs. {m.outstanding.toFixed(2)}</span></td>
                      <td>
                        <span className="mp-status-badge" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                          <span className="mp-dot" style={{ background: st.dot }} />{m.status}
                        </span>
                      </td>
                      <td><button className="mp-view-btn" onClick={() => setSelectedMember(m)}><EyeIcon /> View</button></td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}
        <div className="mp-pagination">
          <span>Showing {filtered.length} of {members.length} members</span>
        </div>
      </div>

      {selectedMember && (
        <MemberProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
      {showModal && (
        <RegisterMemberModal
          onClose={() => setShowModal(false)}
          onSave={handleRegister}
        />
      )}
    </div>
  )
}
