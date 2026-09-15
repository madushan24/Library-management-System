import { useState } from 'react'
import './BooksPage.css'

const books = [
  { id: 'BK-001', isbn: '978-0-07-352332-2', title: 'Discrete Mathematics & Its Applications', author: 'Kenneth H. Rosen',    category: 'Mathematics',   available: 3, total: 5,  status: 'AVAILABLE'  },
  { id: 'BK-002', isbn: '978-0-13-468599-1', title: 'Modern Operating Systems',                author: 'Andrew Tanenbaum',    category: 'Comp Science',  available: 0, total: 4,  status: 'OUT_OF_STOCK' },
  { id: 'BK-003', isbn: '978-0-262-03384-8', title: 'Introduction to Algorithms',              author: 'Cormen, Leiserson',   category: 'Computing',     available: 2, total: 6,  status: 'AVAILABLE'  },
  { id: 'BK-004', isbn: '978-0-13-602772-8', title: 'Microelectronic Circuits',                author: 'Sedra & Smith',       category: 'Engineering',   available: 1, total: 3,  status: 'AVAILABLE'  },
  { id: 'BK-005', isbn: '978-0-07-464765-7', title: 'Principles of Economics',                 author: 'N. Gregory Mankiw',  category: 'Economics',     available: 0, total: 2,  status: 'MAINTENANCE' },
]

const STATUS_STYLE = {
  AVAILABLE:   { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  OUT_OF_STOCK:{ color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  MAINTENANCE: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
}

const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const PlusIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>

export default function BooksPage() {
  const [search, setSearch] = useState('')
  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.isbn.includes(search)
  )

  return (
    <div className="bp">
      <div className="bp-header">
        <div>
          <h2 className="bp-title">Books</h2>
          <p className="bp-sub">Manage book catalog and inventory</p>
        </div>
        <button className="bp-add-btn"><PlusIcon /> Add Book</button>
      </div>

      <div className="bp-toolbar">
        <div className="bp-search">
          <SearchIcon />
          <input placeholder="Search by title, ISBN, author…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="bp-select"><option>All Categories</option><option>Mathematics</option><option>Comp Science</option><option>Engineering</option></select>
        <select className="bp-select"><option>All Status</option><option>AVAILABLE</option><option>OUT OF STOCK</option><option>MAINTENANCE</option></select>
      </div>

      <div className="bp-card">
        <table className="bp-table">
          <thead>
            <tr>
              <th>BOOK ID</th><th>ISBN</th><th>TITLE</th><th>AUTHOR</th><th>CATEGORY</th>
              <th>AVAILABLE</th><th>TOTAL</th><th>STATUS</th><th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const st = STATUS_STYLE[b.status] || STATUS_STYLE.AVAILABLE
              return (
                <tr key={b.id}>
                  <td><span className="bp-id">{b.id}</span></td>
                  <td className="bp-isbn">{b.isbn}</td>
                  <td><span className="bp-book-title">{b.title}</span></td>
                  <td className="bp-author">{b.author}</td>
                  <td><span className="bp-cat">{b.category}</span></td>
                  <td><span className={`bp-copies${b.available === 0 ? ' bp-copies--zero' : ''}`}>{b.available}</span></td>
                  <td>{b.total}</td>
                  <td>
                    <span className="bp-status" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="bp-actions">
                      <button className="bp-btn bp-btn--view">View</button>
                      <button className="bp-btn bp-btn--edit">Edit</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="bp-footer">Showing {filtered.length} of {books.length} books</div>
      </div>
    </div>
  )
}
