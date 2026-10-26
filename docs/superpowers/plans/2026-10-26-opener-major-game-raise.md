# Opener Major Game Raise Implementation Plan

**Goal:** Place game after a one-level major response when opener has an unbalanced 19+ HCP hand and four-card support.

**Architecture:** Extend the existing two-call opener continuation in `packages/bots/src/player.ts`. Preserve 18–19 balanced 2NT handling before applying the strong fit raise.

**Tech Stack:** TypeScript, Vitest, pnpm workspace scripts.

**Spec:** `docs/superpowers/specs/2026-10-26-opener-major-game-raise-design.md`

## Global Constraints

- Keep `packages/core` platform-neutral.
- Validate behavior with bidding tests in both SAYC and 2/1.

## Review Focus

- Strong unbalanced four-card fit places 4M even when a side suit is available.
- Balanced 18–19 HCP retains the existing 2NT rebid.
- Hands below the game threshold keep their existing continuation.

## Task 1: Add the strong fit continuation

**Files:**
- Modify: `packages/bots/src/player.test.ts`
- Modify: `packages/bots/src/player.ts`
- Modify: `TODO.md`, `CHANGES.md`

- [x] Write a failing test for an unbalanced 19-HCP opener with four-card support and a side suit, in SAYC and 2/1.
- [x] Place 4M before side-suit continuations for unbalanced 19+ HCP hands with four-card support.
- [x] Run `pnpm test` (407 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
