import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/theme.css'
import App from './App.jsx'

/* ── Apply saved theme, font, accent, compact prefs on first load ── */
;(function () {
  const theme    = localStorage.getItem('lms_theme')    || 'light'
  const fontSize = localStorage.getItem('lms_fontSize') || 'medium'
  const accent   = localStorage.getItem('lms_accent')   || 'blue'
  const compact  = localStorage.getItem('lms_compact')  || '0'
  document.body.setAttribute('data-theme',     theme)
  document.body.setAttribute('data-font-size', fontSize)
  document.body.setAttribute('data-accent',    accent)
  document.body.setAttribute('data-compact',   compact)
})()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
