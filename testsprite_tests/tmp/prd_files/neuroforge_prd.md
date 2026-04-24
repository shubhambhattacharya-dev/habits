# NeuroForge — Cognitive Enhancement OS

## Product Overview
NeuroForge is an AI-powered cognitive enhancement platform that treats productivity, consistency, and decision-making as a rigorous, data-centric engineering problem. It integrates evidence-based psychological frameworks (Atomic Habits, Deep Work, Thinking Fast & Slow) into daily rituals, habit tracking, and AI-powered task decomposition.

## Target Users
- Single-user personal productivity tool
- No authentication required
- Local-first with cloud database (Neon PostgreSQL)

## Core Features

### 1. Home Dashboard (/)
- Dynamic time-of-day greeting
- NeuroScore ring (0-1000) visualization
- Stat cards: Focus Minutes, Habits Done, Current Streak, Clarity Score
- "One Thing" highest-leverage task display
- Daily book wisdom quote
- Quick action buttons to all modules

### 2. Clarity Engine (/clarity)
- Text input for describing overwhelming problems
- AI decomposition via Groq Llama 3.3 70B
- Generates prioritized task cards (critical/high/medium/low)
- Each task has urgency score, impact score, estimated time, and steps
- Checkable steps within each task

### 3. Focus Shield (/focus)
- Configurable deep work timer (25/45/60 min)
- Start/Pause/Reset controls
- "I'm Tempted" emergency intervention with 60-second cooldown
- Distraction source logging
- Daily focus statistics

### 4. Habit Forge (/habits)
- Database-backed habit list with completion toggles
- Progress bar for daily completion rate
- Expandable 4 Laws details (Cue, Craving, Response, Reward)
- Streak tracking per habit
- Identity statement display
- New Habit creation button

### 5. Evening Reflection (/reflect)
- Mood scale (1-10)
- Productivity scale (1-10)
- Three reflective questions with text inputs
- AI-generated "Truth Report" via Groq streaming
- Framework reference footer

### 6. Book Wisdom (/wisdom)
- Expandable book cards (Atomic Habits, Deep Work, Psychology of Money, Thinking Fast & Slow)
- Key principles with explanations
- Application suggestions
- Teach Back button for Feynman Technique testing

### 7. Rewire Challenges (/challenges)
- 7/14/21-day structured challenge programs
- Filter by status: All, Available, Active, Completed
- Progress bars with day counts
- Difficulty badges (easy/medium/hard/extreme)
- Start Challenge and Log Today actions

## Tech Stack
- Next.js 16 (App Router), TypeScript, Tailwind CSS
- Prisma ORM with PostgreSQL (Neon)
- Groq API (Llama 3.3 70B) via Vercel AI SDK
- Lucide React icons

## Non-Functional Requirements
- No authentication (single-user tool)
- Dark theme ("Neural Void" design system)
- Responsive layout with sidebar navigation
- All pages must load without errors
