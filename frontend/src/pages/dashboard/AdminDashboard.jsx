import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import './AdminDashboard.css'

//  Mock data 
const borrowingData = [
  { day: 'Mon', issued: 55, returned: 40 },
  { day: 'Tue', issued: 70, returned: 52 },
  { day: 'Wed', issued: 80, returned: 60 },
  { day: 'Thu', issued: 75, returned: 58 },
  { day: 'Fri', issued: 68, returned: 50 },
  { day: 'Sat', issued: 30, returned: 25 },
  { day: 'Sun', issued: 18, returned: 14 },
]

const availabilityData = [
  { name: 'Available on Shelves', value: 1825, color: '#1e3a8a' },
  { name: 'Currently Borrowed',   value: 625,  color: '#3b82f6' },
  { name: 'Held in Reservation',  value: 85,   color: '#f59e0b' },
  { name: 'Binding & Repair',     value: 15,   color: '#e2e8f0' },
]

const mostBorrowed = [
  { rank: 1, title: 'A Course in Pure Mathematics', author: 'G.H. Hardy',          category: 'Mathematics' },
  { rank: 2, title: 'Principles of Economics',      author: 'N. Gregory Mankiw',   category: 'Economics'   },
  { rank: 3, title: 'Modern Operating Systems',     author: 'Andrew S. Tanenbaum', category: 'Comp Science' },
  { rank: 4, title: 'Microelectronic Circuits',     author: 'Sedra & Smith',        category: 'Engineering'  },
  { rank: 5, title: 'Introduction to Algorithms',   author: 'Cormen, Leiserson',    category: 'Computing'    },
]

const overdueAlerts = [
  { name: 'K.M. Bandara',    phone: '077 123 4567', days: 14, fine: 14, book: 'Data Structures in C++' },
  { name: 'N.S. Fernando',   phone: '071 987 6543', days: 10, fine: 10, book: 'Engineering Mechanics'   },
  { name: 'M.A. Perera',     phone: '076 543 2198', days: 8,  fine: 8,  book: 'Clinical Pharmacology'   },
  { name: 'T.H. Jayasinghe', phone: '079 332 1144', days: 6,  fine: 6,  book: 'Constitutional Law of SL'},
]

const recentActivity = [
  { type: 'member',  color: '#10b981', text: 'New member registered', detail: 'Kasun Silva (078 445 6678) registered by Lib. Chaminda', time: '5m ago'  },
  { type: 'issue',   color: '#3b82f6', text: 'Book issued',           detail: 'Calculus Vol. II issued to Dilani Wickrama (072 119 8833)',  time: '18m ago' },
  { type: 'return',  color: '#10b981', text: 'Book returned',         detail: 'Macroeconomics returned on-time by S. Rathnayake',           time: '32m ago' },
  { type: 'fine',    color: '#f59e0b', text: 'Fine payment recorded', detail: 'Rs. 12 late fee received from H.M. Farook (12d overdue)',    time: '1h ago'  },
  { type: 'catalog', color: '#6366f1', text: 'New catalog accession', detail: 'Artificial Intelligence (Copy #6) added to catalog',         time: '2h ago'  },
]

//  Stat Card 
function StatCard({ label, value, sub, subColor, icon, danger }) {
  return (
    <div className={`stat-card${danger ? ' stat-card--danger' : ''}`}>
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-icon">{icon}</span>
      </div>
      <div className={`stat-card-value${danger ? ' stat-card-value--danger' : ''}`}>{value}</div>
      {sub && <div className="stat-card-sub" style={{ color: subColor }}>{sub}</div>}
    </div>
  )
}

//  Icons 
const BookIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const CheckIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const CopyIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
const UsersIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const AlertIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const DollarIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const PlusIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const BellIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const BarIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>

const CATEGORY_COLORS = {
  Mathematics:   '#3b82f6',
  Economics:     '#10b981',
  'Comp Science':'#8b5cf6',
  Engineering:   '#f59e0b',
  Computing:     '#ef4444',
}

export default function AdminDashboard() {
  return (
    <div className="dash">

      {/*  Header  */}
      <div className="dash-header">
        <div>
          <p className="dash-header-sub">Overview of library operations, catalog health, and circulation tracking.</p>
        </div>
        <div className="dash-actions">
          <button className="dash-btn dash-btn--outline"><PlusIcon /> Register Member</button>
          <button className="dash-btn dash-btn--outline"><BookIcon /> Add Book</button>
          <button className="dash-btn dash-btn--primary"><BarIcon /> Issue Book</button>
          <button className="dash-btn dash-btn--success"><CheckIcon /> Return Book</button>
        </div>
      </div>

      {/*  KPI Cards  */}
      <div className="stat-grid">
        <StatCard label="TOTAL BOOKS"     value="2,450" sub=" +12 this month"     subColor="#10b981" icon={<BookIcon />}   />
        <StatCard label="AVAILABLE BOOKS" value="1,825" sub="74.5% circulation re" subColor="#64748b" icon={<CheckIcon />}  />
        <StatCard label="BORROWED BOOKS"  value="625"   sub="Across 4 active facu" subColor="#64748b" icon={<CopyIcon />}   />
        <StatCard label="TOTAL MEMBERS"   value="1,240" sub=" +34 new this week"   subColor="#10b981" icon={<UsersIcon />}  />
        <StatCard label="OVERDUE BOOKS"   value="48"    sub="+3 requiring notice"   subColor="#ef4444" icon={<AlertIcon />}  danger />
        <StatCard label="UNPAID FINES"    value="Rs. 8,750" sub="Rs. 1/day default rate" subColor="#64748b" icon={<DollarIcon />} />
      </div>

      {/*  Charts Row  */}
      <div className="charts-row">

        {/* Borrowing Activity */}
        <div className="chart-card chart-card--wide">
          <div className="chart-card-header">
            <div>
              <span className="chart-card-title">Borrowing Activity</span>
              <span className="chart-live-badge">Live System</span>
            </div>
            <div className="chart-tabs">
              {['Today','This Week','This Month','This Year'].map((t, i) => (
                <button key={t} className={`chart-tab${i === 1 ? ' active' : ''}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="chart-legend">
            <span className="legend-dot" style={{ background: '#1e3a8a' }} /> Books Issued &nbsp;
            <span className="legend-dot" style={{ background: '#10b981' }} /> Books Returned
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={borrowingData} barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', fontSize: 12 }} />
              <Bar dataKey="issued"   fill="#1e3a8a" radius={[3, 3, 0, 0]} />
              <Bar dataKey="returned" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-footer">
            <span><BarIcon /> Average Daily Issues: <strong>42 books/day</strong></span>
            <span><CheckIcon /> On-time Return Rate: <strong>92.4% compliance</strong></span>
          </div>
        </div>

        {/* Book Availability */}
        <div className="chart-card">
          <div className="chart-card-header">
            <span className="chart-card-title">Book Availability</span>
          </div>
          <p className="chart-card-sub">Current catalog distribution &amp; status</p>
          <div className="pie-wrap">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={availabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {availabilityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" fontSize={22} fontWeight={800} fill="#1e293b">2,450</text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#94a3b8">TOTAL COPIES</text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pie-legend">
            {availabilityData.map((d, i) => (
              <div key={i} className="pie-legend-row">
                <span className="pie-legend-dot" style={{ background: d.color }} />
                <span className="pie-legend-label">{d.name}</span>
                <span className="pie-legend-value">{d.value.toLocaleString()}</span>
                <span className="pie-legend-pct" style={{ color: d.color }}>
                  {((d.value / 2550) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*  Bottom Row  */}
      <div className="bottom-row">

        {/* Most Borrowed Books */}
        <div className="bottom-card">
          <div className="bottom-card-header">
            <div>
              <span className="bottom-card-title"><BarIcon /> Most Borrowed Books</span>
              <p className="bottom-card-sub">Academic year high circulation volumes</p>
            </div>
            <button className="view-all-btn">View All </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Category</th>
                <th>Circ.</th>
              </tr>
            </thead>
            <tbody>
              {mostBorrowed.map(b => (
                <tr key={b.rank}>
                  <td><span className="rank">#{b.rank}</span></td>
                  <td>
                    <div className="book-title">{b.title}</div>
                    <div className="book-author">{b.author}</div>
                  </td>
                  <td>
                    <span className="cat-badge" style={{ background: (CATEGORY_COLORS[b.category] || '#64748b') + '18', color: CATEGORY_COLORS[b.category] || '#64748b' }}>
                      {b.category}
                    </span>
                  </td>
                  <td><span className="circ-num">{Math.floor(Math.random() * 40) + 80}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            Displaying Top 5 of 2,450 titles &nbsp;&nbsp; Dewey Decimal Filter: ALL
          </div>
        </div>

        {/* Overdue Alerts */}
        <div className="bottom-card">
          <div className="bottom-card-header">
            <div>
              <span className="bottom-card-title"><BellIcon /> Overdue Alerts</span>
              <span className="overdue-count">48 Pending</span>
            </div>
          </div>
          <p className="bottom-card-sub" style={{ marginBottom: 12 }}>Urgent borrower recalls &amp; cumulative daily fines</p>
          <div className="overdue-list">
            {overdueAlerts.map((a, i) => (
              <div key={i} className="overdue-item">
                <div className="overdue-top">
                  <div>
                    <div className="overdue-name">{a.name}</div>
                    <div className="overdue-phone">{a.phone}</div>
                  </div>
                  <span className="overdue-badge">{a.days}d Late</span>
                </div>
                <div className="overdue-bottom">
                  <span className="overdue-book">{a.book}</span>
                  <span className="overdue-fine">Rs. {a.fine}</span>
                </div>
                <div className="overdue-btns">
                  <button className="sms-btn">SMS</button>
                  <button className="clear-btn">Clear</button>
                </div>
              </div>
            ))}
          </div>
          <button className="launch-sms-btn">Launch Automated Batch SMS Reminder (48 patrons)</button>
        </div>

        {/* Recent Activity */}
        <div className="bottom-card">
          <div className="bottom-card-header">
            <span className="bottom-card-title">Recent Activity</span>
            <span className="live-badge">Live Feed</span>
          </div>
          <p className="bottom-card-sub" style={{ marginBottom: 12 }}>Real-time audit log of campus circulation</p>
          <div className="activity-list">
            {recentActivity.map((a, i) => (
              <div key={i} className="activity-item">
                <span className="activity-dot" style={{ background: a.color }} />
                <div className="activity-body">
                  <div className="activity-title">{a.text}</div>
                  <div className="activity-detail">{a.detail}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="audit-btn">Full Audit Log </button>
        </div>

      </div>
    </div>
  )
}
