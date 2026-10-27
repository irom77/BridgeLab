# Expert Blackwood after weak-three minor openings

## Intent

Extend the existing Expert weak-three Blackwood sequence to uncontested 3♣ and 3♦ openings, so a strong responder with a five-card minor fit can investigate slam using the same ace and king asks already used after 3♥ and 3♠.

## Scope

- In Expert only, bid 4NT over partner's uncontested 3♣/3♦ with 19+ HCP and at least five-card support.
- Use the existing 5♣/♦/♥/♠ ace responses, 5NT king ask after all four aces are known, and six-level king responses.
- Place 5m when fewer than three combined aces are known, otherwise 6m; place 7m after the king ask only when all four aces and all four kings are known, otherwise 6m.
- Keep the existing 3♥/3♠ agreement unchanged. Do not start Blackwood after interference or at lower bot skills.

## Approaches

- Duplicate the major weak-three sequence for minors. This isolates the change but creates two copies of the same response protocol.
- Generalize the existing weak-three sequence to carry any opening suit, while retaining the current three-card fit threshold for majors and requiring five-card support for minors. This reuses the tested protocol and is the chosen approach.
- Build a separate minor-slam protocol. That would add unnecessary conventions beyond the existing ace/king sequence.

## Constraints and rationale

Keep the change in `packages/bots`; preserve the platform-neutral core. Add focused tests for both minors, ace/king responses, Expert-only behavior, and interference. Update the weak-three roadmap entry and change history.
