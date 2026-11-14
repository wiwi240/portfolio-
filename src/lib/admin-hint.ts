// Remembers, in this browser only, that the owner signed in, so the public site can show a shortcut to /admin.
// It is just a hint: the shortcut still appears only after the server confirms the session (/api/auth/me),
// and visitors who never signed in never have the flag, so they trigger no extra request.
const KEY = 'wm-admin-hint'

export const hasAdminHint = () => {
  try { return window.localStorage.getItem(KEY) === '1' } catch { return false }
}
export const rememberAdmin = () => {
  try { window.localStorage.setItem(KEY, '1') } catch { /* storage unavailable: no shortcut, /admin still works */ }
}
export const forgetAdmin = () => {
  try { window.localStorage.removeItem(KEY) } catch { /* nothing to clear */ }
}
