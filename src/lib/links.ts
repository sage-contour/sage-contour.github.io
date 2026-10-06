/** Site base path with a trailing slash ("/" on GitHub Pages user sites). */
export const BASE = import.meta.env.BASE_URL

/**
 * Resolves a nav href for the current page. In-page anchors stay relative on the
 * home page and point back to it from any other page; page paths get the base.
 */
export function resolveHref(href: string, onHome: boolean) {
  if (href.startsWith('#')) return onHome ? href : `${BASE}${href}`
  return `${BASE}${href}`
}
