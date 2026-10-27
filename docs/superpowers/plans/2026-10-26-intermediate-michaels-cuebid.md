# Intermediate Michaels Cue-Bids

## Goal

Add Michaels cue-bids over a one-suit opening: cue-bid a minor to show both majors with 8+ HCP, or cue-bid a major to show the other major and an unspecified minor with 10+ HCP. After a major Michaels cue-bid, responder can use 2NT to ask which minor partner holds.

## Approach

Add these conventional actions to Intermediate's direct-overcall path before natural overcalls. On the 2NT inquiry, the Michaels bidder names the longer minor, preferring clubs when lengths tie.

## Constraints

- Apply only over an opponent's uncontested one-level suit opening.
- Require at least five cards in each shown suit.
- Keep Beginner bidding unchanged.
- Source: [ACBL SAYC System Booklet, Defensive Bidding](https://www.bridgewebs.com/canadianbridgedubai/SAYC%20Biddking.pdf), sections on cue-bid overcalls and asking for partner's minor.

## Completed and verified

- [x] Test minor and major Michaels cue-bids and 2NT minor inquiry.
- [x] Run `pnpm test` (470 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
