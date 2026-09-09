// Tracks "last seen" timestamps per admin tab in localStorage, so we can badge
// genuinely new rows (created after the admin last opened that tab) instead of
// showing a decorative, always-on count.

const PREFIX = 'wayfare_admin_last_seen_'

export function getLastSeen(tabId) {
  try {
    const raw = localStorage.getItem(PREFIX + tabId)
    return raw ? new Date(raw) : new Date(0)
  } catch {
    return new Date(0)
  }
}

export function markSeen(tabId) {
  try {
    localStorage.setItem(PREFIX + tabId, new Date().toISOString())
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

export function countNewSince(items, tabId, dateField = 'createdAt') {
  const since = getLastSeen(tabId)
  return items.filter((item) => new Date(item[dateField]) > since).length
}
