import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Check, Flame, Quote, RefreshCw, Target, Timer } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { badges, motivation, student, todaysTasks, weeklyTasks } from '@/lib/fixtures'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/app/')({
  component: PulseBoard,
})

function PulseBoard() {
  const [tasks, setTasks] = useState(todaysTasks)
  const weekPlanned = weeklyTasks.reduce((s, d) => s + d.planned, 0)
  const weekDone = weeklyTasks.reduce((s, d) => s + d.done, 0)
  const todayDone = tasks.filter((t) => t.done).length
  const accuracy = Math.round(((weekDone + todayDone) / (weekPlanned + tasks.length)) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Pulse Board</h1>
        <p className="mt-1 text-muted-foreground">Your week at a glance: keep the pulse steady.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Flame} label="Study streak" value={`${student.streakDays} days`} tone="bg-chart-3/15 text-chart-3" />
        <Stat icon={Timer} label="Focus today" value={`${Math.floor(student.focusMinutesToday / 60)}h ${student.focusMinutesToday % 60}m`} tone="bg-primary/10 text-primary" />
        <Stat icon={Target} label="Tasks done today" value={`${todayDone} / ${tasks.length}`} tone="bg-chart-2/15 text-chart-2" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-3xl border bg-card p-6">
          <h2 className="text-lg font-bold">Task Accuracy Meter</h2>
          <p className="text-sm text-muted-foreground">How many of your planned tasks you finish</p>
          <AccuracyGauge value={accuracy} />
          <p className="text-center text-sm text-muted-foreground">
            {weekDone + todayDone} of {weekPlanned + tasks.length} tasks completed this week
          </p>
        </section>

        <section className="rounded-3xl border bg-card p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold">This week</h2>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-secondary" /> Planned</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-primary" /> Completed</span>
            </div>
          </div>
          <WeekBars />
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Today's tasks</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/timetable">
                Plan with Gemini <ArrowRight />
              </Link>
            </Button>
          </div>
          <ul className="mt-4 space-y-2">
            {tasks.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setTasks((prev) => prev.map((p) => (p.id === t.id ? { ...p, done: !p.done } : p)))}
                  className="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-muted motion-reduce:transition-none"
                  aria-pressed={t.done}
                >
                  <span className={cn('grid size-6 shrink-0 place-items-center rounded-full border-2', t.done ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>
                    {t.done && <Check className="size-3.5" />}
                  </span>
                  <span className={cn('text-sm font-medium', t.done && 'text-muted-foreground line-through')}>{t.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <MotivationCenter />
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Flame; label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-5">
      <div className={cn('grid size-12 place-items-center rounded-2xl', tone)}>
        <Icon className="size-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

function AccuracyGauge({ value }: { value: number }) {
  // Semi-circle gauge: arc length = π·r
  const r = 80
  const arc = Math.PI * r
  const label = value >= 85 ? 'On fire' : value >= 65 ? 'Steady' : 'Needs a push'
  return (
    <div className="relative mx-auto mt-4 w-full max-w-[260px]">
      <svg viewBox="0 0 200 115" className="w-full" role="img" aria-label={`Task accuracy ${value}%`}>
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--secondary)" strokeWidth="18" strokeLinecap="round" />
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={arc}
          strokeDashoffset={arc * (1 - value / 100)}
          className="transition-[stroke-dashoffset] duration-700 motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-1 text-center">
        <p className="font-display text-5xl font-extrabold">{value}%</p>
        <p className="text-sm font-semibold text-primary">{label}</p>
      </div>
    </div>
  )
}

function WeekBars() {
  const max = Math.max(...weeklyTasks.map((d) => d.planned))
  return (
    <div className="mt-6 flex h-52 items-end justify-between gap-3">
      {weeklyTasks.map((d) => (
        <div key={d.day} className="flex flex-1 flex-col items-center gap-2" title={`${d.day}: ${d.done} of ${d.planned} done`}>
          <div className="relative flex h-40 w-full max-w-10 items-end">
            <div className="absolute inset-x-0 bottom-0 rounded-t-lg bg-secondary" style={{ height: `${(d.planned / max) * 100}%` }} />
            <div className="relative w-full rounded-t-lg bg-primary" style={{ height: `${(d.done / max) * 100}%` }} />
          </div>
          <span className="text-xs font-medium text-muted-foreground">{d.day}</span>
        </div>
      ))}
    </div>
  )
}

function MotivationCenter() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % motivation.length), 9000)
    return () => clearInterval(id)
  }, [])
  const m = motivation[i]
  return (
    <section className="ink-panel flex flex-col rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Motivation Center</h2>
        <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/10 hover:text-white" aria-label="Next quote" onClick={() => setI((n) => (n + 1) % motivation.length)}>
          <RefreshCw />
        </Button>
      </div>
      <Quote className="mt-4 size-7 text-accent" />
      <p className="mt-2 font-display text-xl font-semibold leading-snug">{m.quote}</p>
      <p className="mt-2 text-sm text-white/60">— {m.author}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        {badges.map((b) => (
          <span key={b.label} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            {b.emoji} {b.label}
          </span>
        ))}
      </div>
    </section>
  )
}
