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

# Features

## User Features

### Account System

- Email and password authentication
- Profile creation and editing
- Nickname
- Avatar
- Favorite team
- Age
- Profile visibility settings

### Global Fan Map

Fans can view a world map showing the location of other Valencia CF supporters.

### Daily Rewards

- Daily login streaks
- Daily gifts and rewards

---

## Fan Features

### Card Album

Users collect and manage **digital collectible cards** related to:

- Players
- Historic moments
- Club legends

### Card Trading

Fans can trade cards with other users through a trading system.

### Card Packs

Users can purchase and open digital packs containing random collectible cards.

### Custom Avatar

Fans can create customizable avatars similar to **Mii-style characters**, including:

- Clothing
- Jersey customization
- Accessories

### Match Rooms

Fans can create or join rooms during matches to interact with other supporters in real time.

### Rankings

Weekly leaderboards highlight the most active and successful fans.

### Trivia, Polls and Quizzes

Fans can participate in interactive challenges and earn rewards.

### AI Content Suggestions

The platform can recommend personalized content based on fan activity and preferences.

### Season Rewind

At the end of the season, users receive a personalized summary of their activity.

### Merchandise Store

Direct access to official **Valencia CF merchandise**.

### Ticket Access

Quick access to official ticket purchase pages.

### Next Match Countdown

A countdown timer showing the time remaining until the next match.

### Team Statistics

Fans can view updated statistics about the team and its players.

### Explore Fans

Users can browse other fan profiles and explore their collections.

---

# VR Stadium Experience

Valencia Infinity includes a **Virtual Reality experience** that allows fans to explore the stadium in an immersive environment.

The VR experience is developed using:

- **Unity**
- **C#**

Fans will be able to navigate the stadium digitally and interact with virtual elements related to the club.

---

# Seasonal Reward System

The platform includes a **battle-pass style progression system** where fans unlock rewards based on their participation and engagement during the season.

Rewards may include:

- Digital collectibles
- Exclusive content
- Profile customization items

---

# Administrator Features

### News Management

Administrators can create, edit, and publish news articles related to Valencia CF.

### Season Calendar

Management of upcoming matches and season events.

### Card Registry

Administrators can create and manage collectible cards available on the platform.

### Trivia / Poll / Quiz Management

Creation and configuration of fan engagement challenges.

### Engagement Analytics

The system tracks:

- Participation rates
- Completion times
- User responses
- Platform engagement

### Historical Timeline

A timeline of important events in Valencia CF history.

### Season Countdown Banner

Visual countdowns for major club events.

### Album Completion Leaderboard

Tracking fans who complete their card albums first.

### User Statistics Dashboard

Administrators can monitor:

- Album completion rates
- Login streaks
- Quiz participation
- Fan activity metrics

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
| Styling          | TBD               |

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
