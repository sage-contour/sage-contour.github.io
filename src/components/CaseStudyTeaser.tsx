import { CASE_STUDY_PATH, caseStudy } from '../data/content'
import { BASE } from '../lib/links'
import { Section, SectionHeading, Split } from './Section'

const { teaser } = caseStudy

export function CaseStudyTeaser() {
  const href = `${BASE}${CASE_STUDY_PATH}`
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
          <a href={href} className="reveal reveal-delay-1 group block overflow-hidden rounded-2xl border border-line bg-bg" tabIndex={-1} aria-hidden="true">
            <img
              src={`${BASE}media/rancho-bernardo-poster.jpg`}
              alt=""
              width={1920}
              height={1080}
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
