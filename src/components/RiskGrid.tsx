import { useId, type CSSProperties } from 'react'
import { riskLegend } from '../data/content'

const RISK_VAR = [
  'var(--color-risk-low)',
  'var(--color-risk-moderate)',
  'var(--color-risk-elevated)',
  'var(--color-risk-severe)',
] as const

/* ------------------------------------------------------------------ */
/*  Scene geometry (viewBox units, 400 × 400)                          */
/* ------------------------------------------------------------------ */
const VW = 800
const VH = 460
const CANYON_X = 706
const LOT = 24
const OFFSET = 21 // house centre distance from the road centreline
const SPACING = 27 // distance between neighbouring houses along a road

const TREE = '#5b8362'
const TREE_DARK = '#3f6347'
const TRUNK = '#8a6a4a'
const BUSH = '#9aa36b'
const BUSH_LIGHT = '#b4ba85'

/**
 * Prevailing wind: a downslope wind out of the canyon, blowing from the upper right toward
 * the lower left. Embers, streaks and the exposure model all use this vector.
 */
const WIND_ANGLE_DEG = 160 // direction of travel, degrees clockwise from +x (screen coordinates)
const WIND = { x: Math.cos((WIND_ANGLE_DEG * Math.PI) / 180), y: Math.sin((WIND_ANGLE_DEG * Math.PI) / 180) }
const UPWIND = { x: -WIND.x, y: -WIND.y }

/** Narrower viewBox used on small screens: keeps the homes and the canyon, crops the wooded left edge. */
export const MOBILE_VIEWBOX = '150 0 650 460'
export const FULL_VIEWBOX = `0 0 ${VW} ${VH}`

type Pt = { x: number; y: number }
type Cubic = [Pt, Pt, Pt, Pt]
const P = (x: number, y: number): Pt => ({ x, y })

/** Winding suburban streets: a collector that enters from the left and side streets ending in cul-de-sacs. */
const ROADS: { segs: Cubic[]; culDeSac?: boolean; skipStart: number; skipEnd: number }[] = [
  {
    segs: [
      [P(-10, 312), P(90, 322), P(150, 242), P(240, 238)],
      [P(240, 238), P(340, 234), P(392, 272), P(472, 264)],
      [P(472, 264), P(562, 256), P(592, 194), P(634, 152)],
    ],
    culDeSac: true,
    skipStart: 44,
    skipEnd: 18,
  },
  { segs: [[P(236, 238), P(212, 182), P(190, 142), P(152, 92)]], culDeSac: true, skipStart: 34, skipEnd: 18 },
  { segs: [[P(356, 240), P(368, 302), P(412, 350), P(470, 376)]], culDeSac: true, skipStart: 34, skipEnd: 18 },
  { segs: [[P(478, 262), P(472, 204), P(434, 156), P(442, 92)]], culDeSac: true, skipStart: 34, skipEnd: 18 },
  { segs: [[P(556, 256), P(600, 298), P(598, 346), P(646, 384)]], culDeSac: true, skipStart: 34, skipEnd: 18 },
]

/** Footprint of the developed area (ellipse used for placement). */
const REGION_CENTER = P(402, 228)
const REGION_RX = 284
const REGION_RY = 192

/* ------------------------------------------------------------------ */
/*  Bézier helpers                                                     */
/* ------------------------------------------------------------------ */
function bez([a, b, c, d]: Cubic, t: number): Pt {
  const u = 1 - t
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
  }
}
function tangent([a, b, c, d]: Cubic, t: number): Pt {
  const u = 1 - t
  const x = 3 * u * u * (b.x - a.x) + 6 * u * t * (c.x - b.x) + 3 * t * t * (d.x - c.x)
  const y = 3 * u * u * (b.y - a.y) + 6 * u * t * (c.y - b.y) + 3 * t * t * (d.y - c.y)
  const l = Math.hypot(x, y) || 1
  return { x: x / l, y: y / l }
}
function pathD(segs: Cubic[]) {
  return `M${segs[0][0].x} ${segs[0][0].y} ` + segs.map(([, b, c, d]) => `C${b.x} ${b.y} ${c.x} ${c.y} ${d.x} ${d.y}`).join(' ')
}
/** Dense polyline along a road, with cumulative arc length and tangent. */
function tessellate(segs: Cubic[]) {
  const pts: { p: Pt; t: Pt; s: number }[] = []
  let s = 0
  let prev: Pt | null = null
  for (const seg of segs) {
    for (let i = 0; i <= 60; i++) {
      const t = i / 60
      const p = bez(seg, t)
      if (prev) s += Math.hypot(p.x - prev.x, p.y - prev.y)
      pts.push({ p, t: tangent(seg, t), s })
      prev = p
    }
  }
  return pts
}

/* ------------------------------------------------------------------ */
/*  Deterministic scene generation                                    */
/* ------------------------------------------------------------------ */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

type House = { x: number; y: number; angle: number; risk: number; exposure: number }
type Plant = { x: number; y: number; scale: number; kind: 'pine' | 'bush' }

const ROAD_POLYLINES = ROADS.map((r) => tessellate(r.segs))
const CUL_DE_SACS = ROADS.filter((r) => r.culDeSac).map((r) => r.segs[r.segs.length - 1][3])

function insideRegion(x: number, y: number, pad = 0) {
  const dx = (x - REGION_CENTER.x) / (REGION_RX - pad)
  const dy = (y - REGION_CENTER.y) / (REGION_RY - pad)
  return dx * dx + dy * dy < 1
}
function nearRoad(x: number, y: number, dist: number) {
  return ROAD_POLYLINES.some((pl) => pl.some(({ p }) => Math.hypot(p.x - x, p.y - y) < dist))
}

function buildHouses(): House[] {
  const houses: House[] = []
  ROADS.forEach((road, ri) => {
    const pl = ROAD_POLYLINES[ri]
    const total = pl[pl.length - 1].s
    for (let s = road.skipStart; s < total - road.skipEnd; s += SPACING) {
      const k = pl.findIndex((q) => q.s >= s)
      const { p, t } = pl[k < 0 ? pl.length - 1 : k]
      const n = { x: -t.y, y: t.x }
      const angle = (Math.atan2(t.y, t.x) * 180) / Math.PI
      for (const side of [1, -1]) {
        const x = p.x + n.x * OFFSET * side
        const y = p.y + n.y * OFFSET * side
        if (!insideRegion(x, y, 6)) continue
        // keep clear of other roads and of the cul-de-sac turning circles
        const otherRoads = ROAD_POLYLINES.filter((_, i) => i !== ri)
        if (otherRoads.some((o) => o.some(({ p: q }) => Math.hypot(q.x - x, q.y - y) < OFFSET - 2))) continue
        if (CUL_DE_SACS.some((c) => Math.hypot(c.x - x, c.y - y) < 28)) continue
        if (houses.some((h) => Math.hypot(h.x - x, h.y - y) < LOT - 3)) continue
        houses.push({ x, y, angle, risk: 1, exposure: 0 })
      }
    }
  })
  return houses
}

const HOUSES = buildHouses()

function buildPlants(): Plant[] {
  const rand = rng(20240917)
  const plants: Plant[] = []
  const collides = (x: number, y: number, r: number) => plants.some((p) => Math.hypot(p.x - x, p.y - y) < r + p.scale * 9)
  const place = (n: number, box: [number, number, number, number], kind: Plant['kind'], sMin: number, sMax: number, interior = false) => {
    let tries = 0
    let placed = 0
    while (placed < n && tries < n * 60) {
      tries++
      const scale = sMin + rand() * (sMax - sMin)
      const x = box[0] + rand() * (box[2] - box[0])
      const y = box[1] + rand() * (box[3] - box[1])
      const r = scale * 9
      if (x - r < 2 || x + r > VW - 2 || y - r < 2 || y + r > VH - 2) continue
      if (interior) {
        if (!insideRegion(x, y, 10)) continue
        if (nearRoad(x, y, 13)) continue
        if (HOUSES.some((h) => Math.hypot(h.x - x, h.y - y) < 20)) continue
      } else if (insideRegion(x, y, -6)) continue
      if (collides(x, y, r * 0.7)) continue
      plants.push({ x, y, scale, kind })
      placed++
    }
  }
  // Conifer stands: dense along the top and left, thinning toward the bottom.
  place(60, [4, 4, 690, 64], 'pine', 0.7, 1.05)
  place(30, [4, 40, 118, VH - 4], 'pine', 0.65, 1)
  place(24, [4, 404, 660, VH - 4], 'pine', 0.55, 0.85)
  place(12, [640, 60, CANYON_X - 4, 400], 'pine', 0.55, 0.8)
  // Chaparral along the canyon rim (fuel) and scattered undergrowth.
  place(44, [672, 6, CANYON_X + 10, VH - 6], 'bush', 0.55, 0.95)
  place(30, [4, 4, 690, 70], 'bush', 0.45, 0.75)
  place(16, [4, 60, 120, VH - 4], 'bush', 0.45, 0.75)
  place(20, [120, 400, 660, VH - 4], 'bush', 0.45, 0.75)
  // A few trees between the homes.
  place(22, [130, 50, 680, 420], 'pine', 0.5, 0.75, true)
  place(16, [130, 50, 680, 420], 'bush', 0.4, 0.6, true)
  return plants
}

const PLANTS = buildPlants()

/* ------------------------------------------------------------------ */
/*  Exposure model                                                     */
/*                                                                     */
/*  A deliberately simple, physically motivated toy: each home's       */
/*  exposure comes from what sits UPWIND of it.                        */
/*    • the canyon rim (a continuous ember and flame-front source)     */
/*    • tree and brush cover, weighted by size and by how directly     */
/*      upwind it lies, inside a corridor that widens with distance    */
/*    • minus shielding from neighbouring homes immediately upwind     */
/*  Colours are assigned by rank so the palette stays balanced while   */
/*  the ordering follows the physics.                                  */
/* ------------------------------------------------------------------ */
function exposureOf(h: { x: number; y: number }, houses: House[], plants: Plant[]) {
  // Distance to the canyon rim travelling upwind.
  const tCanyon = UPWIND.x > 0 ? (CANYON_X - h.x) / UPWIND.x : Infinity
  const canyon = Math.max(0, 1 - tCanyon / 300)

  let fuel = 0
  for (const p of plants) {
    const vx = p.x - h.x
    const vy = p.y - h.y
    const along = vx * UPWIND.x + vy * UPWIND.y
    if (along < 4 || along > 170) continue
    const cross = Math.abs(vx * UPWIND.y - vy * UPWIND.x)
    const halfWidth = 22 + along * 0.28
    if (cross > halfWidth) continue
    const kind = p.kind === 'pine' ? 1 : 0.7
    fuel += kind * p.scale * (1 - along / 170) * (1 - cross / halfWidth)
  }

  let shield = 0
  for (const o of houses) {
    if (o === h) continue
    const vx = o.x - h.x
    const vy = o.y - h.y
    const along = vx * UPWIND.x + vy * UPWIND.y
    if (along < 8 || along > 70) continue
    const cross = Math.abs(vx * UPWIND.y - vy * UPWIND.x)
    if (cross < 18) shield += 0.12 * (1 - along / 70)
  }

  return { canyon, fuel, shield }
}

function assignRisk(houses: House[], plants: Plant[]) {
  const raw = houses.map((h) => exposureOf(h, houses, plants))
  const fuelScale = Math.max(1e-6, [...raw.map((r) => r.fuel)].sort((a, b) => a - b)[Math.floor(raw.length * 0.9)])
  houses.forEach((h, i) => {
    h.exposure = 0.6 * raw[i].canyon + 0.55 * Math.min(1.2, raw[i].fuel / fuelScale) - Math.min(0.3, raw[i].shield)
  })
  const order = houses.map((_, i) => i).sort((a, b) => houses[a].exposure - houses[b].exposure)
  order.forEach((idx, rank) => {
    const q = rank / order.length
    houses[idx].risk = q < 0.24 ? 0 : q < 0.54 ? 1 : q < 0.8 ? 2 : 3
  })
}

assignRisk(HOUSES, PLANTS)

/**
 * The two homes that carry the message. Exposed: the home hardest against the canyon rim,
 * red. Mitigated: an interior home whose neighbours run orange, green because of what was
 * done to it (roof, vents, defensible space), not where it sits.
 */
const EXPOSED = HOUSES.reduce((best, h, i) => (h.x > HOUSES[best].x ? i : best), 0)
const MITIGATED = (() => {
  // Left half of the neighborhood, away from the canyon, among homes that would otherwise
  // run orange or red; needs a clear vertical leader down to the bottom margin.
  const clear = ({ h, i }: { h: House; i: number }) => !HOUSES.some((o, j) => j !== i && Math.abs(o.x - h.x) < 15 && o.y > h.y)
  const left = HOUSES.map((h, i) => ({ h, i }))
    .filter(({ i }) => i !== EXPOSED)
    .filter(({ h }) => h.x < 340)
  const notable = left.filter(({ h }) => h.risk >= 2).filter(clear)
  const fallback = left.filter(clear)
  const pick = notable.sort((a, b) => b.h.x - a.h.x)[0] ?? fallback[0]
  return (pick ?? { i: 0 }).i
})()
HOUSES[EXPOSED].risk = 3
HOUSES[MITIGATED].risk = 0

const OUTER_PLANTS = PLANTS.filter((p) => !insideRegion(p.x, p.y, -6))
const INNER_PLANTS = PLANTS.filter((p) => insideRegion(p.x, p.y, -6))

/** Long, faint streaks that show the wind crossing the neighborhood (they flow when animated). */
const WIND_STREAKS = [30, 85, 140, 195, 250, 305, 360, 415].map((y0, i) => {
  const len = 380 + ((i * 7) % 3) * 80
  const x0 = CANYON_X + 40 - ((i * 5) % 4) * 30
  const dy = len * (WIND.y / WIND.x) * -1
  const bow = 10 + ((i * 3) % 3) * 8
  return { d: `M${x0} ${y0} q${-len * 0.5} ${dy * 0.5 - bow} ${-len} ${dy}`, dur: 3.2 + ((i * 11) % 5) * 0.45, delay: -((i * 13) % 7) * 0.6 }
})

/* ------------------------------------------------------------------ */
/*  Drawing                                                            */
/* ------------------------------------------------------------------ */
function housePath(s: number) {
  const h = s / 2
  return `M${-h * 0.8} ${-h * 0.05} L0 ${-h * 0.75} L${h * 0.8} ${-h * 0.05} V${h * 0.78} H${-h * 0.8} Z`
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-canyon`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8a6a4a" stopOpacity="0" />
        <stop offset="0.3" stopColor="#8a6a4a" stopOpacity="0.18" />
        <stop offset="1" stopColor="#6b4f36" stopOpacity="0.42" />
      </linearGradient>
      {/* Pine tree icon, origin at the base of the trunk */}
      <g id={`${id}-pine`}>
        <ellipse cx="1.5" cy="4" rx="7" ry="2.2" fill="#000" fillOpacity="0.12" />
        <rect x="-1.4" y="0" width="2.8" height="5" fill={TRUNK} />
        <path d="M0 -25 L6.5 -15 H3.8 L8.5 -7 H5 L10.5 1 H-10.5 L-5 -7 H-8.5 L-3.8 -15 H-6.5 Z" fill={TREE} />
        <path d="M0 -25 L-6.5 -15 H-3.8 L-8.5 -7 H-5 L-10.5 1 H0 Z" fill={TREE_DARK} fillOpacity="0.55" />
      </g>
      {/* Bush icon */}
      <g id={`${id}-bush`}>
        <ellipse cx="1" cy="3.5" rx="7" ry="1.6" fill="#000" fillOpacity="0.1" />
        <circle cx="-4" cy="0" r="4.2" fill={BUSH} />
        <circle cx="4" cy="0.5" r="3.8" fill={BUSH} />
        <circle cx="0" cy="-2.5" r="4.6" fill={BUSH_LIGHT} />
      </g>
    </defs>
  )
}

function Plants({ id, items, sway }: { id: string; items: Plant[]; sway: boolean }) {
  return (
    <g aria-hidden="true">
      {items.map((p, i) => (
        <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${p.scale.toFixed(2)})`}>
          <use
            href={`#${id}-${p.kind}`}
            className={sway ? 'plant' : undefined}
            style={sway ? ({ '--sd': `${(2.6 + ((i * 37) % 17) / 10).toFixed(1)}s`, '--sdd': `-${((i * 53) % 29) / 10}s` } as CSSProperties) : undefined}
          />
        </g>
      ))}
    </g>
  )
}

function Terrain({ id }: { id: string }) {
  const canyon = (o: number) =>
    `M${CANYON_X + o} 0 C${CANYON_X + o + 8} 80 ${CANYON_X + o - 10} 180 ${CANYON_X + o} 270 S${CANYON_X + o + 6} 400 ${CANYON_X + o - 6} ${VH}`
  return (
    <g aria-hidden="true">
      <rect x="0" y="0" width={VW} height={VH} fill="var(--color-surface)" />
      {/* Canyon: shaded drop-off with contour lines along the right edge */}
      <path d={`${canyon(0)} H${VW} V0 Z`} fill={`url(#${id}-canyon)`} />
      <g fill="none" strokeWidth="1">
        {[0, 9, 19, 30, 42, 55, 70].map((o, i) => (
          <path key={o} d={canyon(o)} stroke="var(--color-accent-strong)" strokeOpacity={0.5 - i * 0.055} />
        ))}
      </g>
    </g>
  )
}

function Roads() {
  return (
    <g aria-hidden="true" fill="none" strokeLinecap="round">
      {ROADS.map((r, i) => (
        <g key={i}>
          <path d={pathD(r.segs)} stroke="rgba(20,20,19,0.10)" strokeWidth="11" />
          <path d={pathD(r.segs)} stroke="rgba(250,249,245,0.9)" strokeWidth="0.8" strokeDasharray="4 5" />
        </g>
      ))}
      {CUL_DE_SACS.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r="12" fill="rgba(20,20,19,0.10)" />
      ))}
    </g>
  )
}

/** Compass-style wind indicator, anchored over the canyon so it reads as "wind out of the canyon". */
function WindIndicator({ scale }: { scale: number }) {
  const w = 84 * scale
  const h = 26 * scale
  const x = VW - 12 - w
  const y = 12
  const cx = x + 15 * scale
  const cy = y + h / 2
  const r = 8 * scale
  return (
    <g aria-hidden="true">
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="var(--color-bg)" fillOpacity="0.9" stroke="var(--color-line-strong)" />
      <g transform={`translate(${cx} ${cy}) rotate(${WIND_ANGLE_DEG})`} stroke="var(--color-accent)" strokeWidth={1.4 * scale} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={`M${-r} 0 H${r}`} />
        <path d={`M${r - 4 * scale} ${-4 * scale} L${r} 0 L${r - 4 * scale} ${4 * scale}`} />
      </g>
      <text x={cx + 14 * scale} y={cy + 3.6 * scale} fontSize={10 * scale} fontWeight="600" fill="var(--color-ink)">
        Wind
      </text>
    </g>
  )
}

export type ViewMode = 'regional' | 'sage'

/** Number of homes in each risk band, in legend order (lower, moderate, elevated, severe). */
export const RISK_COUNTS = HOUSES.reduce<[number, number, number, number]>(
  (acc, h) => {
    acc[h.risk] += 1
    return acc
  },
  [0, 0, 0, 0],
)
export const HOME_COUNT = HOUSES.length

type Props = {
  /** Live hero mode: wind, embers and sway run, and `mode` drives the house colours with a transition. */
  animate?: boolean
  /** Which view the animated scene shows. Ignored unless `animate` is set. */
  mode?: ViewMode
  /** 'grid' colours each home by its own risk; 'block' is the regional view: the same neighborhood with every home painted one shared colour. */
  variant?: 'grid' | 'block'
  /** Show the "Mitigated" / "Exposed" text callouts (too small to read in compact panels). */
  callouts?: boolean
  /** Override the viewBox (see MOBILE_VIEWBOX). */
  viewBox?: string
  /** Draw the faint wind streaks across the neighborhood (off for static exports, where they read as stray lines). */
  windStreaks?: boolean
  /** Multiplier for callout text and leader lines, so labels stay legible when the scene renders small. */
  labelScale?: number
  className?: string
  title?: string
}

/**
 * The signature Sage visual: a hillside neighborhood of winding streets and cul-de-sacs,
 * ringed by conifers and brush with a canyon along one side. The regional view paints every
 * home the same colour; the property-level view colours each home by its own risk.
 * Pure SVG + CSS.
 */
export function RiskGrid({ animate = false, mode = 'sage', variant = 'grid', callouts = true, viewBox = FULL_VIEWBOX, windStreaks = true, labelScale = 1, className = '', title }: Props) {
  const id = useId().replace(/:/g, '')
  const label =
    title ??
    (variant === 'block'
      ? 'Regional view: a neighborhood of winding streets surrounded by pine trees and brush, with a canyon along its right side. Every home is painted the same yellow, one shared hazard rating for the whole area.'
      : 'Property-level view: the same neighborhood with each house coloured by its own risk, from green (lower) through yellow and orange to red (severe). Homes nearest the canyon and dense trees trend red. An exposed home at the canyon edge is called out in red, and a mitigated home in the interior is called out in green despite its orange neighbours.')

  const delayFor = (h: House) => Math.max(0, ((CANYON_X - h.x) * -WIND.x + (h.y - 0) * -WIND.y) / 820).toFixed(3)

  const uniform = variant === 'block' && !animate
  const edge = HOUSES[EXPOSED]
  const inner = HOUSES[MITIGATED]
  // Keep the interior label inside a cropped (mobile) viewBox: anchor it to the right of the leader if centring would clip.
  const vbMinX = Number(viewBox.split(/\s+/)[0]) || 0
  const innerLabelClips = inner.x - 50 * labelScale < vbMinX + 6
  const innerLabelX = innerLabelClips ? Math.max(inner.x - 6, vbMinX + 8) : inner.x
  const innerLabelAnchor = innerLabelClips ? 'start' : 'middle'

  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" role="img" aria-label={label} className={`${animate ? `risk-grid mode-${mode}` : ''} ${className}`}>
      <Defs id={id} />
      <Terrain id={id} />
      {windStreaks && (
        <g className={animate ? 'wind-streaks' : ''} fill="none" stroke="var(--color-ink)" strokeOpacity={animate ? 0.28 : 0.12} strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
          {WIND_STREAKS.map((st, i) => (
            <path key={i} d={st.d} className={animate ? 'wind-streak' : undefined} style={animate ? ({ '--wd': `${st.dur}s`, '--wdd': `${st.delay}s` } as CSSProperties) : undefined} />
          ))}
        </g>
      )}
      <Plants id={id} items={OUTER_PLANTS} sway={animate} />
      <WindIndicator scale={labelScale} />

      <g>
        <Roads />

        {HOUSES.map((h, i) => {
          const d = delayFor(h)
          const colour = uniform ? RISK_VAR[1] : RISK_VAR[h.risk]
          const houseStyle: CSSProperties = animate ? ({ '--c': colour, '--d': `${d}s` } as CSSProperties) : { fill: colour }
          const flagged = !uniform && (i === MITIGATED || i === EXPOSED)
          return (
            <g key={i} transform={`translate(${h.x.toFixed(1)} ${h.y.toFixed(1)}) rotate(${h.angle.toFixed(1)})`}>
              <rect className="cell" x={-LOT / 2} y={-LOT / 2} width={LOT} height={LOT} rx="5" fill="var(--color-surface-strong)" />
              <path className={animate ? 'house' : ''} d={housePath(LOT)} style={houseStyle} />
              {flagged && (
                <rect
                  className={animate ? 'cell-highlight' : 'cell-highlight-static'}
                  x={-LOT / 2}
                  y={-LOT / 2}
                  width={LOT}
                  height={LOT}
                  rx="5"
                  style={{ '--d': `${i === EXPOSED ? 0 : 0.2}s` } as CSSProperties}
                />
              )}
            </g>
          )
        })}

          <Plants id={id} items={INNER_PLANTS} sway={animate} />

          {animate && (
            <>
              {[
                { y: 40, dist: 200, d: 0, t: 2.6 },
                { y: 95, dist: 280, d: 0.7, t: 3.4 },
                { y: 140, dist: 180, d: 1.4, t: 2.4 },
                { y: 185, dist: 260, d: 0.3, t: 3.1 },
                { y: 230, dist: 220, d: 1.9, t: 2.8 },
                { y: 275, dist: 300, d: 1.1, t: 3.6 },
                { y: 320, dist: 170, d: 0.5, t: 2.5 },
                { y: 365, dist: 240, d: 1.6, t: 3.0 },
                { y: 410, dist: 190, d: 0.9, t: 2.7 },
              ].map((e, i) => (
                <circle
                  key={i}
                  className="ember"
                  cx={CANYON_X + 4}
                  cy={e.y}
                  r="1.8"
                  fill="var(--color-risk-elevated)"
                  style={{ '--dx': `${(WIND.x * e.dist).toFixed(1)}px`, '--dy': `${(WIND.y * e.dist).toFixed(1)}px`, '--d': `${e.d}s`, '--t': `${e.t}s` } as CSSProperties}
                />
              ))}
            </>
          )}

          {callouts && !uniform && (
            <g className={animate ? 'callout' : ''} fill="var(--color-ink)" fontSize={10.5 * labelScale} fontWeight="600" style={{ paintOrder: 'stroke' }}>
              <g stroke="var(--color-ink)" strokeOpacity="0.6" strokeWidth={1 * labelScale} fill="none">
                <path d={`M${(edge.x + LOT / 2 + 3).toFixed(1)} ${edge.y.toFixed(1)} H${CANYON_X - 4}`} />
                <path d={`M${inner.x.toFixed(1)} ${(inner.y + LOT / 2 + 2).toFixed(1)} V${VH - 30}`} />
              </g>
              <text x={CANYON_X} y={edge.y + 3.5 * labelScale} stroke="var(--color-bg)" strokeWidth={3 * labelScale}>
                Exposed
              </text>
              <text x={innerLabelX} y={VH - 18} textAnchor={innerLabelAnchor} stroke="var(--color-bg)" strokeWidth={3 * labelScale}>
                Mitigated
              </text>
            </g>
          )}
      </g>
    </svg>
  )
}

export function RiskLegend({ className = '', counts }: { className?: string; counts?: readonly number[] }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted ${className}`} aria-label="Risk colour key">
      {riskLegend.map((r, i) => (
        <li key={r.key} className="flex items-center gap-2">
          <span className="risk-swatch" style={{ background: r.color }} aria-hidden="true" />
          <span>{r.label}</span>
          {counts && (
            <span className="font-serif tabular-nums text-ink" aria-label={`${counts[i]} homes`}>
              {counts[i]}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
