import { fileURLToPath } from 'node:url'
import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Base path for GitHub Pages.
 *
 * - Project site  (https://USERNAME.github.io/REPOSITORY/)  → BASE_PATH="/REPOSITORY/"
 * - User/org site (https://USERNAME.github.io/)             → BASE_PATH="/"
 * - Custom domain (CNAME configured in Pages settings)      → BASE_PATH="/"
 *
 * The GitHub Actions workflow sets BASE_PATH and SITE_URL automatically from
 * the repository's Pages configuration. Locally they default to "/" and unset.
 */
const base = process.env.BASE_PATH ?? '/'
const siteUrl = process.env.SITE_URL

/** Pages (relative to the base) and the social image each one uses; others use og.png. */
const pages = {
  '': 'index.html',
  'case-studies/rancho-bernardo/': 'case-studies/rancho-bernardo/index.html',
}
const socialImages: Record<string, string> = {
  'case-studies/rancho-bernardo/': 'media/rancho-bernardo-poster.jpg',
}

/**
 * Injects absolute social/canonical URLs when SITE_URL is known. Social crawlers
 * require absolute og:image URLs; without SITE_URL we fall back to a base-relative path.
 */
function seoUrls(): Plugin {
  return {
    name: 'sage:seo-urls',
    transformIndexHtml(_html, ctx) {
      // ctx.path is the page's path within the project, e.g. /case-studies/rancho-bernardo/index.html
      const page = ctx.path.replace(/^\//, '').replace(/index\.html$/, '')
      const imageFile = socialImages[page] ?? 'og.png'
      const origin = siteUrl ? siteUrl.replace(/\/?$/, '/') : undefined
      const image = origin ? `${origin}${imageFile}` : `${base}${imageFile}`
      const tags: HtmlTagDescriptor[] = [
        { tag: 'meta', attrs: { property: 'og:image', content: image }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:image', content: image }, injectTo: 'head' },
      ]
      if (origin) {
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: origin + page }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: origin + page }, injectTo: 'head' },
        )
      }
      return tags
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), seoUrls()],
  build: {
    target: 'es2020',
    sourcemap: false,
    cssMinify: true,
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries(pages).map(([page, file]) => [page.split('/').at(-2) ?? 'home', fileURLToPath(new URL(file, import.meta.url))]),
      ),
    },
  },
})
