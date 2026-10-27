# Expert Grand Slam Force After a 2/1 Major Fit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Expert 5NT Grand Slam Force after an agreed major fit is reached through an uncontested direct 2/1 sequence.

**Architecture:** Extend `ExpertBot` with exact auction-shape detection parallel to its Jacoby 2NT Grand Slam Force. Keep the new response path separate from 4NT Blackwood king asks.

**Tech Stack:** TypeScript, Vitest, pnpm workspace.

**Spec:** [`2026-10-26-expert-grand-slam-force-two-over-one-design.md`](../specs/2026-10-26-expert-grand-slam-force-two-over-one-design.md)

## Global Constraints

- Keep `packages/core` platform-neutral.
- Preserve deterministic bidding and existing skill/style boundaries.
- Keep the exact 2/1 fit auction separate from Blackwood king asks.

## Review Focus

- Only 2/1 Expert auctions with 1M–2/1–3M–4M activate the ask.
- Opener needs 18+ HCP and two top trump honors to ask.
- Responder bids 7M only with two top trump honors, otherwise 6M.
- Existing Jacoby Grand Slam Force and Blackwood king ask retain their meanings.

---

### Task 1: Add and verify the Expert continuation

**Files:**
- Modify: `packages/bots/src/player.test.ts`
- Modify: `packages/bots/src/player.ts`
- Modify: `TODO.md`, `CHANGES.md`, `README.md`

- [x] Add tests for opener's ask, responder's 6M/7M answers, style and strength boundaries, and unchanged Blackwood king-ask handling.
- [x] Run the test suite before implementation and confirm the new ask/answer cases fail for missing behavior.
- [x] Implement exact auction detection and honor-count responses.
- [x] Run `pnpm test` (598 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
- [x] Update feature docs and commit the verified change.
