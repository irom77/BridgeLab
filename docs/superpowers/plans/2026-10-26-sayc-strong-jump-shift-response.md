# SAYC Strong Jump-Shift Implementation Plan

> **For agentic workers:** Implement the agreement task by task, keeping each task testable.

**Goal:** Complete the basic SAYC strong jump-shift auction through game.

**Architecture:** Detect an uncontested, unpassed SAYC jump shift from the public auction, then prioritize responder/opener continuations before generic bidding rules. Keep 2/1 handling unchanged and use the existing bot's hand-only bidding interface.

**Tech Stack:** TypeScript, Vitest, pnpm workspace scripts.

**Spec:** This plan and the SAYC strong jump-shift agreement recorded in `TODO.md`.

## Global Constraints

- Keep `packages/core` platform-neutral.
- Use HCP and suit lengths from the bot's own hand; never inspect a partner's private hand.
- Keep the jump shift uncontested and unavailable to a passed responder.
- Preserve the distinct 2/1 direct response agreement.

## Review Focus

- Correct jump level when the natural response would be one or two level.
- Opener does not pass after a game-forcing jump shift.
- Opener's major fit, balanced strength, and natural side suit are described legally.
- Responder places game after opener's description, and a game contract is not overbid.
- Interference, passed hands, and 2/1 auctions do not enter the SAYC continuation.

## Agreement

- In an uncontested auction, an unpassed SAYC responder with 19+ HCP and a five-card new suit makes a natural jump shift, forcing to at least game.
- A jump to a suit that could have been bid at the one level is at the two level; a suit that normally requires a two-level response is jumped to the three level.
- 2/1 keeps its direct two-level response agreement.
- Opener raises a three-card major fit directly to game, shows a balanced 18+ hand in notrump, or describes a natural side suit/opening-suit rebid.
- Responder places game in a shown major fit, notrump after opener's notrump rebid, or a long jump-shift suit without a fit.

## Implementation

- [x] Add responder jump-shift selection and preserve fit-raise priority.
- [x] Add opener continuation and responder game placement.
- [x] Cover both two-level and three-level jump shifts, strength threshold, major fits, balanced hands, and natural side-suit fits.
- [x] Extend the Expert auction through Blackwood after opener confirms a major fit at game; keep natural notrump auctions and non-fit jump-shift sequences outside this route.

## Verification

- [x] Focused tests cover the 19-HCP SAYC jump, below-threshold natural response, unchanged 2/1 response, opener rebids, game placement, confirmed-fit Blackwood, ace placement, and no-fit rejection.
- [x] Run workspace tests (633 passed), typecheck, lint, and diff checks for the slam extension.

## References

- [ACBL SAYC system booklet](https://web2.acbl.org/documentLibrary/play/sayc_book.pdf)
- [ACBL lesson on commonly used conventions](https://cdn.acbl.org/assets/documents/teachers/Teacher-Manuals/Commonly-Used-Conventions-Lesson-6.pdf) (responder jump shifts force to at least game)
