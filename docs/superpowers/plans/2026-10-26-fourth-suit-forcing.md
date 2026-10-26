# Fourth Suit Forcing

## Goal

Implement the SAYC one-round force when an unpassed responder introduces the only unbid suit at their second turn after opener has rebid a suit. The call may be artificial and responder may hold fewer than four cards in it. Opener must continue with a natural description.

## Approach

Use the existing auction and hand interfaces in `packages/bots`. Require 10+ HCP for this invitational-or-better treatment, select the cheapest legal level in the fourth suit, and have opener prioritize support for responder's first suit, then a notrump rebid with a stopper, then a natural rebid of opener's first suit.

## Constraints

- Keep the core package platform-neutral and the auction immutable.
- Do not apply this rule after an opening 1NT rebid or to a direct 2/1 game force.
- Preserve natural bids when the auction has not named three distinct suits.
- Source: [ACBL SAYC System Booklet, Subsequent Bidding by Responder](https://www.bridgewebs.com/canadianbridgedubai/SAYC%20Biddking.pdf), which describes a new suit by responder after opener's suit rebid as forcing and says the fourth suit may be artificial.

## Completed and verified

- [x] Test an artificial fourth-suit call with fewer than four cards in that suit.
- [x] Test the 10 HCP threshold and preserve a sub-threshold natural/signoff action.
- [x] Test opener's forced descriptive continuation by support and by a stopper.
- [x] Run `pnpm test` (465 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
