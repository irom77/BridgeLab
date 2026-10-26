# Expert Grand Slam Force After an Accepted Splinter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Expert Grand Slam Force continuation after opener accepts a splinter raise with 4M.

**Architecture:** Add exact auction-shape checks to `ExpertBot`, separate from existing Jacoby and 2/1 Grand Slam Force handling and 4NT Blackwood logic.

**Tech Stack:** TypeScript, Vitest, pnpm workspace.

**Spec:** [`2026-10-26-expert-grand-slam-force-after-splinter-design.md`](../specs/2026-10-26-expert-grand-slam-force-after-splinter-design.md)

## Global Constraints

- Keep bidding deterministic and the behavior Expert-only.
- Preserve Jacoby and 2/1 Grand Slam Force sequences. Keep 4NT Blackwood available when responder has 18+ HCP but fewer than two top trump honors.

## Review Focus

- Only 3-level splinters over 1♥ and 4-level splinters over 1♠ can trigger this path; a natural 1♠–3♥ jump must not be treated as a splinter.
- Responder needs 18+ HCP and two top trump honors to ask.
- Opener's answer depends on two top trump honors.
- With 18+ HCP but fewer than two top trump honors, the existing 4NT Blackwood ask remains available after an accepted splinter.

---

### Task 1: Add and verify the continuation

**Files:**
- Modify: `packages/bots/src/player.test.ts`
- Modify: `packages/bots/src/player.ts`
- Modify: `TODO.md`, `CHANGES.md`, `README.md`

- [x] Add tests for responder's 5NT ask, opener's 6M/7M answers, the strength boundary, rejection of a natural 1♠–3♥ jump in both GSF and king-ask detection, and retained 4NT Blackwood when the GSF condition is not met.
- [x] Run the tests before implementation; the 5NT ask and both answers failed as expected.
- [x] Implement exact accepted-splinter detection.
- [x] Run `pnpm test` (602 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
- [x] Update docs, commit, and push the verified change.
