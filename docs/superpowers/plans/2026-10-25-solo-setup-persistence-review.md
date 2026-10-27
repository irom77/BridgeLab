# Solo Setup, Saves, and Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Let a local player configure a deal, resume it after reload, browse finished hands, and step through or take back actions.

**Architecture:** Keep game transitions in `@contractplay/core`; add a versioned storage adapter package that accepts a `Storage`-shaped interface, and let the React client coordinate setup, autosave, recent hands, and review. Store the current hand and recent completed hands as JSON in browser local storage.

**Tech Stack:** TypeScript, React, Vite, Vitest, pnpm workspace.

**Spec:** Task 5 in `docs/superpowers/plans/2026-10-25-contractplay-app.md`.

## Global Constraints

- `packages/core` remains platform-neutral.
- Keep immutable transitions and action validation in the core.
- Use existing workspace commands; don't invent root test commands.
- Keep saves versioned and preserve action history and board metadata.
- Keep user-facing docs accurate and update the roadmap and changelog.

## Review Focus

- Invalid or obsolete local data: recover to an empty session without crashing.
- Reload during a hand: restore the exact current actor, auction/play state, and undo cursor.
- Undo then a new action: ensure the abandoned future is not replayed.
- Review navigation: do not mutate the active session while stepping a saved hand.
- Small screens: setup, save/resume, review controls, and cards remain reachable without horizontal overflow.

---

### Task 1: Versioned local persistence adapter

**Files:**
- Create: `packages/persistence/package.json`, `tsconfig.json`, `src/index.ts`, `src/local-solo-store.test.ts`
- Modify: root workspace scripts/configuration only if needed for package discovery.

**Interfaces:**
- `loadSoloData(storage): SoloData`
- `saveSoloData(storage, data): void`
- `deleteSavedHand(storage, id): SoloData`
- `exportSavedHand(data, id): string | undefined`
- Version 1 stores `currentGame`, `currentHandId`, and recent completed records with id, game state, and ISO timestamp. Version 0 `{ version: 0, currentGame }` migrates to version 1.

- [x] Write tests for empty storage, v0 migration, round-trip save/reload, malformed and structurally invalid data recovery, delete, and export.
- [x] Run the focused test and observe the expected missing-module failures.
- [x] Implement the adapter and package build/typecheck scripts.
- [x] Run focused tests and workspace typecheck.

### Task 2: Setup, autosave, recent hands, take-back, and review UI

**Files:**
- Modify: `apps/client/src/App.tsx`, `apps/client/src/styles.css`, `apps/client/src/App.test.tsx`
- Modify: `docs/superpowers/plans/2026-10-25-contractplay-app.md`, `TODO.md`, `CHANGES.md`, `README.md`

**Interfaces:**
- Setup uses dealer choices North/East/South/West and vulnerability None/NS/EW/Both, and accepts a pasted PBN board.
- A new hand uses those setup values; unfinished state auto-saves after each accepted action and resumes on reload.
- Completed hands appear newest-first in a recent hands list; review has previous/next action controls and does not alter the active hand.
- Active hand exposes a take-back control using `undoAction` and a redo control while a future action exists.

- [x] Add failing UI tests for selected setup metadata, PBN import, autosave/resume, take-back/redo, and independent review stepping.
- [x] Run the tests and observe the expected failures.
- [x] Implement the UI and responsive styles using the persistence adapter.
- [x] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build`.
- [x] Inspect desktop/tablet/phone layouts using Chromium and check for horizontal overflow.
