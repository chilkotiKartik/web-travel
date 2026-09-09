// Real account system backed by Supabase Auth (Postgres + GoTrue) — not a
// localStorage simulation. Sessions are managed by the Supabase client itself
// (persisted to localStorage as an encrypted-at-rest-by-Supabase JWT, refreshed
// automatically); this module just exposes a small, app-shaped surface over it.

import { supabase } from './supabaseClient'

export class AuthError extends Error {}

function shapeUser(user) {
  if (!user) return null
  return { id: user.id, name: user.user_metadata?.name || user.email.split('@')[0], email: user.email }
}

export function onAuthChange(fn) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    fn(shapeUser(session?.user))
  })
  return () => data.subscription.unsubscribe()
}

export async function signUp({ name, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { name: name.trim() } },
  })
  if (error) throw new AuthError(error.message)
  // If email confirmation is required, Supabase returns a user but no session —
  // the caller needs to know which case it is rather than assume instant login.
  return { user: shapeUser(data.user), needsEmailConfirmation: !data.session }
}

export async function logIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })
  if (error) throw new AuthError(error.message)
  return shapeUser(data.user)
}

export async function logOut() {
  await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return shapeUser(data.user)
}
