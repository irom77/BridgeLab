# Forcing Notrump Major Preference

## Intent

Keep responder's preference available after opener rebids a minor when responder has a weak hand and a doubleton in opener's major.

## Agreement

After an uncontested 1M–1NT–2m auction, responder with up to 9 HCP, exactly two cards in opener's major, and fewer than four cards in opener's rebid minor bids 2M. A five-card alternate major remains a natural continuation and takes priority; four-card or longer support for opener's minor remains a pass.

## Approaches

- Continue passing with these weak doubleton-major hands: this may leave the partnership in opener's minor with no fit.
- Return to opener's major at the two level, after checking for an alternate-major rebid and a fit in opener's minor: selected because it shows the preference while preserving better fits and natural suit descriptions.

## Constraints and non-goals

Use existing point, suit-length, and auction helpers in `packages/bots`; do not alter initial response selection or auctions with interference.

## Reference

[ACBL Unit 390, 1NT Forcing Convention](https://www.acblunit390.org/Simon/fnt.htm) describes retreating to opener's major with a doubleton preference and passing a minor rebid with four-card support.
