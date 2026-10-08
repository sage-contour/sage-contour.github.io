import { useEffect, useRef, useState } from 'react'
import { mailto, site } from '../data/content'
import { CASE_STUDIES_PATH, caseStudyCopy as shared, type CaseStudy } from '../data/case-studies'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Section, SectionHeading, Split } from '../components/Section'
import { RiskMap } from '../components/RiskMap'
import { Topography } from '../components/Topography'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useReveal } from '../hooks/useReveal'
import { BASE } from '../lib/links'

function Film({ cs }: { cs: CaseStudy }) {
  // The film loops silently; with reduced motion it waits for the viewer to press play.
  // A separate button replaces native controls, which would cover the film's legend.
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (reduced) v.pause()
    else v.play().catch(() => setPlaying(false))
  }, [reduced])
  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) v.play().catch(() => setPlaying(false))
    else v.pause()
  }
  return (
    <figure className="reveal reveal-delay-1">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <video
          ref={ref}
          className="block aspect-video h-auto w-full"
          poster={`${BASE}media/${cs.slug}-poster.jpg`}
          muted
          loop
          playsInline
          preload={reduced ? 'metadata' : 'auto'}
          aria-label={cs.video.label}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onClick={toggle}
        >
          <source src={`${BASE}media/${cs.slug}.mp4`} type="video/mp4" />
        </video>
      </div>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <figcaption className="max-w-3xl text-sm leading-relaxed text-faint">{cs.video.caption}</figcaption>
        <button type="button" onClick={toggle} className="btn-secondary shrink-0 self-start py-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4l13 8-13 8z" />}
          </svg>
          {playing ? 'Pause film' : 'Play film'}
        </button>
      </div>
    </figure>
  )
}

export function CaseStudyPage({ cs }: { cs: CaseStudy }) {
  useReveal()
  return (
    <>
      <Header current={CASE_STUDIES_PATH} />
      <main id="main">
        <section id="top" className="relative overflow-hidden">
          <Topography className="opacity-70" />
          <div className="container-x relative pb-14 pt-14 sm:pb-20 sm:pt-20">
            <div className="reveal max-w-4xl">
              <a href={`${BASE}${CASE_STUDIES_PATH}`} className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
                {shared.back}
              </a>
              <p className="eyebrow mb-5 mt-10">{cs.eyebrow}</p>
              <h1 className="text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{cs.heading}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{cs.intro}</p>
            </div>
          </div>
          <div className="container-x relative pb-16 sm:pb-24">
            <Film cs={cs} />
            <dl className="reveal reveal-delay-2 mt-14 grid grid-cols-2 border-t border-line lg:grid-cols-4">
              {cs.stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`border-b border-line py-7 pr-4 lg:border-b-0 ${i % 2 ? 'pl-5 sm:pl-8' : ''} ${i < cs.stats.length - 1 ? 'border-r' : ''} max-lg:[&:nth-child(2)]:border-r-0 lg:[&:not(:first-child)]:pl-8`}
                >
                  <dt className="eyebrow">{s.label}</dt>
                  <dd className="mt-3 font-serif text-3xl tabular-nums leading-none text-ink sm:text-4xl">{s.value}</dd>
                  <dd className="mt-2 text-sm text-muted">{s.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <Section id="risk-map" tone="surface">
          <Split
            left={<SectionHeading eyebrow={shared.riskMap.eyebrow} title={shared.riskMap.heading} />}
            right={<p className="reveal text-base leading-relaxed text-muted sm:text-lg lg:pt-12">{cs.riskMap.copy}</p>}
          />
          <div className="mt-12">
            <RiskMap study={cs} />
          </div>
          <dl className="reveal mt-14 grid border-t border-line md:grid-cols-3">
            {cs.riskMap.highlights.map((h) => (
              <div key={h.value} className="border-b border-line py-7 md:border-b-0 md:border-r md:pr-8 md:last:border-r-0 md:[&:not(:first-child)]:pl-8">
                <dt className="font-serif text-4xl tabular-nums leading-none text-ink">{h.value}</dt>
                <dd className="mt-3 text-base leading-relaxed text-muted">{h.label}</dd>
              </div>
            ))}
          </dl>
          <p className="reveal mt-8 max-w-3xl text-sm leading-relaxed text-faint">{cs.riskMap.note}</p>
        </Section>

        <Section id="method">
          <Split
            left={
              <div className="lg:sticky lg:top-28">
                <SectionHeading eyebrow={shared.steps.eyebrow} title={shared.steps.heading} />
              </div>
            }
            right={
              <ol className="reveal reveal-delay-1 border-t border-line">
                {cs.steps.map((step, i) => (
                  <li key={step.title} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-b border-line py-6 sm:grid-cols-[4.5rem_1fr]">
                    <p className="num">0{i + 1}</p>
                    <div>
                      <h3 className="text-2xl leading-tight">
                        <span className="sr-only">Step {i + 1}: </span>
                        {step.title}
                      </h3>
                      <p className="mt-1.5 max-w-xl text-base leading-relaxed text-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            }
          />
        </Section>

        <Section id="findings" tone="surface">
          <SectionHeading eyebrow={shared.findings.eyebrow} title={shared.findings.heading} />
          <div className="reveal mt-14 grid border-t border-line md:grid-cols-3">
            {cs.findings.map((f, i) => (
              <article key={f.title} className="border-b border-line py-8 md:border-b-0 md:border-r md:pr-8 md:last:border-r-0 md:[&:not(:first-child)]:pl-8">
                <p className="num">0{i + 1}</p>
                <h3 className="mt-6 text-2xl leading-tight">{f.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted">{f.body}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="limits">
          <Split
            left={<SectionHeading eyebrow={shared.limits.eyebrow} title={shared.limits.heading} />}
            right={
              <ul className="reveal reveal-delay-1 border-t border-line">
                {cs.limits.map((item) => (
                  <li key={item} className="flex gap-4 border-b border-line py-5 text-base leading-relaxed text-ink-soft">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            }
          />
        </Section>

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
                <a href={mailto(`${cs.name} case study`)} className="btn-secondary border-bg/30 text-bg hover:border-bg hover:bg-bg/10">
                  {shared.email}
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
