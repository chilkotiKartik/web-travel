// Client-side account system: real signup/login/session/logout, persisted to
// localStorage. Passwords are hashed with the browser's native SubtleCrypto
// (SHA-256) before storage — this is a static frontend with no server, so this
// is honestly a demo-grade account system, not a substitute for real backend
// auth. It's real in the sense that it works: sessions persist across reloads,
// duplicate emails are rejected, wrong passwords are rejected, and every page
// that reads "the current user" reads the same source of truth.

const USERS_KEY = 'wayfare:users'
const SESSION_KEY = 'wayfare:session'

const listeners = new Set()

function notify() {
  const user = getCurrentUser()
  listeners.forEach((fn) => fn(user))
}

export function onAuthChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function readUsers() {
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function writeUsers(users) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function delay(ms = 400 + Math.random() * 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class AuthError extends Error {}

export async function signUp({ name, email, password }) {
  await delay()
  const users = readUsers()
  const normalizedEmail = email.trim().toLowerCase()
  if (users.some((u) => u.email === normalizedEmail)) {
    throw new AuthError('An account with this email already exists')
  }
  const passwordHash = await hashPassword(password)
  const user = { name: name.trim(), email: normalizedEmail, passwordHash, createdAt: new Date().toISOString() }
  users.push(user)
  writeUsers(users)
  window.localStorage.setItem(SESSION_KEY, normalizedEmail)
  notify()
  return { name: user.name, email: user.email }
}

export async function logIn({ email, password }) {
  await delay()
  const users = readUsers()
  const normalizedEmail = email.trim().toLowerCase()
  const user = users.find((u) => u.email === normalizedEmail)
  if (!user) throw new AuthError('No account found with this email')
  const passwordHash = await hashPassword(password)
  if (passwordHash !== user.passwordHash) throw new AuthError('Incorrect password')
  window.localStorage.setItem(SESSION_KEY, normalizedEmail)
  notify()
  return { name: user.name, email: user.email }
}

export function logOut() {
  window.localStorage.removeItem(SESSION_KEY)
  notify()
}

export function getCurrentUser() {
  try {
    const email = window.localStorage.getItem(SESSION_KEY)
    if (!email) return null
    const users = readUsers()
    const user = users.find((u) => u.email === email)
    return user ? { name: user.name, email: user.email } : null
  } catch {
    return null
  }
}
