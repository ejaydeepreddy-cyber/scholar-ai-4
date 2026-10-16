export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M2 12h4l3-7 4 14 3-7h6" />
        </svg>
      </div>
      <span className="font-display text-xl font-extrabold tracking-tight">Scholar Pulse</span>
    </div>
  )
}
