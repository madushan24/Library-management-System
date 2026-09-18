import { useState } from 'react'
import './AddBookModal.css'

const CATS = ['Mathematics','Comp Science','Computing','Engineering','Economics','Software Eng','Physics','Chemistry','Literature','History']
const LANGS = ['English','Sinhala','Tamil','French','German']

const XI = () => React.createElement('span', null, 'X')

import React from 'react'

const INIT = { title:'',author:'',isbn:'',category:'',publisher:'',edition:'',year:2026,language:'English',shelf:'',total:1,description:'',status:'AVAILABLE' }

export default function AddBookModal({ onClose, onSave }) {
  const [form, setForm] = useState(INIT)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState(1)

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => ({ ...p, [k]: '' })) }

  const validateStep = (s) => {
    const e = {}
    if (s === 1) { if (!form.title.trim()) e.title = 'Required'; if (!form.author.trim()) e.author = 'Required'; if (!form.isbn.trim()) e.isbn = 'Required'; if (!form.category) e.category = 'Required' }
    if (s === 2) { if (!form.publisher.trim()) e.publisher = 'Required' }
    if (s === 3) { if (!form.total || form.total < 1) e.total = 'Min 1'; if (!form.shelf.trim()) e.shelf = 'Required' }
    return e
  }

  const next = () => { const e = validateStep(step); if (Object.keys(e).length) { setErrors(e); return }; setErrors({}); setStep(s => s + 1) }

  const submit = (e) => { e.preventDefault(); const e3 = validateStep(3); if (Object.keys(e3).length) { setErrors(e3); return }; setSuccess(true); setTimeout(() => { onSave && onSave(form); onClose() }, 1200) }

  if (success) return (
    <div className="abm-backdrop" onClick={onClose}>
      <div className="abm-modal" onClick={e => e.stopPropagation()}>
        <div className="abm-success">
          <div className="abm-success-icon">&#10003;</div>
          <div className="abm-success-title">Book Added!</div>
          <p>{form.title} added to catalog. {form.total} copies on shelf {form.shelf}.</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="abm-backdrop" onClick={onClose}>
      <div className="abm-modal" onClick={e => e.stopPropagation()}>
        <div className="abm-header">
          <div className="abm-header-left">
            <div className="abm-header-icon">&#128218;</div>
            <div><h2 className="abm-title">Add New Book</h2><p className="abm-subtitle">Add a book to the catalog</p></div>
          </div>
          <button className="abm-close" onClick={onClose}>&#10005;</button>
        </div>

        <div className="abm-steps">
          {['Book Info','Publication','Inventory'].map((s,i) => (
            <div key={i} className={"abm-step" + (step===i+1?" abm-step--active":step>i+1?" abm-step--done":"")}>
              <div className="abm-step-num">{step>i+1?'&#10003;':i+1}</div>
              <span className="abm-step-label">{s}</span>
              {i<2 && <div className="abm-step-line"/>}
            </div>
          ))}
        </div>

        <form onSubmit={submit} noValidate>
          <div className="abm-body">
            {step===1 && <>
              <div className="abm-section-label">Book Information</div>
              <div className="abm-field abm-field--full">
                <label className="abm-label">Title <span className="abm-req">*</span></label>
                <input className={"abm-input"+(errors.title?" abm-input--err":"")} placeholder="Book title" value={form.title} onChange={e=>set('title',e.target.value)}/>
                {errors.title && <span className="abm-err">{errors.title}</span>}
              </div>
              <div className="abm-grid-2">
                <div className="abm-field">
                  <label className="abm-label">Author <span className="abm-req">*</span></label>
                  <input className={"abm-input"+(errors.author?" abm-input--err":"")} placeholder="Author name" value={form.author} onChange={e=>set('author',e.target.value)}/>
                  {errors.author && <span className="abm-err">{errors.author}</span>}
                </div>
                <div className="abm-field">
                  <label className="abm-label">Category <span className="abm-req">*</span></label>
                  <select className={"abm-input"+(errors.category?" abm-input--err":"")} value={form.category} onChange={e=>set('category',e.target.value)}>
                    <option value="">Select...</option>
                    {CATS.map(c=><option key={c}>{c}</option>)}
                  </select>
                  {errors.category && <span className="abm-err">{errors.category}</span>}
                </div>
                <div className="abm-field abm-field--full">
                  <label className="abm-label">ISBN <span className="abm-req">*</span></label>
                  <input className={"abm-input"+(errors.isbn?" abm-input--err":"")} placeholder="978-x-xxx-xxxxx-x" value={form.isbn} onChange={e=>set('isbn',e.target.value)}/>
                  {errors.isbn && <span className="abm-err">{errors.isbn}</span>}
                </div>
              </div>
              <div className="abm-field abm-field--full">
                <label className="abm-label">Description</label>
                <textarea className="abm-textarea" rows={3} placeholder="Brief description..." value={form.description} onChange={e=>set('description',e.target.value)}/>
              </div>
            </>}

            {step===2 && <>
              <div className="abm-section-label">Publication Details</div>
              <div className="abm-grid-2">
                <div className="abm-field abm-field--full">
                  <label className="abm-label">Publisher <span className="abm-req">*</span></label>
                  <input className={"abm-input"+(errors.publisher?" abm-input--err":"")} placeholder="Publisher name" value={form.publisher} onChange={e=>set('publisher',e.target.value)}/>
                  {errors.publisher && <span className="abm-err">{errors.publisher}</span>}
                </div>
                <div className="abm-field">
                  <label className="abm-label">Edition</label>
                  <input className="abm-input" placeholder="e.g. 3rd Edition" value={form.edition} onChange={e=>set('edition',e.target.value)}/>
                </div>
                <div className="abm-field">
                  <label className="abm-label">Year</label>
                  <input className="abm-input" type="number" min="1800" max="2099" value={form.year} onChange={e=>set('year',parseInt(e.target.value)||'')}/>
                </div>
                <div className="abm-field">
                  <label className="abm-label">Language</label>
                  <select className="abm-input" value={form.language} onChange={e=>set('language',e.target.value)}>
                    {LANGS.map(l=><option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </>}

            {step===3 && <>
              <div className="abm-section-label">Inventory</div>
              <div className="abm-grid-2">
                <div className="abm-field">
                  <label className="abm-label">Total Copies <span className="abm-req">*</span></label>
                  <input className={"abm-input"+(errors.total?" abm-input--err":"")} type="number" min="1" value={form.total} onChange={e=>set('total',parseInt(e.target.value)||'')}/>
                  {errors.total && <span className="abm-err">{errors.total}</span>}
                </div>
                <div className="abm-field">
                  <label className="abm-label">Shelf Number <span className="abm-req">*</span></label>
                  <input className={"abm-input"+(errors.shelf?" abm-input--err":"")} placeholder="e.g. A-01" value={form.shelf} onChange={e=>set('shelf',e.target.value)}/>
                  {errors.shelf && <span className="abm-err">{errors.shelf}</span>}
                </div>
                <div className="abm-field">
                  <label className="abm-label">Status</label>
                  <select className="abm-input" value={form.status} onChange={e=>set('status',e.target.value)}>
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
              </div>
              <div className="abm-summary">
                <div className="abm-summary-title">Summary</div>
                {[['Title',form.title],['Author',form.author],['ISBN',form.isbn],['Category',form.category],['Publisher',form.publisher||'--'],['Year',form.year],['Copies',form.total],['Shelf',form.shelf||'--']].map(([k,v])=>(
                  <div key={k} className="abm-summary-row"><span>{k}</span><strong>{v}</strong></div>
                ))}
              </div>
            </>}
            <p className="abm-note"><span className="abm-req">*</span> Required</p>
          </div>

          <div className="abm-footer">
            <div className="abm-footer-left">
              {step > 1 && (
                <button type="button" className="abm-back-btn" onClick={() => { setErrors({}); setStep(s => s - 1) }}>
                  Back
                </button>
              )}
            </div>
            <div className="abm-footer-actions">
              <button type="button" className="abm-cancel-btn" onClick={onClose}>Cancel</button>
              {step < 3
                ? <button type="button" className="abm-next-btn" onClick={next}>Continue</button>
                : <button type="submit" className="abm-save-btn">Add Book</button>}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
