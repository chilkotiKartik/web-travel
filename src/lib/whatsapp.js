/** Builds a wa.me deep link that opens WhatsApp with a prefilled message.
 * This genuinely opens WhatsApp with the text ready to send — the admin still
 * taps Send. True zero-click automated sending needs the WhatsApp Business
 * Cloud API (Meta app review + a verified sender number), which isn't wired
 * up here since no such credentials exist for this project. */
export function waLink(phone, message) {
  if (!phone) return null
  const digits = phone.replace(/[^\d]/g, '')
  if (digits.length < 10) return null
  // Assume Indian numbers when no country code is present (matches the site's market).
  const withCountryCode = digits.length === 10 ? `91${digits}` : digits
  const params = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${withCountryCode}${params}`
}
