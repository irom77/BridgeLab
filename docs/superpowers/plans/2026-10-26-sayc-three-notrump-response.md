# SAYC Three Notrump Response Implementation Plan

**Goal:** Add SAYC's direct 3NT response to a one-level major opening with a balanced 16–18 HCP hand and exactly two-card support.

**Architecture:** Add the response to `BeginnerBot.chooseBid` before natural two-level suit responses. Keep it SAYC-only and preserve Jacoby 2NT and 2/1 game-forcing responses.

**Tech Stack:** TypeScript, Vitest, pnpm workspace scripts.

**Reference:** [ACBL SAYC System Booklet](https://web2.acbl.org/documentLibrary/play/sayc_book.pdf)

## Global Constraints

- Do not apply the direct 3NT agreement to 2/1.
- Preserve natural one-level responses when responder holds a four-card other major.
- Keep bot decisions based on its hand and public auction.

## Review Focus

- Balanced 16–18 HCP and two-card support shows 3NT in SAYC.
- The same hand follows the existing 2/1 response agreement.
- Jacoby 2NT and a natural four-card other major response retain priority.

## Task 1: Add the SAYC response

- [x] Add tests distinguishing the SAYC 3NT response from a 2/1 game-forcing suit response.
- [x] Bid 3NT for an unpassed SAYC responder with a balanced 16–18 HCP hand and exactly two-card support for opener's major, when no four-card other major is available.
- [x] Keep 15 HCP below this direct 3NT range and leave 2/1 behavior unchanged.
- [x] Run `pnpm test` (460 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check` after correcting the range to 16–18 HCP.
