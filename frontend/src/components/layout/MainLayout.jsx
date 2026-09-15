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
      </div>
    </div>
  )
}
