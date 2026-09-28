import { mgaModel } from '../data/content'
import { Section, SectionHeading, Split } from './Section'

export function MgaModel() {
  return (
    <Section id="model" tone="surface">
      <Split
        left={<SectionHeading eyebrow={mgaModel.eyebrow} title={mgaModel.heading} />}
        right={<p className="reveal max-w-xl text-lg leading-relaxed text-muted lg:pt-12">{mgaModel.copy}</p>}
      />

      <ol className="reveal mt-14 grid overflow-hidden rounded-2xl border border-line-strong bg-bg lg:grid-cols-4" aria-label="Flow of a policy through the planned MGA model">
        {mgaModel.flow.map((node, i) => (
          <li
            key={node.title}
            className={`relative border-b border-line p-6 last:border-b-0 sm:p-7 lg:border-b-0 lg:border-r lg:last:border-r-0 ${
              node.highlight ? 'bg-accent-soft/50' : ''
            }`}
          >
            <p className="num">0{i + 1}</p>
            <h3 className="mt-5 text-2xl leading-tight">{node.title}</h3>
            <p className="mt-2 text-base leading-relaxed text-muted">{node.body}</p>
            {i < mgaModel.flow.length - 1 && (
              <span
                className="absolute -bottom-3 left-1/2 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-line-strong bg-bg text-ink lg:-right-3 lg:bottom-auto lg:left-auto lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0"
                aria-hidden="true"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-90 lg:rotate-0">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="reveal lg:col-span-5">
          <p className="eyebrow">{mgaModel.revenueHeading}</p>
          <ul className="mt-4 border-t border-line">
            {mgaModel.revenue.map((r) => (
              <li key={r} className="border-b border-line py-3 text-base text-ink">
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal reveal-delay-1 border-l-2 border-accent pl-6 lg:col-span-7 lg:pl-8">
          <p className="font-serif text-2xl leading-snug text-ink sm:text-3xl">{mgaModel.callout}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{mgaModel.scale}</p>
        </div>
      </div>
    </Section>
  )
}
