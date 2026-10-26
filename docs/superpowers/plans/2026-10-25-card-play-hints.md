# Card Play Hints Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show advisory legal card hints during human-controlled card play.

**Architecture:** The client calls the existing core `requestHint(context, solver?)` helper. It stores recommendations separately from `GameState`, highlights matching cards, and drops results if the current game or actor changes. No solver is bundled; the fallback lists every legal card.

**Tech Stack:** TypeScript, React, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-25-card-play-hints-design.md`

## Global Constraints

- Keep `packages/core` platform-neutral.
- Keep hints advisory and leave `GameState` and action history unchanged.
- Give the hint helper only the acting seat's hand and public current trick context.
- Do not claim strategic advice without a configured solver.

## Review Focus

- Following suit: hint only cards in led suit when held; UI test covers it.
- Leading or void in led suit: all cards are legal fallback suggestions; core tests cover it.
- Stale asynchronous result: replaced game/actor must not show the old hint; UI test covers it.
- Hint selection must not play a card or append history; UI test covers it.
- Dummy control: the hint uses dummy's hand only when the user may control dummy; UI test covers it.
- Invalid solver output: cards outside the legal set are filtered before display; core test covers it.
- Solver failure: show a brief accessible message without affecting a replacement hand.

---

### Task 1: Core legal card hint behavior

**Files:**
- Modify: `packages/core/src/bots.ts`
- Test: `packages/core/src/bots.test.ts` (or the existing focused test file if present)

**Interfaces:**
- Consumes: `PlayContext` and optional `Solver`.
- Produces: `requestHint(context, solver?)` returns the solver's recommendations when supplied; otherwise it returns all cards of the led suit if the hand can follow, or the full hand if leading/void.

- [x] Add tests for leading, following suit, void in led suit, solver delegation, and filtering illegal solver cards.
- [x] Implement/fix fallback and solver legality behavior and verify with the package's existing test command. (The fallback was already correct; solver results now pass through the same legal-card set.)

### Task 2: Client hint interaction

**Files:**
- Modify: `apps/client/src/App.tsx`
- Modify: `apps/client/src/styles.css`
- Test: `apps/client/src/App.test.tsx`

**Interfaces:**
- Consumes: `requestHint(context, solver?)` and the currently displayed game/actor.
- Produces: “Show hint” action in the human card-play panel, an accessible message, and visual indication on every suggested card. Hinting does not call `submitAction`.

- [x] Test that a lead hint identifies every playable card and does not change history.
- [x] Test that a follow-suit hint identifies only cards in the led suit.
- [x] Test the user-controlled dummy case.
- [x] Test that a queued hint is discarded after the hand/actor changes.
- [x] Implement request context from only actor hand, current trick, led suit, and trump; hide recommendations when the relevant game snapshot changes.
- [x] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build`.
- [x] Catch solver failures in the client, report the failure accessibly, and ignore failures from a replaced game; cover the failure message in a UI test.

**Rulings:** The core fallback already met the legal-card behavior, so those tests are characterization coverage rather than a production change. The UI accepts an optional `Solver` prop for host-provided recommendations; this app does not bundle a solver. The final review found that solver output needed a legality filter; `requestHint` now intersects solver results with the acting hand's legal cards before the client highlights them. The client catches solver failures and reports them without letting an old request overwrite a replacement hand.

**Resolved review note:** Solver failures now produce a brief accessible message instead of an unhandled rejection.

## Self-review

- Spec goals map to Task 1 fallback tests and Task 2 interaction tests.
- API naming matches the existing `PlayContext`, `Solver`, and `requestHint` exports.
- No tests require hidden hand information or changes to core state.
- This is one bounded client feature; no separate subsystems require splitting.
