import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Check, RotateCcw, Trophy, X } from 'lucide-react'

import { GeminiSetup, type GeminiConfig } from '@/components/gemini-setup'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { generateQuestions, type Question } from '@/lib/stub-engine'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/app/quiz')({
  component: QuizArena,
})

function QuizArena() {
  const [config, setConfig] = useState<GeminiConfig | null>(null)
  const [questions, setQuestions] = useState<Array<Question>>([])
  const [loading, setLoading] = useState(false)
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  function start(c: GeminiConfig) {
    setLoading(true)
    setTimeout(() => {
      setConfig(c)
      setQuestions(generateQuestions(c.topic, c.count, c.difficulty))
      setIndex(0)
      setPicked(null)
      setScore(0)
      setLoading(false)
    }, 1000)
  }

  const finished = config && index >= questions.length
  const q = questions[index]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Quiz Arena</h1>
        <p className="mt-1 text-muted-foreground">Gemini writes a fresh quiz on any topic, checked against your Study Vault notes.</p>
      </div>

      {!config && (
        <div className="mx-auto max-w-2xl">
          <GeminiSetup counts={[5, 10, 15, 20]} cta="Start quiz" loading={loading} onSubmit={start} />
        </div>
      )}

      {config && q && (
        <section className="mx-auto max-w-2xl rounded-3xl border bg-card p-6 sm:p-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold capitalize text-primary">{config.topic} · {config.difficulty}</span>
            <span className="text-muted-foreground">Question {index + 1} of {questions.length}</span>
          </div>
          <Progress value={(index / questions.length) * 100} className="mt-3" />
          <h2 className="mt-6 text-xl font-bold leading-snug">{q.prompt}</h2>
          <div className="mt-5 space-y-2.5">
            {q.options.map((o, i) => {
              const state = picked === null ? 'idle' : i === q.answer ? 'right' : i === picked ? 'wrong' : 'idle'
              return (
                <button
                  key={i}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => {
                    setPicked(i)
                    if (i === q.answer) setScore((s) => s + 1)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left text-sm font-medium transition-colors motion-reduce:transition-none',
                    state === 'idle' && 'hover:border-primary/50',
                    state === 'right' && 'border-chart-2 bg-chart-2/10',
                    state === 'wrong' && 'border-destructive bg-destructive/10',
                  )}
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-xs font-bold">
                    {state === 'right' ? <Check className="size-4 text-chart-2" /> : state === 'wrong' ? <X className="size-4 text-destructive" /> : String.fromCharCode(65 + i)}
                  </span>
                  {o}
                </button>
              )
            })}
          </div>
          {picked !== null && (
            <div className="mt-5 space-y-4">
              <p className="rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">{q.explanation}</p>
              <Button className="w-full" onClick={() => { setIndex((n) => n + 1); setPicked(null) }}>
                {index + 1 === questions.length ? 'See results' : 'Next question'} <ArrowRight />
              </Button>
            </div>
          )}
        </section>
      )}

      {config && finished && (
        <section className="ink-panel mx-auto max-w-2xl rounded-3xl p-8 text-center">
          <Trophy className="mx-auto size-12 text-accent" />
          <p className="mt-4 font-display text-5xl font-extrabold">{Math.round((score / questions.length) * 100)}%</p>
          <p className="mt-2 text-white/75">You got {score} of {questions.length} right on {config.topic}.</p>
          <p className="mt-1 text-sm text-white/60">{score / questions.length >= 0.8 ? 'Brilliant! Try a harder level next.' : 'Good effort. Review the explanations and go again.'}</p>
          <Button variant="secondary" className="mt-6" onClick={() => setConfig(null)}>
            <RotateCcw /> New quiz
          </Button>
        </section>
      )}
    </div>
  )
}
