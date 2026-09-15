import { useState } from 'react'
import './LibrarianDashboard.css'

const recentBorrowings = [
  { patron: 'Kasun Perera',       memberId: 'MEM-881', type: 'Student',        book: 'Discrete Mathematics & Its Applications',    acc: 'ACC-88219', issuedAt: '10:42 AM', dueDate: '22 Sep 2026', days: 7 },
  { patron: 'Dilani Wickrama',    memberId: 'MEM-084', type: 'Research Fellow', book: 'Modern Operating Systems (4th Edition)',      acc: 'ACC-90412', issuedAt: '10:28 AM', dueDate: '22 Sep 2026', days: 7 },
  { patron: 'S. Rathnayake',      memberId: 'MEM-219', type: 'Undergraduate',   book: 'Introduction to Algorithms (CLRS)',           acc: 'ACC-31082', issuedAt: '09:55 AM', dueDate: '22 Sep 2026', days: 7 },
  { patron: 'Nethmi Jayawardene', memberId: 'MEM-512', type: 'Faculty Staff',   book: 'Artificial Intelligence: A Modern Approach', acc: 'ACC-11944', issuedAt: '09:12 AM', dueDate: '22 Sep 2026', days: 7 },
]

const overdueList = [
  { name: 'K.M. Bandara',  phone: '070 334 1928', memberId: 'MEM-391', days: 14, fine: 14.00, book: 'Data Structures in C++ (2nd Ed)'  },
  { name: 'N.S. Fernando', phone: '071 882 3891', memberId: 'MEM-112', days: 10, fine: 10.00, book: 'Engineering Mechanics: Statics'    },
  { name: 'Sahan Alwis',   phone: '078 991 4455', memberId: 'MEM-404', days: 7,  fine: 7.00,  book: 'Digital Signal Processing...'     },
]

const quickSwitch = [
  { name: 'Kasun P.',   id: 'MEM-001' },
  { name: 'Dilani W.',  id: 'MEM-084' },
  { name: 'Rathnayake', id: 'MEM-219' },
]

const PhoneIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.14 6.14l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const ScanIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
const SearchIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const RefreshIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
const UserPlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
const BookOpenIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
const ReturnIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.89"/></svg>
const CatalogIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const BellIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const ArrowDownIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
const SwapIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
const UserIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const FilterIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
const DownloadIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const MenuIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
const AlertIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const CheckIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IssueIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>

export default function LibrarianDashboard() {
  const [phone, setPhone]           = useState('077 123 4567')
  const [memberFound, setMemberFound] = useState(true)
  const [activeTab, setActiveTab]   = useState('borrowings')

  const handleSearch = (e) => {
    e.preventDefault()
    setMemberFound(phone.trim().length > 0)
  }

  return (
    <div className="ld">

      {/* Header */}
      <div className="ld-header">
        <div>
          <div className="ld-header-title-row">
            <h1 className="ld-header-title">Librarian Dashboard</h1>
            <span className="ld-desk-badge">Desk 01 &bull; Active Session</span>
          </div>
          <p className="ld-header-sub">Manage members, books and daily library transactions.</p>
        </div>
        <div className="ld-header-actions">
          <button className="ld-btn ld-btn--outline"><UserPlusIcon /> Register Member</button>
          <button className="ld-btn ld-btn--dark"><BookOpenIcon /> Issue Book</button>
          <button className="ld-btn ld-btn--success"><ReturnIcon /> Return Book</button>
          <button className="ld-btn ld-btn--outline"><CatalogIcon /> Search Catalog</button>
        </div>
      </div>

      {/* Top Row */}
      <div className="ld-top-row">

        {/* Find Member */}
        <div className="ld-find-card">
          <div className="ld-find-header">
            <div>
              <div className="ld-find-title">Find Member</div>
              <div className="ld-find-sub">Fast checkout &amp; return desk lookup</div>
            </div>
            <span className="ld-rfid-badge">RFID Ready</span>
          </div>

          <label className="ld-input-label">Member Phone / Barcode ID</label>
          <form onSubmit={handleSearch}>
            <div className="ld-phone-row">
              <span className="ld-phone-ico"><PhoneIcon /></span>
              <input
                className="ld-phone-input"
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="077 123 4567"
              />
              <button type="button" className="ld-scan-btn"><ScanIcon /> SCAN</button>
            </div>
            <div className="ld-phone-hint">
              Example: <strong>0771234567</strong> &nbsp;&nbsp; Press <kbd>Enter</kbd> to search
            </div>
            <div className="ld-search-row">
              <button type="submit" className="ld-search-btn"><SearchIcon /> Search Member</button>
              <button type="button" className="ld-refresh-btn"><RefreshIcon /></button>
            </div>
          </form>

          <div className="ld-quick-label">QUICK COUNTER SWITCH:</div>
          <div className="ld-quick-list">
            {quickSwitch.map(m => (
              <button key={m.id} className="ld-quick-btn">{m.name} ({m.id})</button>
            ))}
          </div>
        </div>

        {/* Member Card */}
        {memberFound ? (
          <div className="ld-member-card">
            <div className="ld-member-top">
              <div className="ld-member-avatar">KP</div>
              <div className="ld-member-info">
                <div className="ld-member-name-row">
                  <span className="ld-member-name">Kasun Perera</span>
                  <span className="ld-member-id">MEM-881</span>
                  <span className="ld-active-badge">ACTIVE</span>
                </div>
                <div className="ld-member-meta">
                  <span>077 123 4567</span>
                  <span>Faculty of Computing &amp; Technology</span>
                </div>
              </div>
              <div className="ld-validity">
                <div className="ld-validity-label">Membership Valid</div>
                <div className="ld-validity-date">31 Dec 2026</div>
              </div>
            </div>

            <div className="ld-member-stats">
              <div className="ld-mstat">
                <div className="ld-mstat-label">Current Borrowings</div>
                <div className="ld-mstat-val">2 / 3 Max Allowed</div>
                <div className="ld-progress">
                  <div className="ld-progress-fill" style={{ width: '66%' }} />
                </div>
              </div>
              <div className="ld-mstat ld-mstat--warn">
                <div className="ld-mstat-label">Outstanding Fine</div>
                <div className="ld-mstat-fine">Rs. 4.00</div>
                <div className="ld-mstat-fine-note">1 Day Late on Vol. II</div>
              </div>
              <div className="ld-mstat">
                <div className="ld-mstat-label">Counter Reserved</div>
                <div className="ld-mstat-val">1 Item</div>
                <div className="ld-mstat-fine-note">Shelf Bay 04 &bull; Hold #01</div>
              </div>
            </div>

            <div className="ld-possession-label">
              Currently in Patron Possession (2):
              <span>Last Issued: 08 Sep 2026</span>
            </div>
            <div className="ld-books-row">
              <div className="ld-book-chip">
                <div className="ld-book-chip-title">Discrete Mathematics and Its Applications</div>
                <div className="ld-book-chip-meta">ACC-88219 &bull; Due in 4 days</div>
                <span className="ld-book-num">Book #1</span>
              </div>
              <div className="ld-book-chip ld-book-chip--overdue">
                <div className="ld-book-chip-title">Algorithm Design: Foundations Vol. II</div>
                <div className="ld-book-chip-meta">ACC-74301 &bull; Due Yesterday (1d late)</div>
                <span className="ld-overdue-tag">Overdue</span>
              </div>
            </div>

            <div className="ld-member-actions">
              <button className="ld-act-btn ld-act-btn--primary"><IssueIcon /> Issue Book to Kasun</button>
              <button className="ld-act-btn ld-act-btn--success"><CheckIcon /> Process Quick Return</button>
              <button className="ld-act-btn ld-act-btn--outline"><UserIcon /> View Profile</button>
              <button className="ld-act-btn ld-act-btn--ghost">Clear / New Search</button>
            </div>
          </div>
        ) : (
          <div className="ld-member-card ld-member-empty">
            <div className="ld-empty-icon"><UserIcon /></div>
            <div className="ld-empty-title">Member Not Found</div>
            <div className="ld-empty-sub">No member found for this phone number.</div>
            <button className="ld-act-btn ld-act-btn--primary"><UserPlusIcon /> Register New Member</button>
          </div>
        )}
      </div>

      {/* KPI Row */}
      <div className="ld-kpi-row">
        {[
          { label: "Today's Issues",     value: '35',      sub: '+8 this hour',        icon: <ArrowDownIcon />, danger: false },
          { label: "Today's Returns",    value: '28',      sub: 'Restocked & sorted',  icon: <ReturnIcon />,    danger: false },
          { label: 'Active Circulation', value: '625',     sub: 'Total on loan',       icon: <SwapIcon />,      danger: false },
          { label: 'Overdue Books',      value: '48',      sub: 'Pending returns',     icon: <AlertIcon />,     danger: true  },
          { label: 'Counter Holds',      value: '12',      sub: 'Ready at Desk 01',    icon: <CatalogIcon />,   danger: false },
          { label: "Today's Fines",      value: 'Rs. 450', sub: "Collected today",     icon: <BellIcon />,      danger: false },
        ].map((k, i) => (
          <div key={i} className={`ld-kpi${k.danger ? ' ld-kpi--danger' : ''}`}>
            <div className="ld-kpi-top">
              <span className="ld-kpi-label">{k.label}</span>
              <span className="ld-kpi-icon">{k.icon}</span>
            </div>
            <div className={`ld-kpi-value${k.danger ? ' ld-kpi-value--danger' : ''}`}>{k.value}</div>
            <div className="ld-kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="ld-bottom-row">

        {/* Transactions Table */}
        <div className="ld-tx-card">
          <div className="ld-tx-header">
            <div className="ld-tx-tabs">
              <button
                className={`ld-tx-tab${activeTab === 'borrowings' ? ' active' : ''}`}
                onClick={() => setActiveTab('borrowings')}
              >
                <ArrowDownIcon /> Recent Borrowings
                <span className="ld-tx-count">35</span>
              </button>
              <button
                className={`ld-tx-tab${activeTab === 'returns' ? ' active' : ''}`}
                onClick={() => setActiveTab('returns')}
              >
                <ReturnIcon /> Recent Returns
                <span className="ld-tx-count">28</span>
              </button>
            </div>
            <div className="ld-tx-toolbar">
              <button className="ld-tool-btn"><FilterIcon /> Filter</button>
              <button className="ld-tool-btn"><DownloadIcon /></button>
            </div>
          </div>

          <table className="ld-table">
            <thead>
              <tr>
                <th>PATRON / MEMBER ID</th>
                <th>BOOK TITLE &amp; ACCESSION</th>
                <th>ISSUED AT</th>
                <th>DUE DATE</th>
                <th>STATUS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentBorrowings.map((b, i) => (
                <tr key={i}>
                  <td>
                    <div className="ld-table-name">{b.patron}</div>
                    <div className="ld-table-sub">{b.memberId} &bull; {b.type}</div>
                  </td>
                  <td>
                    <div className="ld-table-book">{b.book}</div>
                    <div className="ld-table-acc">{b.acc}</div>
                  </td>
                  <td className="ld-table-time">{b.issuedAt}</td>
                  <td className="ld-table-time">{b.dueDate}</td>
                  <td>
                    <span className="ld-status-badge">Active &bull; {b.days}d loan</span>
                  </td>
                  <td><button className="ld-row-btn"><MenuIcon /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ld-table-footer">
            <span>Real-time sync active</span>
            <span>Last transaction: 2 mins ago</span>
          </div>
        </div>

        {/* Overdue Panel */}
        <div className="ld-overdue-card">
          <div className="ld-overdue-header">
            <div>
              <span className="ld-overdue-title"><AlertIcon /> Overdue &amp; Fines</span>
              <p className="ld-overdue-sub">Priority counter collection</p>
            </div>
            <span className="ld-overdue-count">48 Pending</span>
          </div>

          <div className="ld-overdue-list">
            {overdueList.map((o, i) => (
              <div key={i} className="ld-overdue-item">
                <div className="ld-overdue-top">
                  <div>
                    <div className="ld-overdue-name">{o.name}</div>
                    <div className="ld-overdue-meta">{o.phone} &bull; {o.memberId}</div>
                  </div>
                  <span className={`ld-days-badge ld-days-badge--${o.days >= 14 ? 'red' : o.days >= 10 ? 'orange' : 'yellow'}`}>
                    {o.days}d Late
                  </span>
                </div>
                <div className="ld-overdue-book">{o.book}</div>
                <div className="ld-overdue-fine-row">
                  <span className="ld-fine-amount">Rs. {o.fine.toFixed(2)}</span>
                </div>
                <div className="ld-overdue-btns">
                  <button className="ld-sms-btn"><BellIcon /> SMS Alert</button>
                  <button className="ld-collect-btn"><CheckIcon /> Collect &amp; Return</button>
                </div>
              </div>
            ))}
          </div>

          <div className="ld-rate-row">
            <span>Rate: Rs. 1.00 / calendar day</span>
            <button className="ld-batch-btn">Send Batch Reminders</button>
          </div>
        </div>

      </div>
    </div>
  )
}
