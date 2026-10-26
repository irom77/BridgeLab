# SAYC Responder Rebids After 1♠–2♣–2♥

> **For agentic workers:** Implement and verify each auction path with focused bot tests.

**Goal:** Let a SAYC responder describe an invitational club holding or spade preference after 1♠–2♣–2♥.

**Architecture:** Extend the existing uncontested SAYC major two-level response handler. Responder rebids 2♠ with 11–12 HCP and exactly two spades, or 3♣ with 10–11 HCP and five or more clubs, giving the 2♠ preference priority when both descriptions apply at 11 HCP.

**Tech Stack:** TypeScript, Vitest, pnpm workspace scripts.

**Spec:** `TODO.md`, SAYC responder continuation after 1♠–2♣–2♥.

## Global Constraints

- Keep bidding based on the acting bot's hand and the public auction.
- Apply this continuation only to uncontested SAYC auctions after an unpassed responder's 1♠–2♣ sequence.
- Keep 2♠ nonforcing and do not alter 2/1 bidding.

## Review Focus

- At both 11 and 12 HCP with exactly two spades, responder bids 2♠.
- With 10 HCP and five clubs, responder bids 3♣; at 11 HCP, a doubleton spade takes priority for 2♠.
- Other hands continue through the existing response logic.

## Implementation

- [x] Add regression tests for 2♠ preference at 11 and 12 HCP and the natural 3♣ invitation at 10 HCP.
- [x] Run the focused bot tests.

## Reference

- [ACBL SAYC System Booklet](https://web2.acbl.org/documentLibrary/play/sayc_book.pdf), responder rebids after an initial two-level new-suit response.
