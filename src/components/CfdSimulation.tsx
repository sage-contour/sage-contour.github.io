/**
 * CFD-style illustration: wind streamlines around a single gabled home, coloured by
 * speed. Streamlines compress and heat up over the roof ridge, stagnate against the
 * windward wall, and slow into a recirculating wake downwind. Decorative only.
 *
 * Rendered as an SVG <g> so it can sit inside another drawing (the flywheel centre).
 */

/** Cool-to-hot colour scale, roughly a muted "jet": slow blue → green → yellow → orange → red. */
export const CFD_SCALE = ['#6f93bf', '#5f9f73', '#e1b24a', '#d97757', '#b7402e']

function hexToRgb(h: string) {
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
}
function rgbToHex(c: number[]) {
  return '#' + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')
}
/** Sample the scale at t ∈ [0, 1]. */
export function speedColour(t: number) {
  const x = Math.max(0, Math.min(1, t)) * (CFD_SCALE.length - 1)
  const i = Math.min(Math.floor(x), CFD_SCALE.length - 2)
  const f = x - i
  const a = hexToRgb(CFD_SCALE[i])
  const b = hexToRgb(CFD_SCALE[i + 1])
  return rgbToHex(a.map((v, k) => v + (b[k] - v) * f))
}

export const CFD_GRADIENT_CSS = `linear-gradient(90deg, ${CFD_SCALE.join(', ')})`

type Props = { cx: number; cy: number; r: number; id?: string }

/**
 * Local scene coordinates are laid out around (cx, cy). The home sits slightly below
 * centre so there is sky above the ridge for the accelerating flow.
 */
export function CfdField({ cx, cy, r, id = 'cfd' }: Props) {
  const x0 = cx - r - 4
  const x1 = cx + r + 4
  const ground = cy + 70
  const peak = { x: cx, y: cy - 8 }
  const eave = 36 // half-width of the roof
  const wallHalf = 28
  const wallTop = ground - 42
  const roofY = (x: number) => (Math.abs(x - cx) <= eave ? peak.y + (Math.abs(x - cx) / eave) * (wallTop - 4 - peak.y) : Infinity)

  // Streamlines: upstream height, height at the ridge, and peak speed (0 slow – 1 fast).
  // Lines that start below the ridge must lift over it and are compressed the most.
  const lines = [
    { y0: peak.y - 78, yp: peak.y - 80, s: 0.3 },
    { y0: peak.y - 61, yp: peak.y - 65, s: 0.38 },
    { y0: peak.y - 44, yp: peak.y - 50, s: 0.5 },
    { y0: peak.y - 26, yp: peak.y - 35, s: 0.68 },
    { y0: peak.y - 10, yp: peak.y - 23, s: 0.84 },
    { y0: peak.y + 6, yp: peak.y - 19, s: 1.0 },
    { y0: peak.y + 24, yp: peak.y - 15.5, s: 0.92 },
    { y0: peak.y + 42, yp: peak.y - 12.5, s: 0.78 },
    { y0: peak.y + 60, yp: peak.y - 10, s: 0.6 },
  ]

  const paths = lines.map((l) => {
    const lift = l.y0 - l.yp
    const wu = 48 + lift * 0.35
    const wd = 78 + lift * 0.55
    const pts: string[] = []
    for (let x = x0; x <= x1; x += 3) {
      const d = x - cx
      const f = Math.exp(-((d / (d < 0 ? wu : wd)) ** 2))
      let y = l.y0 - lift * f
      const ry = roofY(x)
      if (y > ry - 6) y = ry - 6
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    }
    return pts.join(' ')
  })

  const below = (l: (typeof lines)[number]) => l.y0 > peak.y
  const mesh: number[] = []
  for (let v = -r; v <= r; v += 12) mesh.push(v)
  const fine: number[] = []
  for (let v = 0; v <= 96; v += 6) fine.push(v)

  return (
    <g className="cfd" clipPath={`url(#${id}-clip)`}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <radialGradient id={`${id}-hot`}>
          <stop offset="0" stopColor={CFD_SCALE[4]} stopOpacity="0.5" />
          <stop offset="0.55" stopColor={CFD_SCALE[3]} stopOpacity="0.25" />
          <stop offset="1" stopColor={CFD_SCALE[2]} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-cold`}>
          <stop offset="0" stopColor={CFD_SCALE[0]} stopOpacity="0.32" />
          <stop offset="1" stopColor={CFD_SCALE[0]} stopOpacity="0" />
        </radialGradient>
        {lines.map((l, i) => {
          const base = speedColour(0.36)
          const stops = below(l)
            ? [
                [0, base],
                [0.3, speedColour(0.12)], // stagnation ahead of the windward wall
                [0.5, speedColour(l.s)],
                [0.72, speedColour(0.3)],
                [1, speedColour(0.08)], // wake
              ]
            : [
                [0, base],
                [0.5, speedColour(l.s)],
                [1, base],
              ]
          return (
            <linearGradient key={i} id={`${id}-g${i}`} gradientUnits="userSpaceOnUse" x1={x0} x2={x1} y1="0" y2="0">
              {stops.map(([o, c], k) => (
                <stop key={k} offset={o} stopColor={c as string} />
              ))}
            </linearGradient>
          )
        })}
      </defs>

      {/* domain */}
      <circle cx={cx} cy={cy} r={r} fill="var(--color-surface)" />

      {/* computational mesh: coarse everywhere, refined around the structure */}
      <g stroke="var(--color-ink)" strokeOpacity="0.07" strokeWidth="0.6">
        {mesh.map((v) => (
          <line key={`h${v}`} x1={cx - r} x2={cx + r} y1={cy + v} y2={cy + v} />
        ))}
        {mesh.map((v) => (
          <line key={`v${v}`} x1={cx + v} x2={cx + v} y1={cy - r} y2={cy + r} />
        ))}
      </g>
      <g stroke="var(--color-ink)" strokeOpacity="0.06" strokeWidth="0.5">
        {fine.map((v) => (
          <line key={`fh${v}`} x1={cx - 48} x2={cx + 48} y1={ground - 96 + v} y2={ground - 96 + v} />
        ))}
        {fine.map((v) => (
          <line key={`fv${v}`} x1={cx - 48 + v} x2={cx - 48 + v} y1={ground - 96} y2={ground} />
        ))}
      </g>

      {/* speed field: acceleration over the ridge, stagnation upwind, slow wake downwind */}
      <ellipse cx={cx + 4} cy={peak.y - 16} rx="46" ry="17" fill={`url(#${id}-hot)`} />
      <ellipse cx={cx - wallHalf - 10} cy={ground - 22} rx="13" ry="18" fill={`url(#${id}-cold)`} />
      <ellipse cx={cx + wallHalf + 36} cy={ground - 20} rx="40" ry="24" fill={`url(#${id}-cold)`} />

      {/* streamlines */}
      <g fill="none" strokeWidth="1.5" strokeLinecap="round">
        {paths.map((d, i) => (
          <polyline key={i} points={d} stroke={`url(#${id}-g${i})`} />
        ))}
        {/* tracer particles sliding along each streamline; faster lines cycle quicker */}
        {paths.map((d, i) => (
          <polyline
            key={`t${i}`}
            className="cfd-stream"
            points={d}
            stroke="var(--color-bg)"
            strokeOpacity="0.75"
            style={{ ['--wd' as string]: `${(3.2 - lines[i].s * 1.6).toFixed(2)}s`, ['--wdd' as string]: `${(-i * 0.53).toFixed(2)}s` }}
          />
        ))}
      </g>

      {/* recirculating wake eddy */}
      <g fill="none" stroke={CFD_SCALE[0]} strokeOpacity="0.85" strokeWidth="1.2">
        <ellipse className="cfd-eddy" cx={cx + wallHalf + 24} cy={ground - 17} rx="19" ry="11" />
        <ellipse className="cfd-eddy" cx={cx + wallHalf + 24} cy={ground - 17} rx="9" ry="5" style={{ ['--wd' as string]: '2.2s' }} />
      </g>

      {/* ground */}
      <line x1={cx - r} x2={cx + r} y1={ground} y2={ground} stroke="var(--color-ink)" strokeWidth="1" />
      <rect x={cx - r} y={ground} width={2 * r} height={r} fill="var(--color-surface-strong)" />

      {/* the home */}
      <g stroke="var(--color-ink)" strokeWidth="1.2" strokeLinejoin="round">
        <rect x={cx - wallHalf} y={wallTop} width={wallHalf * 2} height={ground - wallTop} fill="var(--color-surface-strong)" />
        <path d={`M${cx - eave} ${wallTop - 4}L${peak.x} ${peak.y}L${cx + eave} ${wallTop - 4}Z`} fill="var(--color-bg)" />
        <rect x={cx + 12} y={peak.y + 1} width="7" height="14" fill="var(--color-bg)" />
      </g>
      {/* attic vent: an opening the flow can carry embers through */}
      <rect x={cx - 3} y={peak.y + 12} width="6" height="4" fill="var(--color-accent)" />
    </g>
  )
}
