# Deploying Two Wolves Portal to Vercel

This project is a [Next.js](https://nextjs.org/) App Router app located in `two-wolves-portal/`. Deployments should be handled with the Vercel CLI so that no GitHub integration is required.

## Prerequisites

1. Install dependencies:
   ```bash
   cd two-wolves-portal
   npm install
   ```
2. Install the Vercel CLI globally (one time):
   ```bash
   npm install -g vercel
   vercel login
   ```

## First-time project link

From the `two-wolves-portal/` directory run:

```bash
vercel
```

Follow the prompts to create or link a Vercel project. Accept the defaults and set the project root to `two-wolves-portal/` when prompted.

## Ongoing deployment commands

All commands should be run from `two-wolves-portal/`.

- Preview build & upload (recommended for QA):
  ```bash
  npm run validate:public
  npm run vercel:deploy
  ```
- Production deploy (after previews look good):
  ```bash
  npm run validate:public
  npm run vercel:deploy:prod
  ```

The `validate:public` script ensures no invalid `/public` paths remain and runs a full `next build` locally so the same artifacts are uploaded by the deploy commands (`--prebuilt`).

## Expected URL

Vercel previews and production deploys will be served from `https://<project-name>.vercel.app` (replace `<project-name>` with the name you assigned during `vercel` setup) or any custom domain you attach inside Vercel.
