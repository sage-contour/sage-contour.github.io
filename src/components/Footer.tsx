import { footer, nav } from '../data/content'
import { Wordmark } from './Wordmark'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-line bg-bg py-12">
      <div className="container-x">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark />
          <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-2">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-muted hover:text-ink">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-faint">{footer.disclaimer}</p>
        <p className="mt-4 text-sm text-faint">© {year} Sage. All rights reserved.</p>
      </div>
    </footer>
  )
}
