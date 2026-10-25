# Core Game Reducer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an immutable reducer for contract bridge auctions and card play that rejects illegal actions and derives the acting seat.

**Architecture:** Keep `GameState` as a serializable value in `packages/core`, and make `applyAction` the only transition function. It validates the next bid or play and returns either a new state or a typed rule error; the existing history module records successful actions and supports undo/redo/replay.

**Tech Stack:** TypeScript, existing `packages/core/src` modules, repository-native TypeScript test runner if one is added later; no runtime dependency.

**Spec:** The agreed scope from the conversation: make the core enforce bridge rules end to end, derive whose turn it is, and preserve immutable take-back/replay history. The existing core scaffold supplies card/deal types, play legality, trick evaluation, and action history.

## Global Constraints

- Keep the core platform-neutral and free of browser, Node, or UI APIs.
- Preserve immutable state transitions; failed actions leave the input state untouched.
- Do not add a runtime dependency for bridge rules.
- Use existing `Card`, `Deal`, `Seat`, `Bid`, `GameAction`, and history types where practical.

## Review Focus

- Out-of-order, insufficient, or invalid bids: reject without changing state.
- Passed-out auction and 3-pass auction termination: enter the correct terminal/playing state.
- Card in hand but failure to follow suit: reject without removing the card.
- Four-card trick winner and next leader: award the trick and continue from the winner.
- Undo followed by a new action: discard the abandoned future and keep state/history aligned.

---

### Task 1: Define immutable game state and auction transitions

**Files:**
- Create: `packages/core/src/game.ts`
- Modify: `packages/core/src/index.ts`
- Create: `packages/core/src/game.test.ts`

**Interfaces:**
- Consumes: `Deal`, `Seat`, `Card` from `cards.ts`; `Bid`, `GameAction`, `GameHistory`, `recordAction`, `undo`, and `redo` from `history.ts`.
- Produces: `createGameState(input: { deal: Deal; dealer: Seat; vulnerability: Vulnerability }): GameState` and `applyAction(state: GameState, action: GameAction): ApplyActionResult`.
- `ApplyActionResult` is `{ ok: true; state: GameState } | { ok: false; error: RuleError }`.
- `GameState` has `phase: "auction" | "play" | "passed-out" | "complete"`, current actor, auction, optional contract, remaining hands, current trick, completed tricks, and history.

- [ ] **Step 1: Write auction transition tests** for dealer acting first, clockwise turn order, increasing bid rank/strain, legal pass/double/redouble, 4 opening passes, 3 passes after a bid, and input immutability on rejection.
- [ ] **Step 2: Run the focused tests** using the repository's configured test command; confirm failures expose missing `game.ts` behavior.
- [ ] **Step 3: Implement auction state and transitions** in `game.ts`. Rank contracts by level then clubs, diamonds, hearts, spades, notrump. Resolve the contract and declarer after three ending passes; resolve four opening passes as passed out.
- [ ] **Step 4: Run the focused tests** and confirm all auction cases pass.

### Task 2: Implement legal card play and trick progression

**Files:**
- Modify: `packages/core/src/game.ts`
- Modify: `packages/core/src/game.test.ts`

**Interfaces:**
- Consumes: `validatePlay`, `trickWinner` from `rules.ts`; `Card`, `Seat`, and the `GameState` produced by Task 1.
- Produces: successful play transitions that update remaining hands, current trick, completed tricks, actor, and phase without mutating prior state.

- [ ] **Step 1: Write play tests** for opening leader, clockwise play order, card ownership, follow-suit enforcement, void discard, trump winner, no-trump winner, trick leader, and completing all 13 tricks.
- [ ] **Step 2: Run the focused tests** and confirm the play cases fail before implementation.
- [ ] **Step 3: Implement play transitions** using the existing rule helpers. Determine opening leader as declarer's left-hand opponent; after each completed trick, set the winner as the next leader; mark the deal complete after 13 tricks.
- [ ] **Step 4: Run the focused tests** and confirm the play lifecycle passes.

### Task 3: Keep undo, redo, and replay synchronized with state

**Files:**
- Modify: `packages/core/src/game.ts`
- Modify: `packages/core/src/game.test.ts`

**Interfaces:**
- Consumes: `GameHistory` cursor model and history functions from `history.ts`.
- Produces: `undoAction(state: GameState): GameState`, `redoAction(state: GameState): GameState`, and `replayActions(state: GameState): readonly GameAction[]`.

- [ ] **Step 1: Write history integration tests** covering undo to initial state, redo to the prior state, replay order after completion, and appending after undo removing the abandoned future.
- [ ] **Step 2: Run focused history tests** and confirm failures before implementation.
- [ ] **Step 3: Implement history reconstruction** by replaying the visible action prefix through the same transition logic; keep the cursor and visible state consistent.
- [ ] **Step 4: Run the focused tests** and confirm undo, redo, and replay remain aligned with rules state.

### Task 4: Verify the package boundary

**Files:**
- Modify: `packages/core/src/index.ts` if needed
- Test: `packages/core/src/game.test.ts`

**Interfaces:**
- Consumes: exported public API from Tasks 1–3.
- Produces: documented exports for state creation, action application, history controls, and rule errors.

- [ ] **Step 1: Add public API tests** importing functions and types from `./index.js` rather than internal files.
- [ ] **Step 2: Run the package test command and TypeScript typecheck**; both must pass with strict compiler settings.
- [ ] **Step 3: Fix export or type errors** without widening the public API beyond the planned reducer surface.
