# Expert Grand Slam Force After an Accepted Splinter

## Intent

Let Expert openers ask about trump quality after accepting partner's splinter raise and reaching 4M.

## Agreement

- In Expert, after 1M–splinter–4M, responder with 18+ HCP and at least two of A/K/Q in the agreed major bids 5NT.
- Opener bids 7M with at least two of A/K/Q in trumps and 6M otherwise.
- Recognize only a major opening, a three-level splinter over 1♥ or four-level splinter over 1♠, opener's game acceptance in the opening major, and responder as the 5NT bidder.
- When responder has 18+ HCP but lacks two top trump honors, preserve the existing 4NT Blackwood ask after accepted splinters.

## Approaches

- Reuse the Jacoby Grand Slam Force shape matching with a broad major-fit detector. This could consume unrelated 5NT auctions.
- Add exact sequence detection for accepted splinter auctions. This keeps the 5NT meaning explicit and isolates the 4NT ace ask.

Use exact detection to match the existing auction-specific convention logic.

## Constraints

- Expert-only and deterministic.
- No changes to core APIs or other bidding styles.
- Test the ask threshold, opener's honor-based answer, rejection of a natural 1♠–3♥ sequence, and the existing 4NT Blackwood path.
