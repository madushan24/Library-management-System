const BASE = 'http://localhost:5000/api'

function getToken() {
  try {
    const s = sessionStorage.getItem('lms_user')
    return s ? JSON.parse(s).token : null
  } catch { return null }
}

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const api = {
  /* Auth */
  login: (body) => request('/auth/login', { method: 'POST', body }),
  me: () => request('/auth/me'),
  updateProfile: (body) => request('/auth/profile', { method: 'PATCH', body }),

  /* Books */
  getBooks: (params = {}) => request('/books?' + new URLSearchParams(params)),
  getBook: (id) => request(`/books/${id}`),
  createBook: (body) => request('/books', { method: 'POST', body }),
  updateBook: (id, body) => request(`/books/${id}`, { method: 'PATCH', body }),
  deleteBook: (id) => request(`/books/${id}`, { method: 'DELETE' }),

  /* Members */
  getMembers: (params = {}) => request('/members?' + new URLSearchParams(params)),
  getMember: (id) => request(`/members/${id}`),
  createMember: (body) => request('/members', { method: 'POST', body }),
  updateMember: (id, body) => request(`/members/${id}`, { method: 'PATCH', body }),
  deleteMember: (id) => request(`/members/${id}`, { method: 'DELETE' }),

  /* Borrowings */
  getBorrowings: (params = {}) => request('/borrowings?' + new URLSearchParams(params)),
  getBorrowing: (id) => request(`/borrowings/${id}`),
  issueBorrowing: (body) => request('/borrowings', { method: 'POST', body }),
  returnBorrowing: (id, body) => request(`/borrowings/${id}/return`, { method: 'PATCH', body }),

  /* Fines */
  getFines: (params = {}) => request('/fines?' + new URLSearchParams(params)),
  getFineSummary: () => request('/fines/summary'),
  payFine: (borrowingId, body) => request(`/fines/${borrowingId}/pay`, { method: 'PATCH', body }),
  waiveFine: (borrowingId) => request(`/fines/${borrowingId}/waive`, { method: 'PATCH' }),

  /* Users (librarians) */
  getUsers: (params = {}) => request('/users?' + new URLSearchParams(params)),
  getUser: (id) => request(`/users/${id}`),
  createUser: (body) => request('/users', { method: 'POST', body }),
  updateUser: (id, body) => request(`/users/${id}`, { method: 'PATCH', body }),
  resetPassword: (id, body) => request(`/users/${id}/reset-password`, { method: 'PATCH', body }),
  toggleUserStatus: (id) => request(`/users/${id}/toggle-status`, { method: 'PATCH' }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  /* Reports */
  getReportOverview: (params = {}) => request('/reports/overview?' + new URLSearchParams(params)),
  getReportOverdue: (params = {}) => request('/reports/overdue?' + new URLSearchParams(params)),
  getReportPopular: (params = {}) => request('/reports/popular?' + new URLSearchParams(params)),
  getReportMembers: (params = {}) => request('/reports/members?' + new URLSearchParams(params)),

  /* Settings */
  getSettings: () => request('/settings'),
  saveSettings: (body) => request('/settings', { method: 'PUT', body }),
}
