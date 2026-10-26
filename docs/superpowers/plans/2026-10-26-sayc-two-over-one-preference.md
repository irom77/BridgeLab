# SAYC Preference After 1♠–2♣–2♥

> **For agentic workers:** Implement and verify each auction path with focused bot tests.

**Goal:** Let a SAYC responder show invitational values and preference for opener's spades after 1♠–2♣–2♥.

**Architecture:** Extend the existing uncontested SAYC major two-level response handler. With 11–12 HCP and exactly two spades, responder rebids 2♠; other continuations keep their existing handling.

**Tech Stack:** TypeScript, Vitest, pnpm workspace scripts.

**Spec:** `TODO.md`, SAYC responder continuation after 1♠–2♣–2♥.

## Global Constraints

- Keep bidding based on the acting bot's hand and the public auction.
- Apply this continuation only to uncontested SAYC auctions after an unpassed responder's 1♠–2♣ sequence.
- Keep 2♠ nonforcing and do not alter 2/1 bidding.

## Review Focus

- At both 11 and 12 HCP with exactly two spades, responder bids 2♠.
- Other hands continue through the existing response logic.

## Implementation

- [x] Add a regression test for the 1♠–2♣–2♥–2♠ continuation at 11 and 12 HCP.
- [x] Run the focused bot tests.

## Reference

- [ACBL SAYC System Booklet](https://web2.acbl.org/documentLibrary/play/sayc_book.pdf), responder rebids after an initial two-level new-suit response.
