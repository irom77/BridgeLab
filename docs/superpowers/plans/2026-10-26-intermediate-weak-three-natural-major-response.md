# Natural Major Response over Weak Three Minors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Find a major fit after a weak 3♣/3♦ opening through a strong natural forcing major response.

**Architecture:** Extend the Intermediate weak-three response and opener continuation logic. Require 16+ HCP and a six-card major for responder's 3M; opener bids 4M with three-card support or repeats the minor at four, after which responder places 4M.

**Tech Stack:** TypeScript, existing bots package and Vitest suite.

**Spec:** [`../specs/2026-10-26-intermediate-weak-three-natural-major-response-design.md`](../specs/2026-10-26-intermediate-weak-three-natural-major-response-design.md)

## Global Constraints

- Keep `packages/core` platform-neutral; bidding logic stays in `packages/bots`.
- Apply only after an uncontested partner 3♣/3♦ opening and keep 3NT response priority.
- Require 16+ HCP and a six-card heart or spade suit with two honors among A-K-Q-J-T.
- Treat the new-suit response as forcing for one round.
- Opener raises with three-card major support; otherwise repeat the opened minor at level four.

## Review Focus

- Do not use the new response after 3♥/3♠ or after interference; test both exclusions.
- Reject a five-card major or fewer than 16 HCP; test both boundaries.
- Preserve the existing qualified 3NT responses; rerun their current major and minor opening coverage.
- Opener must continue when supported or unsupported; test 4M raise and 4m rebid.
- Responder must place 4M after opener's rebid, and opener must pass after the placement; test the full sequence.

---

### Task 1: Natural forcing major response and continuation

**Files:**
- Modify: `packages/bots/src/player.test.ts`
- Modify: `packages/bots/src/player.ts`
- Modify: `TODO.md`
- Modify: `CHANGES.md`

**Interfaces:**
- Consume the existing Intermediate `chooseBid` auction and hand APIs.
- Return only legal `Bid` values through the existing natural auction branch.

- [ ] Add failing tests for 3♣/3♦–3♥/3♠ responses, HCP/length/quality boundaries, major-preempt exclusion, and interference; retain existing qualified 3NT regression coverage.
- [ ] Add opener's forced 4M raise with three-card support and 4m rebid without support.
- [ ] Add responder's 4M placement after 4m and opener's pass after 4M.
- [ ] Run the focused tests and confirm the new response fails before implementation.
- [ ] Implement the responder and opener continuation gates in `IntermediateBot.chooseBid`.
- [ ] Run focused weak-three tests, `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `git diff --check`.
- [ ] Update TODO and CHANGES, then commit and push.
