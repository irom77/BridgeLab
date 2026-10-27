# SAYC 1M–2m Balanced Rebid Implementation Plan

> **For agentic workers:** Implement this agreement with the project test suite before committing.

**Goal:** Complete the balanced 18–19 HCP opener rebid and game placement after an uncontested SAYC 1M–2m response.

**Architecture:** Detect only the uncontested, unpassed SAYC major-opening/minor-response sequence in `BeginnerBot.chooseBid`. Keep the corresponding 2/1 behavior on its existing path.

**Tech Stack:** TypeScript, Vitest, pnpm workspace scripts.

**Spec:** `TODO.md`, SAYC 1M–2m continuation entry.

## Global Constraints

- Do not infer a partner's private cards; use only the acting bot's hand and public auction.
- Keep 2/1 responses distinct.
- Preserve major-fit priority when responder places game.

## Review Focus

- Opener rebids 2NT at both 18 and 19 balanced HCP, not below 18.
- The rule applies only to uncontested SAYC 1M–2m auctions.
- Responder bids 4M with three-card support and 3NT without a major fit.

## Implementation

- [x] Add tests for the strong opener rebid and both responder placements.
- [x] Keep the existing 2/1 18–19 rebid behavior unchanged.
- [x] Run workspace test (618 passed), typecheck, lint, and diff checks.

## Reference

- [ACBL SAYC system booklet](https://web2.acbl.org/documentLibrary/play/sayc_book.pdf)
