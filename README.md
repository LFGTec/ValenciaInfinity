# LFG — Real Valencia Fan Experience Platform

A Next.js web application delivering an immersive, gamified fan engagement experience for Real Valencia supporters. Built with TypeScript, Supabase, and AI-powered features.

---

## Overview

LFG is a full-stack fan platform that combines social networking, collectible card albums, virtual reality stadium experiences, and real-time match engagement — all tailored to the Real Valencia brand identity.

---

## Features

### User
- Account registration and authentication (email & password)
- Profile editing — nickname, favorite team, avatar, age
- Public/private profile visibility toggle
- Global user map showing fan locations
- Access streak tracking and daily gift redemption

### Fan (Fanático)
- **Card Album** — collect, view, and manage your card collection
- **Card Trading** — request, publish, and complete card trades with other fans
- **Card Packs** — buy and open packs to discover new cards
- **Mii-style Avatar** — fully customizable character and jersey designer
- **Match Rooms** — create and join real-time match experience rooms
- **Rankings** — weekly leaderboard and season stats
- **Trivia, Polls & Quizzes** — participate and earn rewards
- **AI Content Suggestions** — personalized content feed powered by AI
- **Season Rewind** — end-of-season recap for each user
- **Merchandise Store** — redirects to official team merch
- **Ticket Redirect** — direct link to match ticket purchases
- **Next Match Timer** — countdown to the upcoming game
- **Team Statistics** — view real-time team performance data
- **Explore Other Fans** — browse other users' profiles and albums
- **VR Stadium Experience** — immersive in-stadium virtual reality view
- **Battle Pass-style Rewards** — seasonal gift progression system

### Administrator
- News management — create, edit, and publish stories
- Season calendar — add, modify, and delete schedule entries
- Card registry — add, remove, and view cards by category
- Trivia/Poll/Quiz management — full CRUD with reward assignment
- Engagement analytics — interaction rates, completion times, response data
- Team timeline — create and manage historical milestones
- Season countdown banner
- Album completion leaderboard — track who finishes first
- User statistics dashboard — album completion %, streaks, quizzes completed

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Database | [Supabase](https://supabase.com/) (PostgreSQL) |
| Auth | Supabase Auth |
| Styling | TBD |
| AI Features | TBD |
| VR | TBD |

---

## Non-Functional Requirements

- **Design** — Intuitive, sports-themed UI aligned with Real Valencia's brand colors and identity
- **Scalability** — Horizontal auto-scaling architecture
- **Security** — HTTPS-only communication; sensitive data stored encrypted
- **TypeScript** — Used across the entire frontend and backend codebase

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL, anon key, and any other secrets

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Project Structure

```
/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable UI components
├── lib/              # Supabase client, utilities, helpers
├── types/            # TypeScript type definitions
└── public/           # Static assets
```

---

## License

Private — All rights reserved.
