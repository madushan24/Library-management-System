// Mock credentials — replace with real JWT API call in Phase 17
export const MOCK_USERS = [
  {
    email:    'admin@gmail.com',
    password: 'admin123',
    role:     'ADMIN',
    name:     'Admin User',
    initials: 'AU',
  },
  {
    email:    'librarian@gmail.com',
    password: 'librarian123',
    role:     'LIBRARIAN',
    name:     'K. Wickramasinghe',
    initials: 'KW',
  },
]

export function authenticate(email, password) {
  return MOCK_USERS.find(
    u => u.email === email.trim().toLowerCase() && u.password === password
  ) || null
}
