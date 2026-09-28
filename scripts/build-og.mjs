/**
 * Generates the social image and PNG icons from SVG using resvg.
 * Run: npm run og
 *
 * The neighborhood scene is rendered from the real React component (via Vite SSR)
 * so the social image always matches the site.
 *
 * Outputs (committed to public/):
 *   public/og.png               1200×630 Open Graph image
 *   public/favicon-32.png       32×32
 *   public/apple-touch-icon.png 180×180
 */
import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createServer } from 'vite'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const pub = join(root, 'public')

const COLORS = {
  '--color-bg': '#FAF9F5',
  '--color-surface': '#F0EEE6',
  '--color-surface-strong': '#E8E6DC',
  '--color-ink': '#141413',
  '--color-ink-soft': '#3D3D3A',
  '--color-muted': '#5E5D59',
  '--color-faint': '#87867F',
  '--color-accent': '#D97757',
  '--color-accent-strong': '#B85C3D',
  '--color-accent-soft': '#F3DCCF',
  '--color-line': '#DEDBD2',
  '--color-line-strong': '#C9C6BB',
  '--color-risk-low': '#5F9F73',
  '--color-risk-moderate': '#E1B24A',
  '--color-risk-elevated': '#D97757',
  '--color-risk-severe': '#B7402E',
}

/** Render <RiskGrid> to static SVG markup with CSS variables resolved to hex. */
async function renderScene(props) {
  const vite = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
    optimizeDeps: { noDiscovery: true, include: [] },
  })
  try {
    const { RiskGrid } = await vite.ssrLoadModule('/src/components/RiskGrid.tsx')
    let svg = renderToStaticMarkup(createElement(RiskGrid, props))
    for (const [k, v] of Object.entries(COLORS)) svg = svg.replaceAll(`var(${k})`, v)
    // static variant sets a CSS transform on lots; resvg does not apply CSS transforms, so drop them
    svg = svg.replaceAll(/transform-box:fill-box;transform-origin:center;transform:scale\(0\.9\)/g, '')
    // the dashed outline around the two called-out homes is styled in CSS; inline it for resvg
    svg = svg.replaceAll('class="cell-highlight-static"', `fill="none" stroke="${COLORS['--color-ink']}" stroke-opacity="0.6" stroke-width="1.4" stroke-dasharray="3 2"`)
    // strip the <svg> wrapper so the scene can be nested
    return svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
  } finally {
    await vite.close()
  }
}

const W = 1200
const H = 630
const F = 'Inter, Helvetica, Arial, sans-serif'
const FS = 'Source Serif 4, Georgia, serif'

const scene = await renderScene({ variant: 'grid', callouts: true, labelScale: 1.35 })

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${COLORS['--color-bg']}"/>
  <!-- Neighborhood scene fills the right two thirds -->
  <svg x="400" y="0" width="800" height="${H}" viewBox="0 0 800 460" preserveAspectRatio="xMaxYMid slice">
    ${scene}
  </svg>
  <!-- Fade into the text panel -->
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${COLORS['--color-bg']}" stop-opacity="1"/>
      <stop offset="0.55" stop-color="${COLORS['--color-bg']}" stop-opacity="1"/>
      <stop offset="1" stop-color="${COLORS['--color-bg']}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="560" height="${H}" fill="url(#fade)"/>

  <g transform="translate(72 96)">
    <rect x="0" y="0" width="18" height="18" rx="4.5" fill="${COLORS['--color-risk-low']}"/>
    <rect x="22" y="0" width="18" height="18" rx="4.5" fill="${COLORS['--color-risk-moderate']}"/>
    <rect x="0" y="22" width="18" height="18" rx="4.5" fill="${COLORS['--color-risk-elevated']}"/>
    <rect x="22" y="22" width="18" height="18" rx="4.5" fill="${COLORS['--color-risk-severe']}"/>
    <text x="54" y="31" font-family="${FS}" font-size="36" font-weight="500" fill="${COLORS['--color-ink']}">Sage</text>
  </g>
  <text x="72" y="228" font-family="${FS}" font-size="50" font-weight="450" fill="${COLORS['--color-ink']}">Physics-Informed AI</text>
  <text x="72" y="288" font-family="${FS}" font-size="50" font-weight="450" fill="${COLORS['--color-ink']}">for Home Insurance</text>
  <text x="72" y="346" font-family="${F}" font-size="20" fill="${COLORS['--color-muted']}">Regional models see the neighborhood.</text>
  <text x="72" y="376" font-family="${F}" font-size="20" font-weight="600" fill="${COLORS['--color-accent-strong']}">Sage understands the home.</text>

  <g font-family="${F}" font-size="15" fill="${COLORS['--color-muted']}" transform="translate(72 520)">
    <rect x="0" y="-11" width="12" height="12" rx="3" fill="${COLORS['--color-risk-low']}"/><text x="18" y="0">Lower</text>
    <rect x="86" y="-11" width="12" height="12" rx="3" fill="${COLORS['--color-risk-moderate']}"/><text x="104" y="0">Moderate</text>
    <rect x="200" y="-11" width="12" height="12" rx="3" fill="${COLORS['--color-risk-elevated']}"/><text x="218" y="0">Elevated</text>
    <rect x="304" y="-11" width="12" height="12" rx="3" fill="${COLORS['--color-risk-severe']}"/><text x="322" y="0">Severe</text>
  </g>
</svg>`

const fontFiles = [
  join(root, 'node_modules', '@fontsource-variable', 'inter', 'files', 'inter-latin-wght-normal.woff2'),
  join(root, 'node_modules', '@fontsource-variable', 'source-serif-4', 'files', 'source-serif-4-latin-wght-normal.woff2'),
]

function render(svgText, width, out) {
  const r = new Resvg(svgText, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles, loadSystemFonts: true, defaultFontFamily: 'Inter' },
  })
  writeFileSync(join(pub, out), r.render().asPng())
  console.log('wrote public/' + out)
}

render(svg, W, 'og.png')
const favicon = readFileSync(join(pub, 'favicon.svg'), 'utf8')
render(favicon, 32, 'favicon-32.png')
render(favicon, 180, 'apple-touch-icon.png')
