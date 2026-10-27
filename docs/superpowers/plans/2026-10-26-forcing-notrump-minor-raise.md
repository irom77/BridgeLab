# Forcing Notrump Minor Raise Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Invite game in opener's minor after 1M–1NT–2m with an unbalanced 11–12 HCP responder holding at least five-card support.

**Architecture:** Extend the existing responder continuation for an uncontested major opening, 1NT response, and two-level minor rebid. Keep major-fit and balanced-notrump actions ahead of the new natural minor raise.

**Tech Stack:** TypeScript, Vitest, pnpm workspace scripts.

**Spec:** `docs/superpowers/specs/2026-10-26-forcing-notrump-minor-raise-design.md`

## Global Constraints

- Keep `packages/core` platform-neutral.
- Reuse existing shared types and helpers.
- Apply in both SAYC and 2/1 bidding styles.

## Review Focus

- Unbalanced 11–12 HCP with five-card minor support raises to 3m.
- Opener accepts in 3NT with 16+ HCP, four-card minor support, and stoppers in every other suit.
- Existing major-fit and balanced notrump continuations remain ahead of the minor raise.
- Other hand strengths and competitive auctions remain unchanged.

### Task 1: Add the natural invitational minor raise

**Files:**
- Modify: `packages/bots/src/player.test.ts`
- Modify: `packages/bots/src/player.ts`
- Modify: `TODO.md`
- Modify: `CHANGES.md`

- [x] Add failing tests for both styles with an unbalanced 11-HCP responder and five-card support after 1♠–1NT–2♣; expect 3♣.
- [x] Run the focused tests and observe the bot pass.
- [x] Raise to 3m with 11–12 HCP, five-card support, and an unbalanced hand, after major-fit and balanced-notrump continuations.
- [x] Add a test for opener accepting in 3NT with 16+ HCP, four-card minor support, and stoppers in every other suit; leave the invitation unaccepted without those conditions.
- [x] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
- [x] Record the agreement in `TODO.md` and `CHANGES.md`.
