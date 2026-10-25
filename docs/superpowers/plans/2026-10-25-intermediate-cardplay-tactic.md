# Initial intermediate card-play tactic

## Goal

Add a tested behavior distinction for intermediate skill while preserving the beginner bot's existing behavior.

## Approach

Keep bidding on the current beginner conventions. For card play, follow suit as before; when partner is not winning, take the trick with the lowest card that wins, and when partner is already winning, play the lowest legal card. This is a first heuristic, not a full intermediate strategy.

## Scope

- Allow `createBot` to construct the intermediate skill.
- Test the cheapest-winning-card and partner-winning cases.
- Keep advanced and expert skills unimplemented and mark this roadmap slice as partial.

## Verification

Verified: `pnpm test` (130 tests), `pnpm lint`, `pnpm typecheck`, and `git diff --check` pass.
