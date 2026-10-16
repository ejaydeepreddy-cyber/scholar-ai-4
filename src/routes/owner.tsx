import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, KeyRound, ShieldX, Users } from 'lucide-react'
import { toast } from 'sonner'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ownerStudents } from '@/lib/fixtures'

export const Route = createFileRoute('/owner')({
  component: OwnerConsole,
})

function OwnerConsole() {
  const [students, setStudents] = useState(ownerStudents)
  const [newCode, setNewCode] = useState('')
  const active = students.filter((s) => s.status === 'active').length

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-content items-center justify-between px-4 py-4 sm:px-6">
          <Logo />
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft /> Back to site</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-content space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Owner Console</h1>
          <p className="mt-1 text-muted-foreground">See who's studying, manage access and rotate the shared access code.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5">
            <Users className="size-5 text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Students with access</p>
            <p className="font-display text-3xl font-bold">{active}</p>
          </div>
          <form
            className="rounded-2xl border bg-card p-5 sm:col-span-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (newCode.trim().length < 6) return toast.error('Use at least 6 characters')
              toast.success('Access code updated. Share the new code with your students.')
              setNewCode('')
            }}
          >
            <div className="flex items-center gap-2">
              <KeyRound className="size-5 text-primary" />
              <Label htmlFor="new-code" className="text-base font-bold">Change access code</Label>
            </div>
            <div className="mt-3 flex gap-2">
              <Input id="new-code" value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="New access code" className="h-10" autoComplete="off" />
              <Button type="submit" className="h-10">Update</Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Students already signed in keep their access. New sign-ins need the new code.</p>
          </form>
        </div>

        <section className="rounded-3xl border bg-card p-2 sm:p-4">
          <h2 className="px-3 pt-2 text-lg font-bold">Signed-in students</h2>
          <div className="mt-2 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.joined}</TableCell>
                    <TableCell>{s.lastActive}</TableCell>
                    <TableCell>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.status === 'active' ? 'bg-chart-2/15 text-chart-2' : 'bg-destructive/10 text-destructive'}`}>
                        {s.status === 'active' ? 'Active' : 'Removed'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {s.status === 'active' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setStudents((prev) => prev.map((p) => (p.id === s.id ? { ...p, status: 'removed' } : p)))
                            toast(`${s.name}'s access was removed`)
                          }}
                        >
                          <ShieldX /> Remove access
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => setStudents((prev) => prev.map((p) => (p.id === s.id ? { ...p, status: 'active' } : p)))}>
                          Restore
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>
    </div>
  )
}
