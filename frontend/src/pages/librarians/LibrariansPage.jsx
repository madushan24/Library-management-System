import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api/client'
import './LibrariansPage.css'

const STATUS_STYLE = {
  ACTIVE:   { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', dot: '#16a34a' },
  INACTIVE: { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', dot: '#94a3b8' },
}

const POSITIONS = ['Senior Librarian', 'Librarian', 'Assistant Librarian']
const SHIFTS    = ['Morning', 'Afternoon', 'Evening']

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
  const EMPTY  = { name: '', username: '', email: '', phone: '', position: 'Librarian', shift: 'Morning', password: '', confirm: '' }
  const [form, setForm]       = useState(isEdit ? { ...librarian, position: librarian.position || 'Librarian', password: '', confirm: '' } : EMPTY)
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
          {(step === 1 || isEdit) && (
            <div className="lbp-form-grid">
              {[
                { label: 'Full Name',  key: 'name',     type: 'text',  ph: 'e.g. Chaminda Perera', span: 2 },
                { label: 'Username',   key: 'username', type: 'text',  ph: 'e.g. chaminda.p'       },
                { label: 'Phone',      key: 'phone',    type: 'text',  ph: '077 xxx xxxx'          },
                { label: 'Email',      key: 'email',    type: 'email', ph: 'chaminda@library.lk', span: 2 },
              ].map(f => (
                <div key={f.key} className={`lbp-field${f.span === 2 ? ' lbp-field--full' : ''}`}>
                  <label className="lbp-label">{f.label}</label>
                  <input
                    className={`lbp-input${errors[f.key] ? ' lbp-input--err' : ''}`}
                    type={f.type} placeholder={f.ph}
                    value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                  />
                  {errors[f.key] && <div className="lbp-err">{errors[f.key]}</div>}
                </div>
              ))}
              {isEdit && (
                <>
                  <div className="lbp-field">
                    <label className="lbp-label">Position</label>
                    <select className="lbp-select" value={form.position} onChange={e => set('position', e.target.value)}>
                      {POSITIONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="lbp-field">
                    <label className="lbp-label">Shift</label>
                    <select className="lbp-select" value={form.shift} onChange={e => set('shift', e.target.value)}>
                      {SHIFTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 2 && !isEdit && (
            <div className="lbp-form-grid">
              <div className="lbp-field">
                <label className="lbp-label">Position</label>
                <select className="lbp-select" value={form.position} onChange={e => set('position', e.target.value)}>
                  {POSITIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="lbp-field">
                <label className="lbp-label">Shift</label>
                <select className="lbp-select" value={form.shift} onChange={e => set('shift', e.target.value)}>
                  {SHIFTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="lbp-field lbp-field--full">
                <label className="lbp-label">Initial Password</label>
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
            </div>
          )}
        </div>

        <div className="lbp-modal-footer">
          <button className="lbp-btn lbp-btn--ghost lbp-modal-cancel" onClick={onClose}>Cancel</button>
          {!isEdit && step === 1 && (
            <button className="lbp-btn lbp-btn--primary" onClick={handleNext}>Next &rarr;</button>
          )}
          {!isEdit && step === 2 && (
            <>
              <button className="lbp-btn lbp-btn--ghost" onClick={() => setStep(1)}>&larr; Back</button>
              <button className="lbp-btn lbp-btn--primary" onClick={handleSubmit}>Create Librarian</button>
            </>
          )}
          {isEdit && (
            <button className="lbp-btn lbp-btn--primary" onClick={handleSubmit}>Save Changes</button>
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

  const handle = async () => {
    if (pw.length < 8)  { setErr('Minimum 8 characters'); return }
    if (pw !== confirm) { setErr('Passwords do not match'); return }
    try {
      await onReset(librarian.id, pw)
      setDone(true)
    } catch (e) {
      setErr(e.message || 'Failed to reset password')
    }
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
              <div className="lbp-success-mini-sub">Staff member can now log in with the new password.</div>
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
  const st = STATUS_STYLE[librarian.status] || STATUS_STYLE.ACTIVE
  return (
    <div className="lbp-modal-backdrop" onClick={onClose}>
      <div className="lbp-modal lbp-modal--sm" onClick={e => e.stopPropagation()}>
        <div className="lbp-modal-header">
          <h3 className="lbp-modal-title">Librarian Profile</h3>
          <button className="lbp-modal-close" onClick={onClose}><XIcon /></button>
        </div>
        <div className="lbp-modal-body">
          <div className="lbp-profile-hero">
            <div className="lbp-profile-av" style={{ background: librarian.color || '#1e3a8a' }}>{librarian.initials}</div>
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
                <span className="lbp-profile-val">{val || '—'}</span>
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
  const [librarians, setLibrarians] = useState([])
  const [loading, setLoading]       = useState(true)
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

  const loadLibrarians = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.getUsers()
      const formatted = data.map((l, i) => ({
        ...l,
        dbId: l.id,
        id: l.lib_id || `LIB-${String(l.id).padStart(3, '0')}`,
        initials: l.name ? l.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'L',
        color: ['#1e3a8a','#7c3aed','#059669','#0891b2','#d97706'][i % 5],
        joined: l.joined_date || l.created_at?.slice(0, 10),
        lastLogin: l.last_login || '—',
      }))
      setLibrarians(formatted)
    } catch (err) {
      console.error('Failed to load librarians:', err)
      showToast(err.message || 'Failed to load staff accounts', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLibrarians()
  }, [loadLibrarians])

  /* KPIs */
  const totalLibs    = librarians.length
  const activeLibs   = librarians.filter(l => l.status === 'ACTIVE').length
  const inactiveLibs = librarians.filter(l => l.status === 'INACTIVE').length
  const shiftCounts  = { Morning: 0, Afternoon: 0, Evening: 0 }
  librarians.forEach(l => { if (shiftCounts[l.shift] !== undefined) shiftCounts[l.shift]++ })
  const busyShift    = Object.entries(shiftCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Morning'

  /* Filtered list */
  const filtered = librarians.filter(l => {
    const q = search.toLowerCase()
    const matchQ = (l.name || '').toLowerCase().includes(q) ||
                   (l.username || '').toLowerCase().includes(q) ||
                   (l.id || '').toLowerCase().includes(q) ||
                   (l.email || '').toLowerCase().includes(q) ||
                   (l.phone || '').includes(q)
    const matchS = statusFilter === 'All Status' || l.status === statusFilter
    return matchQ && matchS
  })

  /* Handlers */
  const handleAdd = async (form) => {
    try {
      await api.createUser({
        name:     form.name.trim(),
        username: form.username.trim(),
        email:    form.email.trim(),
        phone:    form.phone.trim(),
        role:     'LIBRARIAN',          // always stored as LIBRARIAN in DB
        shift:    form.shift,
        password: form.password,
      })
      await loadLibrarians()
      setShowAdd(false)
      showToast(`Librarian "${form.name}" created successfully`)
    } catch (err) {
      alert(err.message || 'Failed to create librarian')
    }
  }

  const handleEdit = async (form) => {
    try {
      await api.updateUser(editLib.dbId || editLib.id, {
        name:     form.name,
        username: form.username,
        email:    form.email,
        phone:    form.phone,
        role:     'LIBRARIAN',          // always stored as LIBRARIAN in DB
        shift:    form.shift,
      })
      await loadLibrarians()
      setEditLib(null)
      showToast('Librarian details updated successfully')
    } catch (err) {
      alert(err.message || 'Failed to update librarian')
    }
  }

  const handleToggleStatus = async (lib) => {
    try {
      const res = await api.toggleUserStatus(lib.dbId || lib.id)
      await loadLibrarians()
      showToast(`${lib.name} has been ${res.status === 'ACTIVE' ? 'activated' : 'deactivated'}`, res.status === 'ACTIVE' ? 'success' : 'warn')
    } catch (err) {
      alert(err.message || 'Failed to toggle status')
    }
  }

  const handleResetPw = async (id, password) => {
    await api.resetPassword(id, { password })
    showToast('Password reset successfully in backend database')
  }

  return (
    <div className="lbp">

      {/* Toast */}
      {toast && (
        <div className={`lbp-toast lbp-toast--${toast.type}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="lbp-header">
        <div>
          <h2 className="lbp-title">Librarians</h2>
          <p className="lbp-sub">Manage staff accounts, assign shifts, roles &amp; portal access permissions</p>
        </div>
        <button className="lbp-btn lbp-btn--primary" onClick={() => setShowAdd(true)}>
          <PlusIcon /> Add Librarian
        </button>
      </div>

      {/* KPIs */}
      <div className="lbp-kpi-row">
        <div className="lbp-kpi">
          <div className="lbp-kpi-icon lbp-kpi-icon--blue"><UsersIcon /></div>
          <div className="lbp-kpi-body">
            <div className="lbp-kpi-label">TOTAL STAFF</div>
            <div className="lbp-kpi-val">{totalLibs}</div>
            <div className="lbp-kpi-sub">registered staff accounts</div>
          </div>
        </div>
        <div className="lbp-kpi">
          <div className="lbp-kpi-icon lbp-kpi-icon--green"><CheckIcon /></div>
          <div className="lbp-kpi-body">
            <div className="lbp-kpi-label">ACTIVE ACCOUNTS</div>
            <div className="lbp-kpi-val lbp-kpi-val--green">{activeLibs}</div>
            <div className="lbp-kpi-sub">{totalLibs > 0 ? Math.round((activeLibs / totalLibs) * 100) : 0}% of staff enabled</div>
          </div>
        </div>
        <div className="lbp-kpi">
          <div className="lbp-kpi-icon lbp-kpi-icon--amber"><SunIcon /></div>
          <div className="lbp-kpi-body">
            <div className="lbp-kpi-label">BUSIEST SHIFT</div>
            <div className="lbp-kpi-val lbp-kpi-val--amber">{busyShift}</div>
            <div className="lbp-kpi-sub">{shiftCounts[busyShift] || 0} librarians scheduled</div>
          </div>
        </div>
        <div className="lbp-kpi">
          <div className="lbp-kpi-icon lbp-kpi-icon--slate"><KeyIcon /></div>
          <div className="lbp-kpi-body">
            <div className="lbp-kpi-label">INACTIVE ACCOUNTS</div>
            <div className="lbp-kpi-val">{inactiveLibs}</div>
            <div className="lbp-kpi-sub">access revoked / suspended</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="lbp-toolbar">
        <div className="lbp-search">
          <SearchIcon />
          <input
            placeholder="Search by name, ID, email, phone or username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="lbp-clear-btn" onClick={() => setSearch('')}>&#10005;</button>
          )}
        </div>
        <select className="lbp-select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
          <option value="All Status">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      {/* Table */}
      <div className="lbp-card">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading librarian accounts...</div>
        ) : (
          <table className="lbp-table">
            <thead>
              <tr>
                <th>LIBRARIAN</th>
                <th>ID</th>
                <th>CONTACT</th>
                <th>ROLE &amp; SHIFT</th>
                <th>JOINED</th>
                <th>LAST LOGIN</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="lbp-empty">No librarians found matching filter</td>
                </tr>
              ) : (
                filtered.map(lib => {
                  const st = STATUS_STYLE[lib.status] || STATUS_STYLE.ACTIVE
                  return (
                    <tr key={lib.id}>
                      <td>
                        <div className="lbp-user-cell">
                          <div className="lbp-avatar" style={{ background: lib.color || '#1e3a8a' }}>
                            {lib.initials}
                          </div>
                          <div>
                            <div className="lbp-name">{lib.name}</div>
                            <div className="lbp-username">@{lib.username}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="lbp-id-badge">{lib.id}</span></td>
                      <td>
                        <div className="lbp-contact-cell">
                          <div className="lbp-phone">{lib.phone}</div>
                          <div className="lbp-email">{lib.email}</div>
                        </div>
                      </td>
                      <td>
                        <div className="lbp-role-cell">
                          <div className="lbp-role">{lib.role}</div>
                          <div className="lbp-shift-tag">{lib.shift} Shift</div>
                        </div>
                      </td>
                      <td className="lbp-date">{lib.joined}</td>
                      <td className="lbp-date">{lib.lastLogin}</td>
                      <td>
                        <span className="lbp-status-badge" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                          <span className="lbp-dot" style={{ background: st.dot }} />
                          {lib.status}
                        </span>
                      </td>
                      <td>
                        <div className="lbp-actions">
                          <button className="lbp-act-btn" title="View details" onClick={() => setViewLib(lib)}>
                            <EyeIcon /> View
                          </button>
                          <button className="lbp-act-btn" title="Edit" onClick={() => setEditLib(lib)}>
                            <EditIcon /> Edit
                          </button>
                          <button className="lbp-act-btn" title="Reset password" onClick={() => setResetLib(lib)}>
                            <KeyIcon /> Reset
                          </button>
                          <button
                            className={`lbp-act-btn lbp-act-btn--toggle${lib.status === 'ACTIVE' ? ' warn' : ''}`}
                            title={lib.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            onClick={() => handleToggleStatus(lib)}
                          >
                            {lib.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}
        <div className="lbp-footer">
          <span>Showing {filtered.length} of {librarians.length} librarians</span>
        </div>
      </div>

      {/* Modals */}
      {showAdd && (
        <LibrarianModal
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
        />
      )}
      {editLib && (
        <LibrarianModal
          librarian={editLib}
          onClose={() => setEditLib(null)}
          onSave={handleEdit}
        />
      )}
      {resetLib && (
        <ResetPwModal
          librarian={resetLib}
          onClose={() => setResetLib(null)}
          onReset={handleResetPw}
        />
      )}
      {viewLib && (
        <ViewModal
          librarian={viewLib}
          onClose={() => setViewLib(null)}
        />
      )}

    </div>
  )
}
