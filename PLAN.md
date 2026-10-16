# Scholar Pulse: Product Roadmap

Scholar Pulse is an AI study companion for students. We're building it in milestones. The product surface comes first, so the experience can be shaped before the data and AI layers go in.

## Milestone 1: Product surface ✅

- Landing page with access-code sign-in and an **Owner** button in the corner
- **Pulse Board**: Task Accuracy Meter, weekly completion chart, streak, today's tasks and Motivation Center
- **Smart Timetable**: add tasks with difficulty and importance, then get generated time slots
- **Quiz Arena**: Gemini-style setup (topic, level, number of questions), then an interactive quiz with score
- **Paper Forge**: same setup, then a printable exam paper with sections, marks and answer key
- **Habit Streaks**: weekly habit grid with streak counters
- **Time Mirror**: sliders for YouTube, Instagram, Gaming, TV and physical activity, then an assessment
- **Study Vault**: corner upload panel for the year's materials
- **Owner Console**: student list, remove/restore access, change access code

Everything runs on stubbed data in `src/lib/fixtures.ts` and a local stand-in engine in `src/lib/stub-engine.ts`.

## Milestone 2: Real access-code sign-in and owner console

- Netlify Database tables: `students` (name, joined, last active, status) and `settings` (hashed access code).
- Seed the access code as **Scholar Advanced Tech**. Store the owner password as a Netlify environment variable (`OWNER_PASSWORD`), never in code.
- Server functions verify the code and password and issue signed HTTP-only session cookies.
- Removing a student revokes their session immediately. Changing the code affects new sign-ins only.
- Protect all `/app/*` and `/owner` routes on the server.

## Milestone 3: Per-student persistence

- Store tasks, completions, habits and check-ins, and screen-time logs per student in Netlify Database.
- Calculate the Accuracy Meter and streaks from real data.

## Milestone 4: Gemini-powered features

- Use Netlify AI Gateway with a Gemini Flash model (no API key to manage).
- Replace each stub-engine function with a server function that returns structured JSON in the same shape:
  `planTimetable`, `generateQuestions` (quiz and paper), `assessScreenTime`.
- To keep questions accurate, use strict JSON schemas, a validation pass on answer keys, and grounding in Study Vault content.

## Milestone 5: Study Vault

- Store uploads in Netlify Blobs, one store per student. Extract the text and keep it for grounding.
- Gemini answers, quizzes and papers cite the student's own material. Time Mirror's "could have done" list uses the real syllabus.

## Milestone 6: Motivation and polish

- Personalised Motivation Center messages from Gemini, based on streaks and accuracy.
- Badges and achievements, a dark mode, and an installable PWA.
