# Expert Texas Transfers over 2NT

## Intent

Expert responders with six-card majors can place game in the major while keeping the 2NT opener on lead. Texas transfers distinguish these game-placement hands from slam-oriented hands that start with the existing three-level Jacoby transfer.

## Behavior

- Over an uncontested 2NT opening, an Expert responder with a six-card major and 0–9 HCP uses 4♦ for hearts or 4♥ for spades. With six cards in both majors, prefer spades.
- Opener accepts by bidding 4♥ or 4♠ respectively; responder then passes.
- Five-card majors and 10+ HCP continue to use existing methods.
- Only exact uncontested 2NT sequences are conventional. SAYC/2/1 Beginner behavior and 1NT auctions remain unchanged.

## Approaches

1. Keep using a three-level Jacoby transfer and raise to game. This is already supported but does not separate game-only hands from slam exploration or abbreviate the auction.
2. Add Texas transfers at the four level for Expert 2NT auctions. This follows the existing transfer model and leaves higher-strength hands on current methods. **Selected** because it directly establishes game and keeps the opener as declarer.

## Constraints and non-goals

Keep all logic in the bot package. Do not alter core auction legality, 1NT methods, or slam conventions. Existing Gerber stays available for balanced hands without a four-card major.

## Source

ACBL, [Commonly Used Conventions: Texas Transfers](https://web2.acbl.org/documentLibrary/play/commonlyusedconventions.pdf), describes 4♦ as a transfer to hearts and 4♥ as a transfer to spades, typically used to stop in game.
