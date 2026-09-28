export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="shrink-0">
        <rect x="1" y="1" width="10" height="10" rx="2.5" fill="var(--color-risk-low)" />
        <rect x="13" y="1" width="10" height="10" rx="2.5" fill="var(--color-risk-moderate)" />
        <rect x="1" y="13" width="10" height="10" rx="2.5" fill="var(--color-risk-elevated)" />
        <rect x="13" y="13" width="10" height="10" rx="2.5" fill="var(--color-risk-severe)" />
      </svg>
      <span className="font-serif text-[1.35rem] font-medium tracking-tight text-ink">Sage</span>
    </span>
  )
}
