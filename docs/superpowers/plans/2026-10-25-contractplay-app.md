# ContractPlay Application Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver ContractPlay as a cross-platform contract bridge app for Web, Windows, macOS, iOS, and iPad, with solo play, hand review, PBN import/export, bots and hints, followed by live multiplayer.

**Architecture:** Use a TypeScript monorepo with a React web client and the existing platform-neutral `packages/core` as the rules authority. Ship the web client directly in browsers and package the same client in Tauri 2 for desktop and mobile; run online games through a server-authoritative API so hidden hands and legal actions are controlled centrally. Build the first usable release around solo play and review, then add multiplayer without changing the bridge rules model.

**Tech Stack:** TypeScript, React, Vite, pnpm workspaces, Tauri 2, Node.js server, PostgreSQL for online accounts/game records, WebSocket transport for live tables, Vitest and Playwright for automated tests. Keep bridge rules and domain packages free of UI, platform, and database dependencies.

**Spec:** ContractPlay product brief from the conversation: cross-platform contract bridge for Web, Windows, Mac, iOS, and iPad; reusable card/deal logic; legal play validation; immutable action history with take-back/review; PBN import/export; configurable bot skill and bidding conventions; and a solver-backed hint seam. The repo currently contains only a core package scaffold and no application or server.

This app-wide roadmap supersedes `2026-10-25-core-game-reducer.md` as the execution plan; its reducer scope is included in Milestone 2, Task 2.

## Global Constraints

- Support Web, Windows, macOS, iOS, and iPadOS from the shared TypeScript client.
- Keep bridge domain logic platform-neutral and deterministic where randomness is injected.
- Enforce legal actions in `packages/core`; the server also validates every online action.
- Never send a player's private hand or unseen cards to other online clients.
- Preserve action history so a finished hand can be reviewed and replayed.
- Use standard PBN tags and deal/auction/play sections; preserve unknown tags/comments on import where practical.
- Ship solo play and review before online multiplayer; multiplayer remains in the app plan as a later milestone.
- No user account is required for local solo play. Online play requires an authenticated or guest session tied to a server-side table.

## Review Focus

- Illegal bid or play input: reject it and preserve the previous state.
- Void and follow-suit edge cases: permit a discard only when the player has no card in the led suit.
- Undo then new action: truncate the abandoned future and keep reconstructed state consistent.
- PBN with absent optional tags, comments, multiple boards, and malformed sections: parse, preserve, or report a useful error without corrupting other boards.
- Network disconnect during an online turn: resume from the server's current revision without duplicating a bid/play or exposing another hand.
- Small touch screens and tablets: retain readable cards, accessible controls, and a usable table layout.

---

## Planned Repository Structure

```text
apps/
  client/                 React/Vite app, routes, table UI, browser entrypoint
    src/
    src-tauri/            Tauri desktop/mobile host and platform configuration
  server/                 Node API, authentication, table sessions, realtime gateway
packages/
  core/                   Cards, auction/play rules, state reducer, scoring, history
  pbn/                    PBN parsing, serialization, validation, round-trip support
  bots/                   Bot strategies, SAYC/2-1 convention configuration, hints
  protocol/               Shared API/WebSocket messages and validation schemas
  persistence/            Client local storage adapters and server repository contracts
  ui/                     Reusable React components/design tokens when shared use exists
```

## Approaches Considered

1. **React web client plus Tauri 2 for desktop and mobile (recommended).** One TypeScript UI and one native host family cover browser, Windows, macOS, iOS, and iPadOS. It reuses the existing TypeScript core and avoids maintaining separate mobile screens at the outset; native integrations and platform builds still need per-platform verification. Tauri describes its frontend as HTML/JavaScript/CSS and supports desktop and mobile build/distribution workflows: [Tauri overview](https://v2.tauri.app/start/), [Tauri distribution](https://v2.tauri.app/distribute/).
2. **React web client plus Capacitor for mobile and a separate desktop wrapper.** This is a mature web-first route and Capacitor officially targets web and iOS (and Android), but the desktop wrapper creates a second packaging path: [Capacitor platform setup](https://capacitorjs.com/docs/getting-started/environment-setup).
3. **Expo / React Native.** Strong TypeScript reuse across iOS, iPadOS, and web, but Windows and macOS require additional platform work for the requested desktop targets: [Expo platform overview](https://docs.expo.dev/).

**Selected approach:** Tauri 2 with a React/Vite client and direct browser deployment. This is the fewest client implementations for the exact target list while preserving the TypeScript domain packages.

## Milestones and Tasks

### Milestone 1: Monorepo and development foundation

#### Task 1: Establish workspace and CI

**Files:**
- Create: root `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, and test/lint configuration
- Create: `.github/workflows/ci.yml`
- Modify: `packages/core/package.json` and `packages/core/tsconfig.json`

**Interfaces:**
- Produces: workspace commands for `typecheck`, `lint`, `test`, and `build`; `@contractplay/core` resolves as a workspace package.

- [x] Add workspace package scripts and baseline CI on Linux for lint, typecheck, unit tests, and production builds.
- [x] Run all workspace checks; CI must fail on type, lint, test, or build errors. (Local workspace checks pass.)

### Milestone 2: Complete bridge domain core

#### Task 2: Implement rules-complete immutable game state

**Files:**
- Create: `packages/core/src/game.ts`, `scoring.ts`, and corresponding tests
- Modify: `packages/core/src/index.ts`, `cards.ts`, `rules.ts`, and `history.ts`

**Interfaces:**
- Produces: `createGameState`, `applyAction`, `undoAction`, `redoAction`, and `replayActions`; typed `GameState`, `Contract`, `Trick`, `RuleError`, and score values.
- Game phases cover auction, passed out, play, and complete. State includes dealer, vulnerability, auction, contract/declarer, remaining hands, current/completed tricks, score, and action history.

- [x] Write tests for bid ordering, passes/doubles/redoubles, passed-out boards, contract/declarer resolution, opening lead, legal play, trick winner, 13-trick completion, scoring, and immutable undo/redo/replay.
- [x] Implement the reducer using shared value types and existing rule helpers; failed transitions return typed errors and leave prior state unchanged. (Initial reducer, deal validation, auction modifier handling, history reconstruction, and score-on-completion are implemented.)
- [x] Verify duplicate scoring for contract level, strain, doubling, vulnerability, overtricks, and undertricks against known scoring examples. (Redoubled undertrick scoring was corrected.)

#### Task 3: Build complete PBN import/export

**Files:**
- Create: `packages/pbn/package.json`, `src/pbn.ts`, and package tests
- Create: PBN parser/serializer tests

**Interfaces:**
- Produces: `parsePbn(input): PbnDocument`, `serializePbn(document): string`, conversion between PBN boards and core hand records, and structured diagnostics with board/line context.

- [x] Define PBN document and board types for tags, deal, auction, play, comments, and diagnostics (in `packages/pbn/src/pbn.ts`).
- [x] Test standard tag/section syntax, all seats and vulnerabilities, suit/rank mapping, comments, multiple boards, incomplete records, and malformed input.
- [x] Implement parser and serializer; preserve unrecognized tags and comments where possible (implementation extracted to `packages/pbn/src/pbn.ts`).
- [x] Verify round-trip on representative fixtures and reject invalid deals without losing unrelated boards.

### Milestone 3: Solo app and hand review

#### Task 4: Build the shared client shell and responsive bridge table

**Files:**
- Create: `apps/client` React/Vite app, routes, components, styles, and UI tests
- Create: `packages/ui` only for components shared by multiple client surfaces

**Interfaces:**
- Client consumes `@contractplay/core` and exposes screens for home, new hand, auction/play table, results, and hand review.

- [x] Add keyboard navigation and accessible labels for bids, cards, seats, vulnerability, and turn status. (Native controls remain keyboard reachable; cards/actions and live status have accessible names.)
- [x] Implement table layout that adapts between desktop, phone portrait, and iPad/tablet landscape. (Responsive CSS breakpoints are in place; device-size review remains.)
- [x] Add UI tests for bidding, selecting a legal card, invalid-card feedback, trick transitions, and completed-hand summary.
- [x] Verify web builds and interaction at phone, tablet, and desktop viewport sizes. (Production build, UI interaction tests, and Chromium viewport checks pass without horizontal overflow.)

#### Task 5: Add local solo game setup, persistence, and history review

**Files:**
- Create: client setup/history screens and `packages/persistence` local adapter
- Modify: core history API only where review controls need it

**Interfaces:**
- Produces: create random or imported hand, resume unfinished local hand, save completed hand, browse recent hands, review move-by-move, and take back during solo play.

- [x] Store local game records with schema version, actions, and board metadata; keep the current hand and recent completed records in browser storage.
- [x] Test save/reload, schema migration, delete/export, review stepping, and take-back branch behavior.
- [x] Implement random/PBN deal setup, dealer/vulnerability selection, start/restart, autosave, resume, and result summary.

#### Task 6: Implement usable bots and hint integration

**Files:**
- Create: `packages/bots/src/player.ts`, bidding/play strategies, and tests
- Modify: `packages/core/src/bots.ts` and client hint UI

**Interfaces:**
- Produces: `BotPlayer` implementations configured by skill and bidding style (`SAYC`, `2/1`); `Solver` adapter remains optional and asynchronously callable.

- [x] Define a convention-system interface and test that each bot only receives its hand, public auction/play, and legal context. (Initial `PlayContext` exposes only own hand and public trick; bidding gets own hand and seat-tagged public auction.)
- [ ] Implement a baseline legal bot first, then beginner/intermediate bidding and play strategies with SAYC and 2/1 configuration. (Beginner opening/pass rules, legal card play, five-card-major/minor opening selection, limited 1NT and minor-opening responses, balanced 1NT responses to major openings, major and minor raises, limited one- and two-level new-suit responses, a narrow uncontested 1M–2-over-1 game force, responder continuations after opener rebids 1NT including the natural five-card-major signoff, opener's lower side-suit rebid after 1M–1NT, and opener suit/second-suit/2♣/minimum and invitational major raise/1NT/2NT rebids are implemented; other continuations, stronger levels, and complete conventions remain.)
- [x] Implement hints that return only legal cards when no solver is configured and display solver recommendations when available. (Client highlights the fallback legal set or the supplied optional solver recommendations; hints never play automatically.)
- [ ] Add deterministic seeded-deal tests for legality, no hidden-information access, and stable output.

### Milestone 4: Ship the shared app to requested platforms

#### Task 7: Add Tauri desktop and mobile hosts

**Files:**
- Create: `apps/client/src-tauri` configuration, capabilities, and platform build scripts
- Modify: workspace scripts and CI workflows

**Interfaces:**
- Produces: browser build plus installable Windows, macOS, iOS, and iPadOS builds from the shared client.

- [ ] Configure Tauri 2 to load the built React client and allow only the required app capabilities.
- [ ] Implement native-safe local file/export and app lifecycle adapters behind the persistence interface.
- [ ] Verify Windows and macOS builds on supported CI runners; verify iOS/iPad builds on macOS with Xcode.
- [ ] Document signing, notarization, App Store submission, Windows installer, and web deployment steps.

### Milestone 5: Live multiplayer

#### Task 8: Implement server, identity, and table lifecycle

**Files:**
- Create: `apps/server` HTTP/API and WebSocket modules
- Create: `packages/protocol` message schemas and `packages/persistence` server contracts
- Create: database schema/migrations and server tests

**Interfaces:**
- Produces: guest/account session, create/join table, seat assignment, ready state, server-side deal creation, state snapshot, action submission, and reconnect/resume APIs.

- [ ] Define versioned request/event schemas with table ID, hand ID, action ID, revision, and actor seat.
- [ ] Implement authoritative server transitions by calling shared core rules; persist each accepted action and snapshot.
- [ ] Add authorization checks ensuring a client receives its own hand and public information only.
- [ ] Test duplicate action delivery, stale revisions, reconnect, seat conflicts, unauthorized actions, and server restart recovery.

#### Task 9: Connect live client play and recovery

**Files:**
- Modify: client table state/network adapter and multiplayer routes
- Modify: shared protocol only as required by integration

**Interfaces:**
- Produces: lobby/table UI, invite/join flow, live auction/play updates, disconnect status, reconnection, and server-confirmed action history.

- [ ] Add multiplayer table and lobby interaction tests using a local test server.
- [ ] Implement optimistic action display only with rollback on server rejection; never advance authoritative state locally before acceptance.
- [ ] Verify reconnect resumes the correct revision and handles an action accepted just before disconnection.

### Milestone 6: Production readiness

#### Task 10: Security, observability, accessibility, and release operations

**Files:**
- Modify: server/client logging, configuration, release workflows, and documentation
- Create: privacy policy, support/runbook notes, and release checklist

**Interfaces:**
- Produces: environment-separated deployments, crash/error reporting, health checks, rate limits, backup/restore, and release artifacts.

- [ ] Add input validation, rate limiting, secure session handling, audit-safe logs, and database backup/restore verification.
- [ ] Run accessibility review, cross-platform smoke tests, PBN fixture checks, and full regression suite.
- [ ] Add staged release workflow for web and signed platform builds; verify rollback and server compatibility with older clients.

## Release Acceptance Criteria

- A user can play a complete legal hand against bots on the web and installed app targets.
- The user can undo during local play, then review or replay the hand later.
- PBN files can be imported, played/reviewed, and exported without losing supported metadata.
- The UI works with touch, mouse, keyboard, and screen-reader labels at phone, iPad, and desktop sizes.
- Online tables (Milestone 5) enforce all actions server-side, conceal private hands, and recover from a client reconnect.
- CI builds and checks every package; platform release instructions are reproducible by a maintainer.
