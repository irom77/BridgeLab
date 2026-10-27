# Expert Blackwood after weak-three minor openings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend Expert's existing weak-three ace/king ask sequence to uncontested 3♣/3♦ openings with 19+ HCP and five-card support.

**Architecture:** Generalize the existing weak-three auction recognizer to return any opening suit. Preserve the three-card support threshold for major preempts and require five-card support for minor preempts; reuse the existing ace response, king ask, and slam placement logic.

**Tech Stack:** TypeScript, Vitest, pnpm workspace.

**Spec:** [`../specs/2026-10-27-expert-blackwood-weak-three-minors-design.md`](../specs/2026-10-27-expert-blackwood-weak-three-minors-design.md)

## Global Constraints

- Keep `packages/core` platform-neutral.
- Keep weak-three Blackwood Expert-only.
- Require 19+ HCP and at least five-card support for 3♣/3♦ openings.
- Do not start the sequence after interference.
- Preserve the existing major weak-three sequence and response meanings.

## Review Focus

- 3♣ and 3♦ use their own minor as the trump suit in all slam placements; test both.
- Three-card support is insufficient for a minor preempt; test the 4-card boundary.
- An opponent's action after 3m prevents the direct ask; test interference.
- Intermediate must not inherit the Expert ask; test skill gating.
- Zero/four ace ambiguity and zero/four king ambiguity retain the established response mappings; cover zero and a nonzero count.

---

### Task 1: Reuse weak-three Blackwood for minor fits

**Files:**
- Modify: `packages/bots/src/player.ts` around `weakThreeMajorOpening` and the weak-three Blackwood auction handlers.
- Test: `packages/bots/src/player.test.ts` weak-three Blackwood tests.
- Modify: `TODO.md`, `CHANGES.md`.

**Interfaces:**
- Consumes: `calls`, `auction`, `partner`, `seat`, `points(hand)`, `aceCount(hand)`, and the existing weak-three ace/king response logic.
- Produces: a weak-three descriptor `{ opening, suit, responderSeat }`; direct Blackwood accepts 3♥/3♠ with 3+ support and 3♣/3♦ with 5+ support.

- [x] **Step 1: Write failing tests** for both minor suits and both bidding styles: Expert bids 4NT over uncontested 3m with 19+ HCP and five-card support; it does not bid 4NT with only four-card support, after interference, or below Expert. Add ace/king response and slam placement coverage for both minor suits.
- [x] **Step 2: Run the focused tests and verify the new minor-entry cases fail while the existing major cases pass.**

  Run: `pnpm exec vitest run packages/bots/src/player.test.ts -t "weak-three Blackwood"`

  Expected: the new direct minor-entry cases fail; existing major weak-three Blackwood cases pass.
- [x] **Step 3: Generalize the weak-three descriptor and reuse the protocol.** Recognize 3♣/♦/♥/♠ and return `suit`; keep major entry at 3+ support and set minor entry to 5+ support. Use `suit` for the 5m/6m/7m placements and do not alter the established response mapping.
- [x] **Step 4: Run focused tests and verify they pass.**

  Run: `pnpm exec vitest run packages/bots/src/player.test.ts -t "weak-three Blackwood"`

  Expected: all matching tests pass for both major and minor weak-three auctions.
- [x] **Step 5: Run workspace verification.**

  Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build && git diff --check`

  Expected: all workspace checks pass.
- [x] **Step 6: Update roadmap and change history, commit, and push.**
