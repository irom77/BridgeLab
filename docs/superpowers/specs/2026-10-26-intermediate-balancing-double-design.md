# Intermediate Balancing Takeout Double

## Intent

Let an Intermediate bot reopen the auction with a takeout double when an opponent opens one of a suit, the next two players pass, and the bot is in balancing seat.

## Agreement

After exactly `1-suit, pass, pass`, double with at least 10 total points (HCP plus the existing shortness adjustment), no more than two cards in opener's suit, and the same support for unbid suits required by the existing direct takeout double. Otherwise retain existing bidding behavior.

## Approaches

- Reuse the direct-seat takeout-double thresholds: too strong for a balancing seat.
- Add a balancing-only gate with a lower total-point threshold and reuse the direct support shape: selected because it keeps direct doubles unchanged and expresses the positional exception.

## Constraints and non-goals

Keep this in the bots package and use existing hand/type helpers. Do not change direct doubles, competitive auctions with intervention, or later-seat balancing overcalls.
