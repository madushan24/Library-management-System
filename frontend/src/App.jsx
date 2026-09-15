import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage          from './pages/auth/LoginPage'
import MainLayout         from './components/layout/MainLayout'
import AdminDashboard     from './pages/dashboard/AdminDashboard'
import LibrarianDashboard from './pages/dashboard/LibrarianDashboard'
import MembersPage        from './pages/members/MembersPage'
import BooksPage          from './pages/books/BooksPage'
import BorrowingsPage     from './pages/borrowings/BorrowingsPage'
import ReturnsPage        from './pages/returns/ReturnsPage'
import IssueBookPage      from './pages/transactions/IssueBookPage'
import FinesPage          from './pages/fines/FinesPage'
import ReportsPage        from './pages/reports/ReportsPage'
import LibrariansPage     from './pages/librarians/LibrariansPage'
import SettingsPage       from './pages/settings/SettingsPage'

// Redirect / to the correct dashboard based on stored role
function RoleRedirect() {
  const stored  = sessionStorage.getItem('lms_user')
  const session = stored ? JSON.parse(stored) : null
  if (!session) return <Navigate to="/login" replace />
  return <Navigate to={session.role === 'ADMIN' ? '/dashboard' : '/librarian'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<RoleRedirect />} />
          <Route path="dashboard"  element={<AdminDashboard />} />
          <Route path="librarian"  element={<LibrarianDashboard />} />
          <Route path="books"      element={<BooksPage />} />
          <Route path="members"    element={<MembersPage />} />
          <Route path="borrowings" element={<BorrowingsPage />} />
          <Route path="returns"    element={<ReturnsPage />} />
          <Route path="issue"      element={<IssueBookPage />} />
          <Route path="fines"      element={<FinesPage />} />
          <Route path="reports"    element={<ReportsPage />} />
          <Route path="librarians" element={<LibrariansPage />} />
          <Route path="settings"   element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
