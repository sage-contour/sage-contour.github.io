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

/**
 * Injects absolute social/canonical URLs when SITE_URL is known. Social crawlers
 * require absolute og:image URLs; without SITE_URL we fall back to a base-relative path.
 */
function seoUrls(): Plugin {
  return {
    name: 'sage:seo-urls',
    transformIndexHtml() {
      const origin = siteUrl ? siteUrl.replace(/\/?$/, '/') : undefined
      const image = origin ? `${origin}og.png` : `${base}og.png`
      const tags: HtmlTagDescriptor[] = [
        { tag: 'meta', attrs: { property: 'og:image', content: image }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:image', content: image }, injectTo: 'head' },
      ]
      if (origin) {
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: origin }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: origin }, injectTo: 'head' },
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
  },
})
