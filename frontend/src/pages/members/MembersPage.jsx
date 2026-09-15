import { useState } from "react"
import RegisterMemberModal from "../../components/members/RegisterMemberModal"
import "./MembersPage.css"

const members = [
  { id: "MEM-001", initials: "KP", color: "#3b82f6", name: "Kasun Perera",          affil: "Undergraduate, Computing & Tech",   phone: "077 123 4567", email: "kasun.p@email.com",          registered: "15/01/2024", borrowed: 2, maxBooks: 3, outstanding: 4.00,  status: "ACTIVE"    },
  { id: "MEM-084", initials: "DW", color: "#8b5cf6", name: "Dilani Wickrama",         affil: "Research Fellow, Biotechnology",    phone: "071 882 3091", email: "dilani.w@university.ac.lk",  registered: "03/09/2023", borrowed: 3, maxBooks: 3, outstanding: 0.00,  status: "ACTIVE"    },
  { id: "MEM-112", initials: "NF", color: "#64748b", name: "N.S. Fernando",           affil: "Senior Lecturer, Mechanical Eng",   phone: "071 987 6543", email: "fernando.ns@eng.ac.lk",      registered: "12/02/2022", borrowed: 1, maxBooks: 5, outstanding: 10.00, status: "ACTIVE"    },
  { id: "MEM-219", initials: "SR", color: "#10b981", name: "S. Rathnayake",           affil: "Undergraduate, Software Eng",       phone: "078 991 4455", email: "s.rathnayake@mycampu...",    registered: "20/06/2024", borrowed: 1, maxBooks: 3, outstanding: 0.00,  status: "ACTIVE"    },
  { id: "MEM-342", initials: "KB", color: "#ef4444", name: "K.M. Bandara",            affil: "Postgraduate, Civil Eng",           phone: "070 334 1928", email: "bandara.km@civil.ac.lk",     registered: "18/11/2023", borrowed: 0, maxBooks: 0, outstanding: 14.00, status: "SUSPENDED" },
  { id: "MEM-405", initials: "FR", color: "#f59e0b", name: "Fathima Rizna",           affil: "Undergraduate, Architecture",       phone: "076 554 2210", email: "rizna.f@arch.ac.lk",         registered: "08/04/2024", borrowed: 2, maxBooks: 3, outstanding: 0.00,  status: "ACTIVE"    },
  { id: "MEM-512", initials: "NJ", color: "#1e3a8a", name: "Dr. Nethmi Jayawardene",  affil: "Head of Dept, AI & Robotics",       phone: "077 445 6678", email: "nethmi.j@ac.lk",             registered: "10/01/2021", borrowed: 2, maxBooks: 5, outstanding: 0.00,  status: "ACTIVE"    },
  { id: "MEM-628", initials: "TA", color: "#94a3b8", name: "Tharindu Alwis",          affil: "Alumni / Guest Scholar",            phone: "072 119 8833", email: "t.alwis@guest.ac.lk",        registered: "14/05/2023", borrowed: 0, maxBooks: 0, outstanding: 0.00,  status: "INACTIVE"  },
  { id: "MEM-703", initials: "CS", color: "#0891b2", name: "Chathura Senaratne",      affil: "Undergraduate, Physical Science",   phone: "075 432 9876", email: "c.senaratne@science.ac.lk",  registered: "29/08/2024", borrowed: 1, maxBooks: 3, outstanding: 0.00,  status: "ACTIVE"    },
]

const STATUS_STYLE = {
  ACTIVE:    { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", dot: "#16a34a" },
  INACTIVE:  { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", dot: "#94a3b8" },
  SUSPENDED: { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", dot: "#ef4444" },
}

const SearchIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const PlusIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const ExportIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const SmsIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const MailIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const PrintIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
const EyeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const BookIcon    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const UsersIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const AlertIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const NewUserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
const FilterIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
const CalIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>

export default function MembersPage() {
  const [search, setSearch]       = useState("")
  const [statusFilter, setStatus] = useState("All Statuses")
  const [hasFines, setHasFines]   = useState(false)
  const [showModal, setShowModal] = useState(false)

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) || m.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "All Statuses" || m.status === statusFilter
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
            <span className="mp-enrolled-badge">1,240 Enrolled</span>
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
            <div className="mp-kpi-value">1,240</div>
            <div className="mp-kpi-sub"><span className="mp-green">+3.8%</span> Faculty, staff &amp; students</div>
          </div>
        </div>
        <div className="mp-kpi">
          <div className="mp-kpi-icon mp-kpi-icon--indigo"><BookIcon2 /></div>
          <div className="mp-kpi-body">
            <div className="mp-kpi-label">ACTIVE BORROWERS</div>
            <div className="mp-kpi-value">{totalBorrowing}</div>
            <div className="mp-kpi-sub"><span className="mp-blue">33.2% ratio</span> Holdings currently issued</div>
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
            <div className="mp-kpi-label">NEW THIS MONTH</div>
            <div className="mp-kpi-value">64</div>
            <div className="mp-kpi-sub"><span className="mp-green">+12% MoM</span> 2025/2026 Academic cohort</div>
          </div>
        </div>
      </div>

      <div className="mp-toolbar">
        <div className="mp-search">
          <SearchIcon />
          <input placeholder="Search by name, phone, member ID (e.g. MEM-001) or NIC..." value={search} onChange={e => setSearch(e.target.value)} />
          <span className="mp-kbd">Ctrl + /</span>
        </div>
        <div className="mp-filter-select"><FilterIcon /><select><option>All Faculties</option></select></div>
        <div className="mp-filter-select"><FilterIcon /><select value={statusFilter} onChange={e => setStatus(e.target.value)}><option value="All Statuses">All Statuses</option><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option><option value="SUSPENDED">SUSPENDED</option></select></div>
        <div className="mp-filter-select"><CalIcon /><select><option>All Time</option><option>This Month</option><option>This Year</option></select></div>
        <label className="mp-fines-check"><input type="checkbox" checked={hasFines} onChange={e => setHasFines(e.target.checked)} /> Has Fines</label>
      </div>

      <div className="mp-sub-toolbar">
        <div className="mp-count-info">
          <span>Showing 1-{filtered.length} of {filtered.length} members</span>
          <span className="mp-sync"><span className="mp-sync-dot" /> Catalog Sync: Nominal</span>
        </div>
        <div className="mp-bulk-btns">
          <button className="mp-bulk-btn"><SmsIcon /> Bulk SMS Notice</button>
          <button className="mp-bulk-btn"><MailIcon /> Broadcast Email</button>
          <button className="mp-bulk-btn"><PrintIcon /> Print Cards</button>
        </div>
      </div>

      <div className="mp-card">
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
            {filtered.map(m => {
              const st = STATUS_STYLE[m.status]
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
                  <td className="mp-email">{m.email}</td>
                  <td className="mp-date">{m.registered}</td>
                  <td>
                    {m.borrowed > 0
                      ? <span className={`mp-borrow-chip${isMax ? " mp-borrow-chip--max" : ""}`}><BookIcon /> {m.borrowed} / {m.maxBooks} Books{isMax ? " (Max)" : ""}</span>
                      : <span className="mp-borrow-none">— 0 Books</span>
                    }
                  </td>
                  <td><span className={m.outstanding > 0 ? "mp-fine-red" : "mp-fine-zero"}>Rs. {m.outstanding.toFixed(2)}</span></td>
                  <td>
                    <span className="mp-status-badge" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                      <span className="mp-dot" style={{ background: st.dot }} />{m.status}
                    </span>
                  </td>
                  <td><button className="mp-view-btn"><EyeIcon /> View</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="mp-pagination">
          <span>Showing 1 to {filtered.length} of {filtered.length} results &nbsp; Per page: <select className="mp-per-page-sel"><option>10</option><option>25</option><option>50</option></select></span>
          <div className="mp-pages">
            <button className="mp-pg mp-pg--disabled">&lt; Prev</button>
            <button className="mp-pg mp-pg--active">1</button>
            <button className="mp-pg">2</button>
            <button className="mp-pg">3</button>
            <span className="mp-pg-dots">...</span>
            <button className="mp-pg">124</button>
            <button className="mp-pg">Next &gt;</button>
          </div>
        </div>
      </div>
      {showModal && (
        <RegisterMemberModal
          onClose={() => setShowModal(false)}
          onSave={(data) => { console.log("New member:", data); setShowModal(false) }}
        />
      )}
    </div>
  )
}

function BookIcon2() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
}



