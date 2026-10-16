import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  BrainCircuit,
  CalendarClock,
  Crown,
  FileText,
  Flame,
  Gauge,
  ScanEye,
  Sparkles,
  Upload,
} from 'lucide-react'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export const Route = createFileRoute('/')({
  component: Home,
})

const features = [
  { icon: CalendarClock, title: 'Smart Timetable', text: 'List your tasks and how hard they are. Gemini gives you time slots that fit your energy.' },
  { icon: BrainCircuit, title: 'Quiz Arena', text: 'Pick a topic, a level and how many questions you want, then test yourself right away.' },
  { icon: FileText, title: 'Paper Forge', text: 'Exam-style question papers with marks, sections and answer keys, ready to print.' },
  { icon: ScanEye, title: 'Time Mirror', text: 'See where your screen time goes and what you could finish if you won some of it back.' },
  { icon: Flame, title: 'Habit Streaks', text: 'Build daily rituals and keep the flame alive, one day at a time.' },
  { icon: Gauge, title: 'Accuracy Meter', text: 'See how many of your planned tasks you actually finish, every week.' },
]

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-content items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <OwnerSignIn />
      </header>

      <main className="mx-auto grid max-w-content items-center gap-12 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-14">
        <section>
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-secondary-foreground">
            <Sparkles className="size-3.5 text-primary" /> Powered by Google Gemini
          </span>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
            Study smarter.
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">Feel the pulse.</span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-4 rounded bg-accent sm:h-5" aria-hidden />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Scholar Pulse is your AI study companion. It plans your day, quizzes you, builds practice
            papers from your own notes and keeps you motivated all year.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            {['Timetables in seconds', 'Quizzes from your notes', 'Daily streaks'].map((t) => (
              <span key={t} className="rounded-full bg-secondary px-3 py-1.5 font-medium text-secondary-foreground">
                {t}
              </span>
            ))}
          </div>
        </section>

        <AccessCard />
      </main>

      <section className="border-t bg-card/60">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything a student needs, in one place</h2>
          <p className="mt-2 text-muted-foreground">Six tools, one AI brain, and a dashboard you'll want to keep coming back to.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40 motion-reduce:transition-none">
                <div className="mb-4 grid size-11 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="size-5" />
                </div>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="ink-panel mt-10 flex flex-col items-start gap-4 rounded-3xl p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-2xl bg-white/10">
                <Upload className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Upload your whole year once</h3>
                <p className="text-sm text-white/70">Notes, syllabus and past papers. Gemini reads them and answers from your material.</p>
              </div>
            </div>
            <span className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">Study Vault</span>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-content px-4 py-8 text-sm text-muted-foreground sm:px-6">
        © 2026 Scholar Pulse · Built for students
      </footer>
    </div>
  )
}

function AccessCard() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !code.trim()) return
    localStorage.setItem('sp-student-name', name.trim())
    navigate({ to: '/app' })
  }

  return (
    <div className="relative">
      <div className="absolute -inset-3 -z-10 rotate-2 rounded-[2rem] bg-accent/60" aria-hidden />
      <form onSubmit={onSubmit} className="rounded-3xl border bg-card p-7 shadow-xl shadow-primary/5 sm:p-9">
        <h2 className="font-display text-2xl font-bold">Enter your study space</h2>
        <p className="mt-1 text-sm text-muted-foreground">Use the access code from your school or study group.</p>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aarav Sharma" className="h-11" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Access code</Label>
            <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter access code" className="h-11" autoComplete="off" required />
          </div>
          <Button type="submit" size="lg" className="h-12 w-full text-base">
            Start studying <ArrowRight />
          </Button>
        </div>
        <p className="mt-5 text-center text-xs text-muted-foreground">Only students with a valid access code can join.</p>
      </form>
    </div>
  )
}

function OwnerSignIn() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Crown /> Owner
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Owner sign in</DialogTitle>
          <DialogDescription>Manage students, remove access and rotate the access code.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (password) navigate({ to: '/owner' })
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="owner-pass">Owner password</Label>
            <Input id="owner-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">Open owner console</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
