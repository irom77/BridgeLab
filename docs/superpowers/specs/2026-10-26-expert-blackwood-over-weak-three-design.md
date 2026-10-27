# Expert Blackwood over a weak three major

## Intent

Let an Expert responder investigate a major-suit slam when partner opens an uncontested weak 3♥ or 3♠ and responder has enough strength and support to ask for aces.

## Scope

- With 19+ HCP and at least three-card support, Expert responder bids 4NT directly over partner's uncontested 3♥/3♠ opening.
- 4NT is simple Blackwood; partner responds 5♣ with zero or four aces, 5♦ with one, 5♥ with two, or 5♠ with three.
- Because this weak-three opener is limited to 10 HCP, treat 5♣ as zero aces. With three combined aces, responder bids 6M; with four, responder asks for kings with 5NT.
- After 5NT, opener responds 6♣ with zero kings, 6♦ with one, 6♥ with two, or 6♠ with three. A four-king response is impossible for an opener capped at 10 HCP.
- Responder places 7M only when all four kings are known between the hands; otherwise responder places 6M. The weak-three opener passes the final contract.
- Only Expert bots use this sequence. Competitive auctions, minor preempts, and keycard variations remain out of scope.

## Approaches

- Use a special keycard response scale for preempts: rejected because it is a separate partnership agreement and not part of the configured SAYC / 2/1 methods.
- Use simple Blackwood after a direct 4NT jump: selected because it is a familiar, bounded ace ask over a preempt, and an established bridge reference explicitly describes direct 4NT after partner's weak two or three major as simple Blackwood.
- Stop at the small slam once all four aces are known: rejected because simple Blackwood's 5NT continuation can ask for kings, and the Expert weak-three sequence is the project's explicit place for further slam exploration.

## Constraints and rationale

Keep bidding in `packages/bots`; do not add convention-specific logic to platform-neutral core. Reuse the existing ace-count responses and threshold behavior where possible. The 19-HCP threshold follows the roadmap's existing slam-zone convention. A direct 4NT over a preempt can be played as simple Blackwood when no lower-level asking agreement is in use. After all aces are accounted for, 5NT asks for kings. [Kantar Bridge, RKB IV, “After Partner Preempts”](https://www.kantarbridge.com/rkb__iv.html) [60 Second Bridge, Blackwood king ask](https://www.60secondbridge.com/public-lessons/bridge-conventions/lessons/503-blackwood-king-ask/).
