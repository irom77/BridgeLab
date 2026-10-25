# Beginner Major Raises

## Intent

Add a basic uncontested response to partner's one-level heart or spade opening, moving the beginner bot beyond opening-only bidding.

## Goals and limits

- Respond only when partner's one-level major opening is the only non-pass call.
- With at least three-card support, raise to two with 6–9 HCP, three with 10–12, and game with 13+.
- Pass with fewer than 6 HCP or fewer than three cards in the opened major.
- Keep behavior identical for current SAYC and 2/1 beginner labels; this is not a complete raise structure.
- Do not add competitive responses or new-suit responses in this change.

## Approaches

- Add this rule within the current convention implementation: chosen because the bot already has the hand, seat, and public auction needed.
- Add a general auction tree and convention engine: broader than this response and deferred until more sequences are defined.

## Constraints

Preserve private-hand-only inputs, respond only to partner, and let the core validate the resulting action. Add focused tests and document the remaining open agreement work.
