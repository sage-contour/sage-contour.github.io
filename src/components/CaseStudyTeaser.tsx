import { caseStudyTeaser as teaser } from '../data/content'
import { CASE_STUDIES_PATH, caseStudyPath } from '../data/case-studies'
import { BASE } from '../lib/links'
import { Section, SectionHeading, Split } from './Section'

export function CaseStudyTeaser() {
  const href = `${BASE}${CASE_STUDIES_PATH}`
  const featured = `${BASE}${caseStudyPath('rancho-bernardo')}`
  return (
    <Section id="case-study">
      <Split
        left={
          <div>
            <SectionHeading eyebrow={teaser.eyebrow} title={teaser.heading} copy={teaser.copy} />
            <a href={href} className="btn-primary reveal mt-8">
              {teaser.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        }
        right={
          <a href={featured} className="reveal reveal-delay-1 group block overflow-hidden rounded-2xl border border-line bg-bg" tabIndex={-1} aria-hidden="true">
            <img
              src={`${BASE}media/rancho-bernardo-risk-map.jpg`}
              alt=""
              width={1600}
              height={1138}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
            />
          </a>
        }
      />
    </Section>
  )
}
