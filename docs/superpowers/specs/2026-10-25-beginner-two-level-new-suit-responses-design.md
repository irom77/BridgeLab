# Beginner Two-Level New-Suit Responses

## Intent

Extend the beginner bot's uncontested response to partner's one-level suit opening when responder cannot make an eligible one-level new-suit bid.

## Goals and limits

- Require at least 10 HCP and four cards in the new suit.
- Prefer any eligible one-level new-suit response over a two-level response.
- Choose the longest eligible new suit; break ties toward the higher ranking suit.
- Bid the lowest legal level for that suit: one when it outranks opener's suit, otherwise two.
- Apply the same limited behavior under current SAYC and 2/1 labels. This rule does not claim to implement the full forcing or game-forcing agreements of either system.
- Keep partner-only, uncontested response restrictions.

## Approaches

- Extend the existing new-suit selector to generate legal one- and two-level candidates: chosen because it keeps suit selection and priority together.
- Add a general auction/convention engine: deferred until system-specific sequences are implemented.

## Constraints

Use public auction and the bot's hand only. Keep action legality in core and cover auction position, thresholds, and priority with focused tests.
