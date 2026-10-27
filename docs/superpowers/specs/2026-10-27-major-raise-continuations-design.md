# Simple major raise continuations

## Intent

Complete the natural follow-up after responder raises opener's major at the two or three level, in both SAYC and 2/1 styles.

## Scope

- After an uncontested 1M–2M raise in either style, opener invites with 3M on 16–18 HCP or places 4M on 19+; responder accepts 3M with 8–9 HCP and passes with 6–7.
- After an uncontested SAYC 1M–3M limit raise, opener places 4M with 13+ HCP or passes below that range. 2/1 continues to use its documented forcing 1NT response with 10–12 HCP and three-card support.
- Keep these sequences natural; the 1M–2M raise does not establish a 2/1 game force.
- Do not change responder's direct 1M raise ranges or competitive auctions.

## Constraints and rationale

Keep the bidding behavior in `packages/bots`. Use existing point-count and seat/auction helpers, with focused coverage for both major suits and both bidding styles. The responder's raise ranges are already implemented; the current gap is opener's and responder's next call.
