# Advanced Bot Implementation Plan

> **For agentic workers:** Use the implementation workflow to execute this plan task by task.

**Goal:** Expose an Advanced solo bot whose deterministic third-hand play differs from Intermediate without accessing hidden information.

**Architecture:** `AdvancedBot` delegates bidding and fallback card choices to `IntermediateBot`. It uses the existing honor-sequence helper for the single Advanced third-hand decision. The client stores the selected `SkillLevel` and offers Advanced in the existing skill selector.

**Tech Stack:** TypeScript, React, Vitest, pnpm workspace scripts.

**Spec:** `docs/superpowers/specs/2026-10-26-advanced-bot-design.md`

## Global Constraints

- Keep `packages/core` platform-neutral.
- Make every chosen card legal and deterministic.
- Keep bot input limited to its own hand and public play context.
- Do not change existing Beginner or Intermediate behavior.

## Review Focus

- With partner currently winning in third hand and a touching honor sequence available, Advanced plays the top honor while Intermediate retains its existing choice.
- With no touching sequence, Advanced falls back to Intermediate and stays legal.
- Advanced bidding delegates to Intermediate and preserves configured SAYC / 2/1 style.
- The solo setup selector creates Advanced bots without exposing Expert prematurely.

## Task 1: Add deterministic Advanced card play

**Files:**
- Modify: `packages/bots/src/player.test.ts`
- Modify: `packages/bots/src/player.ts`

**Interfaces:**
- Consumes `BotConfig`, `BotPlayer`, and `PlayContext` from `@contractplay/core`.
- Produces `AdvancedBot implements BotPlayer`; `chooseBid` delegates to Intermediate, and `chooseCard` applies the Advanced third-hand rule before Intermediate fallback.

- [x] Add a failing test where partner leads a low heart, the second hand plays low, and Advanced holds KQ; expect the king while Intermediate retains its existing choice.
- [x] Add a failing test showing Advanced falls back to Intermediate when no touching sequence is held.
- [x] Run the focused tests; the Advanced factory and selector were missing, as expected.
- [x] Implement `AdvancedBot`; create the Intermediate delegate with `skill: "intermediate"`, use `topOfTouchingHonorSequence` on legal led-suit cards only in the specified third-hand case, and delegate all other choices.
- [x] Run the focused bot tests and confirm both new cases pass.

## Task 2: Expose Advanced in solo setup

**Files:**
- Modify: `apps/client/src/App.tsx`
- Modify: `apps/client/src/App.test.tsx`
- Modify: `packages/bots/src/player.ts`

**Interfaces:**
- `createBot({ skill: "advanced", biddingStyle })` returns `AdvancedBot`.
- The client uses `SkillLevel` for bot skill state and offers Beginner, Intermediate, and Advanced.

- [x] Add a failing UI test asserting Advanced is selectable when bots are enabled.
- [x] Add a failing factory test that `createBot` constructs an Advanced bot and delegates its bid using the configured style.
- [x] Implement the factory branch and update both setup selectors and casts to use `SkillLevel`.
- [x] Run the focused UI and bot tests and confirm they pass.
- [x] Update `TODO.md`, `README.md`, and `CHANGES.md` to describe the implemented Advanced behavior and state that Expert remains unavailable.
- [x] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `git diff --check` (346 tests pass; lint reports only the existing Node module-type warning).
