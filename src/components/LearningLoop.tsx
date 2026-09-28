import { learningLoop } from '../data/content'
import { Section, SectionHeading, Split } from './Section'
import { CfdField, CFD_GRADIENT_CSS } from './CfdSimulation'

const R = 150
const C = 200

function Flywheel() {
  const n = learningLoop.nodes.length
  const pts = learningLoop.nodes.map((_, i) => {
    const a = (-90 + (360 / n) * i) * (Math.PI / 180)
    return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) }
  })
  return (
    <svg viewBox="0 0 400 400" className="mx-auto block h-auto w-full max-w-[380px]" aria-hidden="true" focusable="false">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L10 5 0 10z" fill="var(--color-accent)" />
        </marker>
      </defs>
      <circle cx={C} cy={C} r={R} fill="none" stroke="var(--color-line)" strokeWidth="1" />
      {pts.map((p, i) => {
        const q = pts[(i + 1) % n]
        const a0 = Math.atan2(p.y - C, p.x - C) + 0.16
        const a1 = Math.atan2(q.y - C, q.x - C) - 0.16
        const s = { x: C + R * Math.cos(a0), y: C + R * Math.sin(a0) }
        const e = { x: C + R * Math.cos(a1), y: C + R * Math.sin(a1) }
        return (
          <path key={i} d={`M${s.x} ${s.y} A${R} ${R} 0 0 1 ${e.x} ${e.y}`} fill="none" stroke="var(--color-accent)" strokeOpacity="0.8" strokeWidth="1.4" markerEnd="url(#arrow)" />
        )
      })}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="17" fill="var(--color-bg)" stroke="var(--color-ink)" strokeWidth="1" />
          <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize="13" fontFamily="var(--font-serif)" fill="var(--color-ink)">
            {i + 1}
          </text>
        </g>
      ))}
      <CfdField cx={C} cy={C} r={104} id="loop-cfd" />
      <circle cx={C} cy={C} r="104" fill="none" stroke="var(--color-line-strong)" strokeWidth="1" />
    </svg>
  )
}

export function LearningLoop() {
  return (
    <Section id="moat">
      <Split
        left={
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow={learningLoop.eyebrow} title={learningLoop.heading} copy={learningLoop.supporting} />
            <div className="reveal mt-10">
              <Flywheel />
              <p className="sr-only">Flywheel diagram. At its centre: {learningLoop.center}</p>
              <div className="mx-auto mt-4 flex max-w-[380px] items-center gap-3 text-xs text-faint" aria-hidden="true">
                <span>{learningLoop.legend.low}</span>
                <span className="h-1.5 flex-1 rounded-full" style={{ background: CFD_GRADIENT_CSS }} />
                <span>{learningLoop.legend.high}</span>
              </div>
              <p className="mt-2 text-center text-xs text-faint">{learningLoop.legend.label}</p>
            </div>
          </div>
        }
        right={
          <>
            <ol className="reveal reveal-delay-1 border-t border-line">
              {learningLoop.nodes.map((node, i) => (
                <li key={node} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-b border-line py-6 sm:grid-cols-[4.5rem_1fr]">
                  <p className="num">0{i + 1}</p>
                  <div>
                    <h3 className="text-2xl leading-tight">{node}</h3>
                    <p className="mt-1.5 max-w-lg text-base leading-relaxed text-muted">{learningLoop.nodeNotes[i]}</p>
                  </div>
                </li>
              ))}
            </ol>
            <aside className="reveal mt-10 rounded-2xl bg-surface p-6 sm:p-8">
              <p className="eyebrow">{learningLoop.infra.eyebrow}</p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{learningLoop.infra.body}</p>
            </aside>
          </>
        }
      />
    </Section>
  )
}
