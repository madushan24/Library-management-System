import { useState } from 'react'
import './SettingsPage.css'

/* ─── Theme / display helpers ─── */
function applyTheme(t)   { document.body.setAttribute('data-theme',     t); localStorage.setItem('lms_theme',    t) }
function applyFont(f)    { document.body.setAttribute('data-font-size', f); localStorage.setItem('lms_fontSize', f) }
function applyCompact(c) { document.body.setAttribute('data-compact',   c ? '1' : '0'); localStorage.setItem('lms_compact', c ? '1' : '0') }
function applyAccent(a)  { document.body.setAttribute('data-accent',    a); localStorage.setItem('lms_accent',   a) }

/* ─── Icons ─── */
const SunIcon      = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
const MoonIcon     = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
const LibraryIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const BookIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
const CoinsIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>
const PaletteIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
const ShieldIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const BellIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const DatabaseIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
const TypeIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
const SaveIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
const CheckIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>

/* ─── Toggle ─── */
function Toggle({ checked, onChange, id }) {
  return (
    <label className="sp-toggle" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="sp-toggle-track"><span className="sp-toggle-thumb" /></span>
    </label>
  )
}

/* ─── Section wrapper ─── */
function Section({ icon, title, children }) {
  return (
    <div className="sp-section">
      <div className="sp-section-head">
        <div className="sp-section-icon">{icon}</div>
        <h3 className="sp-section-title">{title}</h3>
      </div>
      <div className="sp-section-body">{children}</div>
    </div>
  )
}

/* ─── Setting row ─── */
function Row({ label, hint, children }) {
  return (
    <div className="sp-row">
      <div className="sp-row-left">
        <div className="sp-row-label">{label}</div>
        {hint && <div className="sp-row-hint">{hint}</div>}
      </div>
      <div className="sp-row-control">{children}</div>
    </div>
  )
}

/* ─── Load saved values ─── */
function load(key, def) {
  try { return JSON.parse(localStorage.getItem(key)) ?? def } catch { return def }
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════ */
export default function SettingsPage() {

  /* ── Appearance ── */
  const [theme,    setThemeS]   = useState(localStorage.getItem('lms_theme')    || 'light')
  const [fontSize, setFontS]    = useState(localStorage.getItem('lms_fontSize') || 'medium')
  const [compact,  setCompactS] = useState(localStorage.getItem('lms_compact')  === '1')
  const [accent,   setAccentS]  = useState(localStorage.getItem('lms_accent')   || 'blue')

  /* ── Library info ── */
  const [libInfo, setLibInfo] = useState(load('lms_libInfo', {
    name:    'Public Library Padiyathalawa',
    address: 'Padiyathalawa, Ampara, Sri Lanka',
    phone:   '+94 63 2 224 400',
    email:   'info@padiyathalawa.library.lk',
    website: 'www.padiyathalawa.library.lk',
    hours:   '08:00 AM – 06:00 PM',
  }))

  /* ── Borrowing ── */
  const [borrow, setBorrow] = useState(load('lms_borrow', {
    period:    '7',
    maxBooks:  '3',
    renewal:   'no',
    graceDays: '0',
    reservations: true,
  }))

  /* ── Fines ── */
  const [fines, setFines] = useState(load('lms_fines', {
    finePerDay:     '1.00',
    currency:       'LKR',
    gracePeriod:    '0',
    maxFine:        '50',
    fineOnHolidays: false,
  }))

  /* ── Notifications ── */
  const [notif, setNotif] = useState(load('lms_notif', {
    overdueAlert:       true,
    returnReminder:     true,
    reminderDaysBefore: '1',
    newMemberWelcome:   true,
    fineNotice:         true,
  }))

  /* ── Security ── */
  const [security, setSecurity] = useState(load('lms_security', {
    sessionTimeout:        '30',
    forceLogoutOnIdle:     true,
    requireStrongPassword: true,
    loginAttempts:         '5',
  }))

  /* ── Toast ── */
  const [toast, setToast] = useState(null)
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600) }

  /* ── Save handlers (each persists to localStorage) ── */
  const saveLib = () => {
    localStorage.setItem('lms_libInfo', JSON.stringify(libInfo))
    showToast('Library information saved')
  }
  const saveBorrow = () => {
    localStorage.setItem('lms_borrow', JSON.stringify(borrow))
    showToast('Borrowing rules saved')
  }
  const saveFines = () => {
    localStorage.setItem('lms_fines', JSON.stringify(fines))
    showToast('Fine settings saved')
  }
  const saveNotif = () => {
    localStorage.setItem('lms_notif', JSON.stringify(notif))
    showToast('Notification preferences saved')
  }
  const saveSecurity = () => {
    localStorage.setItem('lms_security', JSON.stringify(security))
    showToast('Security settings saved')
  }

  const ACCENTS = [
    { id: 'blue',   color: '#1e3a8a', label: 'Navy Blue' },
    { id: 'indigo', color: '#4f46e5', label: 'Indigo'    },
    { id: 'teal',   color: '#0d9488', label: 'Teal'      },
    { id: 'green',  color: '#15803d', label: 'Forest'    },
    { id: 'violet', color: '#7c3aed', label: 'Violet'    },
  ]

  return (
    <div className="sp">
      {toast && <div className="sp-toast"><CheckIcon /> {toast}</div>}

      {/* Header */}
      <div className="sp-header">
        <div>
          <h2 className="sp-title">Settings</h2>
          <p className="sp-sub">Configure system preferences, appearance, and library rules</p>
        </div>
        <div className="sp-version-badge"><DatabaseIcon /> LMS v4.2</div>
      </div>

      {/* ══════════════════════════
          1. APPEARANCE
         ══════════════════════════ */}
      <Section icon={<PaletteIcon />} title="Appearance">

        <Row label="Color Theme" hint="Switch between light and dark interface — applies instantly to the whole system">
          <div className="sp-theme-toggle">
            <button
              className={`sp-theme-btn${theme === 'light' ? ' active' : ''}`}
              onClick={() => { setThemeS('light'); applyTheme('light') }}
            ><SunIcon /> Light</button>
            <button
              className={`sp-theme-btn${theme === 'dark' ? ' active' : ''}`}
              onClick={() => { setThemeS('dark'); applyTheme('dark') }}
            ><MoonIcon /> Dark</button>
          </div>
        </Row>

        <div className="sp-divider" />

        <Row label="Font Size" hint="Adjusts text size across every page immediately">
          <div className="sp-font-btns">
            {[{id:'small',label:'Small'},{id:'medium',label:'Medium'},{id:'large',label:'Large'}].map(f => (
              <button
                key={f.id}
                className={`sp-font-btn${fontSize === f.id ? ' active' : ''}`}
                style={{ fontSize: f.id === 'small' ? 12 : f.id === 'medium' ? 14 : 16 }}
                onClick={() => { setFontS(f.id); applyFont(f.id) }}
              >A — {f.label}</button>
            ))}
          </div>
        </Row>

        <div className="sp-divider" />

        <Row label="Compact Layout" hint="Reduces padding and spacing for denser data views">
          <Toggle id="compact-toggle" checked={compact} onChange={v => { setCompactS(v); applyCompact(v) }} />
        </Row>

        <div className="sp-divider" />

        <Row label="Accent Color" hint="Primary highlight color used across buttons and active states">
          <div className="sp-accents">
            {ACCENTS.map(a => (
              <button
                key={a.id}
                title={a.label}
                className={`sp-accent-dot${accent === a.id ? ' selected' : ''}`}
                style={{ background: a.color }}
                onClick={() => { setAccentS(a.id); applyAccent(a.id) }}
              >{accent === a.id && <CheckIcon />}</button>
            ))}
          </div>
        </Row>

      </Section>

      {/* ══════════════════════════
          2. LIBRARY INFORMATION
         ══════════════════════════ */}
      <Section icon={<LibraryIcon />} title="Library Information">
        <div className="sp-form-grid">
          {[
            { label: 'Library Name',    key: 'name',    type: 'text',  span: 2 },
            { label: 'Phone Number',    key: 'phone',   type: 'text'          },
            { label: 'Email Address',   key: 'email',   type: 'email'         },
            { label: 'Website',         key: 'website', type: 'text'          },
            { label: 'Operating Hours', key: 'hours',   type: 'text'          },
            { label: 'Address',         key: 'address', type: 'text',  span: 2 },
          ].map(f => (
            <div key={f.key} className={`sp-field${f.span === 2 ? ' sp-field--full' : ''}`}>
              <label className="sp-label">{f.label}</label>
              <input
                className="sp-input"
                type={f.type}
                value={libInfo[f.key]}
                onChange={e => setLibInfo(p => ({ ...p, [f.key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <div className="sp-section-footer">
          <button className="sp-save-btn" onClick={saveLib}><SaveIcon /> Save Changes</button>
        </div>
      </Section>

      {/* ══════════════════════════
          3. BORROWING RULES
         ══════════════════════════ */}
      <Section icon={<BookIcon />} title="Borrowing Rules">

        <Row label="Borrowing Period (days)" hint="Number of days a member can hold a book before it is due">
          <input
            className="sp-input sp-input--sm"
            type="number" min="1" max="60"
            value={borrow.period}
            onChange={e => setBorrow(p => ({ ...p, period: e.target.value }))}
          />
        </Row>
        <div className="sp-divider" />

        <Row label="Max Books Per Member" hint="Maximum books a member may borrow at the same time">
          <input
            className="sp-input sp-input--sm"
            type="number" min="1" max="20"
            value={borrow.maxBooks}
            onChange={e => setBorrow(p => ({ ...p, maxBooks: e.target.value }))}
          />
        </Row>
        <div className="sp-divider" />

        <Row label="Renewal Policy" hint="Whether members may renew a borrowed book before its due date">
          <select
            className="sp-select sp-input--sm"
            value={borrow.renewal}
            onChange={e => setBorrow(p => ({ ...p, renewal: e.target.value }))}
          >
            <option value="no">Not Allowed</option>
            <option value="1">Yes — 1 Renewal</option>
            <option value="2">Yes — 2 Renewals</option>
            <option value="3">Yes — 3 Renewals</option>
          </select>
        </Row>
        <div className="sp-divider" />

        <Row label="Grace Period (days)" hint="Days after due date before overdue status is triggered">
          <input
            className="sp-input sp-input--sm"
            type="number" min="0" max="14"
            value={borrow.graceDays}
            onChange={e => setBorrow(p => ({ ...p, graceDays: e.target.value }))}
          />
        </Row>
        <div className="sp-divider" />

        <Row label="Allow Reservations" hint="Let members reserve books that are currently on loan">
          <Toggle id="res-toggle" checked={borrow.reservations} onChange={v => setBorrow(p => ({ ...p, reservations: v }))} />
        </Row>

        <div className="sp-section-footer">
          <button className="sp-save-btn" onClick={saveBorrow}><SaveIcon /> Save Changes</button>
        </div>
      </Section>

      {/* ══════════════════════════
          4. FINE SETTINGS
         ══════════════════════════ */}
      <Section icon={<CoinsIcon />} title="Fine Settings">

        <Row label="Late Fine per Day (Rs.)" hint="Amount charged for each day a book is overdue">
          <input
            className="sp-input sp-input--sm"
            type="number" min="0" step="0.50"
            value={fines.finePerDay}
            onChange={e => setFines(p => ({ ...p, finePerDay: e.target.value }))}
          />
        </Row>
        <div className="sp-divider" />

        <Row label="Currency" hint="Currency used for all transactions and fines">
          <select
            className="sp-select sp-input--sm"
            value={fines.currency}
            onChange={e => setFines(p => ({ ...p, currency: e.target.value }))}
          >
            <option value="LKR">LKR — Sri Lankan Rupee</option>
            <option value="USD">USD — US Dollar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="INR">INR — Indian Rupee</option>
          </select>
        </Row>
        <div className="sp-divider" />

        <Row label="Fine Grace Period (days)" hint="Days overdue before fines start accruing">
          <input
            className="sp-input sp-input--sm"
            type="number" min="0" max="14"
            value={fines.gracePeriod}
            onChange={e => setFines(p => ({ ...p, gracePeriod: e.target.value }))}
          />
        </Row>
        <div className="sp-divider" />

        <Row label="Maximum Fine Cap (Rs.)" hint="Maximum total fine a member can accumulate per book">
          <input
            className="sp-input sp-input--sm"
            type="number" min="0"
            value={fines.maxFine}
            onChange={e => setFines(p => ({ ...p, maxFine: e.target.value }))}
          />
        </Row>
        <div className="sp-divider" />

        <Row label="Charge Fines on Holidays" hint="Whether fines continue to accrue on public holidays and weekends">
          <Toggle id="holiday-toggle" checked={fines.fineOnHolidays} onChange={v => setFines(p => ({ ...p, fineOnHolidays: v }))} />
        </Row>

        <div className="sp-section-footer">
          <button className="sp-save-btn" onClick={saveFines}><SaveIcon /> Save Changes</button>
        </div>
      </Section>

      {/* ══════════════════════════
          5. NOTIFICATIONS
         ══════════════════════════ */}
      <Section icon={<BellIcon />} title="Notifications">

        <Row label="Overdue Alerts" hint="Notify librarians when a book passes its due date">
          <Toggle id="overdue-toggle" checked={notif.overdueAlert} onChange={v => setNotif(p => ({ ...p, overdueAlert: v }))} />
        </Row>
        <div className="sp-divider" />

        <Row label="Return Reminders" hint="Send reminder to members before their due date">
          <Toggle id="reminder-toggle" checked={notif.returnReminder} onChange={v => setNotif(p => ({ ...p, returnReminder: v }))} />
        </Row>
        <div className="sp-divider" />

        <Row label="Reminder Days Before Due" hint="How many days before the due date to send the reminder">
          <input
            className="sp-input sp-input--sm"
            type="number" min="1" max="14"
            value={notif.reminderDaysBefore}
            disabled={!notif.returnReminder}
            onChange={e => setNotif(p => ({ ...p, reminderDaysBefore: e.target.value }))}
          />
        </Row>
        <div className="sp-divider" />

        <Row label="New Member Welcome Message" hint="Send a welcome notification when a new member is registered">
          <Toggle id="welcome-toggle" checked={notif.newMemberWelcome} onChange={v => setNotif(p => ({ ...p, newMemberWelcome: v }))} />
        </Row>
        <div className="sp-divider" />

        <Row label="Fine Notices" hint="Notify members when a fine is applied to their account">
          <Toggle id="fine-notif-toggle" checked={notif.fineNotice} onChange={v => setNotif(p => ({ ...p, fineNotice: v }))} />
        </Row>

        <div className="sp-section-footer">
          <button className="sp-save-btn" onClick={saveNotif}><SaveIcon /> Save Changes</button>
        </div>
      </Section>

      {/* ══════════════════════════
          6. SECURITY
         ══════════════════════════ */}
      <Section icon={<ShieldIcon />} title="Security">

        <Row label="Session Timeout" hint="Automatically log out after this many minutes of inactivity">
          <select
            className="sp-select sp-input--sm"
            value={security.sessionTimeout}
            onChange={e => setSecurity(p => ({ ...p, sessionTimeout: e.target.value }))}
          >
            {['10','15','30','45','60','120'].map(v => <option key={v} value={v}>{v} minutes</option>)}
          </select>
        </Row>
        <div className="sp-divider" />

        <Row label="Force Logout on Idle" hint="Close session automatically when the browser tab is idle">
          <Toggle id="idle-toggle" checked={security.forceLogoutOnIdle} onChange={v => setSecurity(p => ({ ...p, forceLogoutOnIdle: v }))} />
        </Row>
        <div className="sp-divider" />

        <Row label="Require Strong Password" hint="Enforce minimum 8 characters with numbers for all accounts">
          <Toggle id="pw-toggle" checked={security.requireStrongPassword} onChange={v => setSecurity(p => ({ ...p, requireStrongPassword: v }))} />
        </Row>
        <div className="sp-divider" />

        <Row label="Max Failed Login Attempts" hint="Lock account after this many consecutive failed logins">
          <select
            className="sp-select sp-input--sm"
            value={security.loginAttempts}
            onChange={e => setSecurity(p => ({ ...p, loginAttempts: e.target.value }))}
          >
            {['3','5','10','unlimited'].map(v => <option key={v} value={v}>{v === 'unlimited' ? 'Unlimited' : `${v} attempts`}</option>)}
          </select>
        </Row>

        <div className="sp-section-footer">
          <button className="sp-save-btn" onClick={saveSecurity}><SaveIcon /> Save Changes</button>
        </div>
      </Section>

      {/* ══════════════════════════
          7. SYSTEM INFO (read-only)
         ══════════════════════════ */}
      <Section icon={<DatabaseIcon />} title="System Information">
        <div className="sp-sysinfo-grid">
          {[
            ['System Version',     'v4.2 LTS'],
            ['Database Engine',    'PostgreSQL 15.4'],
            ['Deployed On',        '01 January 2024'],
            ['Last Backup',        '15 October 2026 — 02:00 AM'],
            ['Total Books',        '4,812 volumes'],
            ['Total Members',      '1,240 registered'],
            ['Total Transactions', '3,291 since deployment'],
            ['Borrowing Period',   `${borrow.period} days (current setting)`],
            ['Fine Rate',          `Rs. ${fines.finePerDay} / day`],
            ['Server Status',      '✓ Operational'],
          ].map(([label, val]) => (
            <div key={label} className="sp-sysinfo-row">
              <span className="sp-sysinfo-label">{label}</span>
              <span className="sp-sysinfo-val">{val}</span>
            </div>
          ))}
        </div>
      </Section>

    </div>
  )
}
