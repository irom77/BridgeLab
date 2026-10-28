# Expert Slam Continuations After Weak-Three Openings

## Intent

Finish the currently open Expert weak-three roadmap item by covering the remaining slam routes after a major fit is established. The audit found that ordinary game placement is already covered: major raises and quick-trick raises, self-sufficient 3NT, natural forcing major responses, and the existing weak-three Blackwood routes. The missing routes are Blackwood after a natural major response to a weak-three major and a Grand Slam Force after a weak-three major fit reaches game.

## Goals

- After uncontested `3♥–3♠–4♠`, let an Expert responder with 19+ HCP and six-card spade support start 4NT Blackwood, continue through the existing ace and king asks, and place the small or grand slam using the existing ace/king policy.
- During Blackwood placement, pass when partner's king response has already established a contract at or above the intended 6M small slam; bid 7M only when all aces and kings are confirmed.
- Once all four aces are known, ask for kings only when responder holds one to three kings. A weak-three opener is limited to 10 HCP and cannot hold all four kings, so responder with no kings places 6M without an unproductive 5NT ask; responder holding all four kings places 7M directly.
- After a weak-three auction confirms a major fit at game, let an Expert with 18+ HCP and at least six cards in the agreed major ask with 5NT. Partner bids 7M with two of the top three trump honors (A/K/Q), otherwise 6M.
- Keep existing direct Blackwood paths and game-placement decisions intact. Apply the new agreements only in uncontested auctions with an unpassed responder.
- Update the weak-three roadmap entry and change history when these sequences are covered by tests.

## Non-goals

- Change the weak-three opening requirements, existing 3NT or game-raise thresholds, or natural response meanings.
- Add cue-bidding or change the meaning of existing 4NT/5NT Blackwood asks.
- Extend the new agreements to Beginner, Intermediate, or Advanced bots.

## Constraints

- Implement bidding behavior in `packages/bots`; keep `packages/core` platform-neutral.
- Preserve immutable auction inputs and validate the full uncontested auction before applying a convention.
- Expert weak-three agreements apply in both configured bidding styles, consistent with existing weak-three Blackwood coverage.
- The 5NT Grand Slam Force follows the ACBL basic definition: ask partner to bid the grand slam with two of the top three trump honors; otherwise bid the small slam. [ACBL Commonly Used Conventions](https://web2.acbl.org/documentLibrary/play/commonlyusedconventions.pdf)
- For the new 5NT route, the project policy is 18+ HCP and at least six cards in the agreed major, and it is available only when the existing 4NT Blackwood condition does not apply.

## Approaches

1. Add a new control-cue-bidding system after weak-three fits. This offers more descriptive steps but requires defining a separate control-bid ladder and its interaction with the current ace and king asks.
2. Complete the missing weak-three Blackwood route and add the established Grand Slam Force after a confirmed major fit. This reuses the project's tested ace/king flow, adds one bounded 5NT continuation, and keeps existing response agreements intact.

**Chosen:** Approach 2, because the roadmap calls for remaining weak-three slam continuations and the code already has both conventions in adjacent auctions.

## Design

Recognize the exact fit-confirming sequences from the contract calls and verify that the responder was unpassed and opponents only passed. Extend the existing weak-three major-fit recognizer to include `3♥–3♠–4♠` and `3♠–4♥–5♥` alongside the existing `3m–3M–4M` fits. Reuse the existing ace response, king ask, and slam placement policy for the newly covered 4NT sequence. Add a separate Expert responder branch for 5NT after a game-level fit confirmation; opener's reply depends only on its A/K/Q holding in the agreed major.

For a fit eligible for both asks, keep 4NT Blackwood as the first choice when the existing 19+ HCP and six-card suit condition applies. Use 5NT for the documented project threshold when that 4NT condition does not apply. Do not reinterpret 5NT after 4NT; that remains the king ask.

## Review Focus

- A prior pass by responder, opponent action, or malformed seat order must not activate the new routes.
- A 5NT Grand Slam Force must not be mistaken for the 5NT king ask following 4NT.
- The `3♠–4♥–5♥` fit is already at the five level; no lower-level 4NT Blackwood bid may be produced there.
- SAYC and 2/1 style selection should not change Expert weak-three behavior.
- Existing game raises, 3NT placement, direct weak-three Blackwood, and weak-three minor-fit Blackwood must remain stable.
