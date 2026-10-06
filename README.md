# sage-contour.github.io

Public marketing site for **Sage**: physics-informed AI for home insurance.

> Sage is building physics-informed AI for home insurance. We model how individual homes respond to wildfire and other hazards, helping insurance partners identify risks traditional models may misprice.

**Live site:** https://sage-contour.github.io/

It's a static site (home page plus case-study pages) built with **Vite + React + TypeScript + Tailwind CSS**. GitHub Pages deploys it on every push to `main`.

## Local development

Requires Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks, then outputs the static site to dist/
npm run preview   # serves dist/ locally
```

| Script              | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `npm run typecheck` | TypeScript project check                                       |
| `npm run og`        | Regenerate `public/og.png` and PNG icons from SVG (uses resvg) |

## Project structure

```text
index.html         Home page entry
case-studies/rancho-bernardo/index.html
                   Case-study page entry (registered in vite.config.ts `pages`)
src/
  components/      Header, Hero, RiskComparison, RiskGrid (signature visual),
                   ProblemSection, HowItWorks, LearningLoop, CfdSimulation,
                   CaseStudyTeaser, MgaModel, MarketFocus, ClosingCTA,
                   ContactForm, Footer, Section, Topography, Wordmark
  pages/           CaseStudyPage (Rancho Bernardo)
  data/content.ts  All site copy in one place (edit wording here)
  hooks/           useReveal, useMediaQuery
  lib/links.ts     Base-aware links, so nav anchors work from subpages
  styles/          Tailwind theme tokens, animations, reduced-motion rules
public/            favicon.svg, og.png, PNG icons, robots.txt (and optional CNAME)
public/media/      Case-study film and poster
scripts/           build-og.mjs: social image generator
.github/workflows/ deploy.yml: GitHub Pages deployment
```

### Editing copy

Every heading, paragraph, card and label lives in `src/data/content.ts`. The insurance
positioning is deliberate: Sage is a planned MGA, and carrier partners issue policies and bear the risk.
Check any wording change against those rules before you publish it.

- `CONTACT_EMAIL` sets the address behind every **Request an Intro** button.
- `FORM_ENDPOINT` sets where the contact form posts. It uses [formsubmit.co](https://formsubmit.co), so it works on static hosting.
  The first submission sends an activation email to the target address. The form stays inactive until someone confirms that email.

### Case-study media

`public/media/rancho-bernardo.mp4` and `rancho-bernardo-poster.jpg` come from the
orchestrator's ivory-theme render (`orchestrator/tools/case-study/rancho-bernardo-10s-ivory.sh`),
which uses this site's palette, fonts and wordmark. The MP4 is the 1920×1080 H.264 `web.mp4`
from that render. The poster is the 4K `poster.jpg` scaled to 1920 px.

The risk map (`src/components/RiskMap.tsx`) draws `src/data/rancho-bernardo-risk.json`, written by
`orchestrator/tools/risk/web_map.py` from the fire ensemble in `tools/risk/ensemble.py`. The JSON loads
as its own chunk. `public/media/rancho-bernardo-risk-map.jpg` is a static capture of the map, used on the
home-page teaser.

To add another page, create `<path>/index.html`, register it in `pages` in `vite.config.ts`
(and in `socialImages` if it has its own share image), then add a mount file in `src/`.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds the site and deploys it with the official Pages actions
(`configure-pages`, `upload-pages-artifact`, `deploy-pages`).

**One-time setup**

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main`, or run the workflow manually from the **Actions** tab.

**Base path**

Vite's `base` comes from the `BASE_PATH` environment variable (default `/`). The workflow sets it
from the Pages configuration. This repo is named `sage-contour.github.io`, so it's an
organization site served at the root and the base is `/`. The same holds with a custom domain.
Under a different repository name the base becomes `/REPOSITORY/` automatically.

The workflow also passes `SITE_URL`, which is used to emit absolute `og:image`, `og:url`
and canonical URLs for social previews.

**Custom domain (optional)**

1. Add `public/CNAME` containing the domain (e.g. `www.example.com`).
2. Set the same domain under **Settings → Pages** and enable **Enforce HTTPS**.
3. Point DNS at GitHub Pages (a `CNAME` record to `sage-contour.github.io` for a subdomain).

## Design

Warm ivory surfaces, near-black slate text and a clay accent, with a serif display face
(`Source Serif 4`) over a sans body (`Inter`). Both fonts are self-hosted through Fontsource. All colour and font
tokens live in `src/styles/index.css` under `@theme`.

- Palette: ivory `#FAF9F5` / `#F0EEE6` / `#E8E6DC`, slate `#141413` / `#5E5D59`, clay `#D97757`.
- Risk colours: green `#5F9F73`, yellow `#E1B24A`, clay `#D97757`, red `#B7402E`.

## Accessibility and motion

- Semantic landmarks, a skip link, a keyboard-navigable menu and visible focus states.
- Risk colours always come with text labels and a legend.
- Under `prefers-reduced-motion: reduce`, all animation is off and the final property-level state is shown instead.

## License

© Sage. All rights reserved.
