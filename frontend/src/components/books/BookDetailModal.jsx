import './BookDetailModal.css'

const STATUS_STYLE = {
  AVAILABLE:    { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  OUT_OF_STOCK: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  MAINTENANCE:  { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
}

const XIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const BookIcon = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const EditIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>

const Row = ({ label, value, accent }) => (
  <div className="bdm-row">
    <span className="bdm-row-label">{label}</span>
    <span className={`bdm-row-val${accent ? ' bdm-row-val--accent' : ''}`}>{value || '--'}</span>
  </div>
)

export default function BookDetailModal({ book, onClose, onEdit }) {
  if (!book) return null
  const st  = STATUS_STYLE[book.status] || STATUS_STYLE.AVAILABLE
  const pct = book.total > 0 ? Math.round((book.available / book.total) * 100) : 0

  return (
    <div className="bdm-backdrop" onClick={onClose}>
      <div className="bdm-panel" onClick={e => e.stopPropagation()}>

        <div className="bdm-header">
          <span className="bdm-header-title">Book Details</span>
          <div className="bdm-header-actions">
            <button className="bdm-edit-btn" onClick={() => { onClose(); onEdit(book) }}>
              <EditIcon /> Edit Book
            </button>
            <button className="bdm-close" onClick={onClose}><XIcon /></button>
          </div>
        </div>

        <div className="bdm-body">

          <div className="bdm-hero">
            <div className="bdm-cover"><BookIcon /></div>
            <div className="bdm-hero-info">
              <div className="bdm-book-id">{book.id}</div>
              <h2 className="bdm-book-title">{book.title}</h2>
              <div className="bdm-book-author">{book.author}</div>
              <div className="bdm-tags">
                <span className="bdm-cat-tag">{book.category}</span>
                <span className="bdm-status-tag" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                  <span className="bdm-sdot" style={{ background: st.color }} />
                  {book.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="bdm-section-card">
            <div className="bdm-section-title">Inventory &amp; Availability</div>
            <div className="bdm-inventory-grid">
              <div className="bdm-inv-stat bdm-inv-stat--green">
                <div className="bdm-inv-val">{book.available}</div>
                <div className="bdm-inv-label">Available</div>
              </div>
              <div className="bdm-inv-stat bdm-inv-stat--blue">
                <div className="bdm-inv-val">{book.borrowed}</div>
                <div className="bdm-inv-label">Borrowed</div>
              </div>
              <div className="bdm-inv-stat">
                <div className="bdm-inv-val">{book.total}</div>
                <div className="bdm-inv-label">Total Copies</div>
              </div>
              <div className="bdm-inv-stat">
                <div className="bdm-inv-val">{pct}%</div>
                <div className="bdm-inv-label">Availability</div>
              </div>
            </div>
            <div className="bdm-bar-wrap">
              <div className="bdm-bar-track">
                <div className="bdm-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="bdm-bar-label">{book.available} of {book.total} copies available</span>
            </div>
          </div>

          <div className="bdm-section-card">
            <div className="bdm-section-title">Publication Details</div>
            <Row label="ISBN"             value={book.isbn} accent />
            <Row label="Title"            value={book.title} />
            <Row label="Author"           value={book.author} />
            <Row label="Category"         value={book.category} />
            <Row label="Publisher"        value={book.publisher || 'McGraw-Hill Education'} />
            <Row label="Edition"          value={book.edition  || '7th Edition'} />
            <Row label="Publication Year" value={book.year     || '2019'} />
            <Row label="Language"         value={book.language || 'English'} />
            <Row label="Shelf Number"     value={book.shelf    || `A-${book.id.replace('BK-', '')}`} />
          </div>

          <div className="bdm-section-card">
            <div className="bdm-section-title">Description</div>
            <p className="bdm-desc">
              {book.description ||
                `${book.title} is a comprehensive academic text covering ${book.category.toLowerCase()}. Widely used in university curricula, this book provides in-depth theoretical foundations along with practical applications and exercises.`}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
