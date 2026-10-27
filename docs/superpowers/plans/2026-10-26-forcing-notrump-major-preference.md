# Forcing Notrump Major Preference Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show weak doubleton support for opener's major after 1M–1NT–2m when responder lacks a fit for the minor.

**Architecture:** Extend the existing responder continuation for an uncontested major opening, 1NT response, and two-level minor rebid. Let a natural five-card alternate major and a four-card fit in opener's minor keep precedence.

**Tech Stack:** TypeScript, Vitest, pnpm workspace scripts.

**Spec:** `docs/superpowers/specs/2026-10-26-forcing-notrump-major-preference-design.md`

## Global Constraints

- Keep `packages/core` platform-neutral.
- Reuse existing shared types and helpers.
- Apply in SAYC and 2/1.

## Review Focus

- A weak responder with exactly two major cards and fewer than four in opener's minor bids 2M.
- A five-card alternate major continues naturally.
- Four-card support for opener's minor is passed.

### Task 1: Add the weak major preference

**Files:**
- Modify: `packages/bots/src/player.test.ts`
- Modify: `packages/bots/src/player.ts`
- Modify: `TODO.md`
- Modify: `CHANGES.md`

- [x] Add failing tests for both styles with a weak hand, doubleton major support, and no fit for opener's minor.
- [x] Observe both tests fail with Pass, then add a natural preference at 2M after stronger/natural alternatives.
- [x] Add tests that four-card support passes and a five-card alternate major keeps priority.
- [x] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
- [x] Record the continuation in `TODO.md` and `CHANGES.md`.
