# Table play visibility design

## Intent

During card play, give the hand more space, make the auction available on demand, make cards feel like physical playing cards, and make actor and trick status easy to read.

## Goals

- Keep the auction collapsed by default during card play, with a right-side drawer that opens by click/tap and hover on desktop; keep keyboard operation and a clear close/toggle control.
- Render hand and trick cards with a classic white face, corner rank/suit marks, central suit artwork, and standard red/black suits.
- Mark the active seat and distinguish seats that have already played in the current trick; expose the turn and play phase in readable text and accessible status.
- Preserve the current auction-first layout and existing game behavior.
- Keep auction history visible on completed and passed-out hands.

## Non-goals

- Change bridge rules, game state, bot behavior, or card ordering.
- Replace the overall table visual style or add external card-image assets.

## Approaches

- **Right-side auction drawer (chosen):** collapses the existing auction panel during play and reveals it on interaction. This gives the hand more room while keeping auction access close.
- **Compact always-visible auction strip:** reduces the panel but still reserves space throughout play.
- **Modal-only auction:** maximizes space, but hides context and takes extra actions to inspect the auction.

## Design choices

- Desktop pointer hover may reveal the drawer, while click/tap and keyboard toggle work across devices.
- The drawer remains closed initially during play and reports expanded state accessibly.
- Current actor receives a strong active marker and explicit “to play” status. Seats represented in the current trick receive a distinct “played” marker; the trick cards remain visible in the center.
- Card faces use CSS and text/suit symbols, with sufficient contrast and accessible card names.

## Constraints and acceptance

- Keep game rules in `packages/core` unchanged and platform-neutral.
- Reuse the state already exposed by `GameState` for actor, current trick, and auction.
- Update focused client interaction coverage, roadmap, and change history when implemented.
- Check desktop and narrow-screen behavior using existing workspace scripts.
