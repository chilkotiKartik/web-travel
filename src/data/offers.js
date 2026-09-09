// Real, applicable discount codes — validated and applied inside the booking flow (src/pages/Plan.jsx),
// not decorative. Countdown timers on the Offers page compute live off `expiresAt`.

function daysFromNow(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(23, 59, 59, 0)
  return d.toISOString()
}

export const offers = [
  {
    id: 'o1',
    code: 'EARLYBIRD500',
    title: 'Early Bird Sale',
    subtitle: 'Book 30+ days out and save flat ₹500',
    description: 'Applies to any expedition when your preferred departure date is at least 30 days from today.',
    discountType: 'flat',
    discountValue: 500,
    minSpend: 5000,
    expiresAt: daysFromNow(21),
    gradient: 'from-blue-600 to-blue-500',
    badge: 'Limited time',
  },
  {
    id: 'o2',
    code: 'WINTER15',
    title: 'Winter Expedition Sale',
    subtitle: '15% off every Snow Expedition trip',
    description: 'Kedarkantha, Chadar and every winter departure — 15% off, capped at ₹3,000 per booking.',
    discountType: 'percent',
    discountValue: 15,
    maxDiscount: 3000,
    expiresAt: daysFromNow(45),
    gradient: 'from-green-600 to-green-500',
    badge: 'Seasonal',
  },
  {
    id: 'o3',
    code: 'GROUP10',
    title: 'Group Departure Discount',
    subtitle: '10% off for 4 or more travellers',
    description: 'Booking with friends? Any trip, 4+ travellers on the same booking gets an automatic 10% off.',
    discountType: 'percent',
    discountValue: 10,
    minTravelers: 4,
    expiresAt: daysFromNow(90),
    gradient: 'from-blue-600 to-green-500',
    badge: 'Always on',
  },
  {
    id: 'o4',
    code: 'FIRSTTRIP300',
    title: 'First Trip With Us',
    subtitle: 'Flat ₹300 off your first booking',
    description: 'New to Wayfare? Take ₹300 off any expedition on your first confirmed booking.',
    discountType: 'flat',
    discountValue: 300,
    minSpend: 0,
    expiresAt: daysFromNow(120),
    gradient: 'from-green-600 to-blue-500',
    badge: 'New travellers',
  },
  {
    id: 'o5',
    code: 'FLASH24',
    title: '24-Hour Flash Sale',
    subtitle: '20% off, today only',
    description: 'Our biggest single-day discount — 20% off any trip, capped at ₹4,000. Ends when the clock hits zero.',
    discountType: 'percent',
    discountValue: 20,
    maxDiscount: 4000,
    expiresAt: daysFromNow(1),
    gradient: 'from-blue-700 to-blue-500',
    badge: 'Ends soon',
  },
]

export function getOfferByCode(code) {
  if (!code) return null
  const normalized = code.trim().toUpperCase()
  return offers.find((o) => o.code === normalized) || null
}

/** Validates an offer against a booking context and returns { valid, reason, discount }. */
export function evaluateOffer(offer, { subtotal, travelers, date }) {
  if (!offer) return { valid: false, reason: 'Code not found' }
  if (new Date(offer.expiresAt) < new Date()) return { valid: false, reason: 'This code has expired' }
  if (offer.minSpend && subtotal < offer.minSpend) {
    return { valid: false, reason: `Minimum booking value is ₹${offer.minSpend.toLocaleString('en-IN')}` }
  }
  if (offer.minTravelers && travelers < offer.minTravelers) {
    return { valid: false, reason: `Requires at least ${offer.minTravelers} travellers` }
  }
  if (offer.code === 'EARLYBIRD500' && date) {
    const days = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24)
    if (days < 30) return { valid: false, reason: 'Departure date must be 30+ days away' }
  }

  let discount = offer.discountType === 'percent' ? Math.round(subtotal * (offer.discountValue / 100)) : offer.discountValue
  if (offer.maxDiscount) discount = Math.min(discount, offer.maxDiscount)
  discount = Math.min(discount, subtotal)

  return { valid: true, discount }
}
