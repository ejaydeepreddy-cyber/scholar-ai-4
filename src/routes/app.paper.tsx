import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Eye, EyeOff, Printer, RotateCcw } from 'lucide-react'

import { GeminiSetup, type GeminiConfig } from '@/components/gemini-setup'
import { Button } from '@/components/ui/button'
import { generateQuestions, type Question } from '@/lib/stub-engine'

export const Route = createFileRoute('/app/paper')({
  component: PaperForge,
})

function PaperForge() {
  const [config, setConfig] = useState<GeminiConfig | null>(null)
  const [questions, setQuestions] = useState<Array<Question>>([])
  const [loading, setLoading] = useState(false)
  const [showKey, setShowKey] = useState(false)

  function forge(c: GeminiConfig) {
    setLoading(true)
    setTimeout(() => {
      setConfig(c)
      setQuestions(generateQuestions(c.topic, c.count, c.difficulty))
      setShowKey(false)
      setLoading(false)
    }, 1200)
  }

  const total = questions.reduce((s, q) => s + q.marks, 0)
  const half = Math.ceil(questions.length / 2)

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Paper Forge</h1>
        <p className="mt-1 text-muted-foreground">Exam-style question papers with marks and an answer key, built from your syllabus.</p>
      </div>

      {!config && (
        <div className="mx-auto max-w-2xl">
          <GeminiSetup counts={[10, 20, 30, 40]} cta="Forge question paper" loading={loading} onSubmit={forge} />
        </div>
      )}

      {config && (
        <>
          <div className="flex flex-wrap justify-end gap-2 print:hidden">
            <Button variant="outline" onClick={() => setConfig(null)}><RotateCcw /> New paper</Button>
            <Button variant="outline" onClick={() => setShowKey((v) => !v)}>{showKey ? <EyeOff /> : <Eye />} {showKey ? 'Hide' : 'Show'} answer key</Button>
            <Button onClick={() => window.print()}><Printer /> Print</Button>
          </div>
          <article className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 shadow-sm sm:p-12 print:border-0 print:shadow-none">
            <header className="border-b-2 border-foreground pb-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Scholar Pulse · Practice Examination</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold capitalize">{config.topic}</h2>
              <div className="mt-3 flex justify-center gap-6 text-sm">
                <span>Level: <b className="capitalize">{config.difficulty}</b></span>
                <span>Time: <b>{Math.max(30, questions.length * 3)} min</b></span>
                <span>Max marks: <b>{total}</b></span>
              </div>
            </header>
            <p className="mt-5 text-sm text-muted-foreground"><b>Instructions:</b> Attempt all questions. Each question has one correct answer. Marks are shown in brackets.</p>
            {[
              { name: 'Section A', items: questions.slice(0, half), offset: 0 },
              { name: 'Section B', items: questions.slice(half), offset: half },
            ].map((sec) => (
              <section key={sec.name} className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-wider">{sec.name}</h3>
                <ol className="mt-4 space-y-5">
                  {sec.items.map((q, i) => (
                    <li key={q.id} className="text-sm">
                      <div className="flex justify-between gap-4">
                        <p className="font-medium">{sec.offset + i + 1}. {q.prompt}</p>
                        <span className="shrink-0 text-muted-foreground">[{q.marks}]</span>
                      </div>
                      <div className="mt-2 grid gap-1.5 pl-5 sm:grid-cols-2">
                        {q.options.map((o, oi) => (
                          <p key={oi} className={showKey && oi === q.answer ? 'rounded bg-accent/60 px-1 font-semibold' : ''}>
                            ({String.fromCharCode(97 + oi)}) {o}
                          </p>
                        ))}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </article>
        </>
      )}
    </div>
  )
}
