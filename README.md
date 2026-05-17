# Chytayko

Mobile application for parents and children (4+) to read adapted Ukrainian fairy tales.

## Stack

- **Expo**
- **React Native**
- **Firebase** (planned — not integrated in foundation phase)

## Reference docs

- [docs/TECHNICAL_PASSPORT.md](docs/TECHNICAL_PASSPORT.md) — product, architecture, and technical decisions
- [docs/DESIGN_CODE.md](docs/DESIGN_CODE.md) — UI/UX and design tokens (Nordic Quiet Minimal)

## Project structure

```
src/
  app/           Application entry
  components/    Shared UI (future)
  features/      Feature modules (auth, stories, reader, favorites, profile)
  services/      External services (firebase — Phase 2)
  theme/tokens/  Design tokens (future)
  hooks/
  types/
  utils/
assets/          Static assets
```

## Getting started

```bash
npm install
npm start
```

Use `npm run ios` or `npm run android` for device/simulator targets. Web is not supported for this project.

## Development phases

See `docs/TECHNICAL_PASSPORT.md` §14 for build order. Foundation (Phase 1) is complete; Firebase and features follow in later phases.
