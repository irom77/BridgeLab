# Beginner Bot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let a solo user play a hand against three deterministic beginner bots, while keeping bot decision inputs limited to private own-hand data and public game context.

**Architecture:** Add `@contractplay/bots` with a convention-system interface and a baseline SAYC/2/1 beginner implementation. The client will run bot turns through the existing immutable core reducer and expose the user's seat and bot convention in setup. Bots choose bids from their hand and public auction, and choose only legal cards from their own hand using current trick context.

**Tech Stack:** TypeScript, pnpm workspace, Vitest, React.

**Spec:** Task 6 in `docs/superpowers/plans/2026-10-25-contractplay-app.md`.

## Global Constraints

- Keep `packages/core` platform-neutral.
- Enforce legal actions in core and preserve immutable game transitions.
- Bot decision inputs contain only that bot's own hand and public auction/play context.
- Label the initial SAYC and 2/1 implementations as basic beginner conventions, not complete systems.

## Review Focus

- A bot must not see another player's hand: API types expose only one hand and public context.
- Every card choice must obey follow-suit: tests cover a void and a non-void hand.
- Bot loops must progress through all seats without blocking the browser: async turn progression yields between actions.
- Undo during a bot turn must not allow a stale asynchronous decision to mutate a replaced hand: client ignores stale bot results.

### Task 1: Bot convention seam and beginner decisions

**Files:** Create `packages/bots/package.json`, `tsconfig.json`, `src/player.ts`, and `src/player.test.ts`; modify `packages/core/src/bots.ts`, `packages/core/src/index.ts`, root workspace scripts/config only if required.

**Interfaces:** `BeginnerBot` implements `BotPlayer` with `chooseBid(hand, auction)` and `chooseCard(context)`. Add public current-trick context to `PlayContext`; do not include `GameState` or a full deal. `createBot(config)` returns the baseline player. Both `SAYC` and `2/1` configuration values are accepted and exposed, with simple opening/pass behavior pending full convention support.

- [x] Write tests for deterministic opening/pass decisions, accepted styles, legal follow-suit card choice, and no access to hidden deal data.
- [x] Run `pnpm test` and confirm the new bot tests fail because the package/API is missing.
- [x] Implement the minimal bot package and add it to the workspace test/build pipeline.
- [x] Run focused tests and typecheck.

### Task 2: Solo client bot turns

**Files:** Modify `apps/client/src/App.tsx`, `apps/client/src/App.test.tsx`, and `apps/client/src/styles.css`.

**Interfaces:** Setup lets the user choose their seat and SAYC/2/1 beginner bot style. The other three seats are automated. Bot decisions are applied via `applyAction`; async work checks that its captured hand/state is still current before applying.

- [x] Write UI tests for setup selection, automated auction, legal bot play through exposed dummy, and stale action cancellation after a replacement deal.
- [x] Run the tests and confirm failures.
- [x] Implement bot turn scheduling and accessible setup controls.
- [x] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build`.

**Ruling:** First deliverable is deterministic beginner-level bidding and card selection only. Intermediate/advanced/expert strength, complete SAYC/2/1 agreements, and solver hints remain subsequent work because the current milestone needs a usable bot seam before bidding systems can be expanded.
