import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { api } from '../../api/client'
import './AdminDashboard.css'

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

const BookIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const CheckIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const CopyIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
const UsersIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const AlertIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const DollarIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const PlusIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const BellIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const BarIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>

const CATEGORY_COLORS = {
  Mathematics:   '#3b82f6',
  Economics:     '#10b981',
  'Comp Science':'#8b5cf6',
  Engineering:   '#f59e0b',
  Computing:     '#ef4444',
  General:       '#0891b2',
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab]         = useState('This Month')
  const [loading, setLoading]             = useState(true)
  const [smsToast, setSmsToast]           = useState(false)

  const [stats, setStats] = useState({
    totalBooks: 0,
    availBooks: 0,
    borrowedBooks: 0,
    totalMembers: 0,
    overdueLoans: 0,
    unpaidFines: 0,
  })

  const [chartData, setChartData]         = useState([])
  const [availability, setAvailability]   = useState([])
  const [popularBooks, setPopularBooks]   = useState([])
  const [overdueAlerts, setOverdueAlerts] = useState([])
  const [activity, setActivity]           = useState([])

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true)
      const [books, members, borrows, fines, popular, overview] = await Promise.all([
        api.getBooks().catch(() => []),
        api.getMembers().catch(() => []),
        api.getBorrowings().catch(() => []),
        api.getFines().catch(() => []),
        api.getReportPopular().catch(() => []),
        api.getReportOverview({ filter: activeTab }).catch(() => ({ monthly: [] })),
      ])

      const totalCopies    = books.reduce((s, b) => s + (b.total || 0), 0)
      const availCopies    = books.reduce((s, b) => s + (b.available || 0), 0)
      const borrowedCopies = books.reduce((s, b) => s + Math.max(0, (b.total || 0) - (b.available || 0)), 0)
      const maintCopies    = books.filter(b => b.status === 'MAINTENANCE').reduce((s, b) => s + (b.total || 0), 0)
      const overdueCount   = borrows.filter(b => b.status === 'OVERDUE').length
      const unpaidSum      = fines.filter(f => f.status === 'UNPAID').reduce((s, f) => s + (f.amount || 0), 0)

      setStats({
        totalBooks:    totalCopies,
        availBooks:    availCopies,
        borrowedBooks: borrowedCopies,
        totalMembers:  members.length,
        overdueLoans:  overdueCount,
        unpaidFines:   unpaidSum,
      })

      // Availability Pie
      setAvailability([
        { name: 'Available on Shelves', value: availCopies,    color: '#1e3a8a' },
        { name: 'Currently Borrowed',   value: borrowedCopies, color: '#3b82f6' },
        { name: 'Under Maintenance',    value: maintCopies,    color: '#f59e0b' },
      ].filter(d => d.value > 0))

      // Popular books
      setPopularBooks(popular.slice(0, 5).map((p, i) => ({
        rank:     i + 1,
        title:    p.title,
        author:   p.author,
        category: p.category || 'General',
        circ:     p.borrowed || 0,
      })))

      // Overdue alerts
      const od = borrows
        .filter(b => b.status === 'OVERDUE')
        .slice(0, 6)
        .map(b => ({
          name:  b.member_name || 'Member',
          phone: b.mem_id || 'MEM',
          days:  b.overdue_days || 0,
          fine:  b.fine || 0,
          book:  b.book_title || 'Book',
        }))
      setOverdueAlerts(od)

      // Recent activity
      const rec = borrows.slice(0, 6).map(b => {
        const isReturn = b.status === 'RETURNED'
        const isOverdue = b.status === 'OVERDUE'
        return {
          type:   isReturn ? 'return' : isOverdue ? 'fine' : 'issue',
          color:  isReturn ? '#10b981' : isOverdue ? '#ef4444' : '#3b82f6',
          text:   isReturn ? 'Book returned' : isOverdue ? 'Overdue notice' : 'Book issued',
          detail: `"${b.book_title}" — ${b.member_name} (${b.borrow_id})`,
          time:   b.returned_date || b.issued_date || 'Recent',
        }
      })
      setActivity(rec)

      // Borrowing activity chart
      const chartPoints = (overview.monthly || []).map(m => ({
        day:      m.month,
        issued:   m.issued || 0,
        returned: m.returned || 0,
      }))
      setChartData(chartPoints.length ? chartPoints : [
        { day: 'No Data', issued: 0, returned: 0 }
      ])

    } catch (err) {
      console.error('Failed to load dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const handleClear = (name) => {
    setOverdueAlerts(prev => prev.filter(a => a.name !== name))
  }
  const handleSms = () => {
    setSmsToast(true)
    setTimeout(() => setSmsToast(false), 2500)
  }
  const handleBatchSms = () => {
    setSmsToast(true)
    setTimeout(() => setSmsToast(false), 2500)
  }

  const compliance = stats.totalBooks > 0
    ? Math.round((stats.availBooks / stats.totalBooks) * 100)
    : 0

  return (
    <div className="dash">

      {smsToast && (
        <div className="dash-toast">✓ SMS reminder sent successfully</div>
      )}

      {/* Header */}
      <div className="dash-header">
        <div>
          <p className="dash-header-sub">Overview of library operations, catalog health, and circulation tracking.</p>
        </div>
        <div className="dash-actions">
          <button className="dash-btn dash-btn--outline" onClick={() => navigate('/members')}><PlusIcon /> Register Member</button>
          <button className="dash-btn dash-btn--outline" onClick={() => navigate('/books')}><BookIcon /> Add Book</button>
          <button className="dash-btn dash-btn--primary" onClick={() => navigate('/issue')}><BarIcon /> Issue Book</button>
          <button className="dash-btn dash-btn--success" onClick={() => navigate('/returns')}><CheckIcon /> Return Book</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <StatCard label="TOTAL COPIES"     value={stats.totalBooks} sub="Catalog inventory"         subColor="#10b981" icon={<BookIcon />}   />
        <StatCard label="AVAILABLE BOOKS" value={stats.availBooks} sub={`${compliance}% on shelf`}   subColor="#64748b" icon={<CheckIcon />}  />
        <StatCard label="BORROWED BOOKS"  value={stats.borrowedBooks} sub="Active loans"            subColor="#64748b" icon={<CopyIcon />}   />
        <StatCard label="TOTAL MEMBERS"   value={stats.totalMembers} sub="Enrolled patrons"         subColor="#10b981" icon={<UsersIcon />}  />
        <StatCard label="OVERDUE BOOKS"   value={stats.overdueLoans} sub="Requiring recall notice"   subColor="#ef4444" icon={<AlertIcon />}  danger={stats.overdueLoans > 0} />
        <StatCard label="UNPAID FINES"    value={`Rs. ${stats.unpaidFines}.00`} sub="Recorded fines ledger" subColor="#64748b" icon={<DollarIcon />} />
      </div>

      {/* Charts Row */}
      <div className="charts-row">

        {/* Borrowing Activity */}
        <div className="chart-card chart-card--wide">
          <div className="chart-card-header">
            <div>
              <span className="chart-card-title">Borrowing Activity</span>
              <span className="chart-live-badge">Live SQLite Backend</span>
            </div>
            <div className="chart-tabs">
              {['Today','This Week','This Month','This Year','All Time'].map(t => (
                <button
                  key={t}
                  className={`chart-tab${activeTab === t ? ' active' : ''}`}
                  onClick={() => setActiveTab(t)}
                >{t}</button>
              ))}
            </div>
          </div>
          <div className="chart-legend">
            <span className="legend-dot" style={{ background: '#1e3a8a' }} /> Books Issued &nbsp;
            <span className="legend-dot" style={{ background: '#10b981' }} /> Books Returned
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', fontSize: 12 }} />
              <Bar dataKey="issued"   fill="#1e3a8a" radius={[3, 3, 0, 0]} />
              <Bar dataKey="returned" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-footer">
            <span><BarIcon /> Active Borrowings: <strong>{stats.borrowedBooks} books</strong></span>
            <span><CheckIcon /> Shelf Availability: <strong>{compliance}% on shelf</strong></span>
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
                <Pie data={availability} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
                  {availability.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" fontSize={22} fontWeight={800} fill="#1e293b">{stats.totalBooks}</text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#94a3b8">TOTAL COPIES</text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pie-legend">
            {availability.map((d, i) => (
              <div key={i} className="pie-legend-row">
                <span className="pie-legend-dot" style={{ background: d.color }} />
                <span className="pie-legend-label">{d.name}</span>
                <span className="pie-legend-value">{d.value.toLocaleString()}</span>
                <span className="pie-legend-pct" style={{ color: d.color }}>
                  {stats.totalBooks > 0 ? ((d.value / stats.totalBooks) * 100).toFixed(1) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">

        {/* Most Borrowed Books */}
        <div className="bottom-card">
          <div className="bottom-card-header">
            <div>
              <span className="bottom-card-title"><BarIcon /> Most Borrowed Books</span>
              <p className="bottom-card-sub">Live circulation volumes</p>
            </div>
            <button className="view-all-btn" onClick={() => navigate('/reports')}>View All</button>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Title</th><th>Category</th><th>Circ.</th></tr>
            </thead>
            <tbody>
              {popularBooks.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>No circulation history yet</td></tr>
              ) : (
                popularBooks.map(b => (
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
                    <td><span className="circ-num">{b.circ}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="table-footer">Displaying Top 5 titles &nbsp;&bull;&nbsp; Live Database Sync</div>
        </div>

        {/* Overdue Alerts */}
        <div className="bottom-card">
          <div className="bottom-card-header">
            <div>
              <span className="bottom-card-title"><BellIcon /> Overdue Alerts</span>
              <span className="overdue-count">{overdueAlerts.length} Pending</span>
            </div>
          </div>
          <p className="bottom-card-sub" style={{ marginBottom: 12 }}>Urgent borrower recalls &amp; cumulative daily fines</p>
          <div className="overdue-list">
            {overdueAlerts.length === 0 ? (
              <div className="overdue-empty">✓ No overdue alerts</div>
            ) : overdueAlerts.map((a, i) => (
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
                  <span className="overdue-fine">Rs. {a.fine}.00</span>
                </div>
                <div className="overdue-btns">
                  <button className="sms-btn"   onClick={handleSms}>SMS</button>
                  <button className="clear-btn" onClick={() => handleClear(a.name)}>Clear</button>
                </div>
              </div>
            ))}
          </div>
          {overdueAlerts.length > 0 && (
            <button className="launch-sms-btn" onClick={handleBatchSms}>
              Launch Automated Batch SMS Reminder ({overdueAlerts.length} patrons)
            </button>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bottom-card">
          <div className="bottom-card-header">
            <span className="bottom-card-title">Recent Activity</span>
            <span className="live-badge">Live Feed</span>
          </div>
          <p className="bottom-card-sub" style={{ marginBottom: 12 }}>Real-time audit log of campus circulation</p>
          <div className="activity-list">
            {activity.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No activity records yet</div>
            ) : (
              activity.map((a, i) => (
                <div key={i} className="activity-item">
                  <span className="activity-dot" style={{ background: a.color }} />
                  <div className="activity-body">
                    <div className="activity-title">{a.text}</div>
                    <div className="activity-detail">{a.detail}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="audit-btn" onClick={() => navigate('/borrowings')}>Full Borrowing Log</button>
        </div>

      </div>

    </div>
  )
}
