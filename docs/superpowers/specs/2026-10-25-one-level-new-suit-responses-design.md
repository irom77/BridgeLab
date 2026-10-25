# One-Level New-Suit Responses

## Intent

Add a basic response when partner opens one of the lower one-level suits and responder has a qualifying higher suit. This fills a practical gap in beginner auctions while keeping the current responder behavior conservative.

## Goals and limits

- Respond only when partner's one-level suit opening is the only non-pass call.
- Bid a higher-ranked suit at the one level with 4+ cards and 6+ HCP.
- Prefer the longest eligible suit; break ties by bidding the highest eligible suit.
- Pass when no legal one-level new suit qualifies.
- Keep the same rule for the current SAYC and 2/1 labels. Two-level responses, 2/1 game-forcing continuations, minor raises, and competitive auctions remain out of scope.

## Approaches

- Add a narrow rule to the existing responder logic: chosen because it fits the current private hand, seat, and public auction interface.
- Add a complete auction tree now: deferred because later 2/1 continuations and competition need a wider agreement model.

## Constraints

Never rebid a suit at or below the opening's rank at the one level. Keep partner identification and uncontested-auction checks. Verify rules with focused tests and preserve the open roadmap stages.
