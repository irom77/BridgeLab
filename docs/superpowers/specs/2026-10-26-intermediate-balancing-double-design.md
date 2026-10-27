# Intermediate Balancing Takeout Double

## Intent

Let an Intermediate bot reopen the auction with a takeout double when an opponent opens one of a suit, the next two players pass, and the bot is in balancing seat.

## Agreement

After exactly `1-suit, pass, pass`, double with at least 10 total points (HCP plus the existing shortness adjustment), no more than two cards in opener's suit, and the same support for unbid suits required by the existing direct takeout double. Otherwise retain existing bidding behavior.

If opener passes the balancing double, the advancer who passed earlier may make the existing minimum natural advance; for example, after `1♠–Pass–Pass–Double–Pass`, a passed hand with four hearts and 0–8 HCP bids 2♥.

## Approaches

- Reuse the direct-seat takeout-double thresholds: too strong for a balancing seat.
- Add a balancing-only gate with a lower total-point threshold, reuse the direct support shape, and let the passed advancer use the existing natural advances after opener passes: selected because it keeps direct doubles unchanged and expresses the positional exception end to end.

## Constraints and non-goals

Keep this in the bots package and use existing hand/type helpers. Do not change direct doubles, competitive auctions with intervention, or later-seat balancing overcalls.
