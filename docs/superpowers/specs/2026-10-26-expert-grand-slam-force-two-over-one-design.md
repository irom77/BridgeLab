# Expert Grand Slam Force After a 2/1 Major Fit

## Intent

Extend the Expert 5NT Grand Slam Force from Jacoby 2NT auctions to major fits established in uncontested direct 2/1 game-forcing auctions. This gives the partnership a way to ask about the quality of agreed trumps after game has been reached.

## Agreement

- After 1M–2-over-1, opener's 3M establishes a major fit and responder places 4M. Opener bids 5NT with 18+ HCP and at least two of A/K/Q in the agreed major.
- Responder answers opener's 5NT with 7M holding at least two of A/K/Q, otherwise 6M.
- Apply only to 2/1 style and an uncontested direct 2/1 sequence with an agreed major. Other skills and SAYC behavior remain unchanged.
- Keep the existing 5NT Blackwood king ask, which occurs after a 4NT ask, distinct from this sequence.

## Approaches

- Generalize the existing Jacoby detector to arbitrary agreed-major auctions. This risks interpreting a Blackwood continuation as a Grand Slam Force.
- Add an exact detector for the 1M–2/1–3M–4M sequence. This limits the meaning to a documented auction and keeps the king ask separate.

Use the exact detector because it is the smallest unambiguous extension and follows the current auction-specific convention code.

## Constraints

- Keep `packages/core` platform-neutral.
- Keep the behavior deterministic and Expert-only.
- Cover opener strength and trump honors, responder's honor threshold, the 2/1-only boundary, and distinction from Blackwood.
