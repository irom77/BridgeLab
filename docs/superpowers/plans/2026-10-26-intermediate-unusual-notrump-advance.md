# Intermediate Unusual 2NT Advance

## Status

Completed. After partner makes the direct Unusual 2NT overcall and the next opponent passes, a balanced advancer with 13+ HCP places 3NT. Otherwise, Intermediate bids level 3 in the better-supported of the two lowest unbid suits. Ties prefer the lower-ranking suit.

## Goal

Give advancer a simple, nonforcing preference for one of partner's shown suits.

## Constraints

- The unusual 2NT promises at least five cards in each of the two lowest unbid suits.
- A simple preference starts at the three level and shows no game interest.
- Apply only when the opponent after the overcaller passes.
- Source: [ACBL Teacher Manual, Lesson 4: Two-Suited Overcalls](https://cdn.acbl.org/assets/documents/teachers/Teacher-Manuals/More-Commonly-Used-Conventions-Lesson-4.pdf), “Advancing After the Unusual Notrump.”

## Verification

- [x] Test preference over a club opening, where 2NT shows diamonds and hearts.
- [x] Test preference over a spade opening, where 2NT shows clubs and diamonds.
- [x] Test 3NT placement with a balanced game hand.
- [x] `pnpm test` passes (475 tests).
