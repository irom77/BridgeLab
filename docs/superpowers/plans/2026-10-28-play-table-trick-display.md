# Play Table Trick Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make live card play easier to follow with seat-positioned trick cards, a brief completed-trick pause, last-trick access, live partnership totals, and aligned hand controls.

**Architecture:** Keep bridge rules and persisted game state unchanged. Derive trick totals from `GameState.completedTricks`; use client presentation state and a timer to display a completed trick temporarily, while an explicit control can show the latest completed trick on demand.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-28-play-table-trick-display-design.md`

## Global Constraints

- Keep `packages/core` platform-neutral and do not change game rules or saved-game schema.
- Completed tricks stay visible for two seconds.
- Card input and bot actions pause during the two-second display.
- Last-trick access remains available until toggled off or another table state is loaded.
- Derive NS/EW counts from completed tricks.
- Keep focused behavior tests in `apps/client/src/App.test.tsx`.

## Review Focus

- Undo immediately after a trick completes must remove the temporary display and restore the prior counts; cover in Task 1.
- Redo must not advance through the pause; cover in Task 2.
- Loading a saved/completed hand must not spuriously start a new two-second display; cover in Task 1.
- Last-trick display must not replace an in-progress trick; cover in Task 1.
- Switching into or out of a reviewed hand must reset last-trick presentation state; cover in Task 2.
- Bot turns must remain paused until the display timer expires; cover in Task 1.
- Partnership totals must assign each trick to the partnership of its winner; cover in Task 2.
- Narrow screens must retain reachable hand controls as they wrap; cover with responsive layout rules in Task 2 and inspect during final review.

---

### Task 1: Retain completed tricks and provide last-trick access

**Files:**
- Modify: `apps/client/src/App.tsx`
- Modify: `apps/client/src/App.test.tsx`

**Interfaces:**
- Consumes: `GameState.completedTricks`, `GameState.currentTrick`, existing `undoAction`/`applyAction` transitions.
- Produces: client-local presentation state for the temporarily visible completed trick and a boolean for explicitly viewing the latest completed trick; no exported API.

- [x] **Step 1: Write failing UI tests** for the fourth card remaining visible until 2000 ms then clearing; pause before the next human or bot play; the Last trick button displaying and hiding the last completed trick; undo clearing a temporary trick display; and loading a completed saved hand not starting a pause.
- [x] **Step 2: Run the focused tests and confirm expected failures.** Run `pnpm exec vitest run apps/client/src/App.test.tsx -t "completed trick|last trick|undo after trick|loaded completed hand"`.
- [x] **Step 3: Implement client-only completed-trick display state** in `App.tsx`. Detect only live transitions where completed trick count increases; start and clean up a 2000 ms browser timeout; clear temporary and explicit last-trick state on replacement hand, import, undo/redo as appropriate. Render the temporary trick while its timer is active and let the Last trick control show the latest completed trick when the current trick is empty.
- [x] **Step 4: Verify focused tests.** Run the command from Step 2 and confirm all targeted tests pass.

### Task 2: Seat positions, partnership totals, and hand action row

**Files:**
- Modify: `apps/client/src/App.tsx`
- Modify: `apps/client/src/styles.css`
- Modify: `apps/client/src/App.test.tsx`
- Modify: `CHANGES.md`

**Interfaces:**
- Consumes: Task 1 presentation state, `trickWinner`, contract strain, existing hand controls.
- Produces: a four-position trick cross, displayed NS/EW completed-trick counts, and one responsive hand action row containing Show hint and Take back.

- [x] **Step 1: Write failing UI tests** asserting cards carry seat-specific positioning classes; partnership totals reflect each completed trick's winner; Last trick is available after a trick but not during an in-progress trick; Show hint and Take back share a hand action row; Redo is disabled during the pause; and review transitions reset last-trick state.
- [x] **Step 2: Run the focused tests and confirm expected failures.** Run `pnpm exec vitest run apps/client/src/App.test.tsx -t "seat positions|partnership trick totals|hand action row"`.
- [x] **Step 3: Implement the display.** Position North at top, East at right, South at bottom, West at left. Calculate NS/EW counts by applying the contract trump (if any) to each completed trick and mapping its winner to a partnership. Move Take back beside Show hint and the cards in the hand panel; keep controls usable at mobile widths. Record the user-facing change in `CHANGES.md`.
- [x] **Step 4: Verify focused tests.** Run the command from Step 2 and confirm all targeted tests pass.
- [x] **Step 5: Run repository checks.** Run `pnpm test`, `pnpm typecheck`, and `pnpm lint`; resolve any regressions introduced by this work and report any unrelated existing failures by name.
- [x] **Step 6: Review the diff.** Run `git diff --check` and inspect the final changes in `App.tsx`, `styles.css`, tests, and `CHANGES.md`.
