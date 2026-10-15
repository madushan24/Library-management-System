import { useState } from 'react'
import './LibrariansPage.css'

/* ─── Initial data ─── */
const INIT_LIBRARIANS = [
  { id: 'LIB-001', name: 'Chaminda Perera',  initials: 'CP', color: '#1e3a8a', username: 'chaminda.p', email: 'chaminda@library.lk',  phone: '077 111 2233', role: 'Senior Librarian',    shift: 'Morning',   joined: '01/01/2024', lastLogin: '15/10/2026', status: 'ACTIVE'   },
  { id: 'LIB-002', name: 'Nirosha Silva',    initials: 'NS', color: '#7c3aed', username: 'nirosha.s',  email: 'nirosha@library.lk',   phone: '071 223 4455', role: 'Librarian',           shift: 'Evening',   joined: '15/02/2024', lastLogin: '14/10/2026', status: 'ACTIVE'   },
  { id: 'LIB-003', name: 'Ruwan Fernando',   initials: 'RF', color: '#0891b2', username: 'ruwan.f',    email: 'ruwan@library.lk',     phone: '076 334 5566', role: 'Assistant Librarian', shift: 'Morning',   joined: '10/03/2024', lastLogin: '10/10/2026', status: 'INACTIVE' },
  { id: 'LIB-004', name: 'Amali Jayasinghe', initials: 'AJ', color: '#059669', username: 'amali.j',   email: 'amali@library.lk',     phone: '078 445 6677', role: 'Librarian',           shift: 'Afternoon', joined: '20/05/2024', lastLogin: '15/10/2026', status: 'ACTIVE'   },
  { id: 'LIB-005', name: 'Kasun Rathnayake', initials: 'KR', color: '#d97706', username: 'kasun.r',   email: 'kasunr@library.lk',    phone: '075 556 7788', role: 'Assistant Librarian', shift: 'Evening',   joined: '12/07/2024', lastLogin: '13/10/2026', status: 'ACTIVE'   },
]

const STATUS_STYLE = {
  ACTIVE:   { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', dot: '#16a34a' },
  INACTIVE: { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', dot: '#94a3b8' },
}

const ROLES   = ['Senior Librarian', 'Librarian', 'Assistant Librarian']
const SHIFTS  = ['Morning', 'Afternoon', 'Evening']

/* ─── Icons ─── */
const PlusIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const SearchIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const EditIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const KeyIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
const XIcon       = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const UsersIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const CheckIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
const SunIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
const EyeIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeOffIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>

/* ─── Validation ─── */
function validate(form, isEdit = false) {
  const errs = {}
  if (!form.name.trim())     errs.name     = 'Full name is required'
  if (!form.username.trim()) errs.username  = 'Username is required'
  if (!form.email.trim())    errs.email     = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address'
  if (!form.phone.trim())    errs.phone     = 'Phone number is required'
  if (!isEdit) {
    if (!form.password.trim())        errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Minimum 8 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
  }
  return errs
}

/* ─── Add / Edit Modal ─── */
function LibrarianModal({ librarian, onClose, onSave }) {
  const isEdit = !!librarian
  const EMPTY  = { name: '', username: '', email: '', phone: '', role: 'Librarian', shift: 'Morning', password: '', confirm: '' }
  const [form, setForm]       = useState(isEdit ? { ...librarian, password: '', confirm: '' } : EMPTY)
  const [errors, setErrors]   = useState({})
  const [showPw, setShowPw]   = useState(false)
  const [step, setStep]       = useState(1)

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const handleNext = () => {
    const errs = {}
    if (!form.name.trim())     errs.name     = 'Full name is required'
    if (!form.username.trim()) errs.username  = 'Username is required'
    if (!form.email.trim())    errs.email     = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address'
    if (!form.phone.trim())    errs.phone     = 'Phone number is required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStep(2)
  }

  const handleSubmit = () => {
    if (!isEdit) {
      const errs = {}
      if (!form.password.trim()) errs.password = 'Password is required'
      else if (form.password.length < 8) errs.password = 'Minimum 8 characters'
      if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
      if (Object.keys(errs).length) { setErrors(errs); return }
    }
    onSave(form)
  }

  return (
    <div className="lbp-modal-backdrop" onClick={onClose}>
      <div className="lbp-modal" onClick={e => e.stopPropagation()}>

        <div className="lbp-modal-header">
          <div>
            <h3 className="lbp-modal-title">{isEdit ? 'Edit Librarian' : 'Add New Librarian'}</h3>
            <p className="lbp-modal-sub">
              {isEdit ? 'Update account details' : step === 1 ? 'Enter personal & contact details' : 'Set role, shift & login credentials'}
            </p>
          </div>
          <button className="lbp-modal-close" onClick={onClose}><XIcon /></button>
        </div>

        {/* Step indicator (only for Add) */}
        {!isEdit && (
          <div className="lbp-modal-steps">
            {['Personal Details', 'Role & Credentials'].map((s, i) => (
              <div key={i} className={`lbp-modal-step${step === i + 1 ? ' active' : step > i + 1 ? ' done' : ''}`}>
                <div className="lbp-modal-step-num">{step > i + 1 ? '✓' : i + 1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}

        <div className="lbp-modal-body">
          {/* Step 1 / Edit: personal info */}
          {(step === 1 || isEdit) && (
            <div className="lbp-form-grid">
              {[
                { label: 'Full Name',  key: 'name',     type: 'text',  ph: 'e.g. Chaminda Perera',      span: 2 },
                { label: 'Username',   key: 'username',  type: 'text',  ph: 'e.g. chaminda.p'            },
                { label: 'Phone',      key: 'phone',     type: 'text',  ph: '077 xxx xxxx'               },
                { label: 'Email',      key: 'email',     type: 'email', ph: 'chaminda@library.lk', span: 2 },
              ].map(f => (
                <div key={f.key} className={`lbp-field${f.span === 2 ? ' lbp-field--full' : ''}`}>
                  <label className="lbp-label">{f.label}</label>
                  <input
                    className={`lbp-input${errors[f.key] ? ' lbp-input--err' : ''}`}
                    type={f.type} placeholder={f.ph}
                    value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                  />
                  {errors[f.key] && <div className="lbp-err">{errors[f.key]}</div>}
                </div>
              ))}
              {/* Role & Shift shown inline in edit mode */}
              {isEdit && (
                <>
                  <div className="lbp-field">
                    <label className="lbp-label">Role</label>
                    <select className="lbp-input lbp-select" value={form.role} onChange={e => set('role', e.target.value)}>
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="lbp-field">
                    <label className="lbp-label">Shift</label>
                    <select className="lbp-input lbp-select" value={form.shift} onChange={e => set('shift', e.target.value)}>
                      {SHIFTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: role, shift, password */}
          {step === 2 && !isEdit && (
            <div className="lbp-form-grid">
              <div className="lbp-field">
                <label className="lbp-label">Role</label>
                <select className="lbp-input lbp-select" value={form.role} onChange={e => set('role', e.target.value)}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="lbp-field">
                <label className="lbp-label">Shift</label>
                <select className="lbp-input lbp-select" value={form.shift} onChange={e => set('shift', e.target.value)}>
                  {SHIFTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="lbp-field lbp-field--full">
                <label className="lbp-label">Password</label>
                <div className="lbp-pw-wrap">
                  <input
                    className={`lbp-input${errors.password ? ' lbp-input--err' : ''}`}
                    type={showPw ? 'text' : 'password'} placeholder="Min 8 characters"
                    value={form.password} onChange={e => set('password', e.target.value)}
                  />
                  <button type="button" className="lbp-pw-eye" onClick={() => setShowPw(p => !p)}>
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && <div className="lbp-err">{errors.password}</div>}
              </div>
              <div className="lbp-field lbp-field--full">
                <label className="lbp-label">Confirm Password</label>
                <input
                  className={`lbp-input${errors.confirm ? ' lbp-input--err' : ''}`}
                  type="password" placeholder="Re-enter password"
                  value={form.confirm} onChange={e => set('confirm', e.target.value)}
                />
                {errors.confirm && <div className="lbp-err">{errors.confirm}</div>}
              </div>

              {/* Preview summary */}
              <div className="lbp-preview lbp-field--full">
                <div className="lbp-preview-av" style={{ background: '#1e3a8a' }}>{form.name[0] || '?'}</div>
                <div>
                  <div className="lbp-preview-name">{form.name || '—'}</div>
                  <div className="lbp-preview-meta">{form.role} &bull; {form.shift} shift &bull; {form.username || '—'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lbp-modal-footer">
          {!isEdit && step === 2 && (
            <button className="lbp-btn lbp-btn--ghost" onClick={() => setStep(1)}>Back</button>
          )}
          <button className="lbp-btn lbp-btn--ghost lbp-modal-cancel" onClick={onClose}>Cancel</button>
          {!isEdit && step === 1 && (
            <button className="lbp-btn lbp-btn--primary" onClick={handleNext}>Continue</button>
          )}
          {(isEdit || step === 2) && (
            <button className="lbp-btn lbp-btn--success" onClick={handleSubmit}>
              {isEdit ? 'Save Changes' : 'Create Librarian'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

/* ─── Reset Password Modal ─── */
function ResetPwModal({ librarian, onClose, onReset }) {
  const [pw, setPw]       = useState('')
  const [confirm, setCfm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [err, setErr]     = useState('')
  const [done, setDone]   = useState(false)

  const handle = () => {
    if (pw.length < 8)  { setErr('Minimum 8 characters'); return }
    if (pw !== confirm) { setErr('Passwords do not match'); return }
    setDone(true)
    onReset(librarian.id)
  }

  return (
    <div className="lbp-modal-backdrop" onClick={onClose}>
      <div className="lbp-modal lbp-modal--sm" onClick={e => e.stopPropagation()}>
        <div className="lbp-modal-header">
          <div>
            <h3 className="lbp-modal-title">Reset Password</h3>
            <p className="lbp-modal-sub">{librarian.name} &bull; {librarian.username}</p>
          </div>
          <button className="lbp-modal-close" onClick={onClose}><XIcon /></button>
        </div>

        <div className="lbp-modal-body">
          {done ? (
            <div className="lbp-success-mini">
              <div className="lbp-success-mini-icon">✓</div>
              <div className="lbp-success-mini-text">Password reset successfully!</div>
              <div className="lbp-success-mini-sub">Librarian will be notified via email.</div>
            </div>
          ) : (
            <div className="lbp-form-grid">
              <div className="lbp-field lbp-field--full">
                <label className="lbp-label">New Password</label>
                <div className="lbp-pw-wrap">
                  <input
                    className={`lbp-input${err ? ' lbp-input--err' : ''}`}
                    type={showPw ? 'text' : 'password'} placeholder="Min 8 characters"
                    value={pw} onChange={e => { setPw(e.target.value); setErr('') }} autoFocus
                  />
                  <button type="button" className="lbp-pw-eye" onClick={() => setShowPw(p => !p)}>
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div className="lbp-field lbp-field--full">
                <label className="lbp-label">Confirm Password</label>
                <input
                  className={`lbp-input${err ? ' lbp-input--err' : ''}`}
                  type="password" placeholder="Re-enter new password"
                  value={confirm} onChange={e => { setCfm(e.target.value); setErr('') }}
                />
                {err && <div className="lbp-err">{err}</div>}
              </div>
            </div>
          )}
        </div>

        <div className="lbp-modal-footer">
          {!done && <button className="lbp-btn lbp-btn--ghost lbp-modal-cancel" onClick={onClose}>Cancel</button>}
          {done
            ? <button className="lbp-btn lbp-btn--primary" onClick={onClose}>Close</button>
            : <button className="lbp-btn lbp-btn--primary" onClick={handle}>Reset Password</button>
          }
        </div>
      </div>
    </div>
  )
}

/* ─── View Profile Modal ─── */
function ViewModal({ librarian, onClose }) {
  const st = STATUS_STYLE[librarian.status]
  return (
    <div className="lbp-modal-backdrop" onClick={onClose}>
      <div className="lbp-modal lbp-modal--sm" onClick={e => e.stopPropagation()}>
        <div className="lbp-modal-header">
          <h3 className="lbp-modal-title">Librarian Profile</h3>
          <button className="lbp-modal-close" onClick={onClose}><XIcon /></button>
        </div>
        <div className="lbp-modal-body">
          <div className="lbp-profile-hero">
            <div className="lbp-profile-av" style={{ background: librarian.color }}>{librarian.initials}</div>
            <div>
              <div className="lbp-profile-name">{librarian.name}</div>
              <div className="lbp-profile-role">{librarian.role} &bull; {librarian.shift} Shift</div>
              <span className="lbp-status-badge" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                <span className="lbp-dot" style={{ background: st.dot }} />{librarian.status}
              </span>
            </div>
          </div>
          <div className="lbp-profile-grid">
            {[
              ['Librarian ID', librarian.id],
              ['Username',     librarian.username],
              ['Email',        librarian.email],
              ['Phone',        librarian.phone],
              ['Joined',       librarian.joined],
              ['Last Login',   librarian.lastLogin],
            ].map(([label, val]) => (
              <div key={label} className="lbp-profile-row">
                <span className="lbp-profile-label">{label}</span>
                <span className="lbp-profile-val">{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lbp-modal-footer">
          <button className="lbp-btn lbp-btn--primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function LibrariansPage() {
  const [librarians, setLibrarians] = useState(INIT_LIBRARIANS)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatus]   = useState('All Status')

  const [showAdd,   setShowAdd]   = useState(false)
  const [editLib,   setEditLib]   = useState(null)
  const [resetLib,  setResetLib]  = useState(null)
  const [viewLib,   setViewLib]   = useState(null)
  const [toast,     setToast]     = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  /* KPIs */
  const totalLibs    = librarians.length
  const activeLibs   = librarians.filter(l => l.status === 'ACTIVE').length
  const inactiveLibs = librarians.filter(l => l.status === 'INACTIVE').length
  const shiftCounts  = { Morning: 0, Afternoon: 0, Evening: 0 }
  librarians.forEach(l => { if (shiftCounts[l.shift] !== undefined) shiftCounts[l.shift]++ })
  const busyShift    = Object.entries(shiftCounts).sort((a, b) => b[1] - a[1])[0][0]

  /* Filtered list */
  const filtered = librarians.filter(l => {
    const q = search.toLowerCase()
    const matchQ = l.name.toLowerCase().includes(q) || l.username.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.phone.includes(q)
    const matchS = statusFilter === 'All Status' || l.status === statusFilter
    return matchQ && matchS
  })

  /* Handlers */
  const handleAdd = (form) => {
    const newLib = {
      id:        `LIB-${String(librarians.length + 1).padStart(3, '0')}`,
      name:      form.name.trim(),
      initials:  form.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      color:     ['#1e3a8a','#7c3aed','#059669','#0891b2','#d97706'][librarians.length % 5],
      username:  form.username.trim(),
      email:     form.email.trim(),
      phone:     form.phone.trim(),
      role:      form.role,
      shift:     form.shift,
      joined:    new Date().toLocaleDateString('en-GB'),
      lastLogin: '—',
      status:    'ACTIVE',
    }
    setLibrarians(prev => [...prev, newLib])
    setShowAdd(false)
    showToast(`Librarian "${newLib.name}" created successfully`)
  }

  const handleEdit = (form) => {
    setLibrarians(prev => prev.map(l => l.id === editLib.id
      ? { ...l, name: form.name, username: form.username, email: form.email, phone: form.phone, role: form.role, shift: form.shift }
      : l
    ))
    setEditLib(null)
    showToast('Librarian details updated successfully')
  }

  const handleToggleStatus = (lib) => {
    const next = lib.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    setLibrarians(prev => prev.map(l => l.id === lib.id ? { ...l, status: next } : l))
    showToast(`${lib.name} has been ${next === 'ACTIVE' ? 'activated' : 'deactivated'}`, next === 'ACTIVE' ? 'success' : 'warn')
  }

  const handleResetPw = (id) => {
    showToast('Password reset email sent to librarian')
  }

  return (
    <div className="lbp">

      {/* Toast */}
      {toast && (
        <div className={`lbp-toast lbp-toast--${toast.type}`}>{toast.msg}</div>
      )}

      {/* Admin-only banner */}
      <div className="lbp-admin-banner">
        <span>🔒</span>
        <span>ADMIN ONLY — Librarian Management is restricted to Admin users only.</span>
      </div>

      {/* Header */}
      <div className="lbp-header">
        <div>
          <h2 className="lbp-title">Librarian Management</h2>
          <p className="lbp-sub">Create, manage and monitor librarian accounts and shift assignments</p>
        </div>
        <button className="lbp-btn lbp-btn--primary" onClick={() => setShowAdd(true)}>
          <PlusIcon /> Add Librarian
        </button>
      </div>

      {/* KPI cards */}
      <div className="lbp-kpi-row">
        <div className="lbp-kpi">
          <div className="lbp-kpi-icon lbp-kpi-icon--blue"><UsersIcon /></div>
          <div className="lbp-kpi-body">
            <div className="lbp-kpi-label">Total Librarians</div>
            <div className="lbp-kpi-value">{totalLibs}</div>
            <div className="lbp-kpi-sub">across all shifts</div>
          </div>
        </div>
        <div className="lbp-kpi">
          <div className="lbp-kpi-icon lbp-kpi-icon--green"><CheckIcon /></div>
          <div className="lbp-kpi-body">
            <div className="lbp-kpi-label">Active Accounts</div>
            <div className="lbp-kpi-value lbp-kpi-value--green">{activeLibs}</div>
            <div className="lbp-kpi-sub">currently enabled</div>
          </div>
        </div>
        <div className="lbp-kpi">
          <div className="lbp-kpi-icon lbp-kpi-icon--slate"><SunIcon /></div>
          <div className="lbp-kpi-body">
            <div className="lbp-kpi-label">Busiest Shift</div>
            <div className="lbp-kpi-value">{busyShift}</div>
            <div className="lbp-kpi-sub">{shiftCounts[busyShift]} librarian{shiftCounts[busyShift] !== 1 ? 's' : ''} assigned</div>
          </div>
        </div>
        <div className="lbp-kpi lbp-kpi--warn">
          <div className="lbp-kpi-icon lbp-kpi-icon--slate"><UsersIcon /></div>
          <div className="lbp-kpi-body">
            <div className="lbp-kpi-label">Inactive Accounts</div>
            <div className="lbp-kpi-value lbp-kpi-value--slate">{inactiveLibs}</div>
            <div className="lbp-kpi-sub">deactivated accounts</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="lbp-toolbar">
        <div className="lbp-search">
          <SearchIcon />
          <input
            placeholder="Search by name, username, ID, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="lbp-clear-btn" onClick={() => setSearch('')}>&#10005;</button>}
        </div>
        <select className="lbp-select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
          <option value="All Status">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      {/* Table */}
      <div className="lbp-card">
        <table className="lbp-table">
          <thead>
            <tr>
              <th>LIBRARIAN ID</th>
              <th>FULL NAME</th>
              <th>ROLE</th>
              <th>SHIFT</th>
              <th>USERNAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>JOINED</th>
              <th>LAST LOGIN</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="11" className="lbp-empty">No librarians found{search ? ` for "${search}"` : ''}</td></tr>
            ) : (
              filtered.map(l => {
                const st = STATUS_STYLE[l.status]
                return (
                  <tr key={l.id}>
                    <td><span className="lbp-id">{l.id}</span></td>
                    <td>
                      <div className="lbp-name-row">
                        <div className="lbp-avatar" style={{ background: l.color }}>{l.initials}</div>
                        <span className="lbp-name">{l.name}</span>
                      </div>
                    </td>
                    <td className="lbp-role">{l.role}</td>
                    <td><span className="lbp-shift-badge">{l.shift}</span></td>
                    <td className="lbp-username">@{l.username}</td>
                    <td className="lbp-email">{l.email}</td>
                    <td className="lbp-phone">{l.phone}</td>
                    <td className="lbp-date">{l.joined}</td>
                    <td className="lbp-date">{l.lastLogin}</td>
                    <td>
                      <span className="lbp-status-badge" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                        <span className="lbp-dot" style={{ background: st.dot }} />{l.status}
                      </span>
                    </td>
                    <td>
                      <div className="lbp-actions">
                        <button className="lbp-act-btn lbp-act-btn--view"  onClick={() => setViewLib(l)}  title="View Profile">View</button>
                        <button className="lbp-act-btn lbp-act-btn--edit"  onClick={() => setEditLib(l)}  title="Edit"><EditIcon /> Edit</button>
                        <button className="lbp-act-btn lbp-act-btn--reset" onClick={() => setResetLib(l)} title="Reset Password"><KeyIcon /> Reset PW</button>
                        <button
                          className={`lbp-act-btn ${l.status === 'ACTIVE' ? 'lbp-act-btn--deact' : 'lbp-act-btn--act'}`}
                          onClick={() => handleToggleStatus(l)}
                        >
                          {l.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
        <div className="lbp-footer">
          Showing {filtered.length} of {librarians.length} librarians
        </div>
      </div>

      {/* Modals */}
      {showAdd   && <LibrarianModal librarian={null}   onClose={() => setShowAdd(false)}  onSave={handleAdd}  />}
      {editLib   && <LibrarianModal librarian={editLib} onClose={() => setEditLib(null)}   onSave={handleEdit} />}
      {resetLib  && <ResetPwModal   librarian={resetLib} onClose={() => setResetLib(null)} onReset={handleResetPw} />}
      {viewLib   && <ViewModal      librarian={viewLib}  onClose={() => setViewLib(null)}  />}

    </div>
  )
}
