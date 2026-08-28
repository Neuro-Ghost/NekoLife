# Neko Life — a cat-themed life manager

A soft, cozy full-stack task manager / life organizer built with **Next.js 14**, **Prisma + SQLite**, **NextAuth v5** (Discord / Google / GitHub / Email magic-link), and a pastel cat-themed UI.

## Features
- **Auth**: Discord, Google, GitHub OAuth + email magic-link. Create account, log in, profile.
- **Dashboard**: Today's tasks, upcoming events, life-area overview, a cat that reacts to your progress.
- **Tasks**: Kanban board + list view, priorities, due dates, tags, life-area tags.
- **Calendar**: Month view with events & tasks, create/edit events.
- **Notes**: Markdown-ish notes with search, pinned notes.
- **Life Areas**: Work, Health, Study, Personal, Home — color-coded, filterable.
- **Habits**: Daily habit tracker with streaks.

## Setup

```bash
cp .env.example .env          # then edit with your OAuth keys
npm run setup                 # install + prisma generate + push schema
npm run dev                   # http://localhost:3000
```

For a quick local-only demo without OAuth, leave the OAuth fields blank — you can still use the **Email** provider (it logs the magic link to the console in dev).

## Stack
Next.js 14 App Router · Prisma · NextAuth v5 (Auth.js) · Tailwind · date-fns · Lucide icons

## Project layout
```
src/
  app/              routes (dashboard, tasks, calendar, notes, life, api)
  components/       Sidebar, TaskBoard, Calendar, NoteCard, etc.
  lib/              auth.ts, db.ts, utils
  types/            shared types
prisma/
  schema.prisma     data model
```
