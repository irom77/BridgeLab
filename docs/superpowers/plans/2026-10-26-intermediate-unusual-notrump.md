# Intermediate Unusual 2NT Overcall

## Status

Completed and verified. Intermediate uses a direct 2NT overcall over a one-level suit opening when each of the two lowest unbid suits has at least five cards. Tests cover a major opening and a minor opening; the existing natural 1NT overcall cases remain passing.

## Goal

When an opponent opens one of a suit, let Intermediate jump to 2NT with at least five cards in each of the two lowest unbid suits.

## Approach

The direct-overcall branch checks the two lowest unbid suits in standard suit order before natural overcall selection and requires five cards in each. Beginner bidding is unchanged.

## Constraints

- Apply only to a direct overcall of an opponent's one-level suit opening.
- Keep Beginner bidding unchanged.
- Do not change the natural 1NT overcall with a balanced 15–18 HCP hand and a stopper.
- Source: [ACBL SAYC System Booklet, Defensive Bidding](https://www.bridgewebs.com/canadianbridgedubai/SAYC%20Biddking.pdf), which defines a jump 2NT overcall as at least 5–5 in the lowest two unbid suits.

## Verification

- [x] Test the lowest-two-suits calculation over a major and a minor opening.
- [x] Preserve the natural 1NT overcall for a balanced hand.
- [x] Run `pnpm test` (472 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
