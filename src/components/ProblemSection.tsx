import { problem } from '../data/content'
import { Section, SectionHeading, Split } from './Section'

export function ProblemSection() {
  return (
    <Section id="why-sage">
      <Split
        left={<SectionHeading eyebrow={problem.eyebrow} title={problem.heading} />}
        right={<p className="reveal max-w-xl text-lg leading-relaxed text-muted lg:pt-12">{problem.copy}</p>}
      />
      <div className="reveal mt-14 grid border-t border-line md:grid-cols-3">
        {problem.cards.map((card, i) => (
          <article key={card.title} className="border-b border-line py-8 md:border-b-0 md:border-r md:pr-8 md:last:border-r-0 md:[&:not(:first-child)]:pl-8">
            <p className="num">0{i + 1}</p>
            <h3 className="mt-6 text-2xl leading-tight">{card.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted">{card.body}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
