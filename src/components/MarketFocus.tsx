import { market } from '../data/content'
import { Section, SectionHeading, Split } from './Section'

function Chain({ items, current }: { items: string[]; current: string }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {items.map((item, i) => (
        <li key={item} className="flex items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-sm ${item === current ? 'border-ink bg-ink text-bg' : 'border-line-strong text-muted'}`}>{item}</span>
          {i < items.length - 1 && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-faint" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          )}
        </li>
      ))}
    </ol>
  )
}

export function MarketFocus() {
  return (
    <Section id="market">
      <Split
        left={<SectionHeading eyebrow={market.eyebrow} title={market.heading} />}
        right={<p className="reveal font-serif text-2xl leading-snug text-ink lg:pt-12">{market.copy}</p>}
      />
      <div className="reveal mt-14 grid border-t border-line md:grid-cols-3">
        {market.reasons.map((r, i) => (
          <article key={r.title} className="border-b border-line py-8 md:border-b-0 md:border-r md:pr-8 md:last:border-r-0 md:[&:not(:first-child)]:pl-8">
            <p className="num">0{i + 1}</p>
            <h3 className="mt-6 text-2xl leading-tight">{r.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted">{r.body}</p>
          </article>
        ))}
      </div>
      <div className="reveal mt-12 rounded-2xl bg-surface p-6 sm:p-8">
        <p className="eyebrow">{market.expansionLabel}</p>
        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:gap-14">
          <div>
            <p className="mb-2 text-sm text-faint">Hazards</p>
            <Chain items={market.hazards} current="Wildfire" />
          </div>
          <div>
            <p className="mb-2 text-sm text-faint">Geography</p>
            <Chain items={market.geographies} current="California" />
          </div>
        </div>
        <p className="mt-6 max-w-xl text-base text-muted">Expanding {market.expansionNote}</p>
      </div>
    </Section>
  )
}
