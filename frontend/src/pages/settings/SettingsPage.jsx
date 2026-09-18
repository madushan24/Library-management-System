import './SettingsPage.css'

export default function SettingsPage() {
  return (
    <div className="sp">
      <div className="sp-admin-banner">
        <span>&#128274;</span>
        <span>ADMIN ONLY &mdash; Settings are restricted to Admin users only.</span>
      </div>

      <div className="sp-header">
        <h2 className="sp-title">Settings</h2>
        <p className="sp-sub">Configure library system preferences</p>
      </div>

      <div className="sp-grid">

        <div className="sp-card">
          <div className="sp-card-title">Library Information</div>
          <div className="sp-fields">
            {[
              { label: 'Library Name', val: 'Public Library PADIYATHALAWA' },
              { label: 'Address',      val: 'Padiyathalawa, Ampara, Sri Lanka' },
              { label: 'Phone',        val: '+94 63 2 224 400' },
              { label: 'Email',        val: 'info@padiyathalawa.library.lk' },
            ].map(f => (
              <div key={f.label} className="sp-field">
                <label className="sp-label">{f.label}</label>
                <input className="sp-input" defaultValue={f.val} />
              </div>
            ))}
          </div>
          <button className="sp-save-btn">Save Changes</button>
        </div>

        <div className="sp-card">
          <div className="sp-card-title">Borrowing Settings</div>
          <div className="sp-fields">
            <div className="sp-field">
              <label className="sp-label">Borrowing Period (Days)</label>
              <div className="sp-input-row">
                <input className="sp-input sp-input--locked" defaultValue="7" readOnly />
                <span className="sp-locked-note">Fixed &mdash; System Rule</span>
              </div>
            </div>
            <div className="sp-field">
              <label className="sp-label">Max Books Per Member</label>
              <input className="sp-input" defaultValue="3" type="number" min="1" max="10" />
            </div>
            <div className="sp-field">
              <label className="sp-label">Renewal Allowed</label>
              <select className="sp-input">
                <option>No</option>
                <option>Yes &mdash; 1 time</option>
                <option>Yes &mdash; 2 times</option>
              </select>
            </div>
          </div>
          <button className="sp-save-btn">Save Changes</button>
        </div>

        <div className="sp-card">
          <div className="sp-card-title">Fine Settings</div>
          <div className="sp-fields">
            <div className="sp-field">
              <label className="sp-label">Late Fine per Day</label>
              <div className="sp-input-row">
                <input className="sp-input sp-input--locked" defaultValue="Rs. 1.00" readOnly />
                <span className="sp-locked-note">Fixed &mdash; System Rule</span>
              </div>
            </div>
            <div className="sp-field">
              <label className="sp-label">Currency</label>
              <input className="sp-input sp-input--locked" defaultValue="LKR &mdash; Sri Lankan Rupee" readOnly />
            </div>
            <div className="sp-field">
              <label className="sp-label">Fine Grace Period (Days)</label>
              <input className="sp-input" defaultValue="0" type="number" />
            </div>
          </div>
          <button className="sp-save-btn">Save Changes</button>
        </div>

        <div className="sp-card">
          <div className="sp-card-title">System Settings</div>
          <div className="sp-fields">
            <div className="sp-field">
              <label className="sp-label">Date Format</label>
              <select className="sp-input">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div className="sp-field">
              <label className="sp-label">Session Timeout (Minutes)</label>
              <input className="sp-input" defaultValue="30" type="number" />
            </div>
            <div className="sp-field">
              <label className="sp-label">System Version</label>
              <input className="sp-input sp-input--locked" defaultValue="v4.2 LTS" readOnly />
            </div>
          </div>
          <button className="sp-save-btn">Save Changes</button>
        </div>

      </div>
    </div>
  )
}
