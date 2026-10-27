# Card Play Hints Design

## Intent

Give a player a simple in-game hint during card play. The current core helper can list legal cards and accepts an optional solver; the client does not expose it yet. This makes the existing capability useful without claiming strategic advice where no solver exists.

## Goals

- Show a hint control during a human-controlled card-play turn.
- Without a solver, identify every card the player may legally play, including follow-suit constraints.
- With a solver adapter, show its recommended cards using the existing `Solver` interface.
- Keep hints advisory: they do not play a card or change game state.

## Non-goals

- Bidding advice, explanations of bridge strategy, or bot-strength improvements.
- Bundling or implementing a bridge solver.
- Showing another seat's cards or solver inputs beyond the acting hand and public trick context.

## Constraints

- Keep `packages/core` platform-neutral and preserve immutable transitions.
- Use `requestHint(context, solver?)` from `packages/core/src/bots.ts`.
- Keep the client hint scoped to the current human-controlled actor, including dummy when controlled by the user.
- Clear stale hint content when the game or acting seat changes.

## Approaches

1. **Highlight all legal cards in the hand.** Directly communicates the core helper's current no-solver result. A future solver can narrow the highlight list without changing the UI contract. Chosen for this first slice because it distinguishes legality from strategic advice and requires no new dependency.
2. **Choose one arbitrary legal card as “the hint.”** Smaller visually, but implies strategic preference that the fallback cannot support.
3. **Implement a bridge solver first.** Provides strategic recommendations, but substantially expands scope and adds algorithm correctness/performance concerns.

## Design

Add a “Show hint” button in the human card-play panel. Clicking it requests legal/recommended cards from the current hand and public trick context. The UI highlights and labels those cards as playable/recommended; it does not submit an action. The asynchronous request is ignored if its game snapshot or actor is no longer current. Tests cover follow-suit filtering, no automatic play, dummy control, and stale results. The optional solver remains injectable through the core API, but this slice does not configure a production solver.

## Success criteria

- On a lead, a no-solver hint identifies the whole hand as legal.
- When following suit is required, only cards of the led suit are identified.
- Solver recommendations are filtered to cards the acting player can legally play.
- Requesting a hint leaves auction/play state and history unchanged.
- A hint result for a replaced hand is not displayed.
