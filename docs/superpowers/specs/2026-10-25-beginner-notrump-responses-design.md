# Beginner 1NT Responses

## Intent

Let a beginner bot make a simple response when its partner opens 1NT in an uncontested auction. This adds a useful first response while keeping the bidding deliberately conservative.

## Goals and limits

- Identify partner using the bot's seat and public auction.
- In an uncontested auction, respond only to partner's 1NT opening.
- On a balanced hand, pass with fewer than 8 HCP, bid 2NT with 8–9 HCP, and bid 3NT with 10+ HCP.
- Pass in all other auctions and with unbalanced responder hands.
- This does not add Stayman, transfers, competitive bidding, or a complete SAYC/2/1 system.

## Approaches

- Add the acting seat to the existing bot decision API and handle this narrow response: chosen because partnership is otherwise unknowable from hand and auction alone.
- Infer seat from auction order: rejected because calls can begin with passes and the API currently does not promise a specific next bidder.
- Add a full auction model and convention engine: too broad for this step.

## Constraints

Keep decision data limited to the bot's own hand, seat, and public auction. Pass the current actor from the client. Cover partnership, HCP ranges, balanced shape, and intervening calls with focused tests.
