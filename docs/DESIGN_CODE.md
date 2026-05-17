# DESIGN_CODE.md

Project: Chytayko  
Style Name: Nordic Quiet Minimal  
Status: Source of Truth for UI/UX Design

---

# 1. Design Direction

Chytayko uses a calm, airy, Scandinavian-inspired visual style.

Core idea:

Nordic calm + children’s storybook + one-line minimal illustrations.

The app must feel:

- calm
- safe
- warm
- light
- spacious
- trustworthy
- child-friendly
- not childish-chaotic

The app must NOT feel:

- loud
- cartoon-overloaded
- banking-like
- governmental
- corporate
- neon
- cluttered
- Disney-like

---

# 2. Visual Inspiration

Primary inspiration:

- Scandinavian interiors
- Norwegian natural colors
- warm paper
- quiet children’s books
- simple line art
- Picasso-style one-line drawings

Secondary inspiration:

- mountains
- forests
- wooden houses
- linen
- soft evening light

Important rule:

Nature is used as color inspiration, not as heavy background decoration.

---

# 3. Design Philosophy

The interface should feel like:

“A calm Scandinavian children’s reading room.”

Not:

“A colorful kindergarten app.”

Not:

“A bank app.”

Not:

“A tourist app about Norway.”

---

# 4. Space and Layout

The design must use generous spacing.

Rules:

- Prefer empty space over decoration
- Avoid dense screens
- Avoid heavy visual blocks
- Each screen should have one clear purpose
- Use large cards
- Use large touch targets
- Use simple navigation

Minimum touch target:

44x44 px

Preferred touch target:

48x48 px or larger

---

# 5. Color System

## Light Theme: Nordic Paper

Purpose:

Daytime reading, calm browsing, parent-child use.

Recommended colors:

Background:
- Warm paper
- Soft linen
- Cream white

Surface:
- Light beige
- Warm off-white

Text:
- Soft graphite
- Warm dark gray

Accent:
- Muted terracotta
- Forest green
- Dusty blue

Avoid:

- Pure white background
- Pure black text
- Neon colors
- Saturated primary blue
- Bright red
- Acid green

---

## Dark Theme: Night Story

Purpose:

Evening reading, bedtime, low eye strain.

Dark mode must not be a simple color inversion.

Recommended colors:

Background:
- Deep gray-blue
- Night graphite
- Warm charcoal

Surface:
- Soft dark slate
- Muted dark blue-gray

Text:
- Warm milk
- Soft light gray

Accent:
- Muted sage
- Soft terracotta
- Misty blue

Avoid:

- Pure black background
- Pure white text
- Neon green
- Bright blue
- High contrast UI
- Developer-style dark mode

Dark theme should feel like:

“Reading a bedtime story under a blanket.”

Not:

“Opening VS Code at 2 AM.”

---

# 6. Theme Rules

Both light and dark themes are required from the beginning.

Rules:

- All colors must be token-based
- No hardcoded colors inside screens
- Components must support both themes
- Reader must support night reading mode
- Dark mode must be soft, not high-contrast
- Accent colors must remain muted in both themes

Theme names:

Light:
Nordic Paper

Dark:
Night Story

---

# 7. Typography

Typography must be calm and readable.

Rules:

- Large readable text
- Clear hierarchy
- No decorative fonts for body text
- No playful chaotic fonts
- No overly corporate typography

Recommended hierarchy:

Screen title:
Large, calm, readable

Section title:
Medium, clear

Body text:
Comfortable reading size

Story text:
Larger than normal app text

Story reader priority:

Readability > visual style

---

# 8. Reader Design

Reader is the most important screen.

Reader rules:

- No clutter
- No unnecessary buttons
- Large text
- Large image area
- Comfortable line height
- Clear page navigation
- Soft background
- Minimal controls

Allowed controls:

- Back
- Previous page
- Next page
- Favorite
- Progress indicator

Avoid:

- Bottom tab noise inside reader
- Too many icons
- Ads
- Bright buttons
- Dense toolbars

Reader must feel slow and calm.

---

# 9. Illustration Style

Primary illustration style:

Minimal one-line drawings.

Inspired by:

- Picasso one-line animal drawings
- Simple storybook sketches
- Scandinavian minimalism

Use for:

- Empty states
- Icons
- onboarding
- category visuals
- small decorative moments

Examples:

- fox in one line
- bear in one line
- open book in one line
- moon in one line
- small mountain line
- cloud line

Avoid:

- Heavy cartoon characters
- Over-detailed illustrations
- Large background images
- Full-screen decorative scenes
- Random illustration styles

Important:

Illustrations should support the interface, not dominate it.

---

# 10. Image Usage

Story images are allowed, but UI backgrounds should stay clean.

Rules:

- No overloaded background images
- No photo backgrounds for main UI
- No heavy textures
- No full-screen nature backgrounds
- No busy visual layers

Story covers:

- Soft
- Warm
- Simple
- Not too saturated

Page illustrations:

- Can be more expressive
- Must not break calm visual tone

---

# 11. Components

## Buttons

Buttons should be:

- rounded
- large
- calm
- clear
- not flashy

Primary button:

Muted accent background  
Readable soft text

Secondary button:

Light surface  
Soft border  
Graphite text

Avoid:

- Neon button colors
- Harsh shadows
- Tiny buttons
- Too many primary buttons on one screen

---

## Cards

Cards should be:

- spacious
- rounded
- soft
- minimal
- easy to tap

Use cards for:

- story previews
- categories
- favorites
- profile sections

Avoid:

- dense grids
- heavy borders
- aggressive shadows
- too many cards per screen

---

## Icons

Icon style:

- thin line
- rounded
- minimal
- consistent stroke width

Preferred:

- book
- moon
- star
- heart
- fox
- bear
- home
- profile

Avoid:

- filled cartoon icons
- mismatched icon packs
- overly technical icons

---

# 12. Navigation

Navigation must be simple.

Main navigation:

- Home
- Favorites
- Profile

Reader should not feel like part of a complex app.

Rules:

- User should always know where they are
- Avoid deep navigation
- Avoid hidden functionality
- Avoid complex menus

---

# 13. Child-Friendly UX

The app is used by parents with children.

Rules:

- Big tap areas
- Few choices per screen
- Clear labels
- Calm colors
- No sudden motion
- No aggressive sounds
- No visual overload

The app is not a game.

It is a reading companion.

---

# 14. Motion and Animation

Motion should be minimal.

Allowed:

- soft fade
- gentle page transition
- subtle card press
- calm onboarding transition

Avoid:

- bouncing animations
- confetti
- fast motion
- playful chaos
- gamified effects

Animation principle:

Motion should calm, not excite.

---

# 15. Accessibility

Required:

- readable contrast
- large text
- scalable font support
- clear touch targets
- no important information by color only
- dark mode support

Avoid:

- low contrast text
- tiny labels
- pale text on pale background
- icon-only actions without meaning

---

# 16. Forbidden Design Patterns

Never use:

- neon colors
- rainbow palettes
- pure black / pure white contrast
- heavy gradients
- glassmorphism overload
- cartoon chaos
- large decorative backgrounds
- banking-style cold minimalism
- governmental design feeling
- dense CRUD tables
- aggressive notifications
- too many icons
- too many categories on one screen

---

# 17. Product Feeling Checklist

Before accepting any screen, check:

Does it feel calm?

Does it have enough space?

Can a tired parent use it at night?

Can a child understand the main action?

Does it avoid visual noise?

Does it look like a real mobile app, not a template?

Does dark mode feel soft?

Does the UI support reading instead of distracting from it?

If no — redesign.

---

# 18. Design Source of Truth

This document controls all visual decisions.

Cursor must follow this document.

Any new screen or component must respect:

- Nordic Quiet Minimal style
- Light and dark theme support
- calm reading-first UX
- minimal one-line illustration direction
- no visual overload

---

# 19. Color Tokens

All colors are semantic tokens. Screens and components must reference tokens only — never raw HEX values in UI code.

Token naming: `color.{tokenName}`

## Light Theme (Nordic Paper)

| Token | HEX | Role |
|-------|-----|------|
| `background` | `#F6F2EA` | Warm paper — main app canvas |
| `surface` | `#F0EBE2` | Cards, sheets, elevated areas |
| `surfaceMuted` | `#E8E2D6` | Secondary surfaces, chips, inputs |
| `textPrimary` | `#3A3834` | Headings, primary labels |
| `textSecondary` | `#5C5852` | Supporting text, subtitles |
| `textMuted` | `#8A847A` | Hints, placeholders, metadata |
| `primary` | `#B87A5E` | Primary actions, key accents |
| `primarySoft` | `#E8D8CC` | Primary button backgrounds, soft highlights |
| `forest` | `#5A7560` | Success states, nature accents |
| `forestSoft` | `#D4E2D6` | Soft green backgrounds, badges |
| `blue` | `#6B8494` | Links, info, secondary accents |
| `blueSoft` | `#D6E2EA` | Soft blue backgrounds |
| `border` | `#DDD6CA` | Card borders, input outlines |
| `divider` | `#EBE5DA` | Section separators, list dividers |
| `error` | `#B86A62` | Errors — muted, never alarming |
| `success` | `#5A7560` | Confirmations, positive feedback |
| `warning` | `#B89A62` | Gentle warnings, not urgent alerts |

## Dark Theme (Night Story)

| Token | HEX | Role |
|-------|-----|------|
| `background` | `#1E2226` | Deep gray-blue — bedtime canvas |
| `surface` | `#282D33` | Cards, sheets, elevated areas |
| `surfaceMuted` | `#323840` | Secondary surfaces, chips, inputs |
| `textPrimary` | `#EDE8E0` | Warm milk — headings, primary labels |
| `textSecondary` | `#C4BEB4` | Supporting text, subtitles |
| `textMuted` | `#8E8880` | Hints, placeholders, metadata |
| `primary` | `#D4A088` | Primary actions — soft terracotta glow |
| `primarySoft` | `#4A3E38` | Primary button backgrounds, soft highlights |
| `forest` | `#8BA890` | Success states, nature accents |
| `forestSoft` | `#3A4540` | Soft green backgrounds, badges |
| `blue` | `#8BA4B4` | Links, info, secondary accents |
| `blueSoft` | `#3A4248` | Soft blue backgrounds |
| `border` | `#3E444C` | Card borders, input outlines |
| `divider` | `#353B42` | Section separators, list dividers |
| `error` | `#C88880` | Errors — soft rose, low strain |
| `success` | `#8BA890` | Confirmations, positive feedback |
| `warning` | `#C4A870` | Gentle warnings, not urgent alerts |

Rules:

- No pure `#FFFFFF` or `#000000`
- Accents stay muted in both themes
- Reader may use `background` or a dedicated reader surface — never a third ad-hoc palette

---

# 20. Spacing Tokens

Base unit: **4px**. All spacing derives from the scale below.

| Token | Value | px |
|-------|-------|-----|
| `space_0` | 0 | 0 |
| `space_1` | 4 | 4 |
| `space_2` | 8 | 8 |
| `space_3` | 12 | 12 |
| `space_4` | 16 | 16 |
| `space_5` | 20 | 20 |
| `space_6` | 24 | 24 |
| `space_8` | 32 | 32 |
| `space_10` | 40 | 40 |
| `space_12` | 48 | 48 |
| `space_16` | 64 | 64 |

## Usage Examples

**Screen horizontal padding**

```
paddingHorizontal: space_4   // 16px — default screen edge
paddingHorizontal: space_6   // 24px — reader, onboarding
```

**Vertical rhythm between sections**

```
marginBottom: space_8        // 32px — between major sections
marginBottom: space_4        // 16px — between related blocks
```

**Card internal padding**

```
padding: space_5             // 20px — story preview card
padding: space_4             // 16px — compact list card
```

**Stack gaps (lists, form fields)**

```
gap: space_3                // 12px — tight list items
gap: space_4                // 16px — form fields
gap: space_6                // 24px — card grid
```

**Touch target minimum padding**

```
minHeight: 44
paddingVertical: space_3     // ensures 44px+ with content
paddingHorizontal: space_4
```

**Bottom safe area above tab bar**

```
paddingBottom: space_16     // 64px — content above tab bar
```

Rules:

- Prefer `space_6` and `space_8` for breathing room
- Never stack more than three spacing tokens on one edge without design review
- Reader uses larger horizontal padding — see Layout Tokens (§25)

---

# 21. Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `radius_sm` | 6 | Chips, small badges, inline tags |
| `radius_md` | 12 | Buttons, inputs, small cards |
| `radius_lg` | 16 | Story cards, category tiles |
| `radius_xl` | 20 | Modals, bottom sheets, large cards |
| `radius_2xl` | 24 | Hero cards, onboarding panels |
| `radius_full` | 9999 | Avatars, circular icon buttons, pills |

## Usage

- **Buttons:** `radius_md` — calm, not pill-shaped unless icon-only
- **Story preview cards:** `radius_lg`
- **Bottom sheet:** `radius_xl` on top corners only
- **Profile avatar:** `radius_full`
- **Inputs:** `radius_md` — consistent with buttons

Rules:

- Do not mix more than two radius sizes on one component
- Avoid sharp corners (`0`) except for full-bleed images inside rounded containers
- Reader controls: `radius_md` or `radius_full` for icon buttons only

---

# 22. Typography Tokens

Font family: system sans-serif stack (SF Pro, Roboto, Segoe UI) — no decorative fonts.

| Token | fontSize | lineHeight | fontWeight | Usage |
|-------|----------|------------|------------|-------|
| `display` | 32 | 40 | 600 | Splash, onboarding hero |
| `h1` | 28 | 36 | 600 | Screen titles |
| `h2` | 22 | 30 | 600 | Section headers |
| `h3` | 18 | 26 | 500 | Card titles, list headers |
| `bodyLarge` | 17 | 26 | 400 | Emphasized body, story previews |
| `body` | 16 | 24 | 400 | Default UI text |
| `caption` | 13 | 18 | 400 | Metadata, timestamps, hints |
| `reader` | 20 | 34 | 400 | Story page text — bedtime priority |

## Reader Typography

The `reader` token is optimized for tired eyes and low light:

- **Larger than `body`** — minimum 20px, scales with system accessibility settings
- **Generous line height (1.7)** — reduces eye tracking strain during long sessions
- **Regular weight (400)** — no bold blocks in story flow; emphasis via spacing, not weight
- **Never below 18px** even when user selects smaller system text elsewhere in the app

Reader title on page (optional):

- Use `h3` at most — story titles must not dominate the reading area

Rules:

- Story text always uses `reader` inside the Reader screen
- UI chrome (tabs, settings) uses `body` or smaller
- No `display` or `h1` inside active reading view

---

# 23. Shadows

Shadows are soft and barely visible — elevation through surface color, not depth.

| Token | Value | Usage |
|-------|-------|-------|
| `shadow_none` | none | Default — flat Nordic surfaces |
| `shadow_sm` | `0 1px 3px rgba(58, 56, 52, 0.06)` | Subtle lift — chips, pressed cards |
| `shadow_md` | `0 2px 8px rgba(58, 56, 52, 0.08)` | Floating cards, dropdowns |
| `shadow_lg` | `0 4px 16px rgba(58, 56, 52, 0.10)` | Modals, bottom sheets only |

Dark theme (Night Story) — same structure, lower opacity:

| Token | Dark value |
|-------|------------|
| `shadow_sm` | `0 1px 3px rgba(0, 0, 0, 0.20)` |
| `shadow_md` | `0 2px 8px rgba(0, 0, 0, 0.24)` |
| `shadow_lg` | `0 4px 16px rgba(0, 0, 0, 0.28)` |

Rules:

- Prefer `shadow_none` — use surface color difference for hierarchy
- Never use `shadow_lg` on more than one element per screen
- No colored shadows, no spread-heavy drop shadows
- Reader screen: `shadow_none` always

---

# 24. Opacity Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `disabled` | 0.40 | Disabled buttons, inactive icons |
| `pressed` | 0.72 | Pressed state overlay on tappable surfaces |
| `overlaySoft` | 0.24 | Light scrim behind bottom sheets |
| `overlayMedium` | 0.48 | Modal backdrop |
| `overlayStrong` | 0.64 | Full-screen blocking overlay (rare) |

## Usage

- Apply `disabled` to entire component, not only text — icon + label together
- `pressed` on `Pressable`/`TouchableOpacity` active opacity — not a separate color token
- `overlaySoft` for dismissible sheets; `overlayMedium` for modals that require focus
- `overlayStrong` only for critical flows (parental gate) — use sparingly

Rules:

- Do not reduce text contrast below readable levels — use `textMuted` instead of opacity on body text
- Night Story overlays may use `overlaySoft` more often — avoid `overlayStrong` in reader

---

# 25. Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `screenPadding` | `space_4` (16px) | Default horizontal screen inset |
| `sectionGap` | `space_8` (32px) | Vertical gap between major sections |
| `cardGap` | `space_4` (16px) | Gap between cards in grids and lists |
| `cardMinHeight` | 120 | Minimum story/category card height |
| `bottomTabHeight` | 56 | Main tab bar height (excluding safe area) |
| `readerHorizontalPadding` | `space_6` (24px) | Reader text and image side inset |
| `readerVerticalPadding` | `space_8` (32px) | Reader top/bottom content breathing room |

## Usage

**Standard screen**

```
paddingHorizontal: screenPadding
paddingTop: space_4
```

**Home / Favorites list**

```
gap: cardGap
paddingHorizontal: screenPadding
```

**Section with heading**

```
marginBottom: sectionGap    // after last item in previous section
```

**Reader layout**

```
paddingHorizontal: readerHorizontalPadding
paddingVertical: readerVerticalPadding
// No bottom tab — full calm canvas
```

**Bottom tab safe layout**

```
paddingBottom: bottomTabHeight + safeAreaInset
```

Rules:

- `readerHorizontalPadding` ≥ `screenPadding` — reading always gets more air
- `cardMinHeight` ensures tappable story cards without cramming metadata
- `bottomTabHeight` is fixed; do not shrink for denser nav — calm over compact

---

# 26. Reader Contract

The Reader is the most important screen in Chytayko. All other screens exist to bring the user here calmly. This section is the binding contract for Reader implementation.

## Priority

Readability and calm > feature density > visual decoration.

If a control does not help reading or gentle navigation, it does not belong in the Reader.

---

## Layout Structure

Vertical stack, single scroll axis per page (no nested scroll chaos):

```
┌─────────────────────────────────────┐
│  [← Back]              [♥ Favorite] │  ← minimal top bar (optional auto-hide)
├─────────────────────────────────────┤
│                                     │
│         Image area (flexible)       │  ← story illustration when present
│                                     │
├─────────────────────────────────────┤
│                                     │
│         Text area (reader token)    │  ← story body, generous padding
│                                     │
├─────────────────────────────────────┤
│  [◀ Prev]    ● ● ○ ○ ○    [Next ▶]  │  ← bottom controls + progress
└─────────────────────────────────────┘
```

Rules:

- Full-screen canvas — no bottom tab bar
- `paddingHorizontal`: `readerHorizontalPadding` (`space_6` / 24px)
- `paddingVertical`: `readerVerticalPadding` (`space_8` / 32px)
- `background`: `color.background` (Nordic Paper or Night Story)
- `shadow_none` on all Reader surfaces
- One primary content column — no side panels, no split view

---

## Image Area Rules

Purpose:

Display the current page illustration without competing with text.

Rules:

- Occupies upper portion of screen — flexible height, max ~45% of viewport on text-heavy pages
- Image contained with `resizeMode: contain` — never cropped aggressively
- Rounded corners: `radius_lg` on image container only when image has visible bounds
- No decorative frames, borders, or drop shadows on images
- When page has no image: collapse image area — text moves up, no placeholder illustration unless story provides one
- No autoplay, no video controls, no image carousel within a single page

Forbidden:

- Full-bleed background photos behind text
- Image galleries or thumbnails inside Reader
- Animated or looping illustrations during reading
- Saturated overlays on images

---

## Text Area Rules

Purpose:

Comfortable bedtime reading for parent and child.

Rules:

- Typography: `reader` token only — fontSize 20, lineHeight 34, fontWeight 400
- Color: `textPrimary` on `background` — never hardcoded
- Max readable line length: ~65 characters (achieved via horizontal padding, not arbitrary max-width on phone)
- Paragraph spacing: `space_4` between paragraphs
- No bold, italic, or color emphasis in default story rendering unless story markup explicitly requires it (future)
- Text scrolls within page only if content exceeds viewport — prefer pagination over long scroll within one page

Forbidden:

- `h1` or `display` typography inside story body
- Small caption-sized story text
- Text over images
- Justified text (use left-aligned for calm rhythm)

---

## Page Navigation

Allowed controls:

| Control | Position | Behavior |
|---------|----------|----------|
| Back | Top leading | Exits Reader to previous screen |
| Previous page | Bottom leading | Goes to prior page; disabled on first page |
| Next page | Bottom trailing | Goes to next page; disabled on last page |

Rules:

- Tap targets: minimum 44×44px, preferred 48×48px
- Icon buttons: `radius_full`, thin line icons
- Disabled state at boundaries: `disabled` opacity, no error styling
- No page number input, no scrubber, no chapter jump in v1
- Swipe gesture may advance/go back page — see Gestures

---

## Progress Indicator

Purpose:

Quiet orientation — where am I in the story?

Rules:

- Dot or soft bar style — muted, not gamified
- Active page: `primary` or `textPrimary` at full opacity
- Inactive pages: `textMuted` or `border`
- Positioned in bottom control row between Prev/Next
- Does not show percentage, scores, or reading time
- Maximum visible dots: 7; beyond that, compress to soft progress bar

Forbidden:

- Percentage labels
- Animated celebration on page turn
- Star ratings or achievements in progress area

---

## Favorite Action

Purpose:

Save story to Favorites without leaving Reader.

Rules:

- Single heart icon — top trailing
- Outline when not favorited; filled with `primary` when favorited
- Tap toggles state — soft scale or opacity feedback only
- No confirmation dialog
- Icon size: 24px inside 44×44px touch area

Forbidden:

- Share, download, or social actions in Reader chrome
- Toast spam on every favorite toggle

---

## Light Mode Behavior (Nordic Paper)

- Background: `color.background` (`#F6F2EA`)
- Text: `color.textPrimary` (`#3A3834`)
- Controls: `textSecondary` icons on transparent or `surfaceMuted` hit areas
- Image area: same background as canvas — no separate harsh white box
- Top/bottom chrome may auto-fade after 3s of no interaction; reappears on tap

Feeling:

“Afternoon reading by a window.”

---

## Dark / Night Mode Behavior (Night Story)

- Background: `color.background` (`#1E2226`) — never `#000000`
- Text: `color.textPrimary` (`#EDE8E0`) — never `#FFFFFF`
- Reduce overall contrast — soft, not OLED-punchy
- Controls: `textSecondary` — no bright white icons
- Optional: slightly dim default chrome opacity in night mode
- No pure black letterboxing around images

Feeling:

“Reading under a blanket with a soft lamp.”

Rules:

- Night Story is the default expectation for evening sessions
- System theme or in-app toggle must both map to the same token set
- No automatic bright flash on page turn

---

## Allowed Gestures

| Gesture | Action |
|---------|--------|
| Tap left third of screen | Previous page (optional — if enabled, mirror bottom control) |
| Tap right third of screen | Next page (optional) |
| Tap center | Toggle chrome visibility (show/hide controls) |
| Swipe horizontal | Previous / next page — gentle, no parallax |
| Swipe down from top | None — do not use for dismiss; use Back only |
| Pinch | None |
| Long press | None in v1 |

Rules:

- Page transition: soft cross-fade or horizontal slide — duration 250–350ms, ease-out
- No bounce, spring, or 3D page-curl effects
- Gesture and button navigation must stay in sync

---

## Forbidden UI Inside Reader

Never show inside Reader:

- Bottom tab navigation (Home, Favorites, Profile)
- Search bar
- Category chips
- Ads or promotional banners
- Rating prompts or review dialogs
- Settings gear (except via system/back exit)
- Related stories carousel
- Comments or social feed
- Bright primary buttons
- Dense toolbars or more than 5 chrome controls visible at once
- Notifications or toast stacks over story text
- Haptic-heavy or sound-heavy feedback on every page turn

---

## Accessibility Requirements

Required:

- Story text respects system font scale — `reader` token scales up, never below 18px effective
- All navigation controls have accessible labels (“Previous page”, “Next page”, “Add to favorites”)
- Progress indicator exposes current page and total to screen readers
- Contrast: `textPrimary` on `background` meets WCAG AA for body text in both themes
- Focus order: Back → Favorite → Previous → Progress → Next
- Reduce Motion: replace slide transitions with cross-fade or instant cut

Avoid:

- Icon-only controls without accessibility labels
- Auto-hiding chrome with no way to recall controls for assistive tech users
- Color-only state for favorite (pair with icon fill change)

---

## Reader Contract Summary

| Rule | Requirement |
|------|-------------|
| Clutter | Never — chrome is minimal and may hide |
| Bottom tabs | Never inside Reader |
| Controls | Back, Prev, Next, Favorite, Progress only |
| Text | `reader` token, readable in low light |
| Night mode | Night Story tokens — no pure black/white |
| Transitions | Calm fade or slide, 250–350ms |
| Shadows | `shadow_none` |

---

# 27. Component Specifications

All components use tokens from §19–§25. No hardcoded colors, spacing, or radius.

---

## Primary Button

**Purpose**

Single main action per screen section — “Continue”, “Start reading”, “Save”.

**Visual rules**

- Background: `primary`
- Text: `textPrimary` on light theme if contrast sufficient; otherwise warm off-white (`#F6F2EA`)
- Height: minimum 48px
- Typography: `body`, fontWeight 500
- Radius: `radius_md`
- Shadow: `shadow_none`

**Spacing**

- Horizontal padding: `space_6`
- Vertical padding: `space_3` minimum inside fixed height
- Margin below button in forms: `space_4`

**Light / dark**

- Light: `primary` `#B87A5E` on Nordic Paper surfaces
- Dark: `primary` `#D4A088` on Night Story surfaces — slightly lighter, still muted

**Forbidden**

- More than one Primary Button visible in the same viewport without hierarchy review
- Neon or saturated fills
- `shadow_md` or larger on buttons
- Tiny height below 44px
- Icon-only primary buttons (use Icon Button pattern instead)

---

## Secondary Button

**Purpose**

Alternative or low-emphasis actions — “Cancel”, “Skip”, “View all”.

**Visual rules**

- Background: `surface` or transparent
- Border: 1px `border`
- Text: `textPrimary`
- Height: minimum 48px
- Radius: `radius_md`
- Shadow: `shadow_none`

**Spacing**

- Same padding as Primary Button
- Gap between Primary and Secondary in a row: `space_3`

**Light / dark**

- Light: `surface` fill optional; border `divider` or `border`
- Dark: transparent or `surfaceMuted` fill; border `border`

**Forbidden**

- Competing visual weight with Primary on same row
- Filled secondary that looks identical to Primary
- Dashed or heavy 2px borders

---

## Icon Button

**Purpose**

Compact actions — back, favorite, close, prev/next in Reader.

**Visual rules**

- Size: 44×44px minimum touch area
- Icon: 22–24px, thin line style, `textSecondary` default
- Background: transparent, or `surfaceMuted` circle on press
- Radius: `radius_full` for circular hit area
- Shadow: `shadow_none`

**Spacing**

- Margin from screen edge: `screenPadding` or `readerHorizontalPadding` in Reader

**Light / dark**

- Icons use `textSecondary`; active/selected uses `primary` or `textPrimary`
- Night Story: no pure white icons

**Forbidden**

- Filled cartoon icon packs
- Multiple accent colors in one toolbar
- Icon buttons smaller than 44×44px
- Drop shadows on icon buttons

---

## Story Card

**Purpose**

Preview a story on Home, Favorites, or search results — tap to open Reader.

**Visual rules**

- Background: `surface`
- Radius: `radius_lg`
- Min height: `cardMinHeight` (120px)
- Cover image: top or left, soft corners `radius_md` within card
- Title: `h3`; metadata: `caption` in `textMuted`
- Shadow: `shadow_none` or `shadow_sm` at most

**Spacing**

- Internal padding: `space_5`
- Gap between image and text: `space_3`
- Grid/list gap: `cardGap`

**Light / dark**

- Light: warm `surface` on `background`
- Dark: `surface` on deep `background` — no glowing borders

**Forbidden**

- Dense multi-column grids on small phones without breathing room
- Saturated cover overlays
- Play buttons, duration badges, or gamification on card
- `shadow_lg` on cards

---

## Category Chip

**Purpose**

Filter or browse by category — single-select or browse tags.

**Visual rules**

- Height: 36–40px
- Radius: `radius_full` (pill)
- Unselected: `surfaceMuted` background, `textSecondary` label
- Selected: `primarySoft` background, `textPrimary` label; optional 1px `primary` border
- Typography: `caption` or `body` at smaller scale

**Spacing**

- Horizontal padding: `space_4`
- Gap between chips: `space_2`
- Scroll row padding: `screenPadding` horizontal

**Light / dark**

- Selected state must remain muted — not neon highlight
- Dark: `primarySoft` as dark tint `#4A3E38`, not bright fill

**Forbidden**

- More than one scroll row of chips on Home without clear hierarchy
- Rainbow chip colors per category
- Tiny tap targets below 36px height

---

## Search Input

**Purpose**

Find stories by title or keyword — calm, not aggressive.

**Visual rules**

- Background: `surfaceMuted`
- Border: none, or 1px `border` on focus
- Radius: `radius_md`
- Icon: magnifying glass, line style, `textMuted`
- Placeholder: `textMuted`; input text: `textPrimary`
- Typography: `body`
- Height: 48px

**Spacing**

- Horizontal padding: `space_4`
- Icon margin: `space_3` from text
- Margin below search bar: `space_4`

**Light / dark**

- Focus ring: `primary` at low opacity or `border` emphasis — no bright blue system default
- Dark: `surfaceMuted` field on `background`

**Forbidden**

- Search inside Reader
- Instant flashing results overlay
- Red error border on empty query

---

## Bottom Tab

**Purpose**

Main app navigation — Home, Favorites, Profile only.

**Visual rules**

- Height: `bottomTabHeight` (56px) + safe area
- Background: `surface` with top `divider` 1px border — no floating tab bar
- Active icon + label: `primary` or `textPrimary`
- Inactive: `textMuted`
- Icons: thin line, 24px
- Labels: `caption`
- Shadow: `shadow_none`

**Spacing**

- Equal width tabs — three items only in v1
- Icon-to-label gap: `space_1`

**Light / dark**

- Light: `surface` on `background`
- Dark: `surface` `#282D33` — soft separation from `background`

**Forbidden**

- Bottom tab visible inside Reader — **never**
- More than 4 tabs without product review
- Filled badge explosions, notification dots larger than 8px
- Blur/glass tab bar

---

## Progress Indicator

**Purpose**

Show position in story (Reader) or optional loading progress.

**Visual rules**

- Reader: dots or soft bar — see §26
- Loading: thin horizontal bar, height 2–3px, `primary` on `surfaceMuted` track
- Radius: `radius_full` on bar ends
- No percentage text in Reader

**Spacing**

- Dot gap: `space_2`
- Bar margin horizontal: `space_6` in Reader bottom row

**Light / dark**

- Active: `primary`; inactive: `textMuted` or `border`
- Indeterminate loading: slow, smooth animation — no frantic pulse

**Forbidden**

- Circular spinners on full-screen calm screens (prefer skeleton or soft bar)
- Gamified progress (stars, levels)
- Bright green “complete” flashes

---

## Empty State

**Purpose**

Explain absence of content — no favorites yet, no search results.

**Visual rules**

- Centered column layout
- One-line illustration (§9 style) — max 120px wide, `textMuted` stroke
- Title: `h3`, `textPrimary`
- Message: `body`, `textSecondary`
- Optional: Secondary Button CTA — never Primary unless single clear action
- Background: inherits screen `background`

**Spacing**

- Illustration to title: `space_6`
- Title to message: `space_3`
- Message to CTA: `space_8`
- Horizontal padding: `screenPadding`

**Light / dark**

- Same structure both themes; illustration stroke adapts via `textMuted`

**Forbidden**

- Large cartoon characters
- Multiple CTAs
- Guilt-copy (“You have nothing!”)
- Full-screen decorative photos

---

## Error State

**Purpose**

Communicate failure calmly — network, load error.

**Visual rules**

- Same layout rhythm as Empty State
- Icon: simple line alert or cloud — `error` color at muted saturation
- Title: `h3`; message: `body`, `textSecondary`
- Action: Secondary Button “Try again” — not alarming red Primary

**Spacing**

- Same as Empty State

**Light / dark**

- `error` token for icon/accent only — not full red background
- Dark: keep messages soft; no harsh red body text

**Forbidden**

- Technical stack traces visible to user
- Bright red full-screen backgrounds
- Blocking modal for recoverable errors when inline retry works

---

## Loading State

**Purpose**

Indicate content is arriving without anxiety.

**Visual rules**

- Preferred: skeleton placeholders matching Story Card layout — `surfaceMuted` blocks, subtle pulse optional
- Alternative: thin top progress bar (`Progress Indicator` loading variant)
- No full-screen blocking spinner on Home or Favorites unless first launch
- Typography placeholders: rounded `radius_sm` bars

**Spacing**

- Skeleton cards use same `cardGap` and `cardMinHeight` as real Story Cards

**Light / dark**

- Skeleton: `surfaceMuted` on `background`; pulse opacity 0.5–1.0, 1.5s ease

**Forbidden**

- Bouncing logos
- “Loading…” text flashing
- Multiple concurrent spinners on one screen
- Reader: avoid loading chrome over story text — show skeleton page or soft fade

---

# 28. Component States

Every interactive component supports a consistent state model. States must feel calm — never alarming, never gamified.

---

## State Definitions

| State | Meaning | Visual treatment |
|-------|---------|------------------|
| `default` | Resting, interactive | Token colors at full intended contrast |
| `pressed` | Finger down / active press | `pressed` opacity (0.72) on whole control, or `surfaceMuted` fill shift |
| `focused` | Keyboard or accessibility focus | 2px outline `primary` at 40% opacity, or `border` emphasis — no default OS blue ring |
| `disabled` | Not available | `disabled` opacity (0.40) on entire component; no pointer events |
| `loading` | Action in progress | Spinner inside button or skeleton; button `disabled` + label hidden or “…” |
| `selected` | Chosen in a set (chip, tab) | `primarySoft` background + `textPrimary`; tab uses `primary` icon |
| `error` | Validation or failure | `error` border or icon; message in `caption` below — not full red fill |
| `empty` | No data to show | Switch to Empty State pattern — not an error |

---

## State Rules by Component Type

**Buttons (Primary, Secondary)**

- `default` → `pressed` → release
- `disabled`: during submit or invalid form
- `loading`: replace label with small indeterminate indicator; width stable
- `error`: show field-level error below, not red button fill

**Icon Button**

- `pressed`: opacity or `surfaceMuted` circle
- `selected`: favorite filled — `primary` icon
- `disabled`: first/last page in Reader

**Story Card**

- `pressed`: `shadow_sm` or scale 0.98 — subtle only
- `loading`: skeleton card
- `empty`: N/A — parent screen uses Empty State

**Category Chip**

- `default` / `selected` — no `pressed` color different from brief opacity
- `disabled`: rare — opacity on unavailable categories

**Search Input**

- `focused`: border `primary` or `border` darken
- `error`: `error` bottom border + `caption` message

**Bottom Tab**

- `selected` / default inactive — no `pressed` bounce
- `disabled`: N/A for main tabs

**Progress Indicator**

- `loading`: indeterminate bar animation
- `default`: position dots in Reader

---

## Calm State Principles

1. **Opacity over color shift** — use `pressed` and `disabled` opacity tokens before inventing new colors.
2. **One state change at a time** — do not combine `loading` + `error` on the same button.
3. **Error is local** — border, icon, or caption near the field; never full-screen red unless critical blocking (rare).
4. **Loading is quiet** — skeleton and soft bars; no loud spinners on reading paths.
5. **Selected is soft** — `primarySoft` backgrounds, not saturated fills.
6. **Empty is not error** — empty favorites is neutral and warm, not failure styling.
7. **Night Story consistency** — all states use the same semantic tokens; do not brighten `pressed` in dark mode.

---

## State Forbidden Patterns

- Flashing or pulsing `error` states
- Scale bounce on `pressed` (> 1.02)
- `disabled` that looks identical to `default` (must be visibly inactive)
- Multiple primary-colored states on one screen
- Pure red (`#FF0000`) for any state
- Haptic feedback on every `pressed` state
- `loading` that blocks Reader navigation without reason

---

# 29. Illustration Contract

Illustrations support the interface — they never dominate it. One visual language across the entire app.

## Style

**Single-line drawings**

- One continuous or near-continuous stroke per subject
- No fill blocks unless a single soft wash is required for empty-state clarity (rare)
- Subject readable at a glance — silhouette first, detail second

**Picasso-inspired minimal animals**

- Animals reduced to essential curves — ear, body, tail suggested, not rendered
- Reference: one-line animal sketches — elegant, not cute-chaotic
- Faces: neutral or gently calm — never exaggerated

**Scandinavian quiet aesthetic**

- Restrained, airy, warm
- Feels like a stamp in a quiet children’s book margin
- Color: `textMuted` or `textSecondary` stroke on `background` — never full-spectrum palette in line art

---

## Technical Specification

| Property | Value | Notes |
|----------|-------|-------|
| Stroke thickness | 1.5–2px at 1× (24px icon base) | Scale proportionally; max 2.5px on hero empty states |
| Line ending | Round (`strokeLinecap: round`) | Never square or butt caps |
| Line join | Round (`strokeLinejoin: round`) | Smooth corners on paths |
| Allowed complexity | 3–12 strokes per motif | Beyond 12 strokes → simplify |
| Negative space | Minimum 40% of bounding box empty | Subject breathes; no edge-to-edge fill |
| Illustration density | Max 1 illustration per empty-state block; max 1 decorative motif per screen | Reader: illustration from story only |
| Corner behavior | Illustration stays inside safe padding; no bleed into rounded card corners | Respect `radius_lg` clip on cards |
| Icon relation | Illustrations share stroke weight and cap style with UI icons (§11) | Same family as tab/bar icons |

---

## Allowed Motifs

Use only from this set for UI decoration and empty states:

| Motif | Typical use |
|-------|-------------|
| Fox | Empty favorites, onboarding accent |
| Bear | Profile empty areas, welcome |
| Moon | Night mode hints, bedtime onboarding |
| Mountain | Offline, explore empty |
| Cloud | Search empty, soft errors |
| Book | No stories, library empty |
| Forest shapes | Category browse, nature-themed empty (simple 2–3 tree lines) |

Rules:

- One motif per screen context — do not combine fox + bear + moon on one screen
- Motif size: 80–120px width for empty states; 24–32px when used as inline accent
- Story page illustrations may be richer but must not break single-line calm in UI chrome

---

## Forbidden

- Disney-style rounded characters with large eyes and expressions
- Heavy cartoon shading, thick outlines, or sticker aesthetic
- Multiple visual styles (line art + flat cartoon + 3D mix)
- Aggressive expressions (anger, shock, tongue-out, crying floods)
- Overloaded scenes (many animals, busy backgrounds, full landscapes in UI chrome)
- Photorealistic animals in UI empty states
- Gradient-filled mascot characters
- Animated illustration loops in navigation or tabs
- National flags, tourist landmarks, or “Norway postcard” clutter

---

## Illustration Contract Summary

| Rule | Requirement |
|------|-------------|
| Style | Single-line, minimal, Scandinavian quiet |
| Stroke | 1.5–2px, round caps and joins |
| Density | Sparse — one motif per contextual screen |
| Palette | Token-based muted strokes only in UI |
| Consistency | Same language as icons (§11, §27) |

---

# 30. Motion System

Motion calms the user — it never entertains, rewards, or rushes.

## Duration Tokens

| Token | Duration | Usage |
|-------|----------|-------|
| `motion_fast` | 150ms | Micro-feedback — opacity, chip toggle |
| `motion_normal` | 250ms | Default transitions — fade, focus |
| `motion_slow` | 350ms | Page slide, Reader page change, onboarding step |

Rules:

- Never exceed 400ms for UI transitions
- Easing: `ease-out` or `ease-in-out` — never `ease-in` alone for exits that feel snappy
- `Reduce Motion` enabled: use `motion_fast` cross-fade or instant cut; disable slide distance

---

## Transitions

### Fade

- **Use:** modal appear, chrome show/hide in Reader, tab content swap
- **Duration:** `motion_normal`
- **Opacity:** 0 → 1 (enter), 1 → 0 (exit)
- **Forbidden:** flash, blink, strobe

### Page slide

- **Use:** horizontal navigation between app screens (not Reader default)
- **Duration:** `motion_normal`
- **Distance:** full screen width or 30% — consistent per app area
- **Forbidden:** parallax layers, 3D rotation

### Card press

- **Use:** Story Card tap feedback
- **Duration:** `motion_fast`
- **Effect:** opacity `pressed` (0.72) or scale 0.98 — not both aggressively
- **Forbidden:** bounce back, ripple explosion

### Onboarding

- **Use:** step-to-step welcome flow
- **Duration:** `motion_slow` for step change; `motion_normal` for content fade-in
- **Effect:** soft horizontal slide or cross-fade between steps
- **Forbidden:** auto-advance carousel, skip animations that disorient

### Reader page change

- **Use:** only inside Reader (§26)
- **Duration:** `motion_slow` (350ms)
- **Effect:** horizontal slide (like turning a page) **or** cross-fade — pick one per app build, stay consistent
- **Feeling:** paper page turn — gentle, no snap
- **Forbidden:** curl, flip cube, bounce, page peel sound sync, confetti on last page

---

## Global Motion Rules

**Allowed**

- Soft fade
- Gentle slide
- Subtle opacity on press
- Slow indeterminate progress (Loading State)

**Forbidden**

- Bounce (`spring` with high friction overshoot)
- Confetti, particles, stars
- Game effects (coins, levels, streaks)
- Energetic shake, wiggle, or attention pulses
- Auto-playing Lottie mascots on Home
- Sound on every transition

**Reader principle**

Reader animation must feel like turning pages — slow enough for a child to follow, quiet enough for bedtime.

---

# 31. Screen Blueprints

Blueprints define structure and hierarchy — not pixel-perfect mockups. All screens use tokens (§19–§25) and components (§27).

---

## Home

**Purpose**

Discover stories — calm entry point to reading.

**Main blocks**

1. Screen title or quiet greeting (`h1` or `h2`)
2. Search Input (optional top)
3. Category Chip row (horizontal scroll)
4. Story Card list or grid (primary content)
5. Bottom Tab

**Visual hierarchy**

1. Story Cards (largest visual weight)
2. Categories (secondary, horizontal)
3. Search (tertiary)
4. Title (minimal — do not dominate)

**Allowed actions**

- Tap story → Story Details or Reader
- Tap category → filtered list
- Search
- Tab navigation

**Forbidden**

- Hero banners with full-bleed photos
- More than 8–10 visible cards without breathing scroll
- Promotional carousels, ads, streak widgets
- Dense 3-column grid on narrow widths

---

## Story Details

**Purpose**

Preview one story before reading — set calm expectation.

**Main blocks**

1. Back (Icon Button)
2. Cover image (soft, contained)
3. Title (`h1`), short description (`bodyLarge`)
4. Metadata (`caption`) — length, age hint if any
5. Primary Button — “Read” / “Start”
6. Optional Secondary — Favorite

**Visual hierarchy**

1. Cover image
2. Title
3. Primary CTA
4. Description and metadata

**Allowed actions**

- Start reading → Reader
- Toggle favorite
- Back

**Forbidden**

- Related stories grid competing with CTA above fold
- Auto-play audio/video preview
- Star ratings, comments, social share row
- Multiple Primary Buttons

---

## Reader

**Purpose**

Read the story — highest priority screen (§26).

**Main blocks**

1. Minimal top chrome — Back, Favorite
2. Image area (when page has art)
3. Text area (`reader` typography)
4. Bottom chrome — Prev, Progress, Next

**Visual hierarchy**

1. Story text and image (content)
2. Page navigation
3. Chrome (lowest — may auto-hide)

**Allowed actions**

- Page prev/next (buttons + optional swipe)
- Favorite toggle
- Back (exit)
- Tap to show/hide chrome

**Forbidden**

- Bottom Tab
- Search, categories, related stories
- Any pattern listed in §26 Forbidden UI

---

## Favorites

**Purpose**

Quick access to saved stories.

**Main blocks**

1. Title (`h1`) — “Favorites” or equivalent
2. Story Card list (same as Home cards)
3. Empty State when no favorites (§32)
4. Bottom Tab

**Visual hierarchy**

1. Story Cards
2. Title
3. Empty State (only when list empty)

**Allowed actions**

- Open story
- Remove favorite (swipe or long-press — if implemented, must be calm and confirm softly)
- Tab navigation

**Forbidden**

- Sorting UI with 5+ options on screen
- Gamified “collection complete” badges
- Different card style than Home (breaks consistency)

---

## Profile

**Purpose**

Parent-oriented settings and account — low frequency, calm utility.

**Main blocks**

1. Title (`h1`)
2. Profile summary card (avatar, name optional)
3. Settings rows (theme, language, about)
4. Bottom Tab

**Visual hierarchy**

1. Settings list (clear rows)
2. Profile card
3. Title

**Allowed actions**

- Toggle theme (Nordic Paper / Night Story / system)
- Open legal/about
- Sign out if applicable
- Tab navigation

**Forbidden**

- Child profile gamification (avatars shop, points)
- Dense form layouts
- Banking-style KYC density
- Notification marketing toggles prominent above reading settings

---

## Onboarding

**Purpose**

Welcome and orient — minimal steps before first story.

**Main blocks**

1. One-line illustration (single motif per step)
2. Headline (`display` or `h1`)
3. Short body (`bodyLarge`)
4. Progress dots (step indicator)
5. Primary Button — “Continue” / “Get started”
6. Optional Secondary — “Skip” (only if product allows)

**Visual hierarchy**

1. Headline + illustration
2. Body copy
3. CTA

**Allowed actions**

- Next step
- Skip (if allowed)
- Finish → Home or first story

**Forbidden**

- More than 4 steps without product review
- Permission walls before value shown
- Bouncing mascot animations
- Forced account creation before browsing

---

# 32. Empty State System

All empty states follow §27 Empty State component rules. Tone is **calm, warm, supportive** — never joking, never gamified.

Global pattern:

- One line illustration (§29)
- Title: `h3`
- Message: `body`, `textSecondary`
- Optional single CTA: Secondary Button (Primary only when one obvious next step)

---

## No Favorites

| Field | Specification |
|-------|----------------|
| Illustration | Fox or heart-book motif, single-line, 100px |
| Title | “No favorites yet” |
| Message | “Stories you love will appear here.” |
| Action | Secondary — “Explore stories” → Home |
| Tone | Warm invitation, not guilt |

---

## No Progress

| Field | Specification |
|-------|----------------|
| Illustration | Book or moon motif |
| Title | “No reading progress yet” |
| Message | “Open a story and start reading together.” |
| Action | Secondary — “Browse stories” |
| Tone | Supportive — progress is optional, not scored |

---

## No Stories

| Field | Specification |
|-------|----------------|
| Illustration | Open book motif |
| Title | “No stories available” |
| Message | “Check back soon — new stories are on the way.” |
| Action | None, or Secondary “Refresh” if applicable |
| Tone | Calm patience — no “Oops!” |

---

## Search Empty

| Field | Specification |
|-------|----------------|
| Illustration | Cloud motif |
| Title | “Nothing found” |
| Message | “Try a different word or browse all stories.” |
| Action | Secondary — “Clear search” or “Show all” |
| Tone | Helpful, neutral — user is not wrong |

---

## Offline

| Field | Specification |
|-------|----------------|
| Illustration | Mountain or cloud motif |
| Title | “You’re offline” |
| Message | “Connect to the internet to load new stories.” |
| Action | Secondary — “Try again” |
| Tone | Factual, calm — no blame |

---

## Loading

| Field | Specification |
|-------|----------------|
| Illustration | None — use skeleton (§27 Loading State) |
| Title | None during skeleton |
| Message | None — avoid “Loading…” copy on calm screens |
| Action | None |
| Tone | Silent patience |

Exception: first app launch may show soft book motif + “Opening your library…” with `motion_slow` fade — once per install only.

---

## Error

| Field | Specification |
|-------|----------------|
| Illustration | Cloud or simple line alert, `error` stroke at muted weight |
| Title | “Something went wrong” |
| Message | “We couldn’t load this. Please try again.” |
| Action | Secondary — “Try again” |
| Tone | Supportive — no technical codes, no jokes |

---

## Empty State Tone Rules

- Use “you” and “your” sparingly — prefer “stories”, “here”, “together”
- No exclamation marks in titles
- No jokes, puns, or mascot speech bubbles
- No gamification (“Level up!”, “Unlock stories!”)
- No shame (“You haven’t read anything!”)
- Night Story: same copy — do not darken tone into cold minimalism

---

# 33. Responsive Rules

Chytayko targets mobile phones first. Layout must stay calm at every width — no cramming.

## Support Targets

| Width (dp) | Device class | Notes |
|------------|--------------|-------|
| 320 | Small phone | Minimum supported — test all screens |
| 360 | Common Android | Default design reference |
| 375 | iPhone SE / mini | Standard iOS narrow |
| 390 | Modern iPhone | Primary iOS reference |
| 414+ | Large phone | Extra air — never add density |

Tablet: not v1 target — if rendered, center content column max ~480px with side `background` margins.

---

## Layout Rules

**Preserve spacing**

- `screenPadding`, `sectionGap`, `cardGap` tokens stay fixed — do not shrink below token values on 320px
- On 414+, add horizontal inset or max-width column — do not fill extra width with more columns

**Preserve readability**

- `reader` typography never below 18px effective
- Story Card titles may truncate with ellipsis — never below 2 lines clipped without tap to details
- Category Chip row scrolls horizontally — chips do not wrap into 4+ rows

**Avoid dense layouts**

- Home: 1 column Story Cards on ≤390px; 2 columns only at 414+ if card width ≥160px each
- No 3-column grids on phones
- Profile settings: single column always

**No horizontal scrolling**

- Except: Category Chip row, intentional carousels (avoid carousels in v1)
- Story text, lists, and forms never scroll horizontally

**Reader always prioritized**

- At 320px: reduce image max-height before reducing text size or padding below `readerHorizontalPadding`
- Reader never shows side-by-side image + text columns on phone — stack vertically
- Bottom chrome remains thumb-reachable — safe area respected

---

## Breakpoint Behavior Summary

| Element | 320–375 | 390–413 | 414+ |
|---------|---------|---------|------|
| Story grid | 1 col | 1 col | 1–2 col max |
| Screen padding | `space_4` | `space_4` | `space_4`–`space_6` |
| Reader padding | `space_6` | `space_6` | `space_6`–`space_8` |
| Illustration (empty) | 80px | 100px | 120px |

---

# 34. Design QA Checklist

Final acceptance before any screen or component ships. If any item fails — redesign.

## Visual Calm

- [ ] Screen has one clear purpose
- [ ] Generous empty space — not filled “because we can”
- [ ] No more than one strong accent color area per viewport
- [ ] No visual noise (extra icons, badges, banners)

## Dark Mode Quality (Night Story)

- [ ] Uses Night Story tokens only — no hardcoded dark colors
- [ ] No pure black (`#000000`) or pure white (`#FFFFFF`) backgrounds or text
- [ ] Contrast is soft but readable — bedtime test passed
- [ ] Images and illustrations do not glare against `background`

## Spacing

- [ ] `screenPadding`, `sectionGap`, `cardGap` from tokens — no arbitrary magic numbers
- [ ] Touch targets ≥44×44px
- [ ] Cards and sections breathe — minimum `space_4` between related elements

## Reader Comfort

- [ ] Reader matches §26 contract
- [ ] No bottom tab in Reader
- [ ] Story text uses `reader` token
- [ ] Page transition ≤350ms, calm, no bounce
- [ ] Chrome minimal and hideable

## Child Usability

- [ ] Main action obvious without reading all copy
- [ ] Large tap areas, few choices per screen
- [ ] No frightening imagery or aggressive expressions
- [ ] No sudden motion or sound

## Parent Usability

- [ ] Usable one-handed at night
- [ ] Favorites and back paths obvious
- [ ] Theme toggle reachable in Profile
- [ ] No account friction before value (onboarding)

## Illustration Consistency

- [ ] Single-line style per §29
- [ ] Stroke weight matches icon system
- [ ] Motif from allowed set only
- [ ] No Disney / cartoon / mixed styles

## Token Usage

- [ ] Colors from §19 — no inline HEX in screens
- [ ] Spacing from §20, radius from §21, type from §22
- [ ] Shadows `shadow_none` or `shadow_sm` unless modal
- [ ] Opacity states from §24

## Accessibility

- [ ] Labels on icon-only controls
- [ ] Text scales with system settings
- [ ] WCAG AA contrast for body text
- [ ] Reduce Motion respected

## Anti-Patterns (Must Be No)

- [ ] **No banking feel** — cold grays, dense tables, corporate forms
- [ ] **No kindergarten chaos** — rainbow, bounce, mascots, confetti
- [ ] **No visual overload** — ads, carousels, too many CTAs, photo backgrounds

## Product Feeling (§17)

- [ ] Feels calm?
- [ ] Enough space?
- [ ] Tired parent test at night?
- [ ] Child understands main action?
- [ ] Supports reading, does not distract?

**Sign-off:** Designer or reviewer name + date optional in PR — all boxes must pass.

---

# 35. Design Decision Log

> **IMMUTABLE SECTION**  
> This section records frozen product and design decisions.  
> Do not edit unless the product owner explicitly requests a formal design direction change.  
> Any change here must be reflected across `DESIGN_CODE.md`, `TECHNICAL_PASSPORT.md`, and implementation.

---

## Accepted Decisions

| Domain | Decision |
|--------|----------|
| **Visual style** | Nordic Quiet Minimal |
| **Illustration style** | Picasso-inspired single line |
| **Themes** | Nordic Paper (light), Night Story (dark) |
| **Priority** | Reading-first experience |
| **Audience** | Parents + children 4+ |
| **ASO priority** | Higher than branding during MVP |

---

## Forbidden (Frozen)

The following are permanently rejected unless this section is formally revised:

- Disney style
- Bank UI
- Government style
- Visual overload
- Kindergarten chaos

---

## Decision Authority

- **Source of truth for UI:** `DESIGN_CODE.md`
- **Source of truth for product/tech alignment:** `TECHNICAL_PASSPORT.md`
- **Implementation:** must conform to both; no silent drift

---

# 36. Cursor Design Rules

Rules for Cursor and all future UI implementation in Chytayko.

---

## Cursor MUST

- Use design tokens only — colors (§19), spacing (§20), radius (§21), typography (§22), shadows (§23), opacity (§24), layout (§25)
- Never hardcode colors, spacing, or font sizes in screens or one-off components
- Support light (Nordic Paper) and dark (Night Story) themes on every screen and component
- Preserve reader-first UX — Reader (§26) takes precedence over all other screens
- Preserve spacing system — token scale only, no arbitrary compression
- Preserve illustration contract (§29) — single-line motifs from allowed set
- Preserve accessibility (§15, §26, §34) — labels, contrast, touch targets, Reduce Motion
- Reuse components from §27 — Primary/Secondary Button, Story Card, etc.
- Avoid screen-specific hacks — if a pattern repeats twice, extract a shared component

---

## Cursor MUST NOT

- Introduce new colors outside §19 token tables
- Change typography scale defined in §22
- Create alternative themes (no third theme, no “high contrast” variant without design approval)
- Use neon accents or pure `#000000` / `#FFFFFF` UI surfaces
- Reduce touch targets below 44×44px
- Add game UI — points, streaks, levels, confetti, bounce rewards
- Add visual noise — extra icons, banners, carousels, ads, dense toolbars

---

## Reference Order

When implementing any UI task, read in order:

1. §35 Design Decision Log (frozen direction)
2. §19–§25 Tokens
3. §26 Reader Contract (if Reader-related)
4. §27–§28 Components and states
5. §29–§34 Illustration, motion, blueprints, empty states, responsive, QA

---

# 37. Design Change Process

All design changes follow this process. No exceptions.

```
New design idea
       ↓
Check TECHNICAL_PASSPORT.md
       ↓
Check DESIGN_CODE.md
       ↓
Compare with Nordic Quiet Minimal (§1, §35)
       ↓
Approve or reject
       ↓
If approved → update DESIGN_CODE.md first, then implement
If rejected → do not implement
```

---

## Rules

1. **No direct UI changes without updating DESIGN_CODE** — code must not ship ahead of documentation for new patterns, tokens, or components.
2. **TECHNICAL_PASSPORT first for scope** — confirm the idea fits product scope, audience, and MVP constraints before visual work.
3. **DESIGN_CODE second for visual law** — confirm tokens, components, and forbidden patterns (§16, §35).
4. **Nordic Quiet Minimal gate** — reject if the idea adds clutter, banking feel, kindergarten chaos, or weakens reading-first priority.
5. **§35 immutable log** — changes to frozen decisions require explicit product owner approval and a dated note in §35 revision history (append only; do not silent-edit).

---

## Approve Criteria

Approve only if all are true:

- Aligns with §35 accepted decisions
- Uses existing tokens or documents new tokens in §19–§25 before use
- Passes §34 Design QA Checklist
- Does not violate §16 Forbidden Design Patterns or §35 Forbidden list
- Reader impact assessed — reading experience unchanged or improved

---

## Reject Criteria

Reject if any are true:

- New visual style or theme without formal §35 revision
- Hardcoded values instead of tokens
- Reduces Reader calm or adds chrome
- ASO/branding experiment that compromises MVP reading clarity (unless product explicitly reprioritizes)

---

# 38. Design Completion Status

| Area | Status |
|------|--------|
| Visual philosophy | DONE |
| Themes | DONE |
| Tokens | DONE |
| Reader | DONE |
| Components | DONE |
| Illustrations | DONE |
| Motion | DONE |
| Responsive | DONE |
| Accessibility | DONE |
| QA | DONE |

---

## Document Status

**DESIGN_CODE v1.0**  
**Production-ready reference**

This document is complete for MVP implementation. Future changes follow §37 Design Change Process.

| Version | Date | Notes |
|---------|------|-------|
| v1.0 | 2026-05-17 | Initial production-ready design system |

---

END OF DOCUMENT