import { cn } from '@/lib/utils'

// Pill-style single choice used for difficulty, importance and level pickers.
export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: ReadonlyArray<T>
}) {
  return (
    <div className="space-y-2" role="radiogroup" aria-label={label}>
      <p className="text-sm font-medium">{label}</p>
      <div className="flex rounded-xl bg-muted p-1">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={value === o}
            onClick={() => onChange(o)}
            className={cn(
              'flex-1 rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors motion-reduce:transition-none',
              value === o ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}
