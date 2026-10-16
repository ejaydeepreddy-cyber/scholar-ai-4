import { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'

import { Segmented } from '@/components/segmented'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Difficulty } from '@/lib/fixtures'

export type GeminiConfig = { topic: string; difficulty: Difficulty; count: number }

// The "Gemini asks you" setup step shared by Quiz Arena and Paper Forge.
export function GeminiSetup({
  counts,
  cta,
  loading,
  onSubmit,
}: {
  counts: Array<number>
  cta: string
  loading: boolean
  onSubmit: (c: GeminiConfig) => void
}) {
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [count, setCount] = useState(counts[1] ?? counts[0])

  return (
    <form
      className="rounded-3xl border bg-card p-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (topic.trim()) onSubmit({ topic: topic.trim(), difficulty, count })
      }}
    >
      <div className="space-y-5">
        <Bubble>Hi! What topic should I make questions on?</Bubble>
        <div className="space-y-2 pl-11">
          <Label htmlFor="topic" className="sr-only">Topic</Label>
          <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Photosynthesis, Quadratic equations, World War II" className="h-11" required />
        </div>
        <Bubble>What level should the questions be?</Bubble>
        <div className="pl-11">
          <Segmented label="Level" value={difficulty} onChange={setDifficulty} options={['easy', 'medium', 'hard']} />
        </div>
        <Bubble>And how many questions do you want?</Bubble>
        <div className="flex flex-wrap gap-2 pl-11" role="radiogroup" aria-label="Number of questions">
          {counts.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={count === n}
              onClick={() => setCount(n)}
              className={`h-10 min-w-12 rounded-xl border px-3 text-sm font-semibold transition-colors motion-reduce:transition-none ${count === n ? 'border-primary bg-primary text-primary-foreground' : 'hover:border-primary/50'}`}
            >
              {n}
            </button>
          ))}
        </div>
        <Button type="submit" size="lg" className="h-12 w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles />} {loading ? 'Gemini is writing…' : cta}
        </Button>
      </div>
    </form>
  )
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-chart-5 text-primary-foreground">
        <Sparkles className="size-4" />
      </div>
      <p className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground">{children}</p>
    </div>
  )
}
