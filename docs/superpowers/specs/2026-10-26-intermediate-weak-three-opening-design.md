# Intermediate weak three-level openings

## Intent

Give the Intermediate bot a natural preemptive opening for long suits that are too long for a weak two. This adds a distinct bidding capability while keeping Beginner behavior stable.

## Scope

- In an uncontested opening position, Intermediate opens 3♣, 3♦, 3♥, or 3♠ with a seven-card-or-longer suit, 5–10 HCP, at least two honors from ace through ten in the suit, and no outside four-card major.
- Choose the qualifying suit using the existing suit-ordering convention; only one suit can contain seven or more cards in a thirteen-card hand.
- Do not change weak-two openings, competitive bidding, or responses to three-level preempts.
- Beginner keeps its existing behavior.

## Approaches

- Add the rule to the shared Beginner bidder: smallest code change, but it would blur Beginner and Intermediate and change existing beginner behavior.
- Add the rule only to Intermediate's existing bidding wrapper: preserves Beginner behavior and the bot-tier distinction; selected.
- Build a configurable preempt system with seat, vulnerability, and suit-quality styles: supports more agreements, but is broader than the current roadmap increment.

## Constraints

Use existing hand, auction, point-count, and weak-suit helpers. Keep `packages/core` platform-neutral. Tests must cover positive suit selection, point and quality boundaries, outside-major exclusion, and Beginner/competitive gating.

## Builder calls

Use the existing weak-two honor and outside-major rules. Treat prior passes as uncontested; the opening rule may apply in any seat when all prior calls are passes.
