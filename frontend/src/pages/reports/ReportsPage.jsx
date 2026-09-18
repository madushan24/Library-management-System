import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './ReportsPage.css'

const monthlyData = [
  { month: 'Apr', issued: 210, returned: 195 },
  { month: 'May', issued: 280, returned: 260 },
  { month: 'Jun', issued: 190, returned: 180 },
  { month: 'Jul', issued: 320, returned: 298 },
  { month: 'Aug', issued: 350, returned: 330 },
  { month: 'Sep', issued: 290, returned: 275 },
]

const reportTypes = ['Book Report', 'Member Report', 'Borrowing Report', 'Return Report', 'Overdue Report', 'Fine Report', 'Popular Books']
const dateFilters = ['Today', 'This Week', 'This Month', 'This Year', 'Custom Range']

export default function ReportsPage() {
  return (
    <div className="rp">
      <div className="rp-header">
        <div>
          <h2 className="rp-title">Reports</h2>
          <p className="rp-sub">Generate and export library reports</p>
        </div>
        <div className="rp-export-btns">
          <button className="rp-btn rp-btn--outline">Export PDF</button>
          <button className="rp-btn rp-btn--outline">Export Excel</button>
          <button className="rp-btn rp-btn--primary">Print</button>
        </div>
      </div>

      <div className="rp-body">
        {/* Sidebar */}
        <div className="rp-sidebar">
          <div className="rp-section-label">REPORT TYPE</div>
          {reportTypes.map((r, i) => (
            <button key={i} className={`rp-type-btn${i === 0 ? ' active' : ''}`}>{r}</button>
          ))}
          <div className="rp-section-label" style={{ marginTop: 16 }}>DATE FILTER</div>
          {dateFilters.map((d, i) => (
            <button key={i} className={`rp-type-btn${i === 2 ? ' active' : ''}`}>{d}</button>
          ))}
        </div>

        {/* Main */}
        <div className="rp-main">
          <div className="rp-stats">
            {[
              { label: 'Total Issues', value: '1,640' },
              { label: 'Total Returns', value: '1,538' },
              { label: 'Overdue',       value: '48'    },
              { label: 'Fines Collected', value: 'Rs. 8,750' },
            ].map((s, i) => (
              <div key={i} className="rp-stat">
                <div className="rp-stat-label">{s.label}</div>
                <div className="rp-stat-val">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="rp-chart-card">
            <div className="rp-chart-title">Monthly Borrowing Activity</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', fontSize: 12 }} />
                <Bar dataKey="issued"   fill="#1e3a8a" radius={[3,3,0,0]} />
                <Bar dataKey="returned" fill="#10b981" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
