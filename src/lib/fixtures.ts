// Stubbed product data for the first milestone.
// Every screen reads from this module, so a later milestone can swap these
// exports for real Netlify Database queries and Gemini responses.

export type Difficulty = 'easy' | 'medium' | 'hard'
export type Importance = 'low' | 'medium' | 'high'

export const student = {
  name: 'Aarav',
  grade: 'Grade 12 · Science',
  streakDays: 14,
  focusMinutesToday: 135,
}

export const weeklyTasks = [
  { day: 'Mon', planned: 6, done: 5 },
  { day: 'Tue', planned: 5, done: 5 },
  { day: 'Wed', planned: 7, done: 4 },
  { day: 'Thu', planned: 4, done: 4 },
  { day: 'Fri', planned: 6, done: 5 },
  { day: 'Sat', planned: 3, done: 2 },
  { day: 'Sun', planned: 2, done: 2 },
]

export const todaysTasks = [
  { id: 't1', title: 'Physics: Electrostatics numericals', done: true },
  { id: 't2', title: 'Chemistry: Revise p-block notes', done: true },
  { id: 't3', title: 'Maths: Integration practice set 4', done: false },
  { id: 't4', title: 'English: Essay draft', done: false },
]

export const habits = [
  { id: 'h1', name: 'Morning revision', emoji: '📘', streak: 14, week: [1, 1, 1, 1, 1, 1, 0] },
  { id: 'h2', name: '30 min workout', emoji: '🏃', streak: 5, week: [0, 1, 1, 1, 1, 1, 0] },
  { id: 'h3', name: 'No phone before 9 am', emoji: '📵', streak: 3, week: [1, 0, 0, 1, 1, 1, 0] },
  { id: 'h4', name: 'Read 20 pages', emoji: '📖', streak: 9, week: [1, 1, 1, 1, 1, 0, 0] },
  { id: 'h5', name: 'Sleep by 11 pm', emoji: '🌙', streak: 2, week: [0, 0, 1, 0, 1, 1, 0] },
]

export const motivation = [
  {
    quote: 'Small daily improvements are the key to staggering long-term results.',
    author: 'Robin Sharma',
  },
  {
    quote: 'The expert in anything was once a beginner.',
    author: 'Helen Hayes',
  },
  {
    quote: 'Do something today that your future self will thank you for.',
    author: 'Sean Patrick Flanery',
  },
  {
    quote: 'Success is the sum of small efforts, repeated day in and day out.',
    author: 'Robert Collier',
  },
]

export const badges = [
  { label: '14-day streak', emoji: '🔥' },
  { label: 'Quiz ace', emoji: '🎯' },
  { label: 'Early bird', emoji: '🌅' },
  { label: 'Locked in', emoji: '🧠' },
]

export const sampleTasks: Array<{
  title: string
  difficulty: Difficulty
  importance: Importance
}> = [
  { title: 'Organic chemistry: reaction mechanisms', difficulty: 'hard', importance: 'high' },
  { title: 'Physics past paper 2023', difficulty: 'medium', importance: 'high' },
  { title: 'Revise English poems', difficulty: 'easy', importance: 'medium' },
  { title: 'Maths: probability exercise', difficulty: 'medium', importance: 'medium' },
]

export const materials = [
  { name: 'Physics — Full Year Notes.pdf', subject: 'Physics', size: '12.4 MB' },
  { name: 'Chemistry Formula Sheet.pdf', subject: 'Chemistry', size: '1.1 MB' },
  { name: 'Maths Calculus Chapter 7.pdf', subject: 'Maths', size: '4.8 MB' },
  { name: 'English Literature Syllabus.docx', subject: 'English', size: '320 KB' },
]

export const screenApps = [
  { id: 'youtube', label: 'YouTube', emoji: '▶️', hours: 2.5 },
  { id: 'instagram', label: 'Instagram', emoji: '📸', hours: 1.5 },
  { id: 'gaming', label: 'Gaming', emoji: '🎮', hours: 2 },
  { id: 'tv', label: 'TV & entertainment', emoji: '📺', hours: 1.5 },
] as const

export const ownerStudents = [
  { id: 's1', name: 'Aarav Sharma', joined: '2026-09-02', lastActive: '2 min ago', status: 'active' },
  { id: 's2', name: 'Diya Patel', joined: '2026-09-04', lastActive: '1 hr ago', status: 'active' },
  { id: 's3', name: 'Kabir Reddy', joined: '2026-09-11', lastActive: 'Yesterday', status: 'active' },
  { id: 's4', name: 'Meera Iyer', joined: '2026-09-18', lastActive: '3 days ago', status: 'active' },
  { id: 's5', name: 'Rohan Gupta', joined: '2026-10-01', lastActive: 'Today', status: 'active' },
  { id: 's6', name: 'Ananya Rao', joined: '2026-10-09', lastActive: '5 hrs ago', status: 'active' },
]
