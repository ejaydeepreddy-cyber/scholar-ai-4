import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Flame, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { habits as initialHabits } from '@/lib/fixtures'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/app/habits')({
  component: Habits,
})

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const today = 6

function Habits() {
  const [habits, setHabits] = useState(initialHabits)
  const [name, setName] = useState('')

  function toggle(id: string, day: number) {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const week = h.week.map((v, i) => (i === day ? (v ? 0 : 1) : v))
        const streak = day === today ? h.streak + (week[day] ? 1 : -1) : h.streak
        return { ...h, week, streak: Math.max(0, streak) }
      }),
    )
  }

  const doneToday = habits.filter((h) => h.week[today]).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Habit Streaks</h1>
          <p className="mt-1 text-muted-foreground">Small rituals, repeated daily. Don't break the chain.</p>
        </div>
        <div className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
          {doneToday} / {habits.length} habits done today
        </div>
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) return
          setHabits((prev) => [...prev, { id: crypto.randomUUID(), name: name.trim(), emoji: '✨', streak: 0, week: [0, 0, 0, 0, 0, 0, 0] }])
          setName('')
        }}
      >
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add a new habit, e.g. Meditate 10 minutes" className="h-11" aria-label="New habit" />
        <Button type="submit" className="h-11"><Plus /> Add</Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {habits.map((h) => (
          <div key={h.id} className="rounded-3xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-xl">{h.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold">{h.name}</p>
                <p className="text-xs text-muted-foreground">Tap a day to mark it</p>
              </div>
              <div className={cn('flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold', h.streak >= 7 ? 'bg-chart-3/15 text-chart-3' : 'bg-muted text-muted-foreground')}>
                <Flame className="size-4" /> {h.streak}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {h.week.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(h.id, i)}
                  aria-label={`${h.name}, day ${i + 1}${v ? ', done' : ''}`}
                  aria-pressed={!!v}
                  className={cn(
                    'flex aspect-square flex-col items-center justify-center rounded-xl text-xs font-semibold transition-colors motion-reduce:transition-none',
                    v ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-secondary',
                    i === today && 'ring-2 ring-primary/40 ring-offset-2 ring-offset-card',
                  )}
                >
                  {days[i]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
