# Expert Weak-Three Slam Continuations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the audited Expert weak-three slam gaps: Blackwood after `3♥–3♠–4♠` and a Grand Slam Force after an uncontested weak-three major fit reaches game. Preserve legal small-slam placement when the king response already names a contract at or above the agreed 6M level.

**Architecture:** Extend the local weak-three major-fit auction recognizer and reuse the existing ace/key-card response flow for the missing natural-major fit. Ask for kings only when the responder can still learn something useful (one to three kings); skip the ask with zero or four kings. Add a separate 5NT Grand Slam Force branch based on the exact confirmed-fit auction so it cannot collide with 5NT king asks after Blackwood.

**Tech Stack:** TypeScript, Vitest, pnpm workspace.

**Spec:** [`../specs/2026-10-28-expert-weak-three-slam-continuations-design.md`](../specs/2026-10-28-expert-weak-three-slam-continuations-design.md)

## Global Constraints

- Implement bidding behavior in `packages/bots`; keep `packages/core` platform-neutral.
- Preserve existing weak-three opening, game-placement, 3NT, and Blackwood behavior.
- Apply new agreements only to Expert in uncontested auctions with an unpassed responder; cover both configured bidding styles.
- After all four aces are known, ask for kings only when responder holds one to three kings. A weak-three opener is limited to 10 HCP, so a responder with zero kings cannot find all four by asking and places 6M directly; a responder holding all four kings places 7M directly.
- Use 4NT Blackwood first when the existing 19+ HCP and six-card major condition applies; use 5NT for the project GSF threshold only otherwise.
- A 5NT Grand Slam Force asks for two of A/K/Q in trumps; opener bids 7M with two and 6M otherwise.

## Review Focus

- Prior pass by responder and any opponent contract or double must disable new weak-three routes.
- An incorrect fit auction must not trigger GSF or Blackwood.
- The 5NT GSF must be distinct from the 5NT king ask following 4NT.
- `3♠–4♥–5♥` may use 5NT GSF but must never try 4NT after 5♥.
- After a Blackwood king response, never underbid an already higher contract; if the response is at or above 6M, only continue to 7M when all kings are confirmed.
- Existing 3NT, game raises, direct major Blackwood, and minor Blackwood remain unchanged.

---

### Task 1: Continue Blackwood after a weak-three major's natural side-major response

**Files:**
- Modify: `packages/bots/src/player.ts` near `weakThreeMajorFitAuction` and the Expert weak-three Blackwood sequence.
- Test: `packages/bots/src/player.test.ts` near weak-three Blackwood tests.
- Modify: `TODO.md`, `CHANGES.md`.

**Interfaces:**
- Consumes: weak-three major opening, responder's natural forcing major response, opener's game-level fit raise, and existing `aceCount`/king response logic.
- Produces: after uncontested `3♥–3♠–4♠`, an Expert responder with 19+ HCP and six spades bids 4NT; after all aces are known, responders holding one to three kings use the 5NT king ask, while zero kings places 6M and four kings places 7M directly.

- [x] **Step 1: Write failing tests** for both styles; cover 4NT start, ace and king asks/answers, small/grand-slam placement, and pass after placement. Add coverage for skipping an unproductive king ask and for legal placement after a higher response confirms all kings.
- [x] **Step 2: Verify the focused tests fail** because the sequence is not recognized by the current weak-three fit helper.
- [x] **Step 3: Implement the exact 3♥–3♠–4♠ fit recognition and reuse the existing Blackwood response policy.** Do not permit 4NT after 3♠–4♥–5♥.
- [x] **Step 4: Verify focused tests pass** and add negative coverage for insufficient values, passed responder, interference, and non-Expert skill.
- [x] **Step 5: Run `pnpm exec vitest run packages/bots/src/player.test.ts` and confirm all bidding tests pass.**

### Task 2: Add the Grand Slam Force after a weak-three major fit reaches game

**Files:**
- Modify: `packages/bots/src/player.ts` in the Expert weak-three convention branches.
- Test: `packages/bots/src/player.test.ts` near weak-three Grand Slam Force tests.
- Modify: `TODO.md`, `CHANGES.md`.

**Interfaces:**
- Consumes: recognized uncontested weak-three major-fit auctions, responder's HCP and trump length, and opener's A/K/Q trump honors.
- Produces: if responder has 18+ HCP and six or more cards in the agreed major, bid 5NT when the existing direct Blackwood threshold does not apply; opener bids 7M with two of A/K/Q, otherwise 6M.
- Exact fit sequences: `3m–3M–4M`, `3♥–3♠–4♠`, and `3♠–4♥–5♥`.

- [x] **Step 1: Write failing tests** for both answers (two top honors / fewer than two), all three fit sequences, both styles, and preservation of 4NT Blackwood priority.
- [x] **Step 2: Verify the focused tests fail** because the weak-three fit GSF path is absent.
- [x] **Step 3: Implement the 5NT GSF request and opener answer.** Match the exact auction, do not match the Blackwood king-ask sequence, and keep the GSF Expert-only.
- [x] **Step 4: Verify focused tests pass** and cover insufficient values, short trump support, interference, prior pass, and lower skill levels.
- [x] **Step 5: Run `pnpm test && pnpm typecheck && pnpm lint && pnpm build && git diff --check`.**
- [x] **Step 6: Update the weak-three TODO entry and CHANGES.md; review the completed branch.** Final review exposed an impossible/illegal Blackwood continuation when the asker had no kings; the implementation now skips that ask and keeps placement legal when the king response confirms the grand slam.
