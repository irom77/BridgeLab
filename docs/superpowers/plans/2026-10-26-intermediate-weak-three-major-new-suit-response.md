# Natural new-suit responses over weak three majors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Find major fits after weak 3♥ and 3♠ openings through natural forcing new-suit responses.

**Architecture:** Extend `IntermediateBot.chooseBid` responder and continuation gates; Advanced and Expert inherit the behavior. Reuse the existing 16+ HCP and six-card, two-honor thresholds.

**Tech Stack:** TypeScript, bots package, Vitest.

**Spec:** [`../specs/2026-10-26-intermediate-weak-three-major-new-suit-response-design.md`](../specs/2026-10-26-intermediate-weak-three-major-new-suit-response-design.md)

## Global Constraints

- Apply only to uncontested 3♥–3♠ and 3♠–4♥ auctions.
- Preserve existing direct game, notrump, and quick-trick response priority.
- Opener continues in a supported major game or repeats the preempt suit at four.
- Responder places 4♠ after 3♥–3♠–4♥; pass after 3♠–4♥–4♠ and after a major-game raise.

## Review Focus

- Enforce response thresholds and reject a response after interference.
- Preserve the existing direct responses that take precedence.
- Cover supported and unsupported opener continuations for both openings.
- Ensure 3♠–4♥–4♠ is passed, while 3♥–3♠–4♥ is completed to 4♠.

### Task 1: Forcing natural new-suit responses and continuations

**Files:**
- Modify: `packages/bots/src/player.test.ts`
- Modify: `packages/bots/src/player.ts`
- Modify: `TODO.md`
- Modify: `CHANGES.md`

**Interfaces:**
- Consume existing hand, auction, and `IntermediateBot.chooseBid` APIs.
- Continue to return existing `Bid` values.

- [x] Write failing tests for both response auctions and opener fit/no-fit continuations, responder placement/pass, and interference.
- [x] Run the focused tests and confirm the new response fails before implementation.
- [x] Extend the existing response eligibility and opener/responder continuation gates.
- [x] Run focused tests, `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `git diff --check`.
- [x] Update TODO and CHANGES.
- [ ] Commit and push.
