// Local stand-ins for the Gemini features. Each function has the same shape
// the real Gemini-backed server functions will return, so screens don't
// change when the stubs are replaced (see PLAN.md, milestone 4).

import type { Difficulty, Importance } from './fixtures'

export type PlannerTask = {
  id: string
  title: string
  difficulty: Difficulty
  importance: Importance
}

export type Slot = {
  start: string
  end: string
  title: string
  kind: 'study' | 'break'
  difficulty?: Difficulty
  tip?: string
}

const minutesFor: Record<Difficulty, number> = { easy: 30, medium: 50, hard: 75 }
const weight = { low: 1, medium: 2, high: 3 }
const tips: Record<Difficulty, string> = {
  hard: 'Peak-focus slot: phone in another room, use active recall.',
  medium: 'Work in 25-minute sprints and review mistakes at the end.',
  easy: 'Lighter task: good for wrapping up or warming up.',
}

function fmt(total: number) {
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`
}

export function planTimetable(tasks: Array<PlannerTask>, startTime = '16:00'): Array<Slot> {
  const [sh, sm] = startTime.split(':').map(Number)
  let cursor = sh * 60 + sm
  // Highest importance first; on ties, the hardest task goes while energy is high.
  const order = [...tasks].sort(
    (a, b) =>
      weight[b.importance] - weight[a.importance] ||
      minutesFor[b.difficulty] - minutesFor[a.difficulty],
  )
  const slots: Array<Slot> = []
  order.forEach((task, i) => {
    const len = minutesFor[task.difficulty]
    slots.push({
      start: fmt(cursor),
      end: fmt(cursor + len),
      title: task.title,
      kind: 'study',
      difficulty: task.difficulty,
      tip: tips[task.difficulty],
    })
    cursor += len
    if (i < order.length - 1) {
      const rest = task.difficulty === 'hard' ? 15 : 10
      slots.push({ start: fmt(cursor), end: fmt(cursor + rest), title: 'Recharge break', kind: 'break' })
      cursor += rest
    }
  })
  return slots
}

export type Question = {
  id: string
  prompt: string
  options: Array<string>
  answer: number
  explanation: string
  marks: number
}

const stems = [
  (t: string) => `Which statement best describes the core idea of ${t}?`,
  (t: string) => `In ${t}, which of these is the most common misconception?`,
  (t: string) => `Which example correctly applies a principle of ${t}?`,
  (t: string) => `What is the first step when solving a typical ${t} problem?`,
  (t: string) => `Which term is most closely associated with ${t}?`,
  (t: string) => `Why is ${t} important in real-world applications?`,
]

export function generateQuestions(topic: string, count: number, difficulty: Difficulty): Array<Question> {
  const t = topic.trim() || 'the topic'
  const marks = { easy: 1, medium: 2, hard: 4 }[difficulty]
  return Array.from({ length: count }, (_, i) => {
    const answer = (i * 7 + 1) % 4
    const options = [0, 1, 2, 3].map((o) =>
      o === answer
        ? `The accurate ${difficulty}-level explanation of ${t} (concept ${i + 1})`
        : `A plausible but incorrect claim about ${t} (${String.fromCharCode(65 + o)})`,
    )
    return {
      id: `q${i}`,
      prompt: stems[i % stems.length](t),
      options,
      answer,
      explanation: `Gemini will explain why option ${String.fromCharCode(65 + answer)} is correct, citing your uploaded notes on ${t}.`,
      marks,
    }
  })
}

export type ScreenAssessment = {
  totalHours: number
  reducible: number
  biggest: string
  insights: Array<string>
  couldHaveDone: Array<string>
}

export function assessScreenTime(
  apps: Array<{ label: string; hours: number }>,
  activityHours: number,
): ScreenAssessment {
  const totalHours = apps.reduce((s, a) => s + a.hours, 0)
  const biggest = [...apps].sort((a, b) => b.hours - a.hours)[0]
  const reducible = Math.round(apps.reduce((s, a) => s + Math.max(0, a.hours - 0.75), 0) * 10) / 10
  const weeklyGain = Math.round(reducible * 7)
  const insights = [
    `${biggest.label} takes ${biggest.hours}h a day: your biggest time sink. Cutting it by half frees ${(biggest.hours / 2).toFixed(1)}h daily.`,
    `Bringing every app down to 45 min frees about ${reducible}h a day: around ${weeklyGain}h a week for studying.`,
    activityHours < 1
      ? `You're doing ${activityHours}h of physical activity. Aim for at least 1h: it sharpens memory and focus.`
      : `Nice, ${activityHours}h of physical activity a day keeps your brain sharp. Keep it up!`,
  ]
  const chapters = Math.floor((reducible * 7) / 2.5)
  const couldHaveDone = [
    `Finished about ${chapters} full chapters of revision`,
    `Solved roughly ${Math.round(reducible * 7 * 12)} practice questions`,
    `Attempted ${Math.max(1, Math.floor(weeklyGain / 3))} full-length mock papers`,
  ]
  return { totalHours, reducible, biggest: biggest.label, insights, couldHaveDone }
}
