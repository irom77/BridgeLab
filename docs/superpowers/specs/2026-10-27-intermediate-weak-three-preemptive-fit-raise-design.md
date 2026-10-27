# Preemptive fit raises over weak three-level openings

## Intent

Let responders use the known trump fit to place a preemptive contract immediately after partner opens a weak three-level suit.

## Scope

- After an uncontested partner weak three-level opening in any suit, raise based on responder's trump length: three-card support bids level four, four-card support level five, five-card support level six, and six-card support level seven.
- Do not add a high-card-point requirement; this is a preemptive fit raise, not a game-force.
- Preserve existing higher-priority 3NT placement, strong major game responses, and forcing natural major responses.
- The opener passes after the preemptive raise. Do not apply after interference.
- Advanced and Expert inherit the Intermediate behavior, with Expert's existing Blackwood response continuing to take precedence.

## Approaches

- Use a direct raise based on total known trump length: selected because preempt responses are evaluated by expected tricks and trump fit rather than HCP, and the direct bid avoids giving opponents room.
- Use a point-count invite with opener asking for a feature: rejected because weak preemptors have limited descriptive value, and the established project convention gives responder control based on fit.
- Limit raises to game-level contracts: rejected because a three-card fit may belong at 4M and a minor fit can be placed at 4m.

## Constraints and rationale

Keep the behavior in `packages/bots`. A preemptive raise of a three-level opening commonly bids one level higher than responder's trump length: for example, three-card support over 3♠ raises to 4♠, and four-card support to 5♠. Apply the same direct fit-based rule across all four suits. [Responding to partner's preemptive bid, Unit 572 lesson](https://www.unit572.org/uploads/6/9/7/2/6972484/6_responding_to_preeempts.pdf) [Responding to preemptive openings, Hamilton Bridge](https://www.hamiltonbridge.com/AcrobatArticles/RespondingToPreempts.pdf).
