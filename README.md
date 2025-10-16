# Two Wolves Portal

This portal prototype now runs completely client-side using browser storage. No Supabase project or environment variables are required to deploy on Vercel.

## Getting started locally

```bash
cd two-wolves-portal
npm install
npm run dev
```

Visit `http://localhost:3000` to try it out.

## Features

- Email-based sign-in simulation – pick student or teacher mode after entering an address.
- Teachers can draft new tasks and monitor student submissions. Data is saved to `localStorage`.
- Students read published tasks, draft responses, and submit when they are ready.

Everything resets by clearing browser storage, making it easy to demo the experience.
