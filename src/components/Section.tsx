import type { ReactNode } from 'react'

type SectionProps = {
  id?: string
  children: ReactNode
  className?: string
  tone?: 'default' | 'surface'
  rule?: boolean
}

export function Section({ id, children, className = '', tone = 'default', rule = true }: SectionProps) {
  const bg = tone === 'surface' ? 'bg-surface' : ''
  return (
    <section id={id} className={`relative py-20 sm:py-28 ${rule ? 'border-t border-line' : ''} ${bg} ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  )
}

type HeadingProps = {
  eyebrow?: string
  title: string
  copy?: string
  className?: string
  size?: 'md' | 'lg'
}

export function SectionHeading({ eyebrow, title, copy, className = '', size = 'md' }: HeadingProps) {
  const h = size === 'lg' ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl lg:text-[2.75rem]'
  return (
    <div className={`reveal ${className}`}>
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <h2 className={`${h} leading-[1.08]`}>{title}</h2>
      {copy && <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{copy}</p>}
    </div>
  )
}

/** Two-column editorial layout: heading on the left, content on the right. */
export function Split({ left, right, className = '' }: { left: ReactNode; right: ReactNode; className?: string }) {
  return (
    <div className={`grid gap-10 lg:grid-cols-12 lg:gap-8 ${className}`}>
      <div className="lg:col-span-5">{left}</div>
      <div className="lg:col-span-7">{right}</div>
    </div>
  )
}
