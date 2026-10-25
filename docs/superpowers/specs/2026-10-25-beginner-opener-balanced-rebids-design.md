# Beginner Opener Balanced Rebids Design

## Intent

After an uncontested one-level new-suit response, let opener show a balanced hand's strength with a natural notrump rebid.

## Scope and approach

Extend the existing beginner opener continuation: with 12–14 HCP and a balanced shape, rebid 1NT after any one-level suit opening; with 18–19 HCP and a balanced shape, rebid 2NT. Keep the existing six-card opening-suit rebid as a fallback. This makes one focused extension to existing bot logic rather than adding a general bidding engine.

## Constraints and non-goals

Keep the behavior in `packages/bots`, use the existing HCP and balanced-hand helpers, and cover the ranges with bot tests. This does not cover balanced 15–17 hands, responder continuations, competitive auctions, or a complete SAYC/2/1 system.
