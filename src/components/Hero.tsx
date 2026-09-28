import { useEffect, useRef, useState } from 'react'
import { hero, site } from '../data/content'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { RiskGrid, RiskLegend, MOBILE_VIEWBOX, RISK_COUNTS, HOME_COUNT, type ViewMode } from './RiskGrid'

const REGIONAL_COUNTS = [0, HOME_COUNT, 0, 0] as const

/**
 * Scroll thresholds, as a fraction of the viewport height, for the figure's vertical centre.
 * A small scroll is enough: once the visitor has scrolled at least MIN_SCROLL pixels and the
 * figure's centre is above SWITCH_DOWN, the view flips to Sage. Scrolling back so the centre
 * drops below SWITCH_UP (or returning to the very top) restores the regional view. The gap
 * between the two lines prevents flicker.
 */
const SWITCH_DOWN = 0.82
const SWITCH_UP = 0.92
const MIN_SCROLL = 40

export function Hero() {
  const compact = useMediaQuery('(max-width: 640px)')
  const medium = useMediaQuery('(max-width: 1024px)')
  const [mode, setMode] = useState<ViewMode>('regional')
  const figureRef = useRef<HTMLDivElement>(null)
  const scrollMode = useRef<ViewMode>('regional')

  // The scroll position drives the view. A tap on the toggle overrides it until the
  // figure next crosses the threshold line.
  useEffect(() => {
    const el = figureRef.current
    if (!el) return
    let ticking = false
    const evaluate = () => {
      ticking = false
      const rect = el.getBoundingClientRect()
      const centre = (rect.top + rect.bottom) / 2 / window.innerHeight
      const scrolled = window.scrollY >= MIN_SCROLL
      const next: ViewMode =
        scrollMode.current === 'regional'
          ? scrolled && centre < SWITCH_DOWN
            ? 'sage'
            : 'regional'
          : !scrolled || centre > SWITCH_UP
            ? 'regional'
            : 'sage'
      if (next !== scrollMode.current) {
        scrollMode.current = next
        setMode(next)
      }
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(evaluate)
    }
    evaluate()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const choose = (next: ViewMode) => setMode(next)

  const caption = mode === 'regional' ? hero.regionalCaption : hero.propertyCaption
  const counts = mode === 'regional' ? REGIONAL_COUNTS : RISK_COUNTS

  return (
    <section id="top" className="relative">
      <div className="container-x pt-14 sm:pt-20 lg:pt-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-6">Home insurance · Physics + AI · Property-level risk</p>
            <h1 className="text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[5rem]">{hero.headline}</h1>
          </div>
          <div className="lg:col-span-4 lg:pb-2">
            <p className="text-lg leading-relaxed text-muted">{hero.subheadline}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href={site.primaryCtaHref} className="btn-primary">
                {site.primaryCta}
              </a>
              <a href={site.secondaryCtaHref} className="btn-secondary">
                {site.secondaryCta}
              </a>
            </div>
          </div>
        </div>

        <figure className="mt-12 sm:mt-16">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div role="group" aria-label={hero.toggle.label} className="inline-flex rounded-full border border-line-strong bg-bg p-1">
              {(
                [
                  ['regional', hero.toggle.without],
                  ['sage', hero.toggle.with],
                ] as const
              ).map(([value, label]) => {
                const active = mode === value
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(value)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      active ? 'bg-ink text-bg' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            <p className="text-sm text-faint">Scroll or tap to compare · Illustrative neighborhood of {HOME_COUNT} homes</p>
          </div>

          <div ref={figureRef} className="overflow-hidden rounded-2xl border border-line-strong bg-surface">
            <RiskGrid
              animate
              mode={mode}
              viewBox={compact ? MOBILE_VIEWBOX : undefined}
              labelScale={compact ? 1.9 : medium ? 1.3 : 1}
              className="block h-auto w-full"
              title={
                mode === 'regional'
                  ? 'Without Sage: a hillside neighborhood of winding streets, ringed by pine trees and brush with a canyon on the right, with every home painted the same yellow because the whole area shares one regional hazard rating.'
                  : 'With Sage: the same neighborhood with each home coloured by its own risk from green to red as wind and embers cross from the canyon. An exposed home at the canyon edge and a mitigated home on the left are called out.'
              }
            />
          </div>

          <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-[1fr_auto] sm:items-start">
            <figcaption aria-live="polite">
              <p className="font-serif text-lg text-ink">{caption.title}</p>
              <p className="text-sm text-muted">{caption.line}</p>
            </figcaption>
            <RiskLegend counts={counts} className="sm:justify-end" />
          </div>
        </figure>

        <p className="mt-16 max-w-3xl font-serif text-2xl leading-snug text-ink sm:text-3xl">{hero.supporting}</p>
        <div className="h-20 sm:h-28" />
      </div>
    </section>
  )
}
