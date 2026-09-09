// Client-side data layer. Catalog data (destinations/tours/stories) is seeded,
// static content — served with a simulated delay so loading states are real to
// test. Everything user-generated (bookings, contact messages, newsletter
// signups) is written to and read from a live Supabase Postgres database via
// lib/supabaseClient.js, protected by row-level security policies applied to
// the project (see the migration history) — this is a real backend, not a
// localStorage simulation.

import { destinations, getDestinationBySlug } from '../data/destinations'
import { tours, getTourBySlug, getToursForDestination } from '../data/tours'
import { stories, getStoryBySlug } from '../data/stories'
import { supabase } from './supabaseClient'

const LATENCY = { min: 250, max: 650 }

function delay() {
  const ms = LATENCY.min + Math.random() * (LATENCY.max - LATENCY.min)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

class ApiError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ApiError'
  }
}

export { ApiError }

// ---------- Catalog reads (static seed data, always resolve) ----------

export async function fetchDestinations() {
  await delay()
  return destinations
}

export async function fetchDestination(slug) {
  await delay()
  const d = getDestinationBySlug(slug)
  if (!d) throw new ApiError('Destination not found')
  return d
}

export async function fetchTours(filters = {}) {
  await delay()
  let result = tours
  if (filters.destinationSlug) result = result.filter((t) => t.destinationSlug === filters.destinationSlug)
  if (filters.category) result = result.filter((t) => t.category === filters.category)
  if (filters.difficulty) result = result.filter((t) => t.difficulty === filters.difficulty)
  if (filters.maxPrice) result = result.filter((t) => t.price <= filters.maxPrice)
  if (filters.query) {
    const q = filters.query.toLowerCase()
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        t.destinationSlug.replace(/-/g, ' ').includes(q)
    )
  }
  return result
}

export async function fetchTour(slug) {
  await delay()
  const t = getTourBySlug(slug)
  if (!t) throw new ApiError('Trip not found')
  return t
}

export async function fetchToursForDestination(destinationSlug) {
  await delay()
  return getToursForDestination(destinationSlug)
}

export async function fetchStories(filters = {}) {
  await delay()
  let result = stories
  if (filters.category) result = result.filter((s) => s.category === filters.category)
  if (filters.query) {
    const q = filters.query.toLowerCase()
    result = result.filter((s) => s.title.toLowerCase().includes(q) || s.excerpt.toLowerCase().includes(q))
  }
  return result
}

export async function fetchStory(slug) {
  await delay()
  const s = getStoryBySlug(slug)
  if (!s) throw new ApiError('Story not found')
  return s
}

// ---------- Writes (real Postgres tables, RLS-protected) ----------

export async function submitBooking(payload) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new ApiError('You must be logged in to book a trip')

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      tour_slug: payload.tourSlug,
      tour_title: payload.tourTitle,
      destination: payload.destination,
      trip_date: payload.date || null,
      travelers: payload.travelers,
      sharing: payload.sharing,
      price_per_person: payload.pricePerPerson,
      subtotal: payload.subtotal,
      promo_code: payload.promoCode,
      discount: payload.discount,
      total: payload.total,
      contact_name: payload.contact.name,
      contact_email: payload.contact.email,
      contact_phone: payload.contact.phone,
      notes: payload.contact.notes,
    })
    .select()
    .single()

  if (error) throw new ApiError(error.message)
  return {
    id: data.id,
    createdAt: data.created_at,
    status: data.status,
    tourSlug: data.tour_slug,
    tourTitle: data.tour_title,
    destination: data.destination,
    date: data.trip_date,
    travelers: data.travelers,
    sharing: data.sharing,
    pricePerPerson: data.price_per_person,
    subtotal: data.subtotal,
    promoCode: data.promo_code,
    discount: data.discount,
    total: data.total,
    contact: { name: data.contact_name, email: data.contact_email, phone: data.contact_phone, notes: data.notes },
  }
}

export async function fetchBookings() {
  const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
  if (error) throw new ApiError(error.message)
  return data.map((b) => ({
    id: b.id,
    createdAt: b.created_at,
    status: b.status,
    tourSlug: b.tour_slug,
    tourTitle: b.tour_title,
    destination: b.destination,
    date: b.trip_date,
    travelers: b.travelers,
    sharing: b.sharing,
    total: b.total,
    contact: { name: b.contact_name, email: b.contact_email, phone: b.contact_phone },
  }))
}

export async function submitContactMessage(payload) {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || null,
      subject: payload.subject,
      message: payload.message,
    })
    .select()
    .single()

  if (error) throw new ApiError(error.message)
  return { id: data.id, createdAt: data.created_at }
}

export async function subscribeNewsletter(email) {
  const { error } = await supabase.from('newsletter_subscribers').insert({ email })
  if (error) {
    if (error.code === '23505') {
      return { alreadySubscribed: true, email }
    }
    throw new ApiError(error.message)
  }
  return { alreadySubscribed: false, email }
}

// ---------- Admin reads (RLS only returns rows to admins; empty array otherwise) ----------

export async function fetchAllBookings() {
  const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
  if (error) throw new ApiError(error.message)
  return data.map((b) => ({
    id: b.id,
    createdAt: b.created_at,
    status: b.status,
    tourSlug: b.tour_slug,
    tourTitle: b.tour_title,
    destination: b.destination,
    date: b.trip_date,
    travelers: b.travelers,
    total: b.total,
    discount: b.discount,
    promoCode: b.promo_code,
    contact: { name: b.contact_name, email: b.contact_email, phone: b.contact_phone },
  }))
}

export async function fetchAllContactMessages() {
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
  if (error) throw new ApiError(error.message)
  return data.map((m) => ({
    id: m.id,
    createdAt: m.created_at,
    name: m.name,
    email: m.email,
    phone: m.phone,
    subject: m.subject,
    message: m.message,
  }))
}

export async function fetchAllNewsletterSubscribers() {
  const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false })
  if (error) throw new ApiError(error.message)
  return data.map((s) => ({ id: s.id, email: s.email, createdAt: s.created_at }))
}
