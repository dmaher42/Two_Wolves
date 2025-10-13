
# Two Wolves Portal (No-Terminal Starter)

This project is ready to upload to GitHub and deploy with Vercel **without using a terminal**.

## 1) Supabase (done first)
- Create a Supabase project
- In Authentication → URL Configuration, set:
  - Site URL: `http://localhost:3000` (for local) and later your Vercel URL
  - Redirect URLs: add `/auth/callback` and `/post-auth` paths
- In SQL Editor, run:
  1) the tiny `users`-only script
  2) the big script for other tables + policies

## 2) Add environment variables in Vercel
When you deploy (Import Git repo → New Project):
- `NEXT_PUBLIC_SUPABASE_URL` → from Supabase Settings → API (Project URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → from Supabase Settings → API (anon key)
- `NEXT_PUBLIC_SITE_NAME` → Two Wolves Portal (optional)

## 3) After deploy
- Visit `/teacher` once to mark your account as teacher
- Create your first task → check `/student`
