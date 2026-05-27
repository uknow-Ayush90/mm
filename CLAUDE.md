# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push Prisma schema to Supabase (no migrations)
npm run db:seed      # Seed tags into DB
npm run db:studio    # Open Prisma Studio GUI
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:
- `DATABASE_URL` / `DIRECT_URL` — Supabase pooled + direct PostgreSQL URLs
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — for Realtime subscriptions
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — image uploads
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` / `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` — client-side
- `ADMIN_SECRET` — secret key to access `/admin?key=<value>`
- `NEXT_PUBLIC_APP_URL` — full base URL (e.g. `https://yourapp.vercel.app`) for server-side fetches

## Architecture

### No Authentication
User identity is handled without auth. On first visit, an **OnboardingModal** prompts for a display name + username → stored in `localStorage` as a `LocalUser` object (`id`, `username`, `displayName`, `avatarColor`). The `id` (a generated cuid-like string) is sent as `x-user-id` header on all mutating API requests.

**`UserContext`** (`context/UserContext.tsx`) provides `user`, `setUser`, `showOnboarding` to all client components via React Context.

### Admin Access
`/admin?key=<ADMIN_SECRET>` — the key is passed as `x-admin-key` header to protected API routes (`/api/admin`, DELETE/PATCH on `/api/memes/[id]`). No session or cookie involved.

### Data Flow
- **Server Components** (feed, leaderboard, profile, meme detail pages) fetch from Prisma directly or via internal API.
- **Client Components** (VoteButtons, CommentSection, UploadForm) call API routes with `x-user-id` header.
- **Realtime** uses Supabase `postgres_changes` subscriptions (see `hooks/useRealtimeVotes.ts`, `hooks/useRealtimeLeaderboard.ts`).

### Voting
`hooks/useVote.ts` handles optimistic updates: score updates immediately in UI, then reconciles with server response. Vote toggling (click same vote again = remove vote) is handled server-side in `/api/memes/[id]/vote/route.ts`.

### Key DB Relations
- `MemeTag` is the explicit join table between `Meme` and `Tag` (many-to-many).
- `Vote` has `@@unique([userId, memeId])` — one vote per user per meme.
- `Meme.score` = `upvotes - downvotes`, stored as a column for fast ORDER BY queries.
- `User.totalScore` = sum of all their memes' scores, updated on each vote.

### Leaderboard
Shows **top memes by score** (not users). `/api/leaderboard` returns top 20 memes ordered by score descending. Leaderboard page uses `LeaderboardClient` (client component) with Supabase Realtime subscription for live updates.

## Deployment (Vercel)

1. Push to GitHub, connect repo to Vercel
2. Set all env vars in Vercel dashboard
3. Run `npm run db:push` once to create tables in Supabase
4. Run `npm run db:seed` once to seed tags
5. In Supabase dashboard → Database → Replication → enable realtime for the `Meme` table
