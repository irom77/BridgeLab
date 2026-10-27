# Natural new-suit responses over weak three majors

## Intent

Let a strong responder with a long second major find a fit after partner opens a weak three-level major preempt.

## Scope

- After an uncontested 3♥ opening, Intermediate, Advanced, and Expert respond 3♠ with 16+ HCP and six or more spades containing at least two honors among A-K-Q-J-T.
- After an uncontested 3♠ opening, the same hand requirements permit 4♥.
- These natural new-suit responses force opener to bid again. With three or more cards in responder's major, opener raises to 4♠ after 3♥–3♠ or 5♥ after 3♠–4♥. Otherwise opener repeats the preempt suit at 4M.
- After 3♥–3♠–4♥, responder places 4♠. After 3♠–4♥–4♠, responder passes. Opener passes after responder places 4♠.
- Preserve existing higher-priority 4M, 3NT, and quick-trick responses. Do not apply after interference.

## Approaches

- Extend the existing natural forcing response and continuation: selected to reuse the already established strength and suit-quality agreement.
- Add an artificial inquiry: rejected because it needs a larger partnership agreement.
- Make a direct game-only response: rejected because 3♠ over 3♥ can still discover fit at a lower level.

## Constraints and rationale

Keep bidding behavior in `packages/bots` and inherit it through Advanced and Expert. The existing project agreement sets 16+ HCP, six cards, and two honors as the natural forcing major thresholds. For 3♠–4♥, opener's no-fit rebid is 4♠ and responder passes that signoff; with a heart fit opener bids 5♥, which responder also passes.
