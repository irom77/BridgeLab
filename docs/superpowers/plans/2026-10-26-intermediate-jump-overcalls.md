# Intermediate Preemptive Jump Overcalls

## Goal

Add natural weak jump overcalls against an opponent's one-level suit opening. A six-card major suit that qualifies for a weak two jumps to the two level; a seven-card minor suit with comparable quality jumps to the three level.

## Approach

Extend the Intermediate bidder's direct-overcall selection before its existing simple-overcall rules. Require 5–11 HCP and at least two honors among A/K/Q/J/T; prefer a qualifying major jump, then a qualifying minor jump. Existing simple overcalls remain available when the hand does not meet these preemptive shape requirements.

## Constraints

- Use only the bidder's hand and public auction.
- Do not jump in opener's suit or when partner opened.
- Keep Beginner bidding unchanged.
- Source: [ACBL SAYC System Booklet, Defensive Bidding](https://www.bridgewebs.com/canadianbridgedubai/SAYC%20Biddking.pdf), which describes jump overcalls as preemptive and matching an opening bid at the same level.

## Completed and verified

- [x] Test a six-card weak major jump, a seven-card weak minor jump, and the simple-overcall fallback.
- [x] Run `pnpm test` (467 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
