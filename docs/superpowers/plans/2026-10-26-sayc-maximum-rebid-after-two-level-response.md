# SAYC Maximum Rebid After 1M–2m

> **For agentic workers:** Implement and verify each auction path with focused bot tests.

**Goal:** Give an unpassed SAYC opener a strong continuation after a forcing 1M–2m response with a maximum unbalanced hand.

**Architecture:** Reuse the public-auction detector for uncontested SAYC 1M–2m sequences. Opener describes a four-card responder-minor fit, a four-card side suit, or a six-card opening major; responder then places game. Leave 2/1 rules unchanged.

**Tech Stack:** TypeScript, Vitest, pnpm workspace scripts.

**Spec:** `TODO.md`, SAYC 1M–2m opener continuation.

## Global Constraints

- Keep bidding based on the acting bot's hand and the public auction.
- Apply the jump rebids only to uncontested SAYC auctions with an unpassed responder.
- Preserve balanced 18–19 rebids at 2NT and existing 13–18 natural rebids.
- Keep the 2/1 forcing agreements on their existing path.

## Review Focus

- A 19+ HCP opener does not pass after responder's forcing two-level suit response.
- Strong jump raises and shifts stay natural and show the actual fit/suit length.
- Responder reaches game in a major fit, minor fit, or notrump.
- Passed hands, interference, and 2/1 style do not trigger the SAYC treatment.

## Implementation

- [x] Add tests for a maximum jump raise and a natural side-suit jump shift.
- [x] Add a six-card major jump rebid.
- [x] Place game after opener's strong suit rebid.
- [x] Run workspace test (622 passed), typecheck, lint, and diff checks.

## Reference

- [ACBL SAYC system booklet](https://web2.acbl.org/documentLibrary/play/sayc_book.pdf)
