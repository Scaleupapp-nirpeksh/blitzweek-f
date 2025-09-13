# IITB × ScaleUp Blitz Week — Frontend

Single‑page site built with React + Vite, styled‑components, and framer‑motion. No Tailwind.
Includes: hero, live stats, countdown, event details, QR card, and registration form with duplicate checks.

## Quickstart

```bash
pnpm i   # or npm i / yarn
cp .env.example .env  # set API + event time
pnpm dev
```

### Deploy on Vercel
- Set **VITE_API_BASE** to your API base (e.g. `https://api.theblitzweek.com/api`).
- Make sure your backend CORS allows your Vercel domain (it already includes `theblitzweek.com` and `blitzweek.vercel.app`).
