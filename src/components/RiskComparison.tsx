import { insight } from '../data/content'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { RiskGrid, RiskLegend, MOBILE_VIEWBOX } from './RiskGrid'
import { Section, Split } from './Section'

export function RiskComparison() {
  const compact = useMediaQuery('(max-width: 640px)')
  const vb = compact ? MOBILE_VIEWBOX : undefined
  return (
    <Section id="insight" tone="surface">
      <Split
        left={
          <div className="reveal lg:sticky lg:top-28">
            <p className="eyebrow mb-5">{insight.eyebrow}</p>
            <h2 className="text-3xl leading-[1.08] sm:text-4xl lg:text-[2.75rem]">{insight.heading}</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{insight.supporting}</p>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">{insight.body}</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{insight.note}</p>
          </div>
        }
        right={
          <div className="reveal reveal-delay-1">
            <figure className="overflow-hidden rounded-2xl border border-line-strong bg-bg">
              <RiskGrid variant="block" viewBox={vb} windStreaks={false} className="block h-auto w-full" />
              <figcaption className="flex items-baseline gap-3 border-t border-line px-5 py-4">
                <p className="font-serif text-lg">{insight.regional.title}</p>
                <p className="text-sm text-muted">{insight.regional.line}</p>
              </figcaption>
            </figure>
            <div className="flex items-center gap-3 py-4 text-sm text-muted" aria-hidden="true">
              <span className="h-px flex-1 bg-line" />
              <span className="font-serif italic">Sage adds property-level physics</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <figure className="overflow-hidden rounded-2xl border border-ink/40 bg-bg">
              <RiskGrid viewBox={vb} callouts={!compact} windStreaks={false} className="block h-auto w-full" />
              <figcaption className="flex items-baseline gap-3 border-t border-line px-5 py-4">
                <p className="font-serif text-lg">{insight.property.title}</p>
                <p className="text-sm text-muted">{insight.property.line}</p>
              </figcaption>
            </figure>
            <RiskLegend className="mt-5" />
          </div>
        }
      />
    </Section>
  )
}
