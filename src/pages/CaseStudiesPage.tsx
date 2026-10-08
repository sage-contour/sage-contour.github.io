import { site } from '../data/content'
import { CASE_STUDIES_PATH, caseStudies, caseStudiesPage as page, caseStudyCopy as shared, caseStudyPath } from '../data/case-studies'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Topography } from '../components/Topography'
import { useReveal } from '../hooks/useReveal'
import { BASE } from '../lib/links'

export function CaseStudiesPage() {
  useReveal()
  return (
    <>
      <Header current={CASE_STUDIES_PATH} />
      <main id="main">
        <section id="top" className="relative overflow-hidden">
          <Topography className="opacity-70" />
          <div className="container-x relative pb-14 pt-14 sm:pb-20 sm:pt-20">
            <div className="reveal max-w-4xl">
              <p className="eyebrow mb-5">{page.eyebrow}</p>
              <h1 className="text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{page.heading}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{page.intro}</p>
            </div>
          </div>
        </section>

        <section className="relative border-t border-line bg-surface py-16 sm:py-24">
          <div className="container-x">
            <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
              {caseStudies.map((cs, i) => (
                <li key={cs.slug} className={`reveal ${i % 2 ? 'reveal-delay-1' : ''}`}>
                  <a href={`${BASE}${caseStudyPath(cs.slug)}`} className="group block rounded-2xl">
                    <div className="overflow-hidden rounded-2xl border border-line bg-bg">
                      <img
                        src={`${BASE}media/${cs.slug}-card.jpg`}
                        alt=""
                        width={1280}
                        height={720}
                        loading={i < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="block aspect-video h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
                      />
                    </div>
                    <p className="eyebrow mt-6">{cs.place}</p>
                    <h2 className="mt-3 text-3xl leading-tight transition-colors group-hover:text-accent-strong">{cs.name}</h2>
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{cs.summary}</p>
                    <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5">
                      {cs.stats.slice(0, 2).map((s) => (
                        <div key={s.label}>
                          <dt className="text-sm text-faint">{s.label}</dt>
                          <dd className="mt-1 font-serif text-2xl tabular-nums leading-none text-ink">{s.value}</dd>
                        </div>
                      ))}
                      <div>
                        <dt className="text-sm text-faint">{page.statLabels.runs}</dt>
                        <dd className="mt-1 font-serif text-2xl tabular-nums leading-none text-ink">{cs.runs}</dd>
                      </div>
                    </dl>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                      {page.cta}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="reveal mt-16 max-w-3xl text-sm leading-relaxed text-faint">{page.note}</p>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-line bg-ink text-bg">
          <Topography className="opacity-60 invert" />
          <div className="container-x relative py-20 sm:py-28">
            <div className="reveal max-w-3xl">
              <h2 className="text-4xl leading-[1.05] sm:text-5xl">{shared.next.heading}</h2>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-bg/75">{shared.next.copy}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href={`${BASE}#contact`} className="btn-primary bg-bg text-ink hover:bg-accent-soft">
                  {site.primaryCta}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer onHome={false} />
    </>
  )
}
