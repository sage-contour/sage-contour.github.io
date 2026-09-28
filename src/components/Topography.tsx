/** Subtle contour-line backdrop. Decorative only. */
export function Topography({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="var(--color-ink)" strokeWidth="1" strokeOpacity="0.07">
        <path d="M-50 620c120-80 220-60 340-120s180-160 320-150 240 110 380 60 200-120 260-100" />
        <path d="M-50 560c130-70 230-50 350-110s190-150 330-140 230 100 370 50 210-110 250-90" />
        <path d="M-50 500c140-60 240-40 360-100s200-140 340-130 220 90 360 40 220-100 240-80" />
        <path d="M-50 440c150-50 250-30 370-90s210-130 350-120 210 80 350 30 230-90 230-70" />
        <path d="M-50 380c160-40 260-20 380-80s220-120 360-110 200 70 340 20 240-80 220-60" />
        <path d="M-50 320c170-30 270-10 390-70s230-110 370-100 190 60 330 10 250-70 210-50" />
        <path d="M-50 260c180-20 280 0 400-60s240-100 380-90 180 50 320 0 260-60 200-40" />
        <path d="M-50 200c190-10 290 10 410-50s250-90 390-80 170 40 310-10 270-50 190-30" />
      </g>
    </svg>
  )
}
