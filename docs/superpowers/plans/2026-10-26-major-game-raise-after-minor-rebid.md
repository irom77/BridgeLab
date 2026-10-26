# Major Game Raise after a Minor Rebid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let responder place game in opener's major with 13+ HCP and three-card support after 1M–1NT–2m.

**Architecture:** Extend the existing natural responder continuation in `BeginnerBot.chooseBid`; keep the existing 11–12 HCP invitation first-class and preserve style-independent behavior.

**Tech Stack:** TypeScript, Vitest, pnpm workspace.

**Spec:** `docs/superpowers/specs/2026-10-26-major-game-raise-after-minor-rebid.md`

## Global Constraints

- Keep `packages/core` platform-neutral.
- Use the existing hand and auction APIs.
- Preserve SAYC and 2/1 behavior outside this natural continuation.

## Review Focus

- 1♥ and 1♠ openings: test both major suits.
- Three-card support: ensure the game raise applies at 13+ HCP.
- Invitation boundary: preserve 3M at 11–12 HCP.
- Other auctions: do not trigger after a minor opening or a major rebid.

### Task 1: Responder major game raise

**Files:**
- Modify: `packages/bots/src/player.ts`
- Test: `packages/bots/src/player.test.ts`
- Modify: `TODO.md`, `README.md`, `CHANGES.md`

- [x] Write failing tests for both major openings and confirm the current bot does not bid game.
- [x] Add the 13+ HCP, three-card-support game raise after 1M–1NT–2m without changing the 11–12 HCP invitation.
- [x] Run focused tests, `pnpm test` (546 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check`; update roadmap and release notes.
- [ ] Commit and push the completed slice.
