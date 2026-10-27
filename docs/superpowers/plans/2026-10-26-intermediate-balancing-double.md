# Intermediate Balancing Takeout Double Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Intermediate takeout double after a one-level opening and two passes.

**Architecture:** Add a narrowly gated branch to `IntermediateBot.chooseBid`, using the current direct-double support shape and existing shortness points with a 10-point threshold. Keep the direct-seat branch unchanged.

**Tech Stack:** TypeScript, Vitest, pnpm workspace scripts.

**Spec:** `docs/superpowers/specs/2026-10-26-intermediate-balancing-double-design.md`

## Global Constraints

- Keep `packages/core` platform-neutral.
- Reuse existing shared types and APIs.
- Add focused behavior coverage and update roadmap status.

## Review Focus

- A qualifying fourth-seat hand doubles after exactly two passes.
- A hand below the balancing strength threshold does not double.
- Direct-seat takeout double behavior remains unchanged.

### Task 1: Add Intermediate balancing takeout double

**Files:**
- Modify: `packages/bots/src/player.test.ts`
- Modify: `packages/bots/src/player.ts`
- Modify: `TODO.md`
- Modify: `CHANGES.md`

- [x] Add a test for an 8-HCP hand with a singleton in opener's suit, sufficient support for unbid suits, and the auction `1♠–Pass–Pass`; expect Double.
- [x] Add a test for a similarly shaped 6-HCP hand; expect Pass.
- [x] Run `pnpm test` and verify the new qualifying test fails before implementation.
- [x] Add a branch for precisely one one-level opening and two passes, requiring the balancing hand to be fourth to act, at least 10 total points including existing shortness points, and the existing direct-double unbid-suit support shape.
- [ ] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
- [x] Mark the behavior in `TODO.md` and record it in `CHANGES.md`.
