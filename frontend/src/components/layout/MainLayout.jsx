import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import './MainLayout.css'

export default function MainLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-body">
        <Navbar />
        <main className="layout-main">
          <Outlet />
        </main>
        <footer className="layout-footer">
          <span>&copy; 2026 DeepTech Software Solutions. All Rights Reserved.</span>
          <span className="layout-footer-divider">&middot;</span>
          <span>Library Management System <span className="layout-footer-version">v4.2 LTS</span></span>
        </footer>
      </div>
    </div>
  )
}
