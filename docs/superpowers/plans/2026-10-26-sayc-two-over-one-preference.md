# SAYC Responder Rebids After 1♠–2♣–2♥

> **For agentic workers:** Implement and verify each auction path with focused bot tests.

**Goal:** Let a SAYC responder describe a three-card heart fit, invitational club holding, or spade preference after opener's natural rebids to 1♠–2♣.

**Architecture:** Extend the existing uncontested SAYC major two-level response handler. After a 2♥ rebid, responder bids 2♠ with 11–12 HCP and exactly two spades, 3♥ with 10–11 HCP and three-card heart support, or 3♣ with 10–11 HCP and five or more clubs. A three-card heart fit takes priority. After opener's 2♦ rebid, responder can bid 2♠ with 11–12 HCP and exactly two spades to limit the hand.

**Tech Stack:** TypeScript, Vitest, pnpm workspace scripts.

**Spec:** `TODO.md`, SAYC responder continuation after 1♠–2♣–2♥.

## Global Constraints

- Keep bidding based on the acting bot's hand and the public auction.
- Apply this continuation only to uncontested SAYC auctions after an unpassed responder's 1♠–2♣ sequence.
- Keep 2♠ nonforcing and do not alter 2/1 bidding.

## Review Focus

- At both 11 and 12 HCP with exactly two spades, responder bids 2♠.
- With 10 HCP and five clubs, responder bids 3♣; at 11 HCP, a doubleton spade takes priority for 2♠.
- With 10–11 HCP and three hearts, responder invites in 3♥.
- After 1♠–2♣–2♦, responder with 11–12 HCP and exactly two spades bids 2♠.
- Other hands continue through the existing response logic.

## Implementation

- [x] Add regression tests for the 2♠ preference after both 2♥ and 2♦, the natural 3♣ invitation, and the three-card heart-fit invitation.
- [x] Run the focused bot tests.

## Reference

- [ACBL SAYC System Booklet](https://web2.acbl.org/documentLibrary/play/sayc_book.pdf), responder rebids after an initial two-level new-suit response.
