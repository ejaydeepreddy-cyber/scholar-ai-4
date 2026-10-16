import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Dumbbell, Loader2, ScanEye, Sparkles, TrendingDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { screenApps } from '@/lib/fixtures'
import { assessScreenTime, type ScreenAssessment } from '@/lib/stub-engine'

export const Route = createFileRoute('/app/time-mirror')({
  component: TimeMirror,
})

function TimeMirror() {
  const [hours, setHours] = useState<Record<string, number>>(Object.fromEntries(screenApps.map((a) => [a.id, a.hours])))
  const [activity, setActivity] = useState(0.5)
  const [result, setResult] = useState<ScreenAssessment | null>(null)
  const [loading, setLoading] = useState(false)

  const total = Object.values(hours).reduce((s, h) => s + h, 0)
  const max = Math.max(...Object.values(hours), activity, 1)

  function assess() {
    setLoading(true)
    setTimeout(() => {
      setResult(assessScreenTime(screenApps.map((a) => ({ label: a.label, hours: hours[a.id] })), activity))
      setLoading(false)
    }, 1100)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Time Mirror</h1>
        <p className="mt-1 text-muted-foreground">An honest look at your day. Gemini shows where your hours go and what they could become.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-3xl border bg-card p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Daily screen time</h2>
            <span className="font-display text-2xl font-bold text-primary">{total.toFixed(1)}h</span>
          </div>
          <div className="mt-5 space-y-5">
            {screenApps.map((a) => (
              <Slider key={a.id} label={`${a.emoji} ${a.label}`} value={hours[a.id]} max={8} onChange={(v) => setHours((h) => ({ ...h, [a.id]: v }))} />
            ))}
          </div>
          <div className="mt-6 border-t pt-5">
            <Slider label="🏃 Physical activity" value={activity} max={4} onChange={setActivity} />
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><Dumbbell className="size-3.5" /> Sports, gym, walking, yoga, anything that moves you</p>
          </div>
          <Button size="lg" className="mt-6 h-12 w-full" disabled={loading} onClick={assess}>
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />} {loading ? 'Gemini is reflecting…' : 'Assess my day'}
          </Button>
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border bg-card p-6">
            <h2 className="text-lg font-bold">Your day in bars</h2>
            <div className="mt-4 space-y-3">
              {[...screenApps.map((a) => ({ label: a.label, h: hours[a.id], cls: 'bg-chart-3' })), { label: 'Physical activity', h: activity, cls: 'bg-chart-2' }].map((r) => (
                <div key={r.label} className="flex items-center gap-3 text-sm">
                  <span className="w-36 shrink-0 truncate text-muted-foreground">{r.label}</span>
                  <div className="h-3 flex-1 rounded-full bg-muted">
                    <div className={`h-3 rounded-full ${r.cls} transition-[width] motion-reduce:transition-none`} style={{ width: `${(r.h / max) * 100}%` }} />
                  </div>
                  <span className="w-10 text-right font-semibold">{r.h}h</span>
                </div>
              ))}
            </div>
          </div>

          {!result && !loading && (
            <div className="flex flex-col items-center rounded-3xl border border-dashed p-8 text-center text-muted-foreground">
              <ScanEye className="size-10 text-primary" />
              <p className="mt-3 max-w-xs text-sm">Set your hours and tap “Assess my day” to see your mirror.</p>
            </div>
          )}
          {loading && <div className="h-64 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />}
          {result && !loading && (
            <div className="ink-panel rounded-3xl p-6">
              <div className="flex items-center gap-2 text-accent">
                <TrendingDown className="size-5" />
                <p className="text-sm font-semibold">You could win back {result.reducible}h every day</p>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-white/85">
                {result.insights.map((t) => <li key={t} className="rounded-xl bg-white/5 p-3">{t}</li>)}
              </ul>
              <p className="mt-5 text-sm font-semibold">If you'd spent that time studying this week, you could have:</p>
              <ul className="mt-2 space-y-1.5 text-sm text-white/85">
                {result.couldHaveDone.map((t) => <li key={t}>✅ {t}</li>)}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function Slider({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (v: number) => void }) {
  const id = label.replace(/\W+/g, '-')
  return (
    <div>
      <div className="flex justify-between text-sm">
        <label htmlFor={id} className="font-medium">{label}</label>
        <span className="font-semibold">{value}h</span>
      </div>
      <input id={id} type="range" min={0} max={max} step={0.5} value={value} onChange={(e) => onChange(Number(e.target.value))} className="pulse-range mt-2 w-full" />
    </div>
  )
}
