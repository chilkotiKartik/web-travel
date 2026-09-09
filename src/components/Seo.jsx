import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'Wayfare'
const DEFAULT_DESCRIPTION =
  "Wayfare — India's premium adventure travel company. Handpicked treks, expeditions and journeys across the Himalayas and beyond."

function setMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Sets per-page title, description, canonical URL and Open Graph/Twitter tags.
 * Called from each page so the tags follow client-side navigation. */
export function useSeo({ title, description, image } = {}) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Real Adventures, Real India`
    const desc = description || DEFAULT_DESCRIPTION
    const url = window.location.origin + pathname

    document.title = fullTitle
    setMeta('name', 'description', desc)
    setCanonical(url)

    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:site_name', SITE_NAME)
    if (image) setMeta('property', 'og:image', image)

    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', desc)
    if (image) setMeta('name', 'twitter:image', image)
  }, [title, description, image, pathname])
}
