import { useState, useMemo, useRef } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  BORROWINGS,
  filterByDateRange,
  computeMonthlyChart,
  computeStatusPie,
  computePopularBooks,
  computeMemberStats,
  computeOverdueRecords,
} from '../../data/libraryData'
import './ReportsPage.css'

/* ─── Config ─── */
const REPORT_TYPES = [
  { key: 'overview',   label: 'Overview',        icon: '📊' },
  { key: 'borrowings', label: 'Borrowing Report', icon: '📚' },
  { key: 'returns',    label: 'Return Report',    icon: '✅' },
  { key: 'overdue',    label: 'Overdue Report',   icon: '⏰' },
  { key: 'fines',      label: 'Fine Report',      icon: '💰' },
  { key: 'members',    label: 'Member Report',    icon: '👥' },
  { key: 'popular',    label: 'Popular Books',    icon: '🔥' },
]

const DATE_FILTERS = ['All Time', 'This Year', 'This Month', 'This Week', 'Today', 'Custom Range']

/* ─── Icons ─── */
const FileTextIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const TableIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
  </svg>
)
const PrinterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
)
const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)
const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const CoinsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/>
    <path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>
  </svg>
)
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const LayersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
)

/* ─── Export helpers ─── */
function buildCSV(reportKey, data) {
  const { overdueRecords, memberStats, popularBooks, monthlyChart } = data
  const configs = {
    overview:   { headers: ['Month','Issued','Returned','Fines (Rs)'],          rows: monthlyChart.map(r => [r.month, r.issued, r.returned, r.fines]) },
    borrowings: { headers: ['Month','Issued','Returned','Outstanding'],          rows: monthlyChart.map(r => [r.month, r.issued, r.returned, r.issued - r.returned]) },
    returns:    { headers: ['Month','Returned','Issued'],                        rows: monthlyChart.map(r => [r.month, r.returned, r.issued]) },
    overdue:    { headers: ['Borrow ID','Member','Member ID','Book','Due Date','Overdue Days','Fine (Rs)'], rows: overdueRecords.map(r => [r.id, r.member, r.memberId, r.book, r.due, r.days, r.fine]) },
    fines:      { headers: ['Month','Fines Collected (Rs)'],                     rows: monthlyChart.map(r => [r.month, r.fines]) },
    members:    { headers: ['Member ID','Name','Borrowed','Returned','Overdue','Fines (Rs)'], rows: memberStats.map(r => [r.id, r.name, r.borrowed, r.returned, r.overdue, r.fines]) },
    popular:    { headers: ['Rank','Title','Author','Times Borrowed'],           rows: popularBooks.map(r => [r.rank, r.title, r.author, r.borrowed]) },
  }
  const cfg = configs[reportKey] || configs.overview
  return [cfg.headers, ...cfg.rows]
    .map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n')
}

function exportCSV(reportKey, data) {
  const csv  = buildCSV(reportKey, data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url
  a.download = `LMS_${reportKey}_report.csv`; a.click()
  URL.revokeObjectURL(url)
}

async function exportPDF(reportRef, reportKey, reportLabel, dateFilter) {
  const el = reportRef.current
  if (!el) return

  /* ── Snapshot the live report panel (charts + tables) ── */
  const canvas = await html2canvas(el, {
    scale: 2,                  // retina sharpness
    useCORS: true,
    backgroundColor: '#f8fafc',
    logging: false,
  })

  const imgData   = canvas.toDataURL('image/png')
  const doc       = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const pageW     = doc.internal.pageSize.getWidth()
  const pageH     = doc.internal.pageSize.getHeight()
  const headerH   = 38   // branded header height
  const footerH   = 24
  const margin    = 0
  const printW    = pageW - margin * 2
  const maxImgH   = pageH - headerH - footerH   // usable height per page

  /* ── Branded header (drawn on every page) ── */
  function drawHeader() {
    doc.setFillColor(30, 58, 138)
    doc.rect(0, 0, pageW, headerH, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(255, 255, 255)
    doc.text('📚  Library Management System', 16, 26)
  }

  /* ── Footer ── */
  function drawFooter(pageNum, total) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(148, 163, 184)
    doc.text(
      `Page ${pageNum} of ${total}   •   Library Management System   •   Confidential`,
      16,
      pageH - 8
    )
  }

  /* ── Slice the canvas across multiple pages if tall ── */
  const imgW       = canvas.width
  const imgH       = canvas.height
  // how many canvas-px fit in one page's usable area
  const sliceH     = Math.floor((maxImgH / printW) * imgW)
  const totalPages = Math.ceil(imgH / sliceH)

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) doc.addPage()
    drawHeader()

    // crop a horizontal band of the canvas into a temp canvas
    const srcY       = page * sliceH
    const srcActualH = Math.min(sliceH, imgH - srcY)
    const tmpCanvas  = document.createElement('canvas')
    tmpCanvas.width  = imgW
    tmpCanvas.height = srcActualH
    const ctx = tmpCanvas.getContext('2d')
    const srcImg = new Image()
    srcImg.src = imgData
    // draw the slice synchronously (image already decoded)
    await new Promise(res => { srcImg.onload = res; if (srcImg.complete) res() })
    ctx.drawImage(srcImg, 0, srcY, imgW, srcActualH, 0, 0, imgW, srcActualH)

    const sliceData   = tmpCanvas.toDataURL('image/png')
    const renderedH   = (srcActualH / imgW) * printW
    doc.addImage(sliceData, 'PNG', margin, headerH, printW, renderedH)

    drawFooter(page + 1, totalPages)
  }

  doc.save(`LMS_${reportKey}_report.pdf`)
}

function handlePrint(reportRef, reportLabel, dateFilter) {
  const html     = reportRef.current?.innerHTML || ''
  const original = document.body.innerHTML
  document.body.innerHTML = `<div style="font-family:Arial,sans-serif;padding:28px;font-size:12px;color:#1e293b">
    <div style="border-bottom:2px solid #1e3a8a;padding-bottom:12px;margin-bottom:20px">
      <div style="font-size:16px;font-weight:800;color:#1e3a8a">📚 Library Management System</div>
      <div style="font-size:11px;color:#64748b;margin-top:4px">Report: ${reportLabel} &nbsp;|&nbsp; Period: ${dateFilter}</div>
    </div>${html}</div>`
  window.print()
  document.body.innerHTML = original
  window.location.reload()
}

/* ─── Empty State ─── */
function EmptyState({ filter }) {
  return (
    <div className="rp-empty-state">
      <div className="rp-empty-icon">📭</div>
      <div className="rp-empty-title">No data for "{filter}"</div>
      <div className="rp-empty-sub">No borrowing records match this date range. Try selecting a wider period.</div>
    </div>
  )
}

/* ─── KPI Grid ─── */
function KPIGrid({ kpis }) {
  const items = [
    { icon: <BookIcon />,   color: 'blue',   label: 'Total Issues',      value: kpis.totalIssued                },
    { icon: <CheckIcon />,  color: 'green',  label: 'Total Returns',     value: kpis.totalReturned              },
    { icon: <AlertIcon />,  color: 'red',    label: 'Currently Overdue', value: kpis.totalOverdue               },
    { icon: <CoinsIcon />,  color: 'amber',  label: 'Fines (Rs)',        value: `Rs. ${kpis.totalFines}`        },
    { icon: <UsersIcon />,  color: 'indigo', label: 'Active Members',    value: kpis.uniqueMembers              },
    { icon: <LayersIcon />, color: 'slate',  label: 'Unique Titles',     value: kpis.uniqueBooks                },
  ]
  return (
    <div className="rp-kpis">
      {items.map((k, i) => (
        <div key={i} className="rp-kpi">
          <div className={`rp-kpi-icon rp-kpi-icon--${k.color}`}>{k.icon}</div>
          <div>
            <div className="rp-kpi-label">{k.label}</div>
            <div className="rp-kpi-val">{k.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Shared Chart Tooltip ─── */
const TTP = { borderRadius:8, border:'none', boxShadow:'0 4px 16px rgba(0,0,0,.10)', fontSize:12 }

/* ─── Sub-Views ─── */
function OverviewView({ data }) {
  const { kpis, monthlyChart, statusPie } = data
  if (!monthlyChart.length) return <EmptyState filter="this period" />
  return (
    <>
      <KPIGrid kpis={kpis} />
      <div className="rp-charts-row">
        <div className="rp-chart-card rp-chart-card--lg">
          <div className="rp-chart-header">
            <div className="rp-chart-title">Monthly Borrowing Activity</div>
            <div className="rp-chart-legend">
              <span className="rp-leg-dot" style={{ background:'#1e3a8a' }}/>Issued
              <span className="rp-leg-dot" style={{ background:'#10b981' }}/>Returned
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyChart} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#94a3b8' }}/>
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#94a3b8' }}/>
              <Tooltip contentStyle={TTP}/>
              <Bar dataKey="issued"   name="Issued"   fill="#1e3a8a" radius={[3,3,0,0]}/>
              <Bar dataKey="returned" name="Returned" fill="#10b981" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rp-chart-card rp-chart-card--sm">
          <div className="rp-chart-title" style={{ marginBottom:12 }}>Status Distribution</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {statusPie.map((e, i) => <Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={TTP}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="rp-pie-legend">
            {statusPie.map((s, i) => (
              <div key={i} className="rp-pie-row">
                <span className="rp-leg-dot" style={{ background:s.color }}/>
                <span className="rp-pie-name">{s.name}</span>
                <span className="rp-pie-val">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rp-chart-card">
        <div className="rp-chart-title" style={{ marginBottom:12 }}>Fines Trend (Rs)</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={monthlyChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#94a3b8' }}/>
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#94a3b8' }}/>
            <Tooltip contentStyle={TTP} formatter={(v) => [`Rs. ${v}`, 'Fines']}/>
            <Line type="monotone" dataKey="fines" name="Fines" stroke="#ef4444" strokeWidth={2.5} dot={{ r:4, fill:'#ef4444' }} activeDot={{ r:6 }}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

function BorrowingView({ data, mode }) {
  const { monthlyChart } = data
  if (!monthlyChart.length) return <EmptyState filter="this period" />
  return (
    <>
      <div className="rp-chart-card">
        <div className="rp-chart-header">
          <div className="rp-chart-title">{mode === 'returns' ? 'Returns vs Issues — Monthly' : 'Issues vs Returns — Monthly'}</div>
          <div className="rp-chart-legend">
            <span className="rp-leg-dot" style={{ background:'#1e3a8a' }}/>Issued
            <span className="rp-leg-dot" style={{ background:'#10b981' }}/>Returned
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyChart} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#94a3b8' }}/>
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#94a3b8' }}/>
            <Tooltip contentStyle={TTP}/>
            <Bar dataKey="issued"   name="Issued"   fill="#1e3a8a" radius={[3,3,0,0]}/>
            <Bar dataKey="returned" name="Returned" fill="#10b981" radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rp-table-card">
        <div className="rp-table-header">
          <div className="rp-table-title">Monthly Summary</div>
          <span className="rp-table-badge rp-table-badge--blue">{monthlyChart.length} month{monthlyChart.length !== 1 ? 's' : ''}</span>
        </div>
        <table className="rp-table">
          <thead><tr><th>MONTH</th><th>ISSUED</th><th>RETURNED</th><th>OUTSTANDING</th><th>RETURN RATE</th></tr></thead>
          <tbody>
            {monthlyChart.map(r => {
              const rate = r.issued > 0 ? Math.round((r.returned / r.issued) * 100) : 0
              return (
                <tr key={r.month}>
                  <td className="rp-cell-name">{r.month}</td>
                  <td>{r.issued}</td>
                  <td><span style={{ color:'#16a34a', fontWeight:600 }}>{r.returned}</span></td>
                  <td>
                    {r.issued - r.returned > 0
                      ? <span className="rp-days-red">{r.issued - r.returned}</span>
                      : <span style={{ color:'#94a3b8' }}>0</span>}
                  </td>
                  <td>
                    <div className="rp-rate-wrap">
                      <div className="rp-rate-bar" style={{ width:`${rate}%`, background: rate >= 80 ? '#16a34a' : rate >= 60 ? '#d97706' : '#ef4444' }}/>
                      <span className="rp-rate-label">{rate}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

function OverdueView({ data }) {
  const { overdueRecords } = data
  if (!overdueRecords.length) return (
    <div className="rp-empty-state">
      <div className="rp-empty-icon">✅</div>
      <div className="rp-empty-title">No overdue records</div>
      <div className="rp-empty-sub">No overdue borrowings in this period.</div>
    </div>
  )
  return (
    <div className="rp-table-card">
      <div className="rp-table-header">
        <div className="rp-table-title">Overdue Records</div>
        <span className="rp-table-badge rp-table-badge--red">{overdueRecords.length} overdue</span>
      </div>
      <table className="rp-table">
        <thead><tr><th>BORROW ID</th><th>MEMBER</th><th>BOOK</th><th>DUE DATE</th><th>OVERDUE DAYS</th><th>FINE (Rs)</th></tr></thead>
        <tbody>
          {overdueRecords.map(r => (
            <tr key={r.id}>
              <td><span className="rp-id rp-id--blue">{r.id}</span></td>
              <td><div className="rp-cell-name">{r.member}</div><div className="rp-cell-sub">{r.memberId}</div></td>
              <td className="rp-cell-book">{r.book}</td>
              <td className="rp-cell-date">{r.due}</td>
              <td><span className="rp-days-red">{r.days} days</span></td>
              <td><span className="rp-fine-red">Rs. {r.fine}.00</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FinesView({ data }) {
  const { monthlyChart } = data
  const totalFines = monthlyChart.reduce((s, r) => s + r.fines, 0)
  if (!monthlyChart.length) return <EmptyState filter="this period" />
  return (
    <>
      <div className="rp-chart-card">
        <div className="rp-chart-header">
          <div className="rp-chart-title">Fines Collected — Monthly Trend</div>
          <span style={{ fontSize:13, fontWeight:700, color:'#ef4444' }}>Total: Rs. {totalFines}.00</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#94a3b8' }}/>
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#94a3b8' }}/>
            <Tooltip contentStyle={TTP} formatter={(v) => [`Rs. ${v}`, 'Fines']}/>
            <Line type="monotone" dataKey="fines" name="Fines" stroke="#ef4444" strokeWidth={2.5} dot={{ r:4, fill:'#ef4444' }} activeDot={{ r:6 }}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="rp-table-card">
        <div className="rp-table-header">
          <div className="rp-table-title">Monthly Fine Collection</div>
        </div>
        <table className="rp-table">
          <thead><tr><th>MONTH</th><th>FINES COLLECTED (Rs)</th><th>% OF TOTAL</th></tr></thead>
          <tbody>
            {monthlyChart.map(r => (
              <tr key={r.month}>
                <td className="rp-cell-name">{r.month}</td>
                <td><span className={r.fines > 0 ? 'rp-fine-red' : ''} style={r.fines === 0 ? { color:'#94a3b8' } : {}}>Rs. {r.fines}.00</span></td>
                <td>
                  {totalFines > 0 ? (
                    <div className="rp-rate-wrap">
                      <div className="rp-rate-bar" style={{ width:`${Math.round((r.fines/totalFines)*100)}%`, background:'#ef4444' }}/>
                      <span className="rp-rate-label">{Math.round((r.fines/totalFines)*100)}%</span>
                    </div>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function MembersView({ data }) {
  const { memberStats } = data
  if (!memberStats.length) return <EmptyState filter="this period" />
  return (
    <div className="rp-table-card">
      <div className="rp-table-header">
        <div className="rp-table-title">Member Activity Summary</div>
        <span className="rp-table-badge rp-table-badge--blue">{memberStats.length} member{memberStats.length !== 1 ? 's' : ''}</span>
      </div>
      <table className="rp-table">
        <thead><tr><th>MEMBER ID</th><th>NAME</th><th>BORROWED</th><th>RETURNED</th><th>OVERDUE</th><th>FINES (Rs)</th></tr></thead>
        <tbody>
          {memberStats.map(r => (
            <tr key={r.id}>
              <td><span className="rp-id rp-id--blue">{r.id}</span></td>
              <td className="rp-cell-name">{r.name}</td>
              <td>{r.borrowed}</td>
              <td><span style={{ color:'#16a34a', fontWeight:600 }}>{r.returned}</span></td>
              <td>{r.overdue > 0 ? <span className="rp-days-red">{r.overdue}</span> : <span style={{ color:'#94a3b8' }}>0</span>}</td>
              <td>{r.fines > 0 ? <span className="rp-fine-red">Rs. {r.fines}.00</span> : <span style={{ color:'#94a3b8' }}>—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PopularView({ data }) {
  const { popularBooks } = data
  if (!popularBooks.length) return <EmptyState filter="this period" />
  const maxBorrowed = popularBooks[0]?.borrowed || 1
  return (
    <>
      <div className="rp-chart-card">
        <div className="rp-chart-title" style={{ marginBottom:12 }}>Top {popularBooks.length} Most Borrowed Books</div>
        <ResponsiveContainer width="100%" height={Math.max(180, popularBooks.length * 30)}>
          <BarChart data={popularBooks} layout="vertical" barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#94a3b8' }}/>
            <YAxis type="category" dataKey="title" width={230} axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#475569' }}/>
            <Tooltip contentStyle={TTP} formatter={(v) => [v, 'Times Borrowed']}/>
            <Bar dataKey="borrowed" fill="#1e3a8a" radius={[0,3,3,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rp-table-card">
        <div className="rp-table-header"><div className="rp-table-title">Book Popularity Ranking</div></div>
        <table className="rp-table">
          <thead><tr><th>RANK</th><th>TITLE</th><th>AUTHOR</th><th>TIMES BORROWED</th></tr></thead>
          <tbody>
            {popularBooks.map(b => (
              <tr key={b.rank}>
                <td><span className={`rp-rank rp-rank--${b.rank <= 3 ? b.rank : 'other'}`}>#{b.rank}</span></td>
                <td className="rp-cell-book">{b.title}</td>
                <td className="rp-cell-date">{b.author}</td>
                <td>
                  <div className="rp-rate-wrap" style={{ minWidth:120 }}>
                    <div className="rp-rate-bar" style={{ width:`${(b.borrowed/maxBorrowed)*100}%`, background:'#1e3a8a' }}/>
                    <span className="rp-rate-label">{b.borrowed}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ─── Main Page ─── */
export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState('overview')
  const [dateFilter,   setDateFilter]   = useState('All Time')
  const [customFrom,   setCustomFrom]   = useState('')
  const [customTo,     setCustomTo]     = useState('')
  const reportRef = useRef(null)

  /* Apply date range filter to the raw BORROWINGS */
  const filteredBorrowings = useMemo(
    () => filterByDateRange(BORROWINGS, dateFilter, customFrom, customTo),
    [dateFilter, customFrom, customTo]
  )

  /* Derive all report data from the same filtered set */
  const data = useMemo(() => {
    const mc = computeMonthlyChart(filteredBorrowings)
    return {
      kpis: {
        totalIssued:   filteredBorrowings.length,
        totalReturned: filteredBorrowings.filter(b => b.status === 'RETURNED').length,
        totalOverdue:  filteredBorrowings.filter(b => b.status === 'OVERDUE').length,
        totalFines:    filteredBorrowings.reduce((s, b) => s + b.fine, 0),
        uniqueMembers: new Set(filteredBorrowings.map(b => b.memberId)).size,
        uniqueBooks:   new Set(filteredBorrowings.map(b => b.accNo)).size,
      },
      monthlyChart:   mc,
      statusPie:      computeStatusPie(filteredBorrowings),
      overdueRecords: computeOverdueRecords(filteredBorrowings),
      memberStats:    computeMemberStats(filteredBorrowings),
      popularBooks:   computePopularBooks(filteredBorrowings),
    }
  }, [filteredBorrowings])

  const currentReport = REPORT_TYPES.find(r => r.key === activeReport)

  const renderView = () => {
    switch (activeReport) {
      case 'overview':   return <OverviewView   data={data} />
      case 'borrowings': return <BorrowingView  data={data} mode="borrowings" />
      case 'returns':    return <BorrowingView  data={data} mode="returns" />
      case 'overdue':    return <OverdueView    data={data} />
      case 'fines':      return <FinesView      data={data} />
      case 'members':    return <MembersView    data={data} />
      case 'popular':    return <PopularView    data={data} />
      default:           return <OverviewView   data={data} />
    }
  }

  const periodLabel = dateFilter === 'Custom Range' && customFrom && customTo
    ? `${customFrom} → ${customTo}` : dateFilter

  return (
    <div className="rp">

      {/* Header */}
      <div className="rp-header">
        <div>
          <h2 className="rp-title">Reports</h2>
          <p className="rp-sub">
            Live data from {BORROWINGS.length} borrowing records &mdash; {currentReport?.label} &mdash; filtered: <strong>{periodLabel}</strong> ({filteredBorrowings.length} records)
          </p>
        </div>
        <div className="rp-export-btns">
          <button className="rp-btn rp-btn--pdf"   onClick={() => exportPDF(reportRef, activeReport, currentReport?.label, periodLabel)}>
            <FileTextIcon /> Export PDF
          </button>
          <button className="rp-btn rp-btn--excel" onClick={() => exportCSV(activeReport, data)}>
            <TableIcon /> Export Excel
          </button>
          <button className="rp-btn rp-btn--print" onClick={() => handlePrint(reportRef, currentReport?.label, periodLabel)}>
            <PrinterIcon /> Print
          </button>
        </div>
      </div>

      <div className="rp-body">

        {/* Sidebar */}
        <div className="rp-sidebar">
          <div className="rp-section-label">Report Type</div>
          {REPORT_TYPES.map(r => (
            <button
              key={r.key}
              className={`rp-type-btn${activeReport === r.key ? ' active' : ''}`}
              onClick={() => setActiveReport(r.key)}
            >
              <span className="rp-type-icon">{r.icon}</span>{r.label}
            </button>
          ))}

          <div className="rp-divider" />

          <div className="rp-section-label">Date Range</div>
          {DATE_FILTERS.map(d => (
            <button
              key={d}
              className={`rp-type-btn${dateFilter === d ? ' active' : ''}`}
              onClick={() => setDateFilter(d)}
            >
              {d}
            </button>
          ))}

          {/* Custom range pickers */}
          {dateFilter === 'Custom Range' && (
            <div className="rp-custom-range">
              <label className="rp-range-label">From</label>
              <input
                type="date" className="rp-date-input"
                value={customFrom} onChange={e => setCustomFrom(e.target.value)}
              />
              <label className="rp-range-label">To</label>
              <input
                type="date" className="rp-date-input"
                value={customTo} onChange={e => setCustomTo(e.target.value)}
              />
              {(customFrom || customTo) && (
                <button className="rp-range-clear" onClick={() => { setCustomFrom(''); setCustomTo('') }}>
                  Clear range
                </button>
              )}
            </div>
          )}

          <div className="rp-divider" />
          <div className="rp-sidebar-meta">
            <div className="rp-meta-row"><span>Records</span><strong>{filteredBorrowings.length} / {BORROWINGS.length}</strong></div>
            <div className="rp-meta-row"><span>Period</span><strong>{dateFilter}</strong></div>
            <div className="rp-meta-row"><span>Generated</span><strong>{new Date().toLocaleDateString('en-GB')}</strong></div>
          </div>
        </div>

        {/* Main area */}
        <div className="rp-main" ref={reportRef}>
          <div className="rp-report-header">
            <div className="rp-report-title">
              <span className="rp-report-icon">{currentReport?.icon}</span>
              {currentReport?.label}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span className="rp-report-period">{periodLabel}</span>
              <span className="rp-report-count">{filteredBorrowings.length} records</span>
            </div>
          </div>
          {renderView()}
        </div>

      </div>
    </div>
  )
}
