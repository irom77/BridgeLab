# Beginner Opener Suit Rebids

## Intent

Give the beginner bot one simple continuation after partner responds in a new suit at the one level to an uncontested one-level suit opening.

## Goals and limits

- Detect a two-contract auction where this bot opened one of a suit, partner responded one of a different suit, and all other calls were passes.
- With six or more cards in opener's original suit, rebid it at the two level.
- Otherwise pass.
- Apply the same behavior under current SAYC and 2/1 labels; this is not a complete opener rebid structure.
- Do not continue after notrump or raise responses in this change.

## Approaches

- Add one narrow continuation for a six-card opener suit: chosen because it covers the basic long-suit rebid without inventing a full auction tree.
- Add complete responder/opener auction trees: deferred until system-specific agreement behavior is specified.

## Constraints

Only use the bot's hand and public auction. Avoid continuations in competitive auctions and cover partner identity, suit length, and interference with focused tests.
