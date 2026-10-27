# Expert Blackwood after a weak-three minor major fit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Expert Blackwood and king ask after 3♣/3♦–3♥/3♠–4M confirms a major fit.

**Architecture:** Recognize the uncontested minor preempt, natural major response, and opener's game raise as a separate agreed-major sequence. Reuse the standard ace/king response meanings and place 6M/7M according to known controls.

**Tech Stack:** TypeScript, Vitest, pnpm workspace.

**Spec:** [`../specs/2026-10-27-expert-blackwood-after-weak-three-major-fit-design.md`](../specs/2026-10-27-expert-blackwood-after-weak-three-major-fit-design.md)

## Global Constraints

- Keep `packages/core` platform-neutral.
- Keep the new ask Expert-only.
- Require 19+ HCP and a six-card response major.
- Do not start or continue after interference.
- Preserve direct minor-fit and weak-three-major Blackwood sequences.

## Review Focus

- 3♥ and 3♠ are used as trump in all responses and placements; exercise both.
- Either 3♣ or 3♦ can establish the route; exercise both.
- Fewer than six major cards or fewer than 19 HCP does not start the ask; test both boundaries.
- Interference cancels the ask and follow-up; test an opponent call.
- Zero/four ace and king response meanings stay distinct from the Jacoby Grand Slam Force; test the final 5NT/7M route.

---

### Task 1: Add Blackwood after the weak-three major fit

**Files:**
- Modify: `packages/bots/src/player.ts` near the Expert weak-three Blackwood handlers.
- Test: `packages/bots/src/player.test.ts` weak-three Blackwood tests.
- Modify: `TODO.md`, `CHANGES.md`.

**Interfaces:**
- Consumes: the first three contract calls (3m opening, 3M responder, 4M opener raise), seat order, `points(hand)`, and `aceCount(hand)`.
- Produces: a guarded auction recognizer for this exact fit auction; 4NT ace ask, optional 5NT king ask, and 6M/7M placement.

- [x] **Step 1: Write failing tests** for 3♣/3♦–3♥/3♠–4M in Expert: responder starts 4NT with 19+ HCP and a six-card response major; rejects 18 HCP and a five-card response major; ignores interference and lower bot skill. Add a full all-aces/king-ask/grand-slam auction for both majors and both minor openings.
- [x] **Step 2: Run focused tests and verify the new ask and continuation tests fail while existing weak-three Blackwood tests pass.**

  Run: `pnpm exec vitest run packages/bots/src/player.test.ts -t "weak-three Blackwood"`

  Expected: new major-fit Blackwood tests fail; existing direct major/minor weak-three Blackwood tests pass.
- [x] **Step 3: Implement exact auction recognition and reuse the established ace/king meanings.** Use the confirmed major as trump; restrict entry to an uncontested 3m–3M–4M auction with 19+ HCP and a six-card response major.
- [x] **Step 4: Run focused tests and verify both major fits pass without changing direct minor-fit behavior.**

  Run: `pnpm exec vitest run packages/bots/src/player.test.ts -t "weak-three Blackwood"`

  Expected: all matching tests pass for both routes.
- [x] **Step 5: Run workspace verification.**

  Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build && git diff --check`

  Expected: all workspace checks pass.
- [x] **Step 6: Update roadmap and change history, commit, and push.**
