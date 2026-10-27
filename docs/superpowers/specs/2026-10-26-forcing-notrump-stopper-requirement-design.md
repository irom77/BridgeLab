# Forcing Notrump Minor-Rebid Stopper Requirement

## Intent

Keep responder's invitational notrump rebid after opener shows a minor suit only when responder has stoppers in the other unbid suits.

## Agreement

After an uncontested 1M–1NT–2m auction, a balanced responder with 11–12 HCP and fewer than three cards in opener's major bids 2NT only with stoppers in both suits other than opener's major and rebid minor. Without those stoppers, responder with exactly two-card support for opener's major prefers 2M.

## Approaches

- Keep the current strength-only 2NT invitation: simpler, but may choose notrump without protection in both unbid suits.
- Require both unbid-suit stoppers and use the doubleton major preference when either is missing: selected because it follows the documented continuation and keeps the response natural.

## Constraints and non-goals

Use existing hand, suit, and stopper helpers in `packages/bots`; do not change opening or direct response agreements, other strength ranges, or auctions with interference.

## Reference

[ACBL Unit 390, 1NT Forcing Convention](https://www.acblunit390.org/Simon/fnt.htm), responder's second bid: 2NT shows stoppers in unbid suits with no fit; 2M may show a doubleton preference.
