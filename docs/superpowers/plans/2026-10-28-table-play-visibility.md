# Table Play Visibility Implementation Plan

> **For agentic workers:** Execute this plan task by task. Steps use checkbox syntax.

**Goal:** Give card play more room, make the auction available on demand, improve card faces, and make turns and trick participation unmistakable.

**Architecture:** Keep all changes in the React client and CSS, deriving status from the existing `GameState`. During play the auction moves into a right-edge drawer; auction phase keeps its centered panel and completed-hand states retain the normal side-panel layout.

**Tech Stack:** React, TypeScript, CSS, Vitest and Testing Library (existing workspace).

**Spec:** `docs/superpowers/specs/2026-10-28-table-play-visibility-design.md`

## Global Constraints

- Keep `packages/core` platform-neutral and unchanged.
- Reuse current actor, trick, auction, and card state.
- Preserve keyboard access and accessible card names.
- Update `TODO.md` and `CHANGES.md` for the user-facing behavior.

## Review Focus

- Closed auction drawer remains available and operable by click/tap and keyboard.
- Hover reveal must not be required for touch input and must not trap focus.
- Current trick statuses clear after a trick resolves and during review follow the shown state.
- Passed-out hands still expose their auction history.
- Small viewport cards remain identifiable and playable.

## Files

- Modify `apps/client/src/App.tsx` for drawer, seat states, and card face markup.
- Modify `apps/client/src/styles.css` for the drawer and card/seat treatments.
- Modify `TODO.md` and `CHANGES.md` for roadmap and release notes.
- Modify `apps/client/src/App.test.tsx` for focused interaction coverage.

## Tasks

### Task 1: Auction drawer and turn/trick status

- [x] Add focused UI cases for default-collapsed play drawer, click reveal, active actor, and current-trick played seats.
- [x] Run the focused cases and confirm the initial failures identified missing drawer and card-face behavior.
- [x] Add controlled drawer open/pinned state with pointer hover reveal and click/keyboard toggle; keep auction-phase centered presentation.
- [x] Render actor and played status labels from `shownGame`, preserving current live-region turn summary.
- [x] Preserve auction history outside live card play, including passed-out hands.
- [x] Run focused cases and full workspace suite.

### Task 2: Physical-style card faces and roadmap

- [x] Add focused UI coverage for accessible card face rank/suit corner and center suit presentation.
- [x] Run that focused case and confirm expected failure.
- [x] Add CSS-native card face markup with contrasting red/black suits, corner indices, central pip, inset border, subtle finish, and a corresponding trick-card treatment.
- [x] Update roadmap and change history.
- [x] Run focused cases and full workspace suite; run typecheck, lint, and build.

## Final review

- Fixed: passed-out hands retain an accessible auction history; regression coverage verifies all four calls remain visible.
- Minor deferred: while the drawer is pinned open, clicking “Hide auction” with the pointer still over it leaves it open until the pointer leaves, because hover also reveals the drawer.
