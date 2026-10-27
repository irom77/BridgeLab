# Beginner 2/1 Game Force Implementation Plan

- [x] Add bot tests for the 2/1 13 HCP response threshold and continued auction to game.
- [x] Keep and test the existing SAYC 10 HCP two-level response threshold.
- [x] Implement recognition and continuation of the uncontested 1M-2m 2/1 sequence.
- [x] Update `TODO.md`, `README.md`, and `CHANGES.md` to describe the supported subset accurately.
- [x] Run focused and workspace verification commands; review the resulting diff.

## Additional continuation: 1♠–2♥

- [x] Add failing tests for opener's three-card heart raise and responder's game placement, including competing three-card spade support.
- [x] Recognize 3♥ as opener's support-showing rebid within the direct 2/1 force.
- [x] Prefer the agreed heart game over the original spade opening fit.
- [x] Run `pnpm test` (409 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
