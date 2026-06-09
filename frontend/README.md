# Valencia Infinity

### Valencia CF Fan Experience Platform

Valencia Infinity is a modern digital platform designed to enhance the relationship between **Valencia CF** and its global fan community.

The platform combines **social interaction, digital collectibles, match-day engagement, gamification, and immersive experiences** to create a richer and more interactive connection between supporters and the club.

Built using **React, TypeScript, and Supabase**, the system leverages a **backend-as-a-service architecture** to provide scalability, realtime features, and secure authentication without the need for a traditional backend server.

---

# Overview

Valencia Infinity is a **fan engagement platform** that allows supporters of **Valencia CF** to interact with the club and other fans through a variety of interactive experiences.

The platform provides:

- Digital collectible card albums
- Match-day interaction rooms
- Fan rankings and rewards
- Trivia and polls
- Social fan exploration
- Personalized content
- Virtual stadium experiences

The objective is to create a **community-driven ecosystem** that increases fan engagement during the entire football season.

---

# Problem Context

Modern football clubs face an important challenge: maintaining **continuous engagement with fans**, especially those who cannot attend matches in person.

Traditional digital channels such as social media offer limited interaction and do not fully capture the passion and participation of the fan community.

Valencia Infinity addresses this challenge by creating a **centralized digital platform** where fans can:

- Interact with each other
- Participate in club activities
- Collect digital memorabilia
- Compete in community rankings
- Experience immersive club-related content

This approach strengthens the connection between the club and its supporters while fostering an active global community.

---

# User Roles

## Fan

Fans are the primary users of the platform. They can interact with the system through social, collectible, and gamified features.

Fans can:

- Create and customize profiles
- Collect digital cards
- Trade collectibles
- Participate in quizzes and polls
- Join match-day rooms
- Track rankings and rewards
- Explore other fan profiles
- Access club content and statistics

---

## Administrator

Administrators manage the content and engagement features of the platform.

Administrators can:

- Publish club news
- Manage trivia, polls, and quizzes
- Register collectible cards
- Monitor platform analytics
- Manage season events and countdowns
- Track fan participation metrics

---

# Features (Frontend)

## Authentication & Account (`/login`, `/signup`, `/profile`, `/settings`)

- Email/password registration and login
- Google OAuth single sign-on
- Password reset flow
- User profile with avatar, nickname, favorite team, age
- Avatar customization system — Mii-style with interchangeable pieces (clothing, accessories, colors) stored in dedicated DB tables
- Profile visibility and privacy settings (show/hide location, collection, stats)
- Login streak tracking with daily rewards

## Home (`/home`)

- Next match countdown timer
- Recent Valencia CF news cards (RSS-fed from Marca and AS.com)
- Quick-access links to key sections (album, store, matches)

## Team (`/team`)

- Full squad roster with player photos, positions, squad numbers
- Player details: nationality, age, matches played, goals, assists

## Matches (`/matches`)

- Season match schedule (past results and upcoming fixtures)
- Real-time match rooms — fans create/join chat rooms during matches
- Live match state simulation (score, minute, events, lineups)
- League table standings

## News (`/news`)

- RSS feed integration from Marca and AS.com, filtered for Valencia CF
- Client-side XML parsing with keyword categorization (FICHAJES, PARTIDOS, CANTERA, EQUIPO, CLUB)
- Admin-published news articles with categories and images
- Local cache with 10-minute TTL

## Store (`/store`)

- **Card packs**: 500 points for a pack of 5 random cards with weighted rarity distribution (common 50%, rare 30%, epic 15%, legendary 5%)
- **Individual cards**: 200 points to choose a specific card from the catalog (all rarities except Legendario)
- Live points balance display
- Purchased packs stored in DB with `opened_at` null until opened

## Album (`/album`)

- Grid display of all collectible cards with images
- Filter by rarity: Comun, Raro, Epica, Legendario
- Search by player/card name
- Cards marked as obtained/unobtained with visual indicators
- Pack opening animation (3D flip + confetti) with rarity-based visual effects
- Album completion progress tracking
- Visit other users' albums via `/album/:userId`

## Card Exchange (`/exchange`)

- Trade cards between users via trade requests (pending → accepted/rejected/cancelled/expired)
- Public marketplace: list cards for trade or points
- Atomic trade acceptance via PostgreSQL stored procedures (ensures inventory consistency)

## Fans Zone (`/fanzone`)

- **Global Fan Map** — Mapbox-powered world map showing locations of Valencia CF supporters in real time via Supabase Realtime subscriptions
- **Rankings** — weekly leaderboard of most active fans by points
- **Trivia & Quizzes** — interactive challenges with difficulty levels (easy/medium/hard), rewards, and attempt tracking
- **Friends system**: search users, send/accept/reject friend requests, view friends list
- **Season Rewind** — personalized end-of-season summary with stats and achievements

## Match Rooms (`/match-rooms`)

- Create public or private chat rooms for match discussions
- Invite-only rooms with invite codes
- Real-time messaging via Supabase Realtime

## Daily Rewards (`/daily-rewards`)

- Daily login streak calendar
- Configurable rewards per day (points, cards, bonuses)
- Streak tracking with `profiles.current_streak`, `longest_streak`, `last_login_date`

## Virtual World (`/virtual-world`)

- 3D stadium experience built with Three.js (`@react-three/fiber`, `@react-three/drei`)
- Immersive scene with post-processing effects
- Unity WebGL game integration (`/juego`)

## Timeline (`/timeline`)

- Historical timeline of Valencia CF events with images and descriptions
- Admin-managed events

## Tickets (`/ticket`)

- Quick-access page redirecting to official Valencia CF ticket purchase

## Statistics (`/estadisticas`)

- Season statistics and data visualizations

## Admin Panel (`/admin/*`)

All admin routes are guarded by `ProtectedRoute` with `adminOnly` role check:

- **News management** — create, edit, publish news with images and categories
- **Card catalog management** — CRUD for collectible cards (`/admin/cards`)
- **Trivia management** — create/edit trivia with questions, options, correct answers, difficulty, rewards (`/admin/trivias`)
- **Reward configuration** — manage daily reward definitions (`/admin/rewards`)
- **Timeline management** — add/edit historical events (`/admin/timeline`)
- **Analytics dashboard** — participation rates, album completion, login streaks, quiz stats, fan activity metrics (`/admin/statistics`)
- **Trivia history** — view all trivia attempts and results (`/admin/trivia-history`)

## Avatar System

- Dedicated avatar builder with categorized pieces (clothing, accessories, jerseys)
- Color palette selection
- Avatar pieces stored in `AvatarPiezas` table; user configurations in `AvatarUsuario`
- Separate UI components: `AvatarAsset.tsx`, `AvatarControls.tsx`, `AvatarModel.tsx`, `AvatarSection.tsx`

## Cross-cutting Features

- **Dark mode**: toggleable via `.dark` class on `<html>`, with CSS custom properties for brand colors
- **Responsive design**: Tailwind CSS grid/layout adapts to mobile, tablet, desktop
- **Authentication guard**: `ProtectedRoute` redirects unauthenticated users to `/login` with post-login redirect state
- **Points economy**: virtual currency earned through engagement, spent in store
- **Real-time subscriptions**: match rooms, fan map, presence indicators via Supabase Realtime
- **Client-side caching**: RSS news and match data cached in `localStorage` with 10-minute TTL

---

# Tech Stack

| Layer            | Technology        |
| ---------------- | ----------------- |
| Frontend         | React (Vite)      |
| Language         | TypeScript        |
| Routing          | React Router      |
| Backend Platform | Supabase          |
| Database         | PostgreSQL        |
| Authentication   | Supabase Auth     |
| Realtime         | Supabase Realtime |
| Storage          | Supabase Storage  |
| VR Experience    | Unity + C#        |
| AI Features      | TBD               |
| Styling          | Tailwind CSS      |

---

# What is Supabase?

Supabase is an **open-source backend platform** that provides backend services out of the box.

Instead of building a traditional backend with Node.js or another framework, Supabase provides a full backend environment including:

## Database

A managed **PostgreSQL database** where all application data is stored.

## Authentication

Built-in authentication including:

- Email and password login
- Session management
- Secure access control

## APIs

Supabase automatically generates **REST APIs and realtime APIs** from the database schema.

This allows the **React frontend to communicate directly with the database**.

## Realtime

Applications can subscribe to database changes and update the UI instantly.

## Storage

File storage for:

- User avatars
- Images
- Media files

This architecture simplifies development by removing the need to manage a traditional backend server.

---

# System Architecture

Valencia Infinity follows a **frontend + backend-as-a-service architecture**.

## Frontend

- React
- TypeScript
- React Router
- Vite

## Backend Services

- Supabase Database
- Supabase Authentication
- Supabase APIs
- Supabase Realtime
- Supabase Storage

Additional integrations may include:

- AI services for personalized fan content
- Unity-based VR experiences

---

## Project Structure

```bash

/
├── frontend/ # React application (Vite)
│
│ ├── public/ # Static files
│
│ ├── src/
│ │
│ │ ├── assets/ # Images, icons, media
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Main application pages
│ │ ├── layouts/ # Application layouts
│ │ ├── hooks/ # Custom React hooks
│ │ ├── context/ # Global state (auth, user, etc.)
│ │ ├── services/ # API services
│ │ │
│ │ │ └── supabaseClient.ts # Supabase configuration
│ │ │
│ │ ├── router/ # React Router configuration
│ │ ├── types/ # TypeScript types and interfaces
│ │ ├── utils/ # Utility helper functions
│ │ ├── constants/ # Global constants
│ │
│ │ ├── App.tsx # Root React component
│ │ ├── main.tsx # Application entry point
│ │ └── vite-env.d.ts # Vite TypeScript environment types
│
│ ├── .env # Environment variables
│ ├── index.html # HTML entry file
│ ├── package.json # Frontend dependencies
│ ├── tsconfig.json # TypeScript configuration
│ └── vite.config.ts # Vite configuration
│
├── supabase/ # Supabase backend configuration
│
│ ├── migrations/ # Database migrations
│ ├── functions/ # Edge Functions (serverless logic)
│ │
│ │ └── example-function/
│ │
│ └── config.toml # Supabase project configuration
│
├── docs/ # Project documentation
│
├── .env.example # Example environment variables
├── .gitignore # Git ignore rules
├── README.md # Project documentation
└── package.json # Optional root scripts

```

---

# Getting Started

Install dependencies:

```bash
npm install
```

Create environment variables file:

```bash
cp .env.example .env
```

Run the development server:

```bash
npm run dev
```

Open the application in your browser:

```
http://localhost:5173
```

---

## Environment Variables

The project requires the following environment variables to connect to Supabase.

```env
# Frontend (React)
# These variables must start with VITE_ so they can be accessed by Vite
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Backend / Server (Supabase Edge Functions or secure environments)
# These should never be exposed in the frontend because they have elevated privileges
SUPABASE_SERVICE_ROLE_KEY=
```

---

# Non-Functional Requirements

## Design

The interface should follow a **sports-themed design aligned with Valencia CF colors and identity**.

## Scalability

The system must support **large numbers of fans interacting simultaneously**.

## Security

All communication must use:

- HTTPS
- Secure authentication
- Proper access control

## Type Safety

All code should be written using **TypeScript** to ensure maintainability and reliability.

---

# Roadmap

Future improvements may include:

- AI-powered fan recommendations
- Enhanced VR experiences
- Mobile app version
- Expanded collectible systems
- Community tournaments and challenges

---

# License

Private repository — all rights reserved.
