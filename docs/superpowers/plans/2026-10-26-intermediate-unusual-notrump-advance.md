# Intermediate Unusual 2NT Advance

## Status

Completed for a pass by the next opponent. A balanced advancer with 13+ HCP places 3NT. A weak advancer with 5+ cards in a shown suit jumps to level 4 as a preemptive raise. With 13+ HCP and at least three-card support for a shown suit, advancer cue-bids opener's suit. Overcaller places game with 13+ HCP or shows a minimum by bidding level 3 in the preferred suit; advancer then passes with 13–15 HCP or places game with 16+ HCP and three-card support. Other hands bid level 3 in the better-supported suit. Ties prefer the lower-ranking suit.

## Goal

Give advancer a simple, nonforcing preference for one of partner's shown suits.

## Constraints

- The unusual 2NT promises at least five cards in each of the two lowest unbid suits.
- A simple preference starts at the three level and shows no game interest.
- A weak hand with 5+ card support may jump preemptively to level 4.
- A cue-bid of opener's suit shows game-invitational values and support for a shown suit; overcaller chooses a level-three preference with a minimum or bids game with 13+ HCP.
- After a minimum preference, advancer passes below 16 HCP and places game with 16+ HCP when holding at least three cards in partner's suit.
- Apply only when the opponent after the overcaller passes.
- Source: [ACBL Teacher Manual, Lesson 4: Two-Suited Overcalls](https://cdn.acbl.org/assets/documents/teachers/Teacher-Manuals/More-Commonly-Used-Conventions-Lesson-4.pdf), “Advancing After the Unusual Notrump.”

## Verification

- [x] Test preference over a club opening, where 2NT shows diamonds and hearts.
- [x] Test preference over a spade opening, where 2NT shows clubs and diamonds.
- [x] Test 3NT placement with a balanced game hand.
- [x] Test a weak six-card minor fit jumping to level 4.
- [x] Test a shorter fit staying at level 3.
- [x] Test a game-invitational cue and a minimum overcaller's forced preference.
- [x] Test a strong overcaller accepting the cue to game.
- [x] Test passing a minimum preference with 15 HCP and accepting with 16 HCP and three-card support.
- [x] Verify advancer passes to defend after an opponent competes at the three level.
- [x] `pnpm test` passes (483 tests).
- [x] `pnpm typecheck`, `pnpm lint`, and `git diff --check` pass.
