# Forcing Notrump Stopper Requirement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make a balanced 11–12 HCP responder show a doubleton major preference instead of inviting in notrump without stoppers in both unbid suits after opener rebids a minor.

**Architecture:** Tighten the existing 1M–1NT–2m responder continuation in the bot auction handler. Reuse `hasStopper` and the existing natural preference call.

**Tech Stack:** TypeScript, Vitest, pnpm workspace scripts.

**Spec:** `docs/superpowers/specs/2026-10-26-forcing-notrump-stopper-requirement-design.md`

## Global Constraints

- Keep `packages/core` platform-neutral.
- Reuse existing shared types and helpers.
- Keep SAYC and 2/1 response handling otherwise unchanged.

## Review Focus

- With 11–12 HCP, a balanced shape, two-card major support, and no stopper in an unbid suit, responder prefers 2M.
- Existing three-card major raises remain higher priority than notrump invitations.
- Direct forcing-notrump major responses and competitive auctions are unchanged.

### Task 1: Require stoppers for the invitational notrump rebid

**Files:**
- Modify: `packages/bots/src/player.test.ts`
- Modify: `packages/bots/src/player.ts`
- Modify: `TODO.md`
- Modify: `CHANGES.md`

- [x] Add a regression test for `1♠–1NT–2♣` with a balanced 11-HCP responder, doubleton spade support, and no hearts or diamond stopper; expect 2♠ rather than 2NT.
- [x] Run the focused test and observe that the existing response incorrectly bids 2NT.
- [x] Require stoppers in both unbid suits before the 11–12 HCP balanced responder bids 2NT; with exactly two-card support and missing stoppers, return to 2M.
- [x] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
- [x] Record the behavior in `TODO.md` and `CHANGES.md`.
