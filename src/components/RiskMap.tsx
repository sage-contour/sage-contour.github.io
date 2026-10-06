import { useEffect, useRef, useState } from 'react'
import { caseStudy } from '../data/content'

/**
 * Home-by-home wildfire risk map for a case study, drawn from the JSON written by
 * orchestrator/tools/risk/web_map.py. Coordinates are metres from the grid's top-left,
 * so the SVG viewBox is the site itself. The data is loaded lazily as its own chunk.
 */

type Tier = 'low' | 'moderate' | 'elevated' | 'severe'
type Home = { id: string; p: number; tier: Tier; t: number | null; d: string }
type RiskData = {
  width: number
  height: number
  runs: number
  bands: { min: number; d: string }[]
  lines: { level: number; d: string }[]
  terrain: { z: number; major: boolean; d: string }[]
  roads: { major: boolean; d: string }[]
  homes: Home[]
  tiers: Record<Tier, number>
}

const copy = caseStudy.riskMap
const TIERS: Tier[] = ['low', 'moderate', 'elevated', 'severe']
const TIER_COLOR: Record<Tier, string> = {
  low: 'var(--color-risk-low)',
  moderate: 'var(--color-risk-moderate)',
  elevated: 'var(--color-risk-elevated)',
  severe: 'var(--color-risk-severe)',
}
/** Burn-probability bands 10–20 … 50%+: ivory to clay, kept lighter than the home colours. */
const BAND_COLOR = ['#f4e6cf', '#efd5ac', '#e8bf8a', '#e0a370', '#d4865c']
const BAND_LABELS = ['10%', '20%', '30%', '40%', '50%+']
/** Rounded down, so a home at 19.9% never reads as 20% beside a 10–20% tier. */
const pct = (p: number) => (p < 0.01 && p > 0 ? '<1%' : `${Math.floor(p * 100)}%`)

function ScaleBar({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fontFamily="var(--font-sans)" fontSize="15" fill="var(--color-ink)">
      <rect x="-12" y="-30" width="226" height="48" rx="8" fill="var(--color-bg)" fillOpacity="0.88" />
      <path d="M0 0h200M0 -6v12M100 -4v8M200 -6v12" stroke="var(--color-ink)" strokeWidth="1.6" fill="none" />
      <text x="0" y="-12">0</text>
      <text x="200" y="-12" textAnchor="end">200 m</text>
    </g>
  )
}

function NorthArrow({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="26" fill="var(--color-bg)" fillOpacity="0.88" />
      <path d="M0 -17L7 6L0 1L-7 6Z" fill="var(--color-ink)" />
      <text y="20" textAnchor="middle" fontSize="12" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-ink)">
        N
      </text>
    </g>
  )
}

function Toggle({ on, onChange, children }: { on: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        on ? 'border-ink bg-ink text-bg' : 'border-line-strong text-muted hover:border-ink hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

export function RiskMap() {
  const [data, setData] = useState<RiskData | null>(null)
  const [showBurn, setShowBurn] = useState(true)
  const [showHomes, setShowHomes] = useState(true)
  const [hover, setHover] = useState<{ home: Home; x: number; y: number } | null>(null)
  const frame = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let live = true
    import('../data/rancho-bernardo-risk.json').then((m) => live && setData(m.default as RiskData))
    return () => {
      live = false
    }
  }, [])

  const onMove = (e: React.PointerEvent<SVGGElement>) => {
    const target = e.target as SVGElement
    const i = target.dataset.i
    const box = frame.current?.getBoundingClientRect()
    if (!data || i === undefined || !box) return setHover(null)
    setHover({ home: data.homes[Number(i)], x: e.clientX - box.left, y: e.clientY - box.top })
  }

  return (
    <div>
      <div className="reveal mb-5 flex flex-wrap items-center gap-2" role="group" aria-label="Map layers">
        <Toggle on={showBurn} onChange={setShowBurn}>
          {copy.layers.burn}
        </Toggle>
        <Toggle on={showHomes} onChange={setShowHomes}>
          {copy.layers.homes}
        </Toggle>
      </div>

      <div ref={frame} className="reveal relative overflow-hidden rounded-2xl border border-line bg-bg">
        {data ? (
          <svg
            viewBox={`0 0 ${data.width} ${data.height}`}
            className="block h-auto w-full"
            role="img"
            aria-label={copy.label}
            onPointerLeave={() => setHover(null)}
          >
            <rect width={data.width} height={data.height} fill="var(--color-bg)" />
            <g fill="none" stroke="var(--color-ink)" strokeLinejoin="round">
              {data.terrain.map((t) => (
                <path key={t.z} d={t.d} strokeOpacity={t.major ? 0.2 : 0.09} strokeWidth={t.major ? 1.2 : 0.9} />
              ))}
            </g>
            {showBurn && (
              <g>
                {data.bands.map((b, i) => (
                  <path key={b.min} d={b.d} fill={BAND_COLOR[i]} fillOpacity="0.72" fillRule="evenodd" />
                ))}
                <g fill="none" stroke="var(--color-accent-strong)" strokeLinejoin="round">
                  {data.lines.map((l) => (
                    <path key={l.level} d={l.d} strokeOpacity={0.25 + l.level} strokeWidth={l.level >= 0.5 ? 1.6 : 1.1} />
                  ))}
                </g>
              </g>
            )}
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              {data.roads.map((r, i) => (
                <path key={`c${i}`} d={r.d} stroke="var(--color-line-strong)" strokeWidth={r.major ? 11 : 8.5} />
              ))}
              {data.roads.map((r, i) => (
                <path key={`r${i}`} d={r.d} stroke="var(--color-bg)" strokeWidth={r.major ? 8.5 : 6} />
              ))}
            </g>
            <g onPointerMove={onMove} stroke="var(--color-ink)" strokeWidth="0.8" strokeLinejoin="round">
              {data.homes.map((h, i) => (
                <path
                  key={h.id}
                  d={h.d}
                  data-i={i}
                  fill={showHomes ? TIER_COLOR[h.tier] : 'var(--color-surface-strong)'}
                  strokeOpacity={hover?.home.id === h.id ? 1 : 0.55}
                  strokeWidth={hover?.home.id === h.id ? 2.4 : 0.8}
                />
              ))}
            </g>
            <ScaleBar x={36} y={data.height - 30} />
            <NorthArrow x={data.width - 44} y={44} />
          </svg>
        ) : (
          <div className="aspect-[1120/796] w-full animate-pulse bg-surface" aria-hidden="true" />
        )}

        {hover && (
          <div
            className="pointer-events-none absolute z-10 w-56 rounded-xl border border-line bg-bg/95 p-3.5 text-sm shadow-lg backdrop-blur-sm"
            style={{
              left: Math.min(hover.x + 16, (frame.current?.clientWidth ?? 0) - 232),
              top: Math.max(8, hover.y - 96),
            }}
          >
            <p className="flex items-center gap-2 font-medium text-ink">
              <span className="risk-swatch" style={{ background: TIER_COLOR[hover.home.tier] }} />
              {copy.tiers[hover.home.tier].split(' · ')[0]} risk
            </p>
            {hover.home.p > 0 ? (
              <>
                <p className="mt-2 text-muted">
                  {copy.tooltip.ignites} <span className="font-serif text-lg text-ink tabular-nums">{pct(hover.home.p)}</span>{' '}
                  {copy.tooltip.of}
                </p>
                {hover.home.t !== null && (
                  <p className="mt-1 text-faint">
                    {copy.tooltip.median} {Math.round(hover.home.t)} min {copy.tooltip.after}
                  </p>
                )}
              </>
            ) : (
              <p className="mt-2 text-muted">{copy.tooltip.never}</p>
            )}
          </div>
        )}
      </div>

      <div className="reveal mt-6 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="eyebrow">{copy.burnLegend.title}</p>
          <div className="mt-3 flex max-w-sm" aria-hidden="true">
            {BAND_COLOR.map((c, i) => (
              <div key={c} className="flex-1">
                <div className="h-2.5" style={{ background: c }} />
                <p className="mt-1.5 text-xs tabular-nums text-muted">{BAND_LABELS[i]}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-faint">{copy.burnLegend.note}</p>
        </div>
        <div>
          <p className="eyebrow">{copy.homeLegend.title}</p>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm text-ink-soft min-[420px]:grid-cols-2">
            {TIERS.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="risk-swatch" style={{ background: TIER_COLOR[t] }} aria-hidden="true" />
                <span>{copy.tiers[t]}</span>
                {data && <span className="ml-auto tabular-nums text-faint">{data.tiers[t]}</span>}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-faint">{copy.homeLegend.note}</p>
        </div>
      </div>
    </div>
  )
}
