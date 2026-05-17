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

Included:

- User authentication
- Parent profile
- Story catalog
- Story categories
- Story details screen
- Reader mode
- Page illustrations
- Favorites
- Reading progress
- User profile

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

Current roles:

## Parent

Capabilities:

- Login
- View stories
- Open stories
- Read pages
- Add favorites
- Save progress

Future roles (NOT MVP):

- Child
- Moderator
- Content editor
- Author

---

# 4. Screens

Authentication:

1. Splash
2. Onboarding
3. Login
4. Register

Main:

5. Home
6. Categories
7. Story Details
8. Reader
9. Favorites
10. Profile

Future:

- Settings
- Audio player
- Child mode
- Library sync

---

# 5. User Flow

User opens app

Splash

↓

Onboarding

↓

Login/Register

↓

Home

↓

Select category

↓

Open story

↓

Reader

↓

Save progress

↓

Favorites/Profile

---

# 6. Firebase Architecture

Firebase services:

Auth:
- Email/password

Firestore:
- Stories
- Pages
- Favorites
- Progress
- User profiles

Storage:
- Covers
- Page illustrations

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

page-1.webp

page-2.webp

page-3.webp

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

Firestore:

No open access

Forbidden:

allow read, write: if true;

Required:

Authenticated access

User data isolation

Favorites:

Owner only

Progress:

Owner only

Stories:

Read-only

Storage:

Public only for story assets

User files:

Private

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
Firebase integration

Phase 3:
Auth

Phase 4:
Story catalog

Phase 5:
Reader

Phase 6:
Favorites

Phase 7:
Progress

Phase 8:
UI polish

No feature expansion before MVP completion.

---

# 15. Future Expansion

Possible extensions:

Audio books

Child profile

Offline reading

Premium library

Author platform

Content moderation

AI illustration pipeline

Subscriptions

Parental dashboard

Cloud Functions backend

Multi-language support

These features are NOT part of MVP.

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
| `status` | string | yes | `draft` \| `published` — MVP catalog reads `published` only |
| `createdAt` | timestamp | yes | |
| `updatedAt` | timestamp | yes | |

**Ownership:** Authenticated users read `published` stories only. No client writes in MVP.

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

**Ownership:** Authenticated read only. Query by `storyId` + order by `pageNumber`. No client writes in MVP.

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
| `stories` | Authenticated (`published`) | None (MVP) |
| `storyPages` | Authenticated | None (MVP) |
| `favorites` | Own docs only | Own docs only |
| `readingProgress` | Own docs only | Own docs only |

Content ingestion (stories, pages, images): manual upload via Firebase Console / CLI — not in-app admin (§25).

---

# 18. Firestore Access Rules

MVP security model. No public writes. No open collections.

```
// Principle: deny by default; allow explicitly
```

| Collection | Read | Write | Delete |
|------------|------|-------|--------|
| **Stories** | Authenticated; `status == 'published'` | Denied | Denied |
| **Story pages** | Authenticated | Denied | Denied |
| **Favorites** | Owner (`userId == auth.uid`) | Owner create/update | Owner |
| **Reading progress** | Owner (`userId == auth.uid`) | Owner create/update | Owner |
| **Users** | Owner (`uid == auth.uid`) | Owner | Denied (or owner soft-delete only if added later) |

**Global rules:**

- `request.auth != null` required for all reads except none — everything requires auth in MVP
- No `allow read, write: if true`
- No unauthenticated catalog access
- No cross-user reads on `favorites` or `readingProgress`
- Story content writes only via Admin SDK / Console (outside app)

---

# 19. Screen State Flows

UI states must map to `DESIGN_CODE.md` components (§27–§28, §32). No crash on empty or error.

---

## Home

```
loading → success
loading → empty (no published stories)
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

```
loading → success
loading → error → retry → loading
```

| State | Data | UI |
|-------|------|-----|
| `loading` | User profile | Skeleton rows |
| `success` | Profile loaded | Settings, theme toggle |
| `error` | Profile failed | Error State + retry |

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

**Access:** Story assets read-only for authenticated app users; writes via Console/CLI only in MVP.

---

# 21. Environment Rules

| Environment | Purpose |
|-------------|---------|
| `development` | Local Expo dev; Firebase dev project |
| `production` | Store builds; Firebase production project |

**MVP:**

- **No test/staging environment** — reduces config drift and cost
- Firebase config per environment in env files (e.g. `.env.development`, `.env.production`) — not committed with secrets
- Use `app.config.js` / Expo `extra` to inject public Firebase keys at build time

**Rules:**

- Store Firebase config separately from feature code
- No secrets inside React components or screens
- No hardcoded story IDs, user IDs, or collection paths in UI — use constants module
- `DESIGN_CODE.md` tokens for UI; Firebase config for backend only

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
| **Auth error** | Clear message; route to Login | No stack trace to user |
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
| Runtime | Expo |
| UI framework | React Native |
| Auth | Firebase Auth |
| Database | Firestore |
| Files | Firebase Storage |
| Backend | **No backend server** |
| Architecture | **No microservices** |
| Admin | **No admin panel** |
| AI | **No AI** |
| Payments | **No payments** |
| Subscriptions | **No subscriptions** |

**Also frozen (see §2, §14):**

- No audio, offline, push, comments, social, child accounts, gamification in MVP

**Visual source of truth:** `DESIGN_CODE.md` v1.0 — implementation must not drift from tokens, Reader contract, or illustration rules.

**Change process:** New stack or feature → update this document (§37 in `DESIGN_CODE.md` design process applies to UI; tech changes update `TECHNICAL_PASSPORT` first).

---

## Document Status

**TECHNICAL_PASSPORT v1.0**  
**Implementation source of truth**

| Version | Date | Notes |
|---------|------|-------|
| v1.0 | 2026-05-17 | Production-ready technical reference for MVP |

---

END OF DOCUMENT