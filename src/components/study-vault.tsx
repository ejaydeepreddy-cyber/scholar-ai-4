import { useRef, useState } from 'react'
import { FileUp, FolderOpen, Sparkles, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { materials as initialMaterials } from '@/lib/fixtures'

// Corner button where students drop the whole year's study material.
// Files are kept in component state for now; uploads move to Netlify Blobs
// in a later milestone (see PLAN.md).
export function StudyVault() {
  const [files, setFiles] = useState(initialMaterials)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function addFiles(list: FileList | null) {
    if (!list?.length) return
    const added = Array.from(list).map((f) => ({
      name: f.name,
      subject: 'Unsorted',
      size: f.size > 1_000_000 ? `${(f.size / 1_000_000).toFixed(1)} MB` : `${Math.ceil(f.size / 1000)} KB`,
    }))
    setFiles((prev) => [...added, ...prev])
    toast.success(`${added.length} file${added.length > 1 ? 's' : ''} added to your Study Vault`)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="rounded-full shadow-lg shadow-primary/20">
          <Upload /> <span className="hidden sm:inline">Study Vault</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Study Vault</SheetTitle>
          <SheetDescription>
            Upload the whole year's notes, syllabus and past papers. Gemini uses them for your quizzes, papers and timetables.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 px-4 pb-6">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              addFiles(e.dataTransfer.files)
            }}
            className={`flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors motion-reduce:transition-none ${dragging ? 'border-primary bg-secondary' : 'border-border hover:border-primary/50'}`}
          >
            <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
              <FileUp className="size-6" />
            </div>
            <div>
              <p className="font-semibold">Drop files or click to browse</p>
              <p className="text-xs text-muted-foreground">PDF, DOCX, PPT, images · up to 50 MB each</p>
            </div>
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,image/*"
            onChange={(e) => addFiles(e.target.files)}
          />

          <div className="flex items-center gap-2 rounded-xl bg-accent/50 p-3 text-sm text-accent-foreground">
            <Sparkles className="size-4 shrink-0" />
            {files.length} files in your vault. Gemini is ready to answer from them.
          </div>

          <ul className="space-y-2">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                <FolderOpen className="size-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{f.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {f.subject} · {f.size}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}
