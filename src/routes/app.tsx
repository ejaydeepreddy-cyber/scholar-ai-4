import { useEffect, useState } from 'react'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import {
  BrainCircuit,
  CalendarClock,
  FileText,
  Flame,
  LayoutDashboard,
  LogOut,
  Menu,
  ScanEye,
  Sparkles,
} from 'lucide-react'

import { Logo } from '@/components/logo'
import { StudyVault } from '@/components/study-vault'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

const nav = [
  { to: '/app', label: 'Pulse Board', icon: LayoutDashboard },
  { to: '/app/timetable', label: 'Smart Timetable', icon: CalendarClock },
  { to: '/app/quiz', label: 'Quiz Arena', icon: BrainCircuit },
  { to: '/app/paper', label: 'Paper Forge', icon: FileText },
  { to: '/app/habits', label: 'Habit Streaks', icon: Flame },
  { to: '/app/time-mirror', label: 'Time Mirror', icon: ScanEye },
] as const

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: true }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground motion-reduce:transition-none"
        >
          <item.icon className="size-4.5" />
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

function AppLayout() {
  const [name, setName] = useState('Scholar')
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem('sp-student-name')
    if (saved) setName(saved.split(' ')[0])
  }, [])

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden print:hidden h-screen flex-col border-r bg-card px-4 py-6 lg:flex">
        <div className="px-2">
          <Logo />
        </div>
        <div className="mt-8 flex-1">
          <NavLinks />
        </div>
        <div className="ink-panel rounded-2xl p-4">
          <Sparkles className="size-5 text-accent" />
          <p className="mt-2 text-sm font-semibold">Gemini study brain</p>
          <p className="mt-1 text-xs text-white/70">Upload your materials to the Study Vault for answers based on your own notes.</p>
        </div>
        <Button asChild variant="ghost" className="mt-3 justify-start text-muted-foreground">
          <Link to="/">
            <LogOut /> Sign out
          </Link>
        </Button>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex print:hidden items-center justify-between gap-3 border-b bg-background/85 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-4">
                <SheetTitle className="px-2">
                  <Logo />
                </SheetTitle>
                <SheetDescription className="sr-only">Main navigation</SheetDescription>
                <div className="mt-6">
                  <NavLinks onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <p className="text-sm text-muted-foreground">
              Hey <span className="font-semibold text-foreground">{name}</span> 👋 ready to crush it today?
            </p>
          </div>
          <StudyVault />
        </header>
        <main className="mx-auto max-w-content px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
