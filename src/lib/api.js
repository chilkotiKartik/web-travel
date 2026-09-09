// Client-side data layer. Simulates a real API surface (async, latency, occasional
// failure) over the seeded catalog data, and persists user-generated data
// (bookings, contact messages, newsletter signups) to localStorage so it
// survives reloads. Swap the bodies of these functions for real fetch() calls
// against a backend without touching any calling component.

import { destinations, getDestinationBySlug } from '../data/destinations'
import { tours, getTourBySlug, getToursForDestination } from '../data/tours'
import { stories, getStoryBySlug } from '../data/stories'

const LATENCY = { min: 250, max: 650 }

function delay() {
  const ms = LATENCY.min + Math.random() * (LATENCY.max - LATENCY.min)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readStore(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStore(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable (private mode / quota) — fail silently, UI still confirms in-memory
  }
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

// ---------- Writes (persisted to localStorage) ----------

function simulateFlakiness(rate = 0.06) {
  if (Math.random() < rate) throw new ApiError('Network hiccup — please try again.')
}

export async function submitBooking(payload) {
  await delay()
  simulateFlakiness()
  const bookings = readStore('wayfare:bookings', [])
  const record = {
    id: `bk_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    ...payload,
  }
  bookings.push(record)
  writeStore('wayfare:bookings', bookings)
  return record
}

export async function fetchBookings() {
  await delay()
  return readStore('wayfare:bookings', [])
}

export async function submitContactMessage(payload) {
  await delay()
  simulateFlakiness()
  const messages = readStore('wayfare:messages', [])
  const record = { id: `msg_${Date.now().toString(36)}`, createdAt: new Date().toISOString(), ...payload }
  messages.push(record)
  writeStore('wayfare:messages', messages)
  return record
}

export async function subscribeNewsletter(email) {
  await delay()
  simulateFlakiness(0.04)
  const subs = readStore('wayfare:newsletter', [])
  if (subs.includes(email)) {
    return { alreadySubscribed: true, email }
  }
  subs.push(email)
  writeStore('wayfare:newsletter', subs)
  return { alreadySubscribed: false, email }
}
