import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarClock, Coffee, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Segmented } from '@/components/segmented'
import { sampleTasks, type Difficulty, type Importance } from '@/lib/fixtures'
import { planTimetable, type PlannerTask, type Slot } from '@/lib/stub-engine'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/app/timetable')({
  component: Timetable,
})

const difficultyTone: Record<Difficulty, string> = {
  easy: 'bg-chart-2/15 text-chart-2',
  medium: 'bg-chart-4/25 text-[oklch(0.45_0.1_70)]',
  hard: 'bg-chart-3/15 text-chart-3',
}

function Timetable() {
  const [tasks, setTasks] = useState<Array<PlannerTask>>(sampleTasks.map((t, i) => ({ ...t, id: `s${i}` })))
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [importance, setImportance] = useState<Importance>('medium')
  const [start, setStart] = useState('16:00')
  const [slots, setSlots] = useState<Array<Slot> | null>(null)
  const [loading, setLoading] = useState(false)

  function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), title: title.trim(), difficulty, importance }])
    setTitle('')
  }

  function generate() {
    setLoading(true)
    setTimeout(() => {
      setSlots(planTimetable(tasks, start))
      setLoading(false)
    }, 1100)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Smart Timetable</h1>
        <p className="mt-1 text-muted-foreground">Tell Gemini what you need to do and how hard it is. It plans the time slots for you.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="space-y-5 rounded-3xl border bg-card p-6">
          <form onSubmit={addTask} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task">New task</Label>
              <Input id="task" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Biology: revise genetics chapter" className="h-11" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Segmented label="Difficulty" value={difficulty} onChange={setDifficulty} options={['easy', 'medium', 'hard']} />
              <Segmented label="Importance" value={importance} onChange={setImportance} options={['low', 'medium', 'high']} />
            </div>
            <Button type="submit" variant="secondary" className="w-full">
              <Plus /> Add task
            </Button>
          </form>

          <ul className="space-y-2">
            {tasks.length === 0 && <li className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">Add your first task to get started.</li>}
            {tasks.map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-xl border p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <div className="mt-1 flex gap-1.5 text-xs">
                    <span className={cn('rounded-full px-2 py-0.5 font-semibold capitalize', difficultyTone[t.difficulty])}>{t.difficulty}</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold capitalize text-secondary-foreground">{t.importance} priority</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" aria-label={`Remove ${t.title}`} onClick={() => setTasks((prev) => prev.filter((p) => p.id !== t.id))}>
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="start">Start studying at</Label>
              <Input id="start" type="time" value={start} onChange={(e) => setStart(e.target.value)} className="h-11 sm:w-36" />
            </div>
            <Button size="lg" className="h-11 flex-1" disabled={!tasks.length || loading} onClick={generate}>
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />} {loading ? 'Gemini is planning…' : 'Generate my timetable'}
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border bg-card p-6">
          <h2 className="text-lg font-bold">Your plan</h2>
          {!slots && !loading && (
            <div className="mt-10 flex flex-col items-center text-center text-muted-foreground">
              <div className="grid size-16 place-items-center rounded-3xl bg-secondary text-primary">
                <CalendarClock className="size-8" />
              </div>
              <p className="mt-4 max-w-xs text-sm">Add your tasks and hit generate. Hard, high-priority work gets your sharpest hours.</p>
            </div>
          )}
          {loading && (
            <div className="mt-6 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
              ))}
            </div>
          )}
          {slots && !loading && (
            <ol className="relative mt-6 space-y-3 border-l-2 border-dashed border-border pl-6">
              {slots.map((s, i) => (
                <li key={i} className="relative">
                  <span className={cn('absolute -left-[33px] top-4 size-4 rounded-full border-4 border-card', s.kind === 'break' ? 'bg-chart-2' : 'bg-primary')} />
                  {s.kind === 'break' ? (
                    <div className="flex items-center gap-2 rounded-xl bg-chart-2/10 px-4 py-2.5 text-sm text-chart-2">
                      <Coffee className="size-4" /> <span className="font-semibold">{s.title}</span>
                      <span className="ml-auto text-xs">{s.start}–{s.end}</span>
                    </div>
                  ) : (
                    <div className="rounded-xl border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold">{s.title}</p>
                        <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold capitalize', difficultyTone[s.difficulty!])}>{s.difficulty}</span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-primary">{s.start} – {s.end}</p>
                      <p className="mt-1.5 text-xs text-muted-foreground">💡 {s.tip}</p>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  )
}
