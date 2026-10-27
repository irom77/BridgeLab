# Quick-trick game response to a weak three major

## Intent

Allow the Intermediate responder to bid 4M after partner's 3M preempt when responder's quick tricks, rather than trump length, provide enough game strength.

## Scope

- After an uncontested partner 3♥/3♠ opening, bid 4M with 4.5 or more estimated quick tricks.
- Keep the existing 15+ HCP/four-card-support game raise.
- Estimate quick tricks per suit: AKQ = 3; AK = 2; AQ = 1.5; A = 1; KQ = 1; K alone = 0.5 only when it is in opener's preempt suit or responder holds another card in that side suit.
- Apply the same behavior in SAYC and 2/1; Advanced and Expert inherit Intermediate bidding. Opener passes after 4M.
- Competitive auctions and minor preempt game bidding remain out of scope.

## Approaches

- Keep the 15-HCP/four-trump rule only: simple, but misses the ACBL example with a singleton trump and enough quick tricks.
- Add a small quick-trick estimate and bid game at 4.5: selected because it covers the sourced singleton-support auction while remaining deterministic and bounded.
- Build a full trick-taking or solver-backed evaluator: potentially more accurate, but much broader and not available in the bot's current input API.

## Constraints and rationale

Use existing hand and auction APIs; keep core platform-neutral. ACBL's preempt lesson counts about six tricks from opener's seven-card suit, then uses AK spades, A diamonds, KQ clubs, and the trump king to reach 4♥ with a singleton. This design encodes that example using a 4.5 quick-trick threshold. [ACBL response to preempts lesson](https://web2.acbl.org/CommunityLessons/1_16_25.pdf).
