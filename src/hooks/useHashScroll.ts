import { useEffect } from 'react'

/**
 * Scrolls to the URL's #section once the page has rendered. The page is client-rendered,
 * so on arrival from another page (e.g. /#contact from a case study) the browser looks for
 * the anchor before it exists and stays at the top. Scrolls again once web fonts settle,
 * since late font swaps can shift the target.
 */
export function useHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    const go = () => document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    const frame = requestAnimationFrame(go)
    let live = true
    document.fonts?.ready.then(() => live && go())
    return () => {
      live = false
      cancelAnimationFrame(frame)
    }
  }, [])
}
