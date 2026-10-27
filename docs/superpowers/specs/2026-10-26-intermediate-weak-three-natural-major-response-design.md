# Natural major response over a weak three minor

## Intent

Give a strong responder with a long major a forcing way to find a major fit after partner opens 3♣ or 3♦.

## Scope

- After an uncontested partner 3♣/3♦ opening, Intermediate, Advanced, and Expert responders bid 3♥ or 3♠ with 16+ HCP and a six-card major containing at least two honors among A-K-Q-J-T.
- The new-suit response is natural and forces opener to bid again.
- Opener raises to 4M with three or more cards in responder's major; without three-card support, opener repeats the preempted minor at the four level.
- Responder passes 4M after opener raises the major, or bids 4M after opener repeats the minor.
- This slice covers major-suit responses to minor preempts only. Responses to major preempts, new-minor responses, competitive continuations, and slam exploration beyond the existing Blackwood route remain out of scope.

## Approaches

- Add a natural forcing major response over a minor preempt: selected because it is a standard natural way to find a fit and is directly supported by the ACBL preempt guidance.
- Add a 2NT inquiry convention with artificial opener descriptions: rejected because it requires a larger partnership agreement not present in SAYC / 2/1 project conventions.
- Limit responses to game placement: rejected because it skips the opportunity to discover a major fit while 3♥/3♠ remains available.

## Constraints and rationale

Keep the behavior in `packages/bots`; preserve existing 3NT and preemptive responses. The ACBL guidance describes a new-suit response to a three-bid as strong, usually six or more cards, and forcing for opener to bid again. This design chooses 16+ HCP, six cards, and two honors among A-K-Q-J-T as explicit strength and suit-quality thresholds; opener's three-card major support is the fit threshold. [ACBL District 13, “Responding to a Three-Bid”](https://www.acbl-district13.org/newsletters/INnewsletter202401.pdf).
