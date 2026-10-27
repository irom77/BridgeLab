# Advanced Bot Design

## Intent

Add an Advanced opponent level that makes a distinct, testable card-play decision while preserving the existing Beginner and Intermediate behavior. This gives solo players a stronger deterministic opponent without introducing hidden-information access or an external solver dependency.

## Goals

- Expose Advanced in solo setup and bot construction.
- Reuse Intermediate bidding and existing legal-card validation.
- When third to play, partner is currently winning, and the bot holds a touching honor sequence in the led suit, lead the top honor from that sequence to apply third-hand-high pressure.
- Keep choices deterministic and use only the bot's hand and public current trick.

## Non-goals

- Change Beginner or Intermediate behavior.
- Add new bidding agreements in this slice; Advanced delegates bidding to Intermediate.
- Expose Expert until it has its own distinct, tested strategy.
- Add a solver or reveal unseen cards.

## Approaches

1. **Layer a local heuristic on Intermediate (selected).** Advanced delegates bidding and fallback card decisions, overriding only the third-hand honor-sequence case. This is small, deterministic, legal by construction, and preserves the existing public-information boundary.
2. **Add solver-backed play.** This needs a solver dependency, configuration, and a more complete public play context; it is outside this local bot increment.
3. **Keep Advanced unavailable until all higher-level strategies are ready.** This avoids a new choice but does not deliver the roadmap's Advanced progression.

## Constraints

- Keep bridge domain logic in `packages/bots` and shared types in platform-neutral `packages/core`.
- Use existing `legalCards`, `winningPlay`, and honor-sequence helpers.
- Continue to test that bots never receive hidden hands.
- Keep README and roadmap claims limited to implemented behavior.

## Builder decisions

- Advanced follows Intermediate for bidding, opening leads, and non-third-hand play.
- The Advanced-only rule applies when exactly two cards are already in the trick, partner is winning, and the actor holds a touching honor sequence in the led suit. It plays the top honor; otherwise it delegates to Intermediate.
