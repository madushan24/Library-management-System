import { useState } from 'react'
import './BooksPage.css'
import BookDetailModal from '../../components/books/BookDetailModal'
import EditBookModal from '../../components/books/EditBookModal'
import AddBookModal from '../../components/books/AddBookModal'

const BOOKS = [
  { id: 'BK-001', isbn: '978-0-07-352332-2', title: 'Discrete Mathematics & Its Applications', author: 'Kenneth H. Rosen',    category: 'Mathematics',   available: 3, total: 5, borrowed: 2, status: 'AVAILABLE'    },
  { id: 'BK-002', isbn: '978-0-13-468599-1', title: 'Modern Operating Systems',                author: 'Andrew Tanenbaum',    category: 'Comp Science',  available: 0, total: 4, borrowed: 4, status: 'OUT_OF_STOCK'  },
  { id: 'BK-003', isbn: '978-0-262-03384-8', title: 'Introduction to Algorithms',              author: 'Cormen, Leiserson',   category: 'Computing',     available: 2, total: 6, borrowed: 4, status: 'AVAILABLE'    },
  { id: 'BK-004', isbn: '978-0-13-602772-8', title: 'Microelectronic Circuits',                author: 'Sedra & Smith',       category: 'Engineering',   available: 1, total: 3, borrowed: 2, status: 'AVAILABLE'    },
  { id: 'BK-005', isbn: '978-0-07-464765-7', title: 'Principles of Economics',                 author: 'N. Gregory Mankiw',  category: 'Economics',     available: 0, total: 2, borrowed: 0, status: 'MAINTENANCE'  },
  { id: 'BK-006', isbn: '978-0-13-110362-7', title: 'The C Programming Language',              author: 'Kernighan & Ritchie', category: 'Computing',    available: 4, total: 4, borrowed: 0, status: 'AVAILABLE'    },
  { id: 'BK-007', isbn: '978-0-20-163361-0', title: 'Clean Code',                              author: 'Robert C. Martin',   category: 'Software Eng',  available: 0, total: 3, borrowed: 3, status: 'OUT_OF_STOCK'  },
]

const STATUS_STYLE = {
  AVAILABLE:    { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  OUT_OF_STOCK: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  MAINTENANCE:  { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
}

const CAT_COLORS = {
  Mathematics:   { color: '#2563eb', bg: '#eff6ff' },
  'Comp Science':{ color: '#7c3aed', bg: '#f5f3ff' },
  Computing:     { color: '#0891b2', bg: '#ecfeff' },
  Engineering:   { color: '#d97706', bg: '#fffbeb' },
  Economics:     { color: '#16a34a', bg: '#f0fdf4' },
  'Software Eng':{ color: '#db2777', bg: '#fdf2f8' },
}

const SearchIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const PlusIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const BookIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const CheckIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
const LayersIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
const AlertIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const WrenchIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>

export default function BooksPage() {
  const [search, setSearch]         = useState('')
  const [catFilter, setCatFilter]   = useState('All Categories')
  const [statusFilter, setStatus]   = useState('All Status')
  const [viewBook, setViewBook]     = useState(null)
  const [editBook, setEditBook]     = useState(null)
  const [showAdd, setShowAdd]       = useState(false)

  const totalBooks    = BOOKS.reduce((s, b) => s + b.total, 0)
  const availBooks    = BOOKS.reduce((s, b) => s + b.available, 0)
  const borrowedBooks = BOOKS.reduce((s, b) => s + b.borrowed, 0)
  const overdueBooks  = BOOKS.filter(b => b.borrowed > 0 && b.available === 0).length
  const maintenance   = BOOKS.filter(b => b.status === 'MAINTENANCE').length
  const needsAtten    = BOOKS.filter(b => b.status === 'OUT_OF_STOCK' || b.status === 'MAINTENANCE').length

  const categories = ['All Categories', ...new Set(BOOKS.map(b => b.category))]

  const filtered = BOOKS.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q)
    const matchCat    = catFilter === 'All Categories' || b.category === catFilter
    const matchStatus = statusFilter === 'All Status'  || b.status.replace(/_/g, ' ') === statusFilter
    return matchSearch && matchCat && matchStatus
  })

  return (
    <div className="bp">

      {/* Header */}
      <div className="bp-header">
        <div>
          <h2 className="bp-title">Books</h2>
          <p className="bp-sub">Manage book catalog, inventory and circulation</p>
        </div>
        <button className="bp-add-btn" onClick={() => setShowAdd(true)}>
          <PlusIcon /> Add Book
        </button>
      </div>

      {/* KPI Cards */}
      <div className="bp-kpi-row">
        <div className="bp-kpi">
          <div className="bp-kpi-icon bp-kpi-icon--blue"><BookIcon /></div>
          <div className="bp-kpi-body">
            <div className="bp-kpi-label">TOTAL BOOKS</div>
            <div className="bp-kpi-value">{totalBooks}</div>
            <div className="bp-kpi-sub">{BOOKS.length} unique titles in catalog</div>
          </div>
        </div>
        <div className="bp-kpi">
          <div className="bp-kpi-icon bp-kpi-icon--green"><CheckIcon /></div>
          <div className="bp-kpi-body">
            <div className="bp-kpi-label">AVAILABLE COPIES</div>
            <div className="bp-kpi-value bp-kpi-value--green">{availBooks}</div>
            <div className="bp-kpi-sub">{totalBooks > 0 ? ((availBooks / totalBooks) * 100).toFixed(1) : 0}% of total on shelf</div>
          </div>
        </div>
        <div className="bp-kpi">
          <div className="bp-kpi-icon bp-kpi-icon--indigo"><LayersIcon /></div>
          <div className="bp-kpi-body">
            <div className="bp-kpi-label">BORROWED COPIES</div>
            <div className="bp-kpi-value">{borrowedBooks}</div>
            <div className="bp-kpi-sub">{totalBooks > 0 ? ((borrowedBooks / totalBooks) * 100).toFixed(1) : 0}% currently on loan</div>
          </div>
        </div>
        <div className="bp-kpi bp-kpi--warn">
          <div className="bp-kpi-icon bp-kpi-icon--orange"><AlertIcon /></div>
          <div className="bp-kpi-body">
            <div className="bp-kpi-label">OVERDUE TO RETURN</div>
            <div className="bp-kpi-value bp-kpi-value--red">{overdueBooks}</div>
            <div className="bp-kpi-sub">books past due  fines accumulating</div>
          </div>
        </div>
        <div className="bp-kpi bp-kpi--maint">
          <div className="bp-kpi-icon bp-kpi-icon--yellow"><WrenchIcon /></div>
          <div className="bp-kpi-body">
            <div className="bp-kpi-label">NEEDS ATTENTION</div>
            <div className="bp-kpi-value bp-kpi-value--orange">{needsAtten}</div>
            <div className="bp-kpi-sub">{maintenance} maintenance, rest out of stock</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bp-toolbar">
        <div className="bp-search">
          <SearchIcon />
          <input
            placeholder="Search by title, ISBN, author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="bp-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="bp-select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
          <option>All Status</option>
          <option>AVAILABLE</option>
          <option>OUT OF STOCK</option>
          <option>MAINTENANCE</option>
        </select>
      </div>

      {/* Table */}
      <div className="bp-card">
        <table className="bp-table">
          <thead>
            <tr>
              <th>BOOK ID</th>
              <th>ISBN</th>
              <th>TITLE &amp; AUTHOR</th>
              <th>CATEGORY</th>
              <th>AVAILABLE</th>
              <th>BORROWED</th>
              <th>TOTAL</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const st  = STATUS_STYLE[b.status] || STATUS_STYLE.AVAILABLE
              const cat = CAT_COLORS[b.category] || { color: '#64748b', bg: '#f8fafc' }
              return (
                <tr key={b.id}>
                  <td><span className="bp-id">{b.id}</span></td>
                  <td className="bp-isbn">{b.isbn}</td>
                  <td>
                    <div className="bp-book-title">{b.title}</div>
                    <div className="bp-author">{b.author}</div>
                  </td>
                  <td>
                    <span className="bp-cat" style={{ color: cat.color, background: cat.bg }}>
                      {b.category}
                    </span>
                  </td>
                  <td>
                    <span className={`bp-copies${b.available === 0 ? ' bp-copies--zero' : ''}`}>
                      {b.available}
                    </span>
                  </td>
                  <td>
                    <span className={`bp-borrowed${b.borrowed > 0 ? ' bp-borrowed--active' : ''}`}>
                      {b.borrowed}
                    </span>
                  </td>
                  <td className="bp-total">{b.total}</td>
                  <td>
                    <span className="bp-status" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                      <span className="bp-status-dot" style={{ background: st.color }} />
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="bp-actions">
                      <button className="bp-btn bp-btn--view" onClick={() => setViewBook(b)}>View</button>
                      <button className="bp-btn bp-btn--edit" onClick={() => setEditBook(b)}>Edit</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="bp-footer">
          <span>Showing {filtered.length} of {BOOKS.length} titles</span>
          <span className="bp-footer-right">{totalBooks} total copies in library</span>
        </div>
      </div>

      {/* Modals */}
      {showAdd   && <AddBookModal    onClose={() => setShowAdd(false)}   onSave={() => setShowAdd(false)} />}
      {viewBook  && <BookDetailModal book={viewBook}  onClose={() => setViewBook(null)} onEdit={b => { setViewBook(null); setEditBook(b) }} />}
      {editBook  && <EditBookModal   book={editBook}  onClose={() => setEditBook(null)} onSave={() => setEditBook(null)} />}
    </div>
  )
}
