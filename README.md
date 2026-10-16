# Scholar Pulse

An AI study companion for students. It has a Gemini-planned timetable, a quiz generator, a question-paper generator, habit streaks, a Task Accuracy Meter, a screen-time assessment (Time Mirror), a Motivation Center and a Study Vault for the whole year's materials. Students join with a shared access code. The owner has a console to see who's signed in, remove access and change the code.

## Tech

- TanStack Start (React 19, TanStack Router) on Vite
- Tailwind CSS 4 with shadcn/ui components, lucide icons
- Netlify hosting. Planned: Netlify Database, Netlify Blobs and Netlify AI Gateway (Gemini)

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000
# or, with Netlify features emulated:
netlify dev            # http://localhost:8888
```

## How to copy and put the website online

1. **Get a copy of the code.** In the Netlify dashboard, open the project and find the linked Git repository. Clone it with `git clone <repo-url>`, or download it as a ZIP.
2. **Install the tools.** Install Node.js 22 or newer from nodejs.org, then run `npm install -g netlify-cli`.
3. **Install the project.** In the project folder, run `npm install`.
4. **Try it locally.** Run `netlify dev` and open http://localhost:8888.
5. **Put it online (new copy).**
   - Push the folder to your own GitHub repo.
   - On app.netlify.com, choose **Add new project → Import an existing project** and pick that repo.
   - Netlify reads `netlify.toml`, so the build command (`vite build`) and publish folder (`dist/client`) are filled in for you. Click **Deploy**.
6. **Or deploy straight from your computer.** Run `netlify login`, then `netlify init` (to create or link a project), then `netlify deploy --prod`.
7. **Updates.** Every push to the `main` branch redeploys the site automatically.
8. **Secrets.** Once owner sign-in is fully connected (see the roadmap), set the owner password under **Project configuration → Environment variables** as `OWNER_PASSWORD`. Don't put it in the code.

## Roadmap

The screens are live with sample data. Next up: real access-code and owner sign-in, saving each student's data, connecting Gemini to the timetable, quiz, paper and Time Mirror, and Study Vault uploads. See [PLAN.md](PLAN.md).
