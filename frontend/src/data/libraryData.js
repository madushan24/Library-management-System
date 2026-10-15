/**
 * libraryData.js
 * Single source of truth for all library data.
 * All dates stored as ISO strings (YYYY-MM-DD) for reliable filtering.
 * Display helpers convert to DD/MM/YYYY where needed.
 */

/* ─── Reference date ─── */
// Using real Date() so "Today / This Week / This Month" filters are live.
// All records span April – October 2026.

/* ─── Members ─── */
export const MEMBERS = {
  'MEM-881': { name: 'Kasun Perera',    phone: '076 554 1122' },
  'MEM-112': { name: 'N.S. Fernando',   phone: '071 882 3891' },
  'MEM-084': { name: 'Dilani Wickrama', phone: '071 987 6543' },
  'MEM-404': { name: 'Sahan Alwis',     phone: '078 991 4455' },
  'MEM-342': { name: 'K.M. Bandara',    phone: '077 234 5678' },
  'MEM-405': { name: 'Fathima Rizna',   phone: '075 112 3344' },
}

/* ─── Books ─── */
export const BOOKS = {
  'ACC-88219': { title: 'Discrete Mathematics & Its Applications', author: 'K. Rosen'      },
  'ACC-44871': { title: 'Engineering Mechanics: Statics',           author: 'Meriam'        },
  'ACC-92011': { title: 'Digital Signal Processing Concepts',       author: 'Proakis'       },
  'ACC-55103': { title: 'Data Structures in C++ (2nd Ed)',          author: 'M. Weiss'      },
  'ACC-30491': { title: 'Modern Operating Systems (4th Ed)',        author: 'A. Tanenbaum'  },
  'ACC-61027': { title: 'Microelectronic Circuits',                 author: 'Sedra & Smith' },
  'ACC-74301': { title: 'Algorithm Design: Foundations Vol. II',    author: 'Kleinberg'     },
  'ACC-19203': { title: 'Introduction to Algorithms (CLRS)',        author: 'Cormen et al.' },
}

/* ─── Master Borrowings (31 records, April – October 2026) ─── */
// status  : 'BORROWED' | 'OVERDUE' | 'RETURNED'
// overdueDays / fine : computed/fixed as of 2026-10-15 for OVERDUE; exact for RETURNED
export const BORROWINGS = [
  // ── October 2026 ──────────────────────────────────────────────────────
  { id:'BR-001', memberId:'MEM-881', accNo:'ACC-88219', issuedDate:'2026-10-08', dueDate:'2026-10-15', returnedDate:null,         status:'BORROWED', overdueDays:0,  fine:0,  returnCondition:null    },
  { id:'BR-002', memberId:'MEM-112', accNo:'ACC-44871', issuedDate:'2026-10-01', dueDate:'2026-10-08', returnedDate:null,         status:'OVERDUE',  overdueDays:7,  fine:7,  returnCondition:null    },
  { id:'BR-003', memberId:'MEM-404', accNo:'ACC-92011', issuedDate:'2026-10-10', dueDate:'2026-10-17', returnedDate:null,         status:'BORROWED', overdueDays:0,  fine:0,  returnCondition:null    },
  { id:'BR-004', memberId:'MEM-342', accNo:'ACC-55103', issuedDate:'2026-10-15', dueDate:'2026-10-22', returnedDate:null,         status:'BORROWED', overdueDays:0,  fine:0,  returnCondition:null    },

  // ── September 2026 ────────────────────────────────────────────────────
  { id:'BR-005', memberId:'MEM-084', accNo:'ACC-30491', issuedDate:'2026-09-20', dueDate:'2026-09-27', returnedDate:'2026-09-27', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },
  { id:'BR-006', memberId:'MEM-405', accNo:'ACC-61027', issuedDate:'2026-09-05', dueDate:'2026-09-12', returnedDate:'2026-09-11', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },
  { id:'BR-007', memberId:'MEM-881', accNo:'ACC-74301', issuedDate:'2026-09-01', dueDate:'2026-09-08', returnedDate:'2026-09-14', status:'RETURNED', overdueDays:6,  fine:6,  returnCondition:'Good'    },
  { id:'BR-008', memberId:'MEM-112', accNo:'ACC-19203', issuedDate:'2026-09-10', dueDate:'2026-09-17', returnedDate:null,         status:'OVERDUE',  overdueDays:28, fine:28, returnCondition:null      },
  { id:'BR-009', memberId:'MEM-342', accNo:'ACC-88219', issuedDate:'2026-09-25', dueDate:'2026-10-02', returnedDate:null,         status:'OVERDUE',  overdueDays:13, fine:13, returnCondition:null      },
  { id:'BR-010', memberId:'MEM-404', accNo:'ACC-44871', issuedDate:'2026-09-15', dueDate:'2026-09-22', returnedDate:'2026-09-22', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },

  // ── August 2026 ───────────────────────────────────────────────────────
  { id:'BR-011', memberId:'MEM-084', accNo:'ACC-92011', issuedDate:'2026-08-01', dueDate:'2026-08-08', returnedDate:'2026-08-07', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },
  { id:'BR-012', memberId:'MEM-881', accNo:'ACC-30491', issuedDate:'2026-08-01', dueDate:'2026-08-08', returnedDate:'2026-08-14', status:'RETURNED', overdueDays:6,  fine:6,  returnCondition:'Good'    },
  { id:'BR-013', memberId:'MEM-405', accNo:'ACC-61027', issuedDate:'2026-08-20', dueDate:'2026-08-27', returnedDate:'2026-09-01', status:'RETURNED', overdueDays:5,  fine:5,  returnCondition:'Damaged'  },
  { id:'BR-014', memberId:'MEM-404', accNo:'ACC-55103', issuedDate:'2026-08-10', dueDate:'2026-08-17', returnedDate:'2026-08-25', status:'RETURNED', overdueDays:8,  fine:8,  returnCondition:'Good'    },
  { id:'BR-015', memberId:'MEM-342', accNo:'ACC-74301', issuedDate:'2026-08-15', dueDate:'2026-08-22', returnedDate:'2026-08-22', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },

  // ── July 2026 ─────────────────────────────────────────────────────────
  { id:'BR-016', memberId:'MEM-342', accNo:'ACC-44871', issuedDate:'2026-07-15', dueDate:'2026-07-22', returnedDate:'2026-07-22', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },
  { id:'BR-017', memberId:'MEM-112', accNo:'ACC-74301', issuedDate:'2026-07-05', dueDate:'2026-07-12', returnedDate:'2026-07-20', status:'RETURNED', overdueDays:8,  fine:8,  returnCondition:'Good'    },
  { id:'BR-018', memberId:'MEM-404', accNo:'ACC-61027', issuedDate:'2026-07-10', dueDate:'2026-07-17', returnedDate:'2026-07-17', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },
  { id:'BR-019', memberId:'MEM-084', accNo:'ACC-19203', issuedDate:'2026-07-20', dueDate:'2026-07-27', returnedDate:'2026-08-05', status:'RETURNED', overdueDays:9,  fine:9,  returnCondition:'Good'    },
  { id:'BR-020', memberId:'MEM-881', accNo:'ACC-55103', issuedDate:'2026-07-25', dueDate:'2026-08-01', returnedDate:'2026-08-01', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },

  // ── June 2026 ─────────────────────────────────────────────────────────
  { id:'BR-021', memberId:'MEM-881', accNo:'ACC-92011', issuedDate:'2026-06-01', dueDate:'2026-06-08', returnedDate:'2026-06-08', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },
  { id:'BR-022', memberId:'MEM-405', accNo:'ACC-88219', issuedDate:'2026-06-15', dueDate:'2026-06-22', returnedDate:'2026-06-22', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },
  { id:'BR-023', memberId:'MEM-342', accNo:'ACC-92011', issuedDate:'2026-06-01', dueDate:'2026-06-08', returnedDate:'2026-06-08', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },
  { id:'BR-024', memberId:'MEM-112', accNo:'ACC-44871', issuedDate:'2026-06-20', dueDate:'2026-06-27', returnedDate:'2026-07-05', status:'RETURNED', overdueDays:8,  fine:8,  returnCondition:'Good'    },

  // ── May 2026 ──────────────────────────────────────────────────────────
  { id:'BR-025', memberId:'MEM-084', accNo:'ACC-30491', issuedDate:'2026-05-05', dueDate:'2026-05-12', returnedDate:'2026-05-12', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },
  { id:'BR-026', memberId:'MEM-404', accNo:'ACC-74301', issuedDate:'2026-05-15', dueDate:'2026-05-22', returnedDate:'2026-05-22', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },
  { id:'BR-027', memberId:'MEM-881', accNo:'ACC-61027', issuedDate:'2026-05-20', dueDate:'2026-05-27', returnedDate:'2026-05-27', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },
  { id:'BR-028', memberId:'MEM-405', accNo:'ACC-19203', issuedDate:'2026-05-08', dueDate:'2026-05-15', returnedDate:'2026-05-20', status:'RETURNED', overdueDays:5,  fine:5,  returnCondition:'Good'    },

  // ── April 2026 ────────────────────────────────────────────────────────
  { id:'BR-029', memberId:'MEM-342', accNo:'ACC-88219', issuedDate:'2026-04-05', dueDate:'2026-04-12', returnedDate:'2026-04-12', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },
  { id:'BR-030', memberId:'MEM-112', accNo:'ACC-55103', issuedDate:'2026-04-15', dueDate:'2026-04-22', returnedDate:'2026-04-22', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },
  { id:'BR-031', memberId:'MEM-084', accNo:'ACC-92011', issuedDate:'2026-04-20', dueDate:'2026-04-27', returnedDate:'2026-04-27', status:'RETURNED', overdueDays:0,  fine:0,  returnCondition:'Good'    },
]

/* ─── Fine Payment Status (for records where fine > 0) ─── */
export const FINE_PAYMENTS = {
  'BR-002': { status: 'UNPAID', method: '-',    paidDate: null         },
  'BR-007': { status: 'PAID',   method: 'Cash', paidDate: '2026-09-14' },
  'BR-008': { status: 'UNPAID', method: '-',    paidDate: null         },
  'BR-009': { status: 'UNPAID', method: '-',    paidDate: null         },
  'BR-012': { status: 'PAID',   method: 'Cash', paidDate: '2026-08-14' },
  'BR-013': { status: 'PAID',   method: 'Card', paidDate: '2026-09-01' },
  'BR-014': { status: 'PAID',   method: 'Card', paidDate: '2026-08-25' },
  'BR-017': { status: 'PAID',   method: 'Cash', paidDate: '2026-07-20' },
  'BR-019': { status: 'PAID',   method: 'Card', paidDate: '2026-08-05' },
  'BR-024': { status: 'WAIVED', method: '-',    paidDate: '2026-07-05' },
  'BR-028': { status: 'PAID',   method: 'Cash', paidDate: '2026-05-20' },
}

/* ─── Date Utilities ─── */

/** Convert ISO date string (YYYY-MM-DD) → DD/MM/YYYY display string */
export function formatDate(isoStr) {
  if (!isoStr) return '-'
  const [y, m, d] = isoStr.split('-')
  return `${d}/${m}/${y}`
}

/** Convert DD/MM/YYYY display string → ISO string */
export function toISO(display) {
  if (!display || display === '-') return null
  const [d, m, y] = display.split('/')
  return `${y}-${m}-${d}`
}

/**
 * Filter an array of borrowing records by issuedDate.
 * @param {Array}  records    - BORROWINGS array
 * @param {string} filter     - 'All Time' | 'Today' | 'This Week' | 'This Month' | 'This Year' | 'Custom Range'
 * @param {string} customFrom - ISO date string (for Custom Range)
 * @param {string} customTo   - ISO date string (for Custom Range)
 */
export function filterByDateRange(records, filter, customFrom = '', customTo = '') {
  if (filter === 'All Time') return records

  const now = new Date()
  let from, to

  switch (filter) {
    case 'Today': {
      from = new Date(now); from.setHours(0, 0, 0, 0)
      to   = new Date(now); to.setHours(23, 59, 59, 999)
      break
    }
    case 'This Week': {
      const day  = now.getDay()
      const diff = day === 0 ? -6 : 1 - day   // Monday as start
      from = new Date(now); from.setDate(now.getDate() + diff); from.setHours(0, 0, 0, 0)
      to   = new Date(from); to.setDate(from.getDate() + 6);    to.setHours(23, 59, 59, 999)
      break
    }
    case 'This Month': {
      from = new Date(now.getFullYear(), now.getMonth(), 1)
      to   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      break
    }
    case 'This Year': {
      from = new Date(now.getFullYear(), 0, 1)
      to   = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
      break
    }
    case 'Custom Range': {
      from = customFrom ? new Date(customFrom)                : null
      to   = customTo   ? new Date(customTo + 'T23:59:59')   : null
      break
    }
    default: return records
  }

  return records.filter(r => {
    if (!r.issuedDate) return false
    const d = new Date(r.issuedDate)
    if (from && d < from) return false
    if (to   && d > to  ) return false
    return true
  })
}

/* ─── Derived Page Data ─── */

/** Returns the full borrowings list in the format BorrowingsPage expects */
export function getBorrowingsPageData() {
  return BORROWINGS.map(b => ({
    id:       b.id,
    member:   MEMBERS[b.memberId].name,
    memberId: b.memberId,
    book:     BOOKS[b.accNo].title,
    issued:   formatDate(b.issuedDate),
    due:      formatDate(b.dueDate),
    returned: b.returnedDate ? formatDate(b.returnedDate) : '-',
    days:     b.overdueDays,
    fine:     b.fine,
    status:   b.status,
  }))
}

/** Returns all RETURNED records in the format ReturnsPage expects */
export function getReturnsPageData() {
  return BORROWINGS
    .filter(b => b.status === 'RETURNED')
    .map((b, i) => ({
      id:        `RT-${String(i + 1).padStart(3, '0')}`,
      borrowId:  b.id,
      member:    MEMBERS[b.memberId].name,
      memberId:  b.memberId,
      book:      BOOKS[b.accNo].title,
      accNo:     b.accNo,
      issued:    formatDate(b.issuedDate),
      due:       formatDate(b.dueDate),
      returned:  formatDate(b.returnedDate),
      days:      b.overdueDays,
      fine:      b.fine,
      condition: b.returnCondition || 'Good',
    }))
}

/** Returns all fine records (fine > 0) in the format FinesPage expects */
export function getFinesPageData() {
  return BORROWINGS
    .filter(b => b.fine > 0)
    .map((b, i) => {
      const pmt = FINE_PAYMENTS[b.id] || { status: 'UNPAID', method: '-', paidDate: null }
      return {
        id:       `FN-${String(i + 1).padStart(3, '0')}`,
        borrowId: b.id,
        member:   MEMBERS[b.memberId].name,
        memberId: b.memberId,
        phone:    MEMBERS[b.memberId].phone,
        book:     BOOKS[b.accNo].title,
        days:     b.overdueDays,
        amount:   b.fine,
        paid:     pmt.status === 'PAID' ? b.fine : 0,
        method:   pmt.method,
        date:     formatDate(pmt.paidDate || b.returnedDate || b.dueDate),
        status:   pmt.status,
      }
    })
}

/* ─── Report Computation Helpers ─── */

/** Build month-by-month chart data from a filtered borrowings array */
export function computeMonthlyChart(records) {
  const map = {}
  records.forEach(b => {
    const key = b.issuedDate.slice(0, 7)  // 'YYYY-MM'
    if (!map[key]) map[key] = { issued: 0, returned: 0, fines: 0 }
    map[key].issued++
    if (b.status === 'RETURNED') map[key].returned++
    map[key].fines += b.fine
  })
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, d]) => ({
      month: new Date(key + '-01').toLocaleString('en', { month: 'short' }) + ' ' + key.slice(0, 4),
      issued:   d.issued,
      returned: d.returned,
      fines:    d.fines,
    }))
}

/** Status distribution for pie chart */
export function computeStatusPie(records) {
  return [
    { name: 'Borrowed', value: records.filter(b => b.status === 'BORROWED').length, color: '#2563eb' },
    { name: 'Returned', value: records.filter(b => b.status === 'RETURNED').length, color: '#16a34a' },
    { name: 'Overdue',  value: records.filter(b => b.status === 'OVERDUE').length,  color: '#ef4444' },
  ]
}

/** Top N most-borrowed books */
export function computePopularBooks(records, n = 8) {
  const map = {}
  records.forEach(b => {
    const key = b.accNo
    if (!map[key]) map[key] = { accNo: key, title: BOOKS[key].title, author: BOOKS[key].author, count: 0 }
    map[key].count++
  })
  return Object.values(map)
    .sort((a, b) => b.count - a.count)
    .slice(0, n)
    .map((b, i) => ({ rank: i + 1, title: b.title, author: b.author, borrowed: b.count }))
}

/** Per-member activity summary */
export function computeMemberStats(records) {
  const map = {}
  records.forEach(b => {
    if (!map[b.memberId]) map[b.memberId] = {
      id: b.memberId, name: MEMBERS[b.memberId].name,
      borrowed: 0, returned: 0, overdue: 0, fines: 0,
    }
    map[b.memberId].borrowed++
    if (b.status === 'RETURNED') map[b.memberId].returned++
    if (b.status === 'OVERDUE')  map[b.memberId].overdue++
    map[b.memberId].fines += b.fine
  })
  return Object.values(map).sort((a, b) => b.borrowed - a.borrowed)
}

/** Overdue records list */
export function computeOverdueRecords(records) {
  return records
    .filter(b => b.status === 'OVERDUE')
    .map(b => ({
      id:       b.id,
      member:   MEMBERS[b.memberId].name,
      memberId: b.memberId,
      book:     BOOKS[b.accNo].title,
      due:      formatDate(b.dueDate),
      days:     b.overdueDays,
      fine:     b.fine,
    }))
}
