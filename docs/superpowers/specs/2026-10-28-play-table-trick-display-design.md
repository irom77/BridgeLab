# Play table trick display

## Intent

Make card play easier to follow by placing played cards at their compass seats, keeping a completed trick visible briefly, and showing partnership progress without opening another panel.

## Goals

- Place North, East, South, and West cards in a cross around the table center.
- Keep the fourth card visible for two seconds after a trick completes, then clear it automatically.
- Let the player reveal the most recently completed trick on demand.
- Show NS and EW trick totals, updated as each trick completes.
- Put “Show hint” and “Take back” in one controls row alongside the hand.

## Non-goals

- No game-rule or saved-game schema changes.
- No configurable delay setting in this change.
- No redesign of auction, review, or completed-hand screens.

## Approaches

- **Client presentation state (selected):** temporarily retain the completed trick in the React client. It preserves core rules and stored game data while supporting the requested display.
- **Core game phase:** add a post-trick pause to game state. This changes game transitions and persistence for a visual delay, so it is unnecessary for the current scope.

## Behavior and implementation choices

- Use a two-second client timer, restarting it for each completed trick and clearing it when a different hand is loaded or the trick is undone.
- Pause card input and bot actions while that timer runs so the completed four-card layout remains visible for the full two seconds.
- The Last trick control displays the latest completed trick until toggled off or another table state is loaded.
- Derive partnership totals from completed tricks and their winners; do not add separately persisted counters.
- Align the hand actions beside the cards on wide layouts and allow them to wrap beneath the cards on narrow screens.
- Add focused client tests for trick positioning/retention, last-trick access, totals, and hand controls; run the repository test and typecheck commands before completion.

## Roadmap and release notes

Record the completed user-facing behavior in `CHANGES.md` and update `TODO.md` only if a corresponding roadmap item exists.
