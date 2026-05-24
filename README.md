# Chytayko

A calm mobile reading app for parents and children (4+) — adapted Ukrainian fairy tales in a Nordic Quiet Minimal experience.

## Stack

- Expo
- React Native
- TypeScript
- Firebase
- AsyncStorage

## MVP status

Public reading MVP in progress.

## Current features

- Public catalog
- Story details
- Reader
- Favorites
- Reading progress
- Continue reading
- Local persistence
- Optional auth
- Theme system
- Light / dark mode
- Firebase-ready architecture

## Architecture

- Feature-based structure under `src/features/`
- Firebase isolated in `src/services/firebase/`
- Public-first access model — reading does not require login
- Local-first data for favorites, progress, and reader session cache

## Source of truth

- [docs/TECHNICAL_PASSPORT.md](docs/TECHNICAL_PASSPORT.md) — product, architecture, data model
- [docs/DESIGN_CODE.md](docs/DESIGN_CODE.md) — UI/UX and design tokens

## Development note

Test content only during development. Final stories and illustrations are not part of the current development phase.

## License

Proprietary / All Rights Reserved
