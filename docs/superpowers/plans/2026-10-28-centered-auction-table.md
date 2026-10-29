# Centered Auction Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Focus the active table on a centered auction, larger cards, compact in-game menus, and a visible release version. The auction uses a seat-aligned call grid inspired by Trickster Bridge.

**Architecture:** Keep the existing client components and game state. Recompose the auction panel into the central table area during bidding, expose setup/import/history through a native disclosure menu, and source the header version from the client package manifest. The call grid derives currently available contract, double, and redouble actions from the auction for presentation; core action validation remains authoritative.

**Tech Stack:** React, TypeScript, CSS, Vite, Vitest, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-28-centered-auction-table-design.md`

## Global Constraints

- Keep `packages/core` platform-neutral and unchanged.
- Preserve existing accessible labels, controls, and game behavior.
- Do not add dependencies.
- Verify with `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm web:verify`.

## Review Focus

- Bot-controlled auction turns still show the centered auction state while preventing user bid submission; cover with an existing or focused bot-mode UI test.
- PBN import stays available after starting a game; assert the disclosure menu contains its import controls.
- Play hands fit at 320px and 760px widths; inspect responsive CSS and verify using the workspace's web build.
- The visible version follows `apps/client/package.json`; assert rendered version and retain Vite build coverage.
- Disclosure controls remain keyboard-accessible; use semantic `details`/`summary` and test their accessible names.

---

### Task 1: Recompose the active table and menus

**Files:**
- Modify: `apps/client/src/App.tsx`
- Test: `apps/client/src/App.test.tsx`

**Interfaces:**
- Consumes the existing `GameState`, auction controls, setup state, PBN import form, and recent-hand handlers.
- Produces phase-specific layout classes and a semantic table menu without changing state or action APIs.

- [x] Add focused assertions that the active auction is centered in the table composition, and settings/import/history appear in a named disclosure menu.
- [x] Move the auction panel into the central game layout while `phase === "auction"`; keep its current companion placement for play and results.
- [x] Move next-deal settings, PBN import, and recent hands into a native disclosure menu while retaining existing handlers and labels.
- [x] Run `pnpm test -- apps/client/src/App.test.tsx` and confirm the focused UI tests pass.

### Task 2: Enlarge cards and adapt table spacing

**Files:**
- Modify: `apps/client/src/styles.css`
- Test: `apps/client/src/App.test.tsx`

**Interfaces:**
- Consumes the phase-specific layout classes from Task 1.
- Produces desktop and mobile card/table sizing with no horizontal overflow.

- [x] Update hand-card styles to a desktop size around 58×80px and mobile size around 42×60px, adjusting gaps and table dimensions to fit 13 cards.
- [x] Use a temporary headless browser session to inspect auction and play layouts at 320px, 390px, 768px, and 1280px; confirm centered alignment, card sizes, and no document-width overflow.
- [x] Run the focused client test and inspect CSS breakpoints for 320px, 380px, and 760px layouts.

### Task 3: Display the current release version

**Files:**
- Modify: `apps/client/src/App.tsx`
- Test: `apps/client/src/App.test.tsx`

**Interfaces:**
- Consumes the client package version from `apps/client/package.json`.
- Produces a persistent, accessible version label in the site header.

- [x] Render the current package version in the header and assert the exact version label in the client UI test.
- [x] Confirm the JSON manifest import is supported by the project TypeScript/Vite configuration, adjusting configuration only if needed.

### Task 4: Release-readiness verification and notes

**Files:**
- Modify: `CHANGES.md`

- [x] Add a concise user-facing change entry.
- [x] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm web:verify`.
- [x] Inspect final diff and confirm it is ready for release without publishing the release.

### Task 5: Add a seat-aligned bidding box

**Files:**
- Modify: `apps/client/src/App.tsx`
- Modify: `apps/client/src/styles.css`
- Test: `apps/client/src/App.test.tsx`

- [x] Replace the call selector with a compact level-by-strain grid and explicit Pass, Double, and Redouble controls.
- [x] Disable contract calls that do not outrank the current contract, and enable Double/Redouble only for the eligible side.
- [x] Align auction calls in North-East-South-West columns beginning at the dealer, with compact suit and notrump labels.
- [x] Update focused UI coverage for bidding, call eligibility, and seat alignment.
- [x] Run `pnpm test` (886 tests), `pnpm typecheck`, `pnpm lint`, and `pnpm web:verify`.
