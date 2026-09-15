import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authenticate } from '../../constants/auth'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [keep, setKeep] = useState(false)
  const [user, setUser] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setErr('')
    if (!user.trim()) return setErr('Email is required.')
    if (!pw.trim())   return setErr('Password is required.')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const account = authenticate(user, pw)
      if (account) {
        // Store session — will be replaced with JWT in Phase 17
        sessionStorage.setItem('lms_user', JSON.stringify(account))
        navigate(account.role === 'ADMIN' ? '/dashboard' : '/librarian')
      } else {
        setErr('Invalid email or password. Please try again.')
      }
    }, 900)
  }

  return (
    <div className="lp-page">
      <div className="lp-card">

        {/* ── LEFT PANEL ── */}
        <div className="lp-left">
          <div className="lp-overlay" />
          <div className="lp-left-body">

            <div className="lp-brand">
              <div className="lp-brand-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div>
                <span className="lp-brand-label">LMS STAFF PORTAL</span>
                <span className="lp-brand-name">Library Management System</span>
              </div>
            </div>

            <div>
              <h1 className="lp-hero-title">Public Library PADIYATHALAWA</h1>
              <p className="lp-hero-desc">Manage books, members, borrowing and library operations efficiently.</p>
            </div>

            <div className="lp-badges">
              <span className="lp-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                Library Staff Only
              </span>
              <span className="lp-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                Librarian &amp; Admin Portal
              </span>
              <span className="lp-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                Automated Fine Engine (Rs. 1/ day)
              </span>
            </div>

            <div className="lp-warning">
              <div className="lp-warning-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                STAFF-RESTRICTED GATEWAY
              </div>
              <p>Authorized personnel only. Any other members do not hold login access and are administered directly over the counter by certified library officers.</p>
            </div>

          </div>
          <div className="lp-statusbar">
            <span className="lp-online">
              <span className="lp-dot" />
              Core Engine Online &nbsp;·&nbsp; Latency: 18ms
            </span>
            <span>DeepTech software solutions • v4.2 </span>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="lp-right">
          <div className="lp-form-area">

            <div className="lp-form-top">
              <span className="lp-portal-tag">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                Staff Portal
              </span>
              <span className="lp-version">INTERNAL V4.2</span>
            </div>

            <p className="lp-form-sub">Sign in to access the library management system.</p>

            <div className="lp-role-bar">
              <span className="lp-role-main">ADMIN &amp; LIBRARIAN ONLY</span>
              <span className="lp-role-note">(No member login)</span>
            </div>

            <form onSubmit={submit} noValidate>
              <div className="lp-field">
                <label className="lp-label">USERNAME OR EMAIL</label>
                <div className="lp-input-row">
                  <svg className="lp-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  <input
                    className="lp-input"
                    type="text"
                    placeholder="e.g., admin@gmail.com"
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="lp-field">
                <label className="lp-label">PASSWORD</label>
                <div className="lp-input-row">
                  <svg className="lp-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  <input
                    className="lp-input"
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button type="button" className="lp-eye" onClick={() => setShowPw(v => !v)} aria-label="toggle password">
                    {showPw
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    }
                  </button>
                </div>
              </div>

              <div className="lp-opt-row">
                <label className="lp-check">
                  <input type="checkbox" checked={keep} onChange={e => setKeep(e.target.checked)} />
                  Keep signed in for 30 days
                </label>
                <button type="button" className="lp-forgot">Forgot password?</button>
              </div>

              {err && <div className="lp-error">{err}</div>}

              <button type="submit" className="lp-btn" disabled={loading}>
                {loading ? <span className="lp-spinner" /> : 'Login'}
              </button>
            </form>

            <div className="lp-security">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              256-bit SSL Encrypted &nbsp;•&nbsp; 30-min Session Timeout
            </div>
            <p className="lp-support">Need IT Support? Contact basnayakamadushan0@gmail.com <strong>(0772272446)</strong></p>

          </div>
          <p className="lp-copy">© 2026 DeepTech software solutions . All Rights Reserved.</p>
        </div>

      </div>
    </div>
  )
}
