# TECHNICAL_PASSPORT.md
Project: Chytayko
Type: Mobile application (Pet-project / Portfolio MVP)
Stack: Expo + React Native + Firebase
Status: MVP Planning
Source of Truth: This document is the absolute reference for product, architecture and development decisions.

---

# 1. Product Vision

Chytayko is a mobile application for parents and children (4+ years).

Purpose:

- Read adapted Ukrainian fairy tales
- Focus on visual reading experience
- Simple child-friendly interface
- Parent-controlled content usage
- Demonstrate Expo + React Native + Firebase skills

This project is:

- Portfolio project
- Learning project
- Expandable foundation

This project is NOT initially:

- Commercial SaaS
- Marketplace
- AI platform
- Audio service
- Social network

---

# 2. MVP Scope

**Access model: Public-first**

Reading stories does **not** require authentication.

Included:

**Public (no login required):**

- Story catalog (Home)
- Story details screen
- Reader mode
- Page illustrations
- Favorites (local-first MVP, persisted with AsyncStorage)
- Reading progress (local-first MVP, persisted with AsyncStorage)

**Optional account (Profile):**

- User authentication (email/password) — optional
- Login / Register screens
- Parent profile (account area)
- Logout

**Rule:**

> **AUTH MUST NOT GATE READING.**

Excluded from MVP:

- Audio stories
- AI generation
- Premium subscription
- Admin panel
- Content moderation
- Push notifications
- Offline mode
- Comments
- Social features
- Child accounts
- Gamification
- Payments

---

# 3. User Roles

## Guest (default)

Anyone using the app without signing in.

Capabilities (MVP):

- View story catalog
- Open stories
- Read pages
- Add favorites (local device, AsyncStorage — no login)
- Save reading progress (local device, AsyncStorage — no login)
- Open Profile and choose Login / Register

No login required.

## Parent (optional, signed in)

Same reading capabilities as Guest, plus:

- Account identity (email)
- Profile with logout
- Foundation for future cloud sync of favorites and progress

Auth is optional and belongs to Profile / account features — not to reading.

Future roles (NOT MVP):

- Child
- Moderator
- Content editor
- Author

---

# 4. Screens

**Public screens (no auth required):**

1. Splash
2. Home
3. Story Details
4. Reader
5. Favorites

**Account screens (optional auth):**

6. Login
7. Register
8. Profile

**Secondary / future in stack:**

9. Onboarding (optional entry — not required before reading)
10. Categories (future catalog filter)

Future:

- Settings
- Audio player
- Child mode
- Library sync

---

# 5. User Flow

**Public-first flow (default):**

User opens app

↓

Splash

↓

Home (catalog)

↓

Story Details

↓

Reader

↓

(Local progress saved automatically)

↓

Favorites (local list)

**Optional account flow (from Profile only):**

Profile

↓

Login or Register (optional)

↓

Return to reading — no re-gating

**Rules:**

- Login / Register are **not** required before reading
- Splash goes to **Home** by default
- Auth never blocks app startup

---

# 6. Firebase Architecture

Firebase is **optional in MVP runtime**. The app must open and support reading without Firebase configuration (mock / demo mode).

Firebase services (when configured):

Auth:
- Email/password — optional; Profile and Login / Register only
- **Must not block app startup** if env vars are missing

Firestore (future data layer):
- Stories (catalog)
- Story pages
- User profiles
- Favorites (cloud sync — post-MVP)
- Reading progress (cloud sync — post-MVP)

Storage (future):
- Covers
- Page illustrations

**MVP local-first (no Firestore required to read):**

- Story catalog → mock service
- Favorites → local mock service, **persisted with AsyncStorage** on device
- Reading progress → local mock service, **persisted with AsyncStorage** on device
- Auth is optional; signed-in account may enable **cloud sync in a future phase** (not MVP)
- Firestore sync for favorites and progress is **future** — not a current MVP requirement

Future:

Cloud Functions:
NOT MVP

Remote Config:
NOT MVP

Analytics:
OPTIONAL

---

# 7. Firestore Schema

users

Document:

id
name
email
avatar
createdAt

---

stories

Document:

id
title
description
ageGroup
category
coverImage
pageCount
createdAt
updatedAt

---

storyPages

Document:

id
storyId
pageNumber
text
imageUrl

---

favorites

Document:

id
userId
storyId
createdAt

---

readingProgress

Document:

id
userId
storyId
lastPage
updatedAt

---

# 8. Storage Structure

stories/

story-id/

cover.webp

page-001.webp

page-002.webp

page-003.webp

Future:

audio/

thumbnails/

avatars/

---

# 9. App Architecture

Feature-based architecture

src/

app/

components/

features/

auth/

stories/

reader/

favorites/

profile/

services/

firebase/

hooks/

types/

utils/

assets/

Rules:

- No business logic inside screens
- Firebase isolated in services
- Features independent
- Shared components reusable

## Offline / network (MVP)

**Phase status:** NetInfo integration deferred.

**Current behavior:**

- Fallback network service (`src/features/app/services/networkStatusService.ts`)
- App assumes online
- Reading not blocked
- Favorites not blocked
- Reader not blocked
- Home offline banner inactive

**Future activation:**

- Add `@react-native-community/netinfo`
- Enable real online/offline detection in `networkStatusService`
- Keep public-first behavior — informational banner only; no auth gate, no retry logic, no cloud sync in this phase

---

# 10. UI Principles

Audience:

Children 4+

Rules:

- Large touch targets
- Minimal text
- High contrast
- Large illustrations
- Calm palette
- Simple navigation
- Low interaction complexity

Avoid:

- Tiny buttons
- Dense layouts
- Complex menus
- Multi-step flows

---

# 11. Performance Rules

Images:

Format:

WEBP only

Recommended size:

100–200 KB

Avoid:

PNG
Large originals
Multiple downloads

Loading:

Lazy loading

Pagination

Never load full library

---

# 12. Security Rules

**Principle: AUTH MUST NOT GATE READING.**

Firestore:

No open writes

Forbidden:

allow read, write: if true;

**Stories & pages (when on Firestore):**

- Read access for catalog content must not require login for the public-first app model
- Client writes denied in MVP (ingestion via Console / CLI only)

**User-owned data (when on Firestore):**

- `favorites` — owner only
- `readingProgress` — owner only
- `users` — owner only

**MVP before Firestore:**

- Favorites and progress stay on device (AsyncStorage via local mock services)
- No auth check to read stories
- App must work **without login** and **without Firebase env** for reading

Storage:

- Story assets (covers, pages) — read-only for app users when integrated
- User files — private

Auth errors:

- Confined to Login / Register screens only
- Never crash or block Splash, Home, Reader, Favorites

---

# 13. Budget Protection

Enable:

Firebase App Check

Budget alerts:

1 €
5 €
10 €
20 €

Use:

Lazy loading

Small images

Query limits

Avoid:

Unlimited reads

Large files

Repeated fetch loops

---

# 14. Development Rules

Build order:

Phase 1:
Project setup

Phase 2:
Theme system

Phase 3:
Navigation (public-first)

Phase 4:
Story catalog (mock)

Phase 5:
Reader

Phase 6:
Favorites (local-first, AsyncStorage)

Phase 7:
Reading progress (local-first, AsyncStorage)

Phase 8:
Optional auth (Profile, Login, Register)

Phase 9:
Firebase foundation (non-blocking)

Phase 10:
UI polish

**Rules:**

- Ship public reading path before requiring any Firebase env
- **AUTH MUST NOT GATE READING**
- Do not add navigation guards that force Login before Home / Reader

No feature expansion before MVP completion.

---

# 15. Future Expansion

Possible extensions:

Cloud sync for favorites and reading progress (Firestore, per-account) — **post-MVP; not required for current release**

Firestore-backed story catalog (replace mock service)

Offline reading

Audio books

Child profile

Premium library

Author platform

Content moderation

AI illustration pipeline

Subscriptions

Parental dashboard

Cloud Functions backend

Multi-language support

These features are NOT part of MVP.

MVP stays public-first: reading remains free of mandatory login even after Firebase data integration.

---

# 16. Branding & ASO

App Title:

Читайко: Казки для дітей

Subtitle / Short Description:

Українські народні казки на ніч

Brand Name:

Читайко

ASO Keywords:

казки
казки для дітей
українські казки
казки на ніч
народні казки
дитячі казки

Rule:

ASO has higher priority than brand positioning during MVP stage.
Brand-first strategy may be reconsidered after launch.

---

# 17. Firestore Detailed Schema

Canonical data model for MVP. Field names are exact — use in types, services, and security rules.

Visual and empty-state behavior: `DESIGN_CODE.md` (§27, §32).

---

## Collection: `users`

Document ID: Firebase Auth `uid`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Same as document ID (`uid`) |
| `email` | string | yes | From Auth; mirrored for queries |
| `displayName` | string | no | Parent display name |
| `avatar` | string | no | Storage URL or null |
| `createdAt` | timestamp | yes | Server timestamp on create |
| `updatedAt` | timestamp | yes | Server timestamp on update |

**Ownership:** User may read and write only their own document (`request.auth.uid == userId`).

---

## Collection: `stories`

Document ID: auto-generated or explicit `id` (must match `id` field)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Document ID |
| `slug` | string | yes | URL-safe key; see §24 |
| `title` | string | yes | Ukrainian title (MVP) |
| `description` | string | yes | Short preview text |
| `ageGroup` | string | yes | e.g. `4+`, `5+` |
| `category` | string | yes | Category slug or id |
| `coverImage` | string | yes | Storage path or download URL |
| `pageCount` | number | yes | Total pages; must match `storyPages` count |
| `status` | string | yes | `draft` \| `active` — MVP catalog reads `active` only; `draft` is hidden from users |
| `createdAt` | timestamp | yes | |
| `updatedAt` | timestamp | yes | |

**Story status rules:**

- `active` — visible in catalog and readable by all users (public)
- `draft` — hidden from catalog; not shown to users in MVP
- Do not use `published` (outdated; replaced by `active`)

**Ownership:** Public read for `active` stories only. No client writes in MVP.

---

## Collection: `storyPages`

Document ID: auto-generated or `{storyId}_{pageNumber}`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Document ID |
| `storyId` | string | yes | Reference to `stories.id` |
| `pageNumber` | number | yes | 1-based index |
| `text` | string | yes | Page body (Ukrainian, MVP) |
| `imageUrl` | string | no | Storage path or URL; null if text-only page |
| `createdAt` | timestamp | yes | |

**Ownership:** Public read. Query by `storyId` + order by `pageNumber`. No client writes in MVP.

---

## Collection: `favorites`

Document ID: recommended `{userId}_{storyId}` for idempotency

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Document ID |
| `userId` | string | yes | Auth `uid` |
| `storyId` | string | yes | Reference to `stories.id` |
| `createdAt` | timestamp | yes | |

**Ownership:** Owner only — `request.auth.uid == resource.data.userId` on read/write/delete.

---

## Collection: `readingProgress`

Document ID: recommended `{userId}_{storyId}`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Document ID |
| `userId` | string | yes | Auth `uid` |
| `storyId` | string | yes | Reference to `stories.id` |
| `lastPage` | number | yes | Last read page (1-based) |
| `completed` | boolean | yes | `true` when user finished last page |
| `updatedAt` | timestamp | yes | |

**Ownership:** Owner only — `request.auth.uid == resource.data.userId` on read/write/delete.

---

## Ownership Summary

| Collection | Client read | Client write |
|------------|-------------|--------------|
| `users` | Own doc only | Own doc only |
| `stories` | Public read (`active` only) when on Firestore; mock without Firebase | None (MVP) |
| `storyPages` | Public read when on Firestore; mock without Firebase | None (MVP) |
| `favorites` | Own docs only | Own docs only |
| `readingProgress` | Own docs only | Own docs only |

Content ingestion (stories, pages, images): manual upload via Firebase Console / CLI — not in-app admin (§25).

---

## Firebase seed (development only)

- Development uses **test content only** — no final story content before development is explicitly complete.
- No copyrighted material without clear rights.
- **Seed collections:** `stories`, `storyPages` only (not `users`, `favorites`, or `readingProgress` in MVP seeding).
- **Status:** `draft` — hidden from catalog; `active` — visible (see Story status rules above).
- **Storage naming** (§20): `stories/{story-slug}/cover.webp`, `page-001.webp`, … — **WEBP only**, 3-digit zero-padded page files.
- No automated seed scripts in the repo; manual Console / CLI ingestion only.

---

## Firestore indexes (development foundation only)

Composite indexes live in `firestore.indexes.json` (referenced by `firebase.json`). Deploy with rules when the Firebase project is ready.

| Collection | Index fields |
|------------|----------------|
| `stories` | `status` ASC, `createdAt` DESC |
| `stories` | `status` ASC, `title` ASC |
| `storyPages` | `storyId` ASC, `pageNumber` ASC |
| `favorites` | `userId` ASC, `updatedAt` DESC |
| `readingProgress` | `userId` ASC, `updatedAt` DESC |

MVP catalog queries may sort client-side until Firestore `orderBy` is adopted; indexes are provisioned for near-future server-side queries and cloud sync.

---

# 18. Firestore Access Rules

Target security model when Firestore replaces mocks. **Current MVP app does not require Firestore to read.**

```
// Principle: deny by default; allow explicitly
// AUTH MUST NOT GATE READING — catalog is public read
```

| Collection | Read | Write | Delete |
|------------|------|-------|--------|
| **Stories** | Public; `status == 'active'` | Denied | Denied |
| **Story pages** | Public | Denied | Denied |
| **Favorites** | Owner (`userId == auth.uid`) when signed in | Owner create/update | Owner |
| **Reading progress** | Owner (`userId == auth.uid`) when signed in | Owner create/update | Owner |
| **Users** | Owner (`uid == auth.uid`) | Owner | Denied (or owner soft-delete only if added later) |

**Global rules:**

- Story catalog and pages: **no auth required to read**
- Favorites and progress: require auth only when syncing to Firestore (future); local MVP uses AsyncStorage without login
- No `allow read, write: if true`
- No cross-user reads on `favorites` or `readingProgress`
- Story content writes only via Admin SDK / Console (outside app)

**MVP without Firestore:**

- App uses mock catalog and local favorites/progress (AsyncStorage) — Firestore rules do not apply at runtime
- Reading, favorites, and progress work with no Firebase configuration

---

# 19. Screen State Flows

UI states must map to `DESIGN_CODE.md` components (§27–§28, §32). No crash on empty or error.

Public screens (Home, Story Details, Reader, Favorites) must load without auth. **AUTH MUST NOT GATE READING.**

---

## Splash

```
initializing → navigate Home
```

| State | Data | UI |
|-------|------|-----|
| `initializing` | No auth wait | Brand / calm loader |
| `done` | Route ready | Navigate to **Home** — never to Login |

Firebase init and auth subscription run in background; Splash does not block on them.

---

## Home

```
loading → success
loading → empty (no active stories)
loading → error → retry → loading
```

| State | Data | UI |
|-------|------|-----|
| `loading` | Fetching catalog | Skeleton Story Cards (§27) |
| `success` | ≥1 story | Story Card list + categories |
| `empty` | 0 stories | Empty State — No stories (§32) |
| `error` | Fetch failed | Error State + retry (§32) |

---

## Story Details

```
loading → success
loading → error → retry → loading
```

| State | Data | UI |
|-------|------|-----|
| `loading` | Fetching story meta | Skeleton cover + text |
| `success` | Story loaded | Cover, title, CTA Read |
| `error` | Story missing / network | Error State + back |

---

## Reader

```
loading → reading
loading → error → retry → loading
reading → completed (last page reached)
```

| State | Data | UI |
|-------|------|-----|
| `loading` | Fetching pages | Soft fade or skeleton; no bottom tab (§26) |
| `reading` | Page content | Reader Contract (§26) |
| `completed` | `completed: true` in progress | Optional calm message; no confetti |
| `error` | Pages failed | Error State; preserve back navigation |

---

## Favorites

Public screen. Works without login (local mock in MVP).

```
loading → success
loading → empty
loading → error → retry → loading
```

| State | Data | UI |
|-------|------|-----|
| `loading` | Fetching favorites | Skeleton cards |
| `empty` | 0 favorites | Empty State — No favorites (§32) |
| `success` | ≥1 favorite | Story Card list |
| `error` | Fetch failed | Error State + retry |

---

## Profile

Optional auth. Does not gate reading.

```
guest → success (logged out UI)
authenticated → success (user info + logout)
```

| State | Data | UI |
|-------|------|-----|
| `guest` | No Firebase user | Login + Register buttons |
| `authenticated` | User signed in | Email, logout, settings (future) |
| `auth_error` | Login/Register only | Error on auth screens — not on Profile startup |

---

# 20. Storage Rules

Canonical path layout. Aligns with §8; page naming standardized here.

```
stories/
  {story-slug}/
    cover.webp
    page-001.webp
    page-002.webp
    page-003.webp
```

**Rules:**

| Rule | Requirement |
|------|-------------|
| Format | **WEBP only** — no PNG, no JPEG in production assets |
| Page naming | Sequential zero-padded: `page-001.webp`, `page-002.webp`, … |
| Cover | Always `cover.webp` |
| Slug folder | Lowercase, kebab-case story slug (§24) — no spaces |
| Characters | `a-z`, `0-9`, hyphen only in paths |
| Size | 100–200 KB per image target (§11) |

**Forbidden:**

- `page-1.webp` (unpadded) in new content
- Spaces in folder or file names
- `Cover.PNG`, mixed case extensions
- Non-sequential gaps without documented reason

**Access:** Story assets read-only for app users (no login required to read); writes via Console/CLI only in MVP.

---

# 21. Environment Rules

| Environment | Purpose |
|-------------|---------|
| `development` | Local Expo dev; Firebase dev project (optional) |
| `production` | Store builds; Firebase production project (optional) |

**MVP:**

- **No test/staging environment** — reduces config drift and cost
- **App must work without `.env`** — mock story catalog; favorites and reading progress on device via AsyncStorage
- **App must work without login** — auth is optional (Profile only); no Firebase env required to read
- Firebase config per environment in env files (e.g. `.env.development`, `.env.production`) — not committed with secrets
- Use `app.config.js` / Expo `extra` to inject public Firebase keys at build time when present
- Missing `EXPO_PUBLIC_FIREBASE_*` vars must **not** crash the app or block Splash → Home

**Rules:**

- Store Firebase config separately from feature code
- No secrets inside React components or screens
- No hardcoded story IDs, user IDs, or collection paths in UI — use constants module
- `DESIGN_CODE.md` tokens for UI; Firebase config for backend only
- Firebase Auth errors stay inside Login / Register — never on public screens

---

# 22. Localization Rules

| Phase | Languages |
|-------|-----------|
| **MVP** | Ukrainian (`uk`) only |
| **Future** | Norwegian (`nb`), English (`en`) |

**Rules:**

- All user-visible text centralized — i18n dictionary or `locales/uk.json`
- No inline strings in components or screens
- Firestore story `title`, `description`, `text` stored in Ukrainian for MVP
- ASO strings (§16) remain Ukrainian for store listing
- When adding `nb` / `en`: extend locale files only; do not fork components per language

**Visual copy tone:** `DESIGN_CODE.md` §32 — calm, warm, supportive; Ukrainian copy must match that tone.

---

# 23. Error Handling Rules

Fail gracefully. Fallback UI required — no crash-first behavior.

| Scenario | Behavior | UI reference |
|----------|----------|--------------|
| **Empty data** | Render Empty State | §32 — context-specific copy |
| **Missing image** | Show text-only page or soft placeholder; log in dev | Reader §26 — collapse image area |
| **Failed story load** | Error State + retry | §32 Error |
| **Auth error** | Clear message on Login / Register only | No stack trace; never block reading |
| **Network failure** | Offline empty state when appropriate | §32 Offline |

**Implementation rules:**

- Services return typed results (`success` \| `error` \| `empty`) — screens branch on state (§19)
- Never assume Firestore document exists — null-check before render
- Image `onError` handler required on all story images
- Global error boundary for unexpected crashes — last resort only
- Retry actions use Secondary Button pattern (§27)

---

# 24. Naming Rules

**Stories — slug format**

- Lowercase Latin transliteration or ASCII slug
- Words separated by hyphen
- No spaces, no underscores in slug

Examples:

```
kolobok
lisychka-ta-zhuravel
koza-dereza
```

Slug = Storage folder name = stable story key in URLs/deep links (future).

---

**Images**

```
cover.webp
page-001.webp
page-002.webp
page-003.webp
```

---

**Collections (Firestore)**

- camelCase: `storyPages`, `readingProgress`, `users`, `stories`, `favorites`

---

**Assets (app bundle)**

- kebab-case: `icon-home.svg`, `empty-favorites.png` (bundle assets only if not WEBP story content)

---

**Code**

- Components: PascalCase
- Files: kebab-case or PascalCase per existing `src/` convention
- Constants: `SCREAMING_SNAKE_CASE` for env keys only

---

# 25. Technical Freeze Rules

> **FROZEN FOR MVP** — expansion allowed only after MVP completion and explicit passport revision.

| Area | Frozen choice |
|------|----------------|
| Access model | **Public-first** — reading without login |
| Runtime | Expo |
| UI framework | React Native |
| Auth | Firebase Auth (optional — Profile only) |
| Data (MVP) | Mock stories + local favorites/progress (AsyncStorage) |
| Cloud sync | **Future** — Firestore per-account (not MVP) |
| Database (future) | Firestore |
| Files (future) | Firebase Storage |
| Backend | **No backend server** |
| Architecture | **No microservices** |
| Admin | **No admin panel** |
| AI | **No AI** |
| Payments | **No payments** |
| Subscriptions | **No subscriptions** |

**Also frozen (see §2, §14):**

- No audio, offline, push, comments, social, child accounts, gamification in MVP
- **AUTH MUST NOT GATE READING**
- No mandatory Login before Home, Story Details, Reader, or Favorites

**Visual source of truth:** `DESIGN_CODE.md` v1.0 — implementation must not drift from tokens, Reader contract, or illustration rules.

**Change process:** New stack or feature → update this document (§37 in `DESIGN_CODE.md` design process applies to UI; tech changes update `TECHNICAL_PASSPORT` first).

---

# 26. Brand & Reading Philosophy (Frozen)

Product and reading principles for Chytayko. Frozen for MVP and content phase planning. Does not change runtime behavior in §1–§25 until explicitly implemented.

## 26.1 Product identity

Chytayko is:

- family reading product
- tool for building reading habits
- digital reading ritual
- public-first reading experience

**Priority order:**

1. Reading habit formation
2. Family reading ritual
3. Digital library

Digital library is supporting functionality, not the core idea.

## 26.2 Audience

**Primary:** parents, grandparents, family reading

**Secondary:** child self-reading (future growth)

**Age groups:**

| Group | Mode |
|-------|------|
| 0–2 | image-first; adult reads |
| 2–4 | co-reading |
| 4–6 | independent reading preparation |
| 6+ | future learning layer |

## 26.3 Anti-addiction contract

Chytayko **MUST NOT USE:**

- endless scroll
- autoplay
- streaks
- XP
- daily rewards
- loot mechanics
- FOMO
- return timers
- push “come back”
- ads for children
- aggressive animation
- overstimulation
- multi-focus screens

**Rule:** one primary focus per screen.

## 26.4 Reading rituals

Supported ritual modes:

- 🌙 Night reading
- ☀ Day reading
- 📖 Quiet time
- 🎉 Weekend reading
- 🚗 Travel reading

**Night mode:** warmer palette, fewer details, calmer rhythm

**Day mode:** lighter palette, more exploration, still low stimulation

## 26.5 Reading philosophy

Application **MUST NOT** replace adults.

**No:** narration, auto-reading, story voice playback, parent replacement

**Main scenario:** adult reads to child

**Secondary scenario:** child reads independently

**Future (not MVP):** hide-illustrations mode, travel reading mode, ambient layer (late phase only)

**Ambient:** optional, disabled by default, background atmosphere only, never story narration

## 26.6 Illustration philosophy

Tablet and phone layouts are different. **Do not** scale tablet composition to phone.

| Device | Priority |
|--------|----------|
| Phone | text |
| Tablet | illustration |

**Illustration layers:** A hero · B context · C details

| Device | Layers |
|--------|--------|
| Phone | A + limited B |
| Tablet | A + B + C |

**Support:** illustration-hidden mode, text-only reading

## 26.7 Brand character — Teri

**Name:** Teri

**Concept:** book creature inspired by a Boxer dog

**Role:** library guardian, quiet companion

**Constraints:** appears rarely; helps orientation; not a main hero; not a reward system; not gamification; does not replace parents

## 26.8 Product boundaries

- Digital only — no print roadmap
- Stories and illustrations belong to the **content phase** and remain **unfrozen** until that phase
- No global illustration freeze before the content phase
- Visual execution: `DESIGN_CODE.md`; store strings: §16

---

## Document Status

**TECHNICAL_PASSPORT v1.0**  
**Implementation source of truth**

| Version | Date | Notes |
|---------|------|-------|
| v1.0 | 2026-05-17 | Production-ready technical reference for MVP |

---

END OF DOCUMENT