# Expert Smolen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Expert-only Smolen continuation to find 5-3 major fits after Stayman denial over 1NT.

**Architecture:** Handle the responder jump, opener fit/3NT choice, and responder placement in the existing Expert auction extension. Restrict all stages to uncontested 1NT–2♣–2♦ auctions and keep beginner behavior unchanged.

**Tech Stack:** TypeScript, Vitest, pnpm workspace.

**Spec:** `docs/superpowers/specs/2026-10-26-expert-smolen.md`

## Global Constraints

- Keep `packages/core` platform-neutral.
- Use existing hand and public auction APIs.
- Keep Smolen exclusive to Expert bots.

## Review Focus

- 5-4 patterns in either orientation: test both Smolen calls.
- Opener's three-card support: test choosing 4M in the shown four-card major.
- No three-card fit: test 3NT and responder's longer-major placement.
- Insufficient strength and interference: test the convention does not trigger.
- Lower bot skills: verify existing natural Stayman-denial behavior remains available.

### Task 1: Expert Smolen auction

**Files:**
- Modify: `packages/bots/src/player.ts`
- Test: `packages/bots/src/player.test.ts`
- Modify: `TODO.md`, `README.md`, `CHANGES.md`

- [x] Add failing tests for both patterns, opener's fit decision, responder placement, strength threshold, interference, and skill boundary.
- [x] Implement the Expert-only sequence as specified.
- [x] Run `pnpm test` (554 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check`; update roadmap and release notes.
- [ ] Commit and push the completed slice.

## Source

- ACBL, [Smolen](https://web2.acbl.org/documentLibrary/play/Commonly_Used_Conventions/smolen.pdf), describes the 5-4 major disclosure after Stayman denial and how it keeps opener declarer.
