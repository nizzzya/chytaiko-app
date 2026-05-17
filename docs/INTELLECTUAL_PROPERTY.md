# INTELLECTUAL_PROPERTY.md

Project: Chytayko  
Status: Intellectual Property Policy  
Version: CHYTAYKO IP POLICY v1.0

---

This document defines ownership and usage rules for all Chytayko intellectual
property. It complements the proprietary `LICENSE` at the repository root.

Unless explicitly authorized in writing, no person or entity may copy,
redistribute, modify, publish, resell, or create derivative works from any
protected asset listed below.

---

## 1. Protected Assets

All project assets are proprietary and protected, including but not limited to:

| Category | Examples |
|----------|----------|
| Source code | Application logic, services, hooks, utilities |
| UI/UX system | Components, layouts, tokens, themes, motion rules |
| Design specifications | `docs/DESIGN_CODE.md`, design tokens, Reader contract |
| Technical specifications | `docs/TECHNICAL_PASSPORT.md`, schemas, flows, naming rules |
| Illustrations | One-line motifs, icons, empty-state art |
| Story assets | Text, page content, covers, page images (`page-001.webp`, etc.) |
| Generated assets | Build outputs, exports, automated or AI-assisted outputs |
| Branding | App name, store copy, ASO strings, visual identity |
| Documentation | README, policies, contracts, internal guides |
| Future content | New stories, categories, languages, features |

**Rule:** If it exists in or for Chytayko, it is protected unless explicitly
released under a separate written license.

---

## 2. Design Ownership

Ownership includes:

- Nordic Quiet Minimal visual direction
- Nordic Paper and Night Story themes
- Color, spacing, radius, typography, shadow, opacity, and layout tokens
- Component specifications and state models
- Reader Contract and screen blueprints
- Motion system and illustration contract
- Empty-state copy tone and UX patterns

`docs/DESIGN_CODE.md` is the authoritative design record. It may not be copied,
republished, or reused in other products without written permission.

Implementation code that expresses these designs (e.g. `src/theme/`) is equally
protected.

---

## 3. Story Ownership

All story-related content is proprietary:

- Titles, descriptions, and metadata
- Full story text (Ukrainian MVP and future translations)
- Story slugs and catalog structure
- Reading progress and favorites logic as product expression
- Firestore story documents and Storage paths under `stories/{slug}/`

Third parties may not republish, adapt, or commercialize Chytayko stories outside
the application without written permission.

---

## 4. Illustration Ownership

Illustrations include:

- Picasso-inspired single-line drawings
- Allowed motifs (fox, bear, moon, mountain, cloud, book, forest shapes)
- Stroke rules, density limits, and style constraints from DESIGN_CODE
- UI empty-state illustrations and decorative line art
- Story page illustrations (when present)

Illustrations may not be extracted for stock use, rebranding, or derivative
products. Style guides do not grant a license to reproduce the art itself.

---

## 5. Brand Ownership

Chytayko branding is protected:

- Name: **Chytayko** / **Читайко**
- App store title, subtitle, and ASO keyword sets
- Product positioning (reading-first, parents + children 4+)
- Visual identity derived from DESIGN_CODE

No use of the Chytayko name, logos, or confusingly similar marks in other apps,
stores, or marketing without written permission.

---

## 6. Documentation Ownership

All project documentation is proprietary:

- `docs/TECHNICAL_PASSPORT.md`
- `docs/DESIGN_CODE.md`
- `docs/INTELLECTUAL_PROPERTY.md` (this document)
- `.cursorrules` and internal development contracts
- README and setup guides

Documentation may be referenced internally by authorized contributors only.
External redistribution of specifications, schemas, or policies is prohibited.

---

## 7. Future AI Asset Policy

AI-generated or AI-assisted assets (when introduced) remain Chytayko property
subject to these rules:

| Rule | Requirement |
|------|-------------|
| Ownership | Outputs created for Chytayko are owned by Chytayko |
| Training | Third parties may not use Chytayko assets to train models without permission |
| Disclosure | AI-assisted content must be documented in commit or asset metadata when used |
| Review | All AI outputs require human review before publication in the app |
| Style | Must comply with DESIGN_CODE illustration and tone rules |
| MVP | AI generation is not part of MVP scope (see TECHNICAL_PASSPORT §25) |

If tooling or vendors change, this section may be revised under IP POLICY v2.0+.

---

## 8. Third-party Asset Rules

Third-party libraries and tools (e.g. Expo, React Native, Firebase) remain subject
to their respective licenses. Chytayko does not claim ownership of those
dependencies.

Rules for third-party **creative** assets:

- Must not violate Chytayko proprietary license or DESIGN_CODE
- Must include verifiable license compatible with proprietary app distribution
- Must be documented (source, license, attribution if required)
- No Disney-style, stock cartoon, or mixed-style art that breaks illustration contract
- Fonts: system fonts preferred; licensed fonts require retained license proof

Contributors must not commit third-party story text, illustrations, or branding
without explicit approval and license documentation.

---

## Policy Summary

| Action | Allowed without written permission |
|--------|-------------------------------------|
| View repo (if granted access) | Evaluation only, as authorized |
| Copy source or docs | No |
| Redistribute or publish | No |
| Modify or fork for commercial use | No |
| Create derivative works | No |
| Resell or sublicense | No |

**CHYTAYKO IP POLICY v1.0** — Effective 2026. Updates require versioned revision of
this document and, where applicable, the root `LICENSE`.

---

END OF DOCUMENT
