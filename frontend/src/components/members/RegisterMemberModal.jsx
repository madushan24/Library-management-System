import { useState } from 'react'
import './RegisterMemberModal.css'

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
)

const INITIAL = {
  firstName: '', lastName: '', phone: '', email: '',
  nic: '', dob: '', gender: '', address: '', city: '', status: 'ACTIVE',
}

const REQUIRED = ['firstName', 'lastName', 'phone', 'nic', 'gender', 'status']

export default function RegisterMemberModal({ onClose, onSave }) {
  const [form, setForm]     = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim())  e.firstName = 'First name is required.'
    if (!form.lastName.trim())   e.lastName  = 'Last name is required.'
    if (!form.phone.trim())      e.phone     = 'Phone number is required.'
    else if (!/^0\d{9}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Enter a valid 10-digit phone number.'
    if (!form.nic.trim())        e.nic    = 'NIC / Student ID is required.'
    if (!form.gender)            e.gender = 'Please select gender.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setSuccess(true)
    setTimeout(() => { onSave?.(form); onClose() }, 1400)
  }

  return (
    <div className="rmm-backdrop" onClick={onClose}>
      <div className="rmm-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="rmm-header">
          <div className="rmm-header-left">
            <div className="rmm-header-icon"><UserIcon /></div>
            <div>
              <h2 className="rmm-title">Register New Member</h2>
              <p className="rmm-subtitle">Fill in the details to create a new library member account.</p>
            </div>
          </div>
          <button className="rmm-close" onClick={onClose}><XIcon /></button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="rmm-success">
            <div className="rmm-success-icon"><CheckIcon /></div>
            <div className="rmm-success-title">Member Registered!</div>
            <p>{form.firstName} {form.lastName} has been successfully registered.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="rmm-body">

              {/* Section: Personal Info */}
              <div className="rmm-section-label">Personal Information</div>
              <div className="rmm-grid-2">
                <div className="rmm-field">
                  <label className="rmm-label">First Name <span className="rmm-req">*</span></label>
                  <input className={`rmm-input${errors.firstName ? ' rmm-input--err' : ''}`}
                    placeholder="e.g. Kasun" value={form.firstName}
                    onChange={e => set('firstName', e.target.value)} />
                  {errors.firstName && <span className="rmm-err">{errors.firstName}</span>}
                </div>
                <div className="rmm-field">
                  <label className="rmm-label">Last Name <span className="rmm-req">*</span></label>
                  <input className={`rmm-input${errors.lastName ? ' rmm-input--err' : ''}`}
                    placeholder="e.g. Perera" value={form.lastName}
                    onChange={e => set('lastName', e.target.value)} />
                  {errors.lastName && <span className="rmm-err">{errors.lastName}</span>}
                </div>
                <div className="rmm-field">
                  <label className="rmm-label">Date of Birth</label>
                  <input className="rmm-input" type="date" value={form.dob}
                    onChange={e => set('dob', e.target.value)} />
                </div>
                <div className="rmm-field">
                  <label className="rmm-label">Gender <span className="rmm-req">*</span></label>
                  <select className={`rmm-input${errors.gender ? ' rmm-input--err' : ''}`}
                    value={form.gender} onChange={e => set('gender', e.target.value)}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  {errors.gender && <span className="rmm-err">{errors.gender}</span>}
                </div>
              </div>

              {/* Section: Contact */}
              <div className="rmm-section-label">Contact Details</div>
              <div className="rmm-grid-2">
                <div className="rmm-field">
                  <label className="rmm-label">Phone Number <span className="rmm-req">*</span></label>
                  <input className={`rmm-input${errors.phone ? ' rmm-input--err' : ''}`}
                    placeholder="e.g. 0771234567" value={form.phone}
                    onChange={e => set('phone', e.target.value)} />
                  {errors.phone && <span className="rmm-err">{errors.phone}</span>}
                </div>
                <div className="rmm-field">
                  <label className="rmm-label">Email Address</label>
                  <input className={`rmm-input${errors.email ? ' rmm-input--err' : ''}`}
                    type="email" placeholder="e.g. kasun@gmail.com" value={form.email}
                    onChange={e => set('email', e.target.value)} />
                  {errors.email && <span className="rmm-err">{errors.email}</span>}
                </div>
                <div className="rmm-field rmm-field--full">
                  <label className="rmm-label">Address</label>
                  <input className="rmm-input" placeholder="Street address" value={form.address}
                    onChange={e => set('address', e.target.value)} />
                </div>
                <div className="rmm-field">
                  <label className="rmm-label">City</label>
                  <input className="rmm-input" placeholder="e.g. Padiyathalawa" value={form.city}
                    onChange={e => set('city', e.target.value)} />
                </div>
              </div>

              {/* Section: Identity */}
              <div className="rmm-section-label">Identity &amp; Membership</div>
              <div className="rmm-grid-2">
                <div className="rmm-field">
                  <label className="rmm-label">NIC / Student ID <span className="rmm-req">*</span></label>
                  <input className={`rmm-input${errors.nic ? ' rmm-input--err' : ''}`}
                    placeholder="e.g. 200012345678 or S/2024/001" value={form.nic}
                    onChange={e => set('nic', e.target.value)} />
                  {errors.nic && <span className="rmm-err">{errors.nic}</span>}
                </div>
                <div className="rmm-field">
                  <label className="rmm-label">Membership Status</label>
                  <select className="rmm-input" value={form.status}
                    onChange={e => set('status', e.target.value)}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              {/* Required note */}
              <p className="rmm-note"><span className="rmm-req">*</span> Required fields</p>
            </div>

            {/* Footer */}
            <div className="rmm-footer">
              <button type="button" className="rmm-cancel-btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="rmm-save-btn">
                <CheckIcon /> Register Member
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
