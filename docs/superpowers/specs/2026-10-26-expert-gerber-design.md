# Expert Gerber Design

## Intent

Add an Expert bot tier with a slam-asking continuation after direct notrump openings. This builds on Advanced and gives Expert a distinct bidding decision while preserving the existing quantitative meaning of 4NT.

## Goals

- Expose Expert in solo setup and bot construction.
- After partner directly opens 1NT, bid 4♣ with a balanced 19+ HCP hand and no four-card major.
- After partner directly opens 2NT, bid 4♣ with a balanced 16+ HCP hand and no four-card major.
- Answer partner's direct 4♣ Gerber ask with 4♦ for zero or four aces, 4♥ for one, 4♠ for two, or 4NT for three.
- After the answer, place 6NT when the responder knows the partnership has at least three aces; otherwise place 4NT. For the ambiguous 4♦ response, assume zero unless responder's own aces already establish at least three.
- Reuse Advanced card play and delegate all other bids to Intermediate.

## Non-goals

- Add king-asking Gerber, Blackwood, or slam exploration in suit auctions.
- Change Beginner, Intermediate, or Advanced behavior.
- Reveal hidden cards or use a solver.

## Approaches

1. **Layer Gerber onto Expert (selected).** Add a wrapper around Advanced that intercepts only the direct notrump ace-ask sequence, leaving all other behavior unchanged. This cleanly distinguishes the highest tier while preserving the existing quantitative 4NT agreement.
2. **Make Gerber available to all tiers.** This would change established Beginner/Intermediate bidding, so it is not appropriate for this Expert increment.
3. **Add a solver-backed slam evaluator.** This requires hidden-hand sampling and a solver integration; it is much larger and not needed for the defined ace-ask behavior.

## Constraints

- Keep bot logic in `packages/bots`; keep shared skill types in platform-neutral `packages/core`.
- No opponent calls may occur in the Gerber sequence.
- Keep decisions deterministic and legal.
- Public docs must state the limited ace-count placement policy accurately.

## References

- [ACBL Modern Notrump teacher manual](https://web2.acbl.org/documentLibrary/teachers/ModernNTteacherManual.pdf)
- [ACBL SAYC system booklet](https://web2.acbl.org/documentLibrary/play/sayc_book.pdf)
