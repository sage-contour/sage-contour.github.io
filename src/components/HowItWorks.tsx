import { howItWorks } from '../data/content'
import { Section, SectionHeading, Split } from './Section'

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <Split
        left={
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow={howItWorks.eyebrow} title={howItWorks.heading} />
            <p className="reveal mt-8 max-w-sm font-serif text-xl leading-snug text-ink-soft">{howItWorks.bottomLine}</p>
          </div>
        }
        right={
          <ol className="reveal reveal-delay-1 border-t border-line">
            {howItWorks.steps.map((step, i) => {
              const last = i === howItWorks.steps.length - 1
              return (
                <li key={step.title} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-b border-line py-6 sm:grid-cols-[4.5rem_1fr]">
                  <p className="num">0{i + 1}</p>
                  <div>
                    <h3 className={`text-2xl leading-tight ${last ? 'text-accent-strong' : ''}`}>
                      <span className="sr-only">Step {i + 1}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-base text-muted">{step.body}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        }
      />
    </Section>
  )
}
