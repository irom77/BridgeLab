# Expert Blackwood over weak three majors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow Expert responders with slam interest to ask for aces over partner's weak 3♥/3♠ preempt and place the major-suit contract.

**Architecture:** Add a narrowly gated direct 4NT Blackwood route to `ExpertBot`, using partner's preempted major as trump. Reuse the existing 5-level ace response pattern and place 5M or 6M based on the combined ace count.

**Tech Stack:** TypeScript, existing bots package and Vitest suite.

**Spec:** [`../specs/2026-10-26-expert-blackwood-over-weak-three-design.md`](../specs/2026-10-26-expert-blackwood-over-weak-three-design.md)

## Global Constraints

- Keep `packages/core` platform-neutral; bidding logic stays in `packages/bots`.
- Apply the new convention only to Expert and only after an uncontested partner 3♥/3♠ opening.
- Use simple Blackwood responses: 5♣ = 0/4, 5♦ = 1, 5♥ = 2, 5♠ = 3.
- Require 19+ HCP and at least three-card trump support before responder asks.
- Place 6M with three or more known combined aces; otherwise place 5M.

## Review Focus

- Direct 4NT is not used over a minor preempt or after interference; test both.
- Beginner, Intermediate, and Advanced do not start this convention; test one lower skill.
- Weak opener answers the ace ask with the correct count and passes responder's final contract; test answer and placement.
- The 5♣ 0/4 response is treated as zero for the small-slam threshold; test responder with three aces.
- Both major suits and the 19-HCP / three-card support boundaries work; test both majors plus below-threshold hands.

---

### Task 1: Direct Blackwood over a weak major preempt

**Files:**
- Modify: `packages/bots/src/player.test.ts`
- Modify: `packages/bots/src/player.ts`
- Modify: `TODO.md`
- Modify: `CHANGES.md`

**Interfaces:**
- Consume existing `points(hand)`, `aceCount(hand)`, and Expert `chooseBid` patterns.
- Keep the existing 5♣/5♦/5♥/5♠ ace-response scale and return legal `Bid` values.

- [ ] Add failing tests for qualifying 4NT asks over both 3♥ and 3♠, 18-HCP and two-card-support rejection, interference, a minor preempt, and lower-skill exclusion.
- [ ] Run the focused tests and confirm qualifying Expert asks fail before implementation.
- [ ] Add Expert-only direct Blackwood trigger at 19+ HCP with 3+ support after an uncontested partner 3M.
- [ ] Add opener ace-count responses and responder 5M/6M placement based on the documented 0/4, 1, 2, 3 response scale.
- [ ] Test opener pass after final placement and run focused weak-three tests.
- [ ] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `git diff --check`.
- [ ] Update TODO and CHANGES, then commit and push.
