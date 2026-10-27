# Self-sufficient 3NT response to a major preempt

## Intent

Let an Intermediate responder choose 3NT over partner's weak three-level suit preempt only when responder has a concrete nine-trick hand independent of partner's suit.

## Scope

- After an uncontested partner 3♣/3♦/3♥/3♠ opening, respond 3NT when responder holds an eight-card side suit headed by A-K-Q-J, an ace outside that suit and partner's suit, and a stopper in each remaining side suit (an ace, or a king with another card in that suit).
- Apply the same natural rule in SAYC and 2/1; Advanced and Expert inherit Intermediate bidding.
- Keep the existing four-card/15-HCP major game raise ahead of this path.
- Do not add a general nine-trick estimator, 3NT correction by opener, other game responses, or competitive continuations.

## Approaches

- Respond 3NT from a generic HCP or balanced-hand threshold: simpler, but can bid notrump without nine self-sufficient tricks.
- Require an identifiable running suit plus outside ace and side-suit stoppers: selected because it models the ACBL example directly and is testable from responder's hand.
- Build a full honor-based trick estimator: more flexible, but much broader than this source-backed case.

## Constraints and rationale

Use existing hand and auction APIs; keep core platform-neutral. ACBL says 3NT over a preempt should be based on nine tricks in responder's own hand plus stoppers in the other suits, and gives an example with an eight-card A-K-Q-J suit, an outside ace, and stoppers elsewhere. This slice implements that sufficient pattern after any natural weak three-level suit opening. [ACBL response to preempts lesson](https://web2.acbl.org/CommunityLessons/1_16_25.pdf).
