import { useState } from 'react'
import './EditBookModal.css'

const XIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const SaveIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>

const CATEGORIES = ['Mathematics','Comp Science','Computing','Engineering','Economics','Software Eng','Physics','Chemistry','Literature','History']
const LANGUAGES  = ['English','Sinhala','Tamil','French','German','Japanese']

export default function EditBookModal({ book, onClose, onSave }) {
  const [form, setForm] = useState({
    title:     book?.title     || '',
    author:    book?.author    || '',
    isbn:      book?.isbn      || '',
    category:  book?.category  || '',
    publisher: book?.publisher || 'McGraw-Hill Education',
    edition:   book?.edition   || '7th Edition',
    year:      book?.year      || '2019',
    language:  book?.language  || 'English',
    shelf:     book?.shelf     || `A-${book?.id?.replace('BK-', '') || '001'}`,
    total:     book?.total     || 1,
    available: book?.available ?? 1,
    status:    book?.status    || 'AVAILABLE',
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())  e.title  = 'Title is required.'
    if (!form.author.trim()) e.author = 'Author is required.'
    if (!form.isbn.trim())   e.isbn   = 'ISBN is required.'
    if (!form.category)      e.category = 'Category is required.'
    if (form.total < 1)      e.total  = 'Total copies must be at least 1.'
    if (form.available < 0)  e.available = 'Available copies cannot be negative.'
    if (form.available > form.total) e.available = 'Cannot exceed total copies.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSuccess(true)
    setTimeout(() => { onSave?.({ ...book, ...form }); onClose() }, 1200)
  }

  if (success) return (
    <div className="ebm-backdrop" onClick={onClose}>
      <div className="ebm-modal" onClick={e => e.stopPropagation()}>
        <div className="ebm-success">
          <div className="ebm-success-icon"><CheckIcon /></div>
          <div className="ebm-success-title">Book Updated!</div>
          <p>{form.title} has been successfully updated.</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="ebm-backdrop" onClick={onClose}>
      <div className="ebm-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="ebm-header">
          <div className="ebm-header-left">
            <div className="ebm-header-icon"><SaveIcon /></div>
            <div>
              <h2 className="ebm-title">Edit Book</h2>
              <p className="ebm-subtitle">{book?.id} &bull; Update book details and inventory</p>
            </div>
          </div>
          <button className="ebm-close" onClick={onClose}><XIcon /></button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="ebm-body">

            {/* Basic Info */}
            <div className="ebm-section-label">Book Information</div>
            <div className="ebm-grid-2">
              <div className="ebm-field ebm-field--full">
                <label className="ebm-label">Title <span className="ebm-req">*</span></label>
                <input className={`ebm-input${errors.title ? ' ebm-input--err' : ''}`}
                  value={form.title} onChange={e => set('title', e.target.value)}
                  placeholder="Book title" />
                {errors.title && <span className="ebm-err">{errors.title}</span>}
              </div>
              <div className="ebm-field">
                <label className="ebm-label">Author <span className="ebm-req">*</span></label>
                <input className={`ebm-input${errors.author ? ' ebm-input--err' : ''}`}
                  value={form.author} onChange={e => set('author', e.target.value)}
                  placeholder="Author name" />
                {errors.author && <span className="ebm-err">{errors.author}</span>}
              </div>
              <div className="ebm-field">
                <label className="ebm-label">ISBN <span className="ebm-req">*</span></label>
                <input className={`ebm-input${errors.isbn ? ' ebm-input--err' : ''}`}
                  value={form.isbn} onChange={e => set('isbn', e.target.value)}
                  placeholder="978-x-xxx-xxxxx-x" />
                {errors.isbn && <span className="ebm-err">{errors.isbn}</span>}
              </div>
              <div className="ebm-field">
                <label className="ebm-label">Category <span className="ebm-req">*</span></label>
                <select className={`ebm-input${errors.category ? ' ebm-input--err' : ''}`}
                  value={form.category} onChange={e => set('category', e.target.value)}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.category && <span className="ebm-err">{errors.category}</span>}
              </div>
            </div>

            {/* Publication */}
            <div className="ebm-section-label">Publication Details</div>
            <div className="ebm-grid-2">
              <div className="ebm-field">
                <label className="ebm-label">Publisher</label>
                <input className="ebm-input" value={form.publisher}
                  onChange={e => set('publisher', e.target.value)} placeholder="Publisher name" />
              </div>
              <div className="ebm-field">
                <label className="ebm-label">Edition</label>
                <input className="ebm-input" value={form.edition}
                  onChange={e => set('edition', e.target.value)} placeholder="e.g. 3rd Edition" />
              </div>
              <div className="ebm-field">
                <label className="ebm-label">Publication Year</label>
                <input className="ebm-input" type="number" min="1900" max="2099" value={form.year}
                  onChange={e => set('year', e.target.value)} />
              </div>
              <div className="ebm-field">
                <label className="ebm-label">Language</label>
                <select className="ebm-input" value={form.language}
                  onChange={e => set('language', e.target.value)}>
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="ebm-field">
                <label className="ebm-label">Shelf Number</label>
                <input className="ebm-input" value={form.shelf}
                  onChange={e => set('shelf', e.target.value)} placeholder="e.g. A-01" />
              </div>
            </div>

            {/* Inventory */}
            <div className="ebm-section-label">Inventory</div>
            <div className="ebm-grid-3">
              <div className="ebm-field">
                <label className="ebm-label">Total Copies <span className="ebm-req">*</span></label>
                <input className={`ebm-input${errors.total ? ' ebm-input--err' : ''}`}
                  type="number" min="1" value={form.total}
                  onChange={e => set('total', parseInt(e.target.value) || 0)} />
                {errors.total && <span className="ebm-err">{errors.total}</span>}
              </div>
              <div className="ebm-field">
                <label className="ebm-label">Available Copies</label>
                <input className={`ebm-input${errors.available ? ' ebm-input--err' : ''}`}
                  type="number" min="0" value={form.available}
                  onChange={e => set('available', parseInt(e.target.value) || 0)} />
                {errors.available && <span className="ebm-err">{errors.available}</span>}
              </div>
              <div className="ebm-field">
                <label className="ebm-label">Status</label>
                <select className="ebm-input" value={form.status}
                  onChange={e => set('status', e.target.value)}>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
            </div>

            <p className="ebm-note"><span className="ebm-req">*</span> Required fields</p>
          </div>

          <div className="ebm-footer">
            <button type="button" className="ebm-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="ebm-save-btn"><SaveIcon /> Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )
}
