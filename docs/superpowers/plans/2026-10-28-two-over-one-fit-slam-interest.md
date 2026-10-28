# 2/1 fit-showing rebid after a minor raise Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** In an uncontested, unpassed 2/1 game force, show a three-card fit for opener's major below game with 15+ HCP after opener raises responder's minor, then ensure opener reaches game.

**Architecture:** Extend the existing 2/1 continuation branches in `BeginnerBot` to distinguish a slow fit raise (3M) from fast arrival (4M). Reuse the existing auction recognizer and its passed-hand/interference restrictions; do not introduce a generalized auction framework.

**Tech Stack:** TypeScript, Vitest, pnpm workspace.

**Spec:** [`../specs/2026-10-28-two-over-one-fit-slam-interest-design.md`](../specs/2026-10-28-two-over-one-fit-slam-interest-design.md)

## Global Constraints

- Keep the behavior in `packages/bots`; no core or UI changes.
- Preserve the 2/1 game force only for unpassed, uncontested auctions.
- Keep SAYC behavior unchanged.
- Place 4M with 13–14 HCP; show 3M with 15+ HCP and three-card support.

## Review Focus

- Both 1♥ and 1♠ openings, with 2♣ and 2♦ responses, use the opening major as trump.
- The 14/15 HCP boundary selects 4M/3M respectively.
- Opener completes 4M after responder's 3M even with a minimum opener hand.
- Passed responder, prior interference, and SAYC do not enter this 2/1 route.
- A responder without three-card support retains existing behavior.

---

### Task 1: Add the slow fit-showing raise to the 2/1 continuation

**Files:**
- Modify: `packages/bots/src/player.ts` in `twoOverOneAuction` continuation handling.
- Test: `packages/bots/src/player.test.ts` near direct 2/1 minor-fit continuation tests.
- Modify: `TODO.md`, `CHANGES.md`.

**Interfaces:**
- Consumes: `twoOverOneAuction`, `points(hand)`, responder's support for the opening major, and the current non-pass contract sequence.
- Produces: 3M with 15+ HCP and three-card support after 1M–2m–3m; 4M with 13–14 HCP; opener's 4M completion after 3M.

- [x] **Step 1: Write failing tests** for both opening majors and both minor responses, plus 13/14 fast-arrival cases, opener's minimum completion, passed-hand, interference, SAYC, and no-fit controls.
- [x] **Step 2: Run focused tests and verify the new 3M and opener-completion cases fail while existing direct 2/1 continuations pass.**

  Run: `pnpm exec vitest run packages/bots/src/player.test.ts -t "shows the three-card major fit|fast arrival" --reporter=dot`

  Expected: the new fast-arrival and slow-fit tests fail for the missing 3M branch; existing matching tests pass.
- [x] **Step 3: Implement the fast-arrival split and opener's mandatory game completion.** Keep the exact uncontested 2/1 recognizer and do not alter SAYC paths.
- [x] **Step 4: Run the focused tests and confirm both majors and both minor responses follow the split.**
- [x] **Step 5: Run workspace verification.**

  Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build && git diff --check`

  Expected: all workspace checks pass.
- [x] **Step 6: Update the roadmap and change history; prepare the feature branch for review.**
