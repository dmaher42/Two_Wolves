# Two Wolves Portal

This project provides a lightweight prototype of the Two Wolves learning portal. It now works entirely in the browser with local storage – no external services or Supabase setup required.

## Getting started

1. Install dependencies and run the development server:

   ```bash
   npm install
   npm run dev
   ```

2. Visit `http://localhost:3000`.

## How it works

- Sign in with any school email and choose whether to act as a student or teacher. The choice is stored locally so you can swap roles quickly.
- Teachers can create tasks and view student progress. Tasks and submissions are saved in `localStorage` so the prototype behaves consistently across refreshes on the same device.
- Students see published tasks, open them to respond, and their work auto-saves.

Because everything runs in the browser, deploying to Vercel no longer needs Supabase environment variables.
