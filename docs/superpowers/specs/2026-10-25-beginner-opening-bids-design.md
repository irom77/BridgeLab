# Beginner Opening Bid Refinement

## Intent

Make the beginner bot's opening suit selection respect a shared SAYC/2/1 baseline: open a five-card major when available, otherwise open a minor. This fixes four-card major openings while keeping the current beginner scope clear.

## Goals and limits

- Preserve the existing 15–17 balanced 1NT and below-12 pass rules.
- Prefer a five-card major over a minor; with both majors, choose the longer and prefer spades on a tie.
- If there is no five-card major, open a minor, choosing the longer minor and diamonds on a tie.
- This does not implement responses, competitive auctions, or complete SAYC/2/1 agreements.

## Approaches

- Add a complete convention engine: too broad for this focused correction and not supported by current auction-state abstractions.
- Refine the existing opening selector: chosen because it corrects the immediate convention violation without changing the bot API.
- Leave the selector unchanged: rejected because it can choose a four-card major over a minor.

## Constraints

Use the existing private-hand-only `ConventionSystem.openingBid` API. Keep both style labels supported and deterministic. Cover behavior with focused bot tests and update roadmap/changelog language accurately.
