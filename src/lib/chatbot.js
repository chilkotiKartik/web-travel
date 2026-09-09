// Rule-based trip assistant. Answers are generated locally from the site's own
// data (destinations, tours, journal, offers, FAQs) — no external API, so it works
// offline and never fabricates a trip or price that isn't actually on the site.

import { destinations } from '../data/destinations'
import { tours } from '../data/tours'
import { faqs } from '../data/misc'
import { offers } from '../data/offers'

function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`
}

function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ')
}

function findDestination(text) {
  return destinations.find((d) => text.includes(d.name.toLowerCase()) || text.includes(d.slug.replace(/-/g, ' ')))
}

function findTour(text) {
  return tours.find((t) => text.includes(t.title.toLowerCase()))
}

function scoreFaq(text, faq) {
  const words = norm(faq.question + ' ' + faq.answer).split(/\s+/)
  const queryWords = text.split(/\s+/).filter((w) => w.length > 3)
  let score = 0
  for (const w of queryWords) if (words.includes(w)) score++
  return score
}

const GREETINGS = ['hi', 'hello', 'hey', 'yo', 'namaste', 'hola']
const THANKS = ['thanks', 'thank you', 'thx', 'ty']

export function suggestedPrompts() {
  return ['Beginner-friendly treks?', 'Trips to Ladakh', 'How do I book?', 'Any active discount codes?']
}

export function getBotReply(message) {
  const text = norm(message)

  if (THANKS.some((w) => text.includes(w))) {
    return { text: "You're welcome! Anything else you'd like to know before you book?", actions: [] }
  }

  if (GREETINGS.some((w) => text === w || text.startsWith(w + ' '))) {
    return {
      text: "Hey! I'm the Wayfare trip assistant. Ask me about a destination, a specific trek, pricing, or how booking works.",
      actions: [
        { label: 'Popular treks', to: '/tours' },
        { label: 'See destinations', to: '/destinations' },
      ],
    }
  }

  // Destination match
  const destination = findDestination(text)
  if (destination) {
    const destTours = tours.filter((t) => t.destinationSlug === destination.slug)
    const priceRange =
      destTours.length > 0
        ? `${formatPrice(Math.min(...destTours.map((t) => t.price)))}–${formatPrice(Math.max(...destTours.map((t) => t.price)))}`
        : null
    return {
      text: `${destination.name}: ${destination.tagline} Best season is ${destination.bestSeason}. We run ${destTours.length} trip${destTours.length === 1 ? '' : 's'} there${priceRange ? `, starting from ${priceRange}` : ''}.`,
      actions: [{ label: `View ${destination.name} trips`, to: `/tours?destination=${destination.slug}` }],
    }
  }

  // Tour match
  const tour = findTour(text)
  if (tour) {
    return {
      text: `${tour.title} is a ${tour.difficulty.toLowerCase()} ${tour.duration}-day trip, rated ${tour.rating}/5 from ${tour.reviewsCount} reviews. Starts from ${formatPrice(tour.price)} per person.`,
      actions: [
        { label: 'View full itinerary', to: `/tours/${tour.slug}` },
        { label: 'Book this trip', to: `/plan?tour=${tour.slug}` },
      ],
    }
  }

  // Booking / how it works
  if (/\b(book|booking|reserve|how do i (start|sign up))\b/.test(text)) {
    return {
      text: 'Booking takes four quick steps: pick a trip, set your date and group size, add your contact details, then review and confirm. You get a booking ID instantly.',
      actions: [{ label: 'Start booking', to: '/plan' }],
    }
  }

  // Discounts / offers
  if (/\b(discount|offer|coupon|code|promo|sale|deal)\b/.test(text)) {
    const live = offers.filter((o) => new Date(o.expiresAt) > new Date())
    return {
      text: `We have ${live.length} active codes right now — from flat-₹ off to seasonal sale pricing. Codes apply directly in the booking flow.`,
      actions: [{ label: 'See all offers', to: '/offers' }],
    }
  }

  // Beginner friendly
  if (/\b(beginner|first time|easy|new to trek|never trekked)\b/.test(text)) {
    const easy = tours.filter((t) => t.tags.includes('Beginner Friendly')).slice(0, 3)
    return {
      text: `Great place to start: ${easy.map((t) => t.title).join(', ')}. All rated Easy-to-Moderate with full food and camping support.`,
      actions: easy.slice(0, 2).map((t) => ({ label: t.title, to: `/tours/${t.slug}` })),
    }
  }

  // Pricing
  if (/\b(price|cost|budget|how much|expensive|cheap)\b/.test(text)) {
    const min = Math.min(...tours.map((t) => t.price))
    const max = Math.max(...tours.map((t) => t.price))
    return {
      text: `Trips range from ${formatPrice(min)} for a short backpacking trip to ${formatPrice(max)} for extended high-altitude expeditions. Filter by budget on the Expeditions page.`,
      actions: [{ label: 'Browse by price', to: '/tours' }],
    }
  }

  // Safety / altitude
  if (/\b(safe|safety|altitude sickness|dangerous|risk)\b/.test(text)) {
    return {
      text: 'Every high-altitude trek carries a certified trek leader with a first-aid kit and oximeter, acclimatisation days built into the itinerary, and an evacuation plan. Read our altitude guide in the Journal for details.',
      actions: [{ label: 'Read the altitude guide', to: '/journal/first-time-above-14000-feet' }],
    }
  }

  // FAQ fallback via keyword scoring
  const scored = faqs.map((f) => ({ f, score: scoreFaq(text, f) })).sort((a, b) => b.score - a.score)
  if (scored[0]?.score >= 2) {
    return { text: scored[0].f.answer, actions: [{ label: 'More FAQs', to: '/contact#faq' }] }
  }

  return {
    text: "I couldn't quite place that. Try asking about a destination (like Ladakh), a specific trek, pricing, difficulty level, or how booking works — or talk to a human on WhatsApp.",
    actions: [{ label: 'All FAQs', to: '/contact#faq' }],
  }
}
