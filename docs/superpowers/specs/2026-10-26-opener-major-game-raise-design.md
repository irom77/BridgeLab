# Opener Major Game Raise Design

## Intent

Complete opener's strength ranges after a one-level major response by placing game directly with a strong unbalanced hand and a four-card fit.

## Goals

- After an uncontested one-level major response, opener bids 4M with an unbalanced hand, 19+ HCP, and four-card support.
- Apply the behavior in SAYC and 2/1.
- Preserve the established balanced 18–19 HCP 2NT rebid and lower strength raises.

## Non-goals

- Change responder's strength ranges or add slam bidding.
- Change opener continuations after a 2/1 response, 1NT response, or competitive auction.

## Approaches

1. **Prioritize the strong major fit before side-suit rebids (selected).** This avoids losing the game-level fit when a side suit is also available and keeps the existing balanced rebid precedence.
2. **Bid the side suit first, then raise.** This delays finding the major fit and does not satisfy the direct game placement requirement.

## Constraints

- Keep the behavior in `packages/bots` and use existing hand evaluation and auction types.
- Cover both bidding styles with focused tests.
