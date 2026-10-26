# 1♥–2♠ in 2/1 Game Force

## Goal

Complete the higher-ranking two-over-one response that was missing from the existing 2/1 parser and continuation logic.

## Agreement

- In uncontested 2/1 style, responder bids 2♠ over 1♥ with at least five spades and 13+ HCP; the response is game-forcing.
- SAYC keeps the natural 1♠ response with four or more spades at its existing strength range.
- Opener raises to 3♠ with three-card spade support, even when balanced; responder completes 4♠.
- With a balanced 18–19 HCP opener and no three-card spade fit, opener rebids 2NT; responder continues to 3NT when there is no three-card fit for opener's heart suit.

## Implementation

`twoOverOneAuction` accepts 1♥–2♠ as the higher-ranking 2/1 exception while continuing to reject an invalid repeat of 2♠ by opener. The 2/1 response chooser gives the five-card, 13+ HCP game force priority over the natural 1♠ response.

## Verification

Tests cover the 2/1 response, SAYC distinction, opener's three-card spade raise, game completion, and notrump continuation. Run the workspace `pnpm test`, `pnpm typecheck`, and `pnpm lint` commands.
