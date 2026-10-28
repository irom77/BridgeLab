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

- [x] Store local game records with schema version, actions, and PBN tags/comments; keep imported metadata with the current and completed hand in browser storage.
- [x] Test save/reload, schema migration, delete/export, review stepping, and take-back branch behavior; export completed hands as PBN without losing supported metadata.
- [x] Implement random/PBN deal setup, dealer/vulnerability selection, start/restart, autosave, resume, and result summary.

#### Task 6: Implement usable bots and hint integration

**Files:**
- Create: `packages/bots/src/player.ts`, bidding/play strategies, and tests
- Modify: `packages/core/src/bots.ts` and client hint UI

**Interfaces:**
- Produces: `BotPlayer` implementations configured by skill and bidding style (`SAYC`, `2/1`); `Solver` adapter remains optional and asynchronously callable.

- [x] Define a convention-system interface and test that each bot only receives its hand, public auction/play, and legal context. (Initial `PlayContext` exposes only own hand and public trick; bidding gets own hand and seat-tagged public auction.)
- [x] Add a deterministic Advanced bot tier for third-hand honor-sequence play; see [`2026-10-26-advanced-bot.md`](2026-10-26-advanced-bot.md).
- [x] Add an Expert bot tier with direct Gerber over 1NT/2NT openings, splinter raises after major openings with opener completing game, and a Blackwood continuation after Jacoby 2NT shortness; see [`2026-10-26-expert-gerber.md`](2026-10-26-expert-gerber.md). Broader expert strategy remains planned.
- [ ] Implement a baseline legal bot first, then beginner/intermediate bidding and play strategies with SAYC and 2/1 configuration. (Beginner opening/pass rules, legal card play, five-card-major/minor opening selection, limited 1NT and minor-opening responses, balanced 1NT responses to major openings, 2/1 forcing 1NT with opener rebids and responder invitations plus passed-hand exceptions, natural competitive notrump responses and strength-showing redoubles, a simple competitive major raise, and interference exceptions, major and minor raises, limited one- and two-level new-suit responses, an uncontested 1M–2-over-1 game force including three-card major support, six-card response-suit and side-major responder continuations, and game continuations after opener's balanced 2NT rebid, responder continuations after opener rebids 1NT including the natural five-card-major signoff and the invitational continuations after 1M–1NT–2M, opener's lower side-suit rebid after 1M–1NT, and opener suit/second-suit/2♣/minimum and invitational major raise/1NT/2NT rebids including balanced 18–19 HCP 2NT and six-card minor rebids after 1m–1NT with responder game acceptance at 8+ HCP, a SAYC five-card minimum rebid, and a six-card invitational jump rebid are implemented; broader competition, other continuations, stronger levels, and complete conventions remain.)
- [x] Implement hints that return only legal cards when no solver is configured and display solver recommendations when available. (Client highlights the fallback legal set or the supplied optional solver recommendations; hints never play automatically.)
- [x] Add deterministic seeded-deal tests for legality, no hidden-information access, and stable output. (Five fixed seeds exercise both Beginner and Intermediate bots across all four seats; bids and card choices repeat deterministically, cards stay in hand and follow suit, and play contexts contain only the acting hand and public trick data.)
- [x] Add an intermediate opening-lead tactic that leads the top honor from a touching honor sequence.
- [x] When no touching honor sequence applies, lead fourth-highest from the longest suit of four or more cards.
- [x] In Intermediate play, use second-hand-low when following an opponent's lead; Advanced inherits the tactic and keeps its third-hand honor play.
- [x] Add strong SAYC opening bands: balanced 20–21 HCP with 2NT, 22+ HCP with strong 2♣, a waiting 2♦ response, and balanced opener rebids of 2NT with 22–24 or 3NT with 25–27.
- [x] Support Stayman, transfers, and direct 3NT over a 2NT opening, including alternate-major discovery after a heart reply and responder game placement.
- [x] Support Stayman and Jacoby transfers over a 1NT opening, including opener's major response, transfer acceptance, responder placement, and alternate spade fit discovery.
- [x] After a 1NT–2♣–2♦ Stayman denial, let responder show a five-card major naturally at the two level, and let opener raise with three-card support.
- [x] Add quantitative 4NT invitations over 1NT (balanced 16+ without a major fit) and 2NT (balanced 12+ without a major fit); opener accepts with maximum strength.
- [x] Continue the 1♥–1NT–2♠ reverse by showing a major fit, bidding notrump with a spade stopper, or rebidding a natural minor.
- [x] After 1♠–1NT–2♥, raise with three-card heart support on 10–12 HCP or place 4♥ with 13+; with a balanced hand without a heart fit, invite in 2NT or bid 3NT.
- [x] Accept opener's invitational jump raise to 3M with 10+ HCP and pass with fewer points in SAYC and 2/1.
- [x] Open unbalanced six-card-or-longer nine-playing-trick hands with strong 2♣ below 22 HCP; add natural positive responses and a supported major game raise.
- [x] Continue after a waiting 2♦ response with Stayman/transfers over balanced 2NT, natural suit raises, and balanced 3NT placement with a stopper.
- [x] Continue a direct 2/1 game force by showing opener's four-card side major with 12–17 HCP.
- [x] After a direct 2/1 minor response, an unbalanced opener with 12+ HCP shows a four-card fit with a three-level raise; responder places the minor game with four-card support, retaining balanced 18–19 HCP 2NT rebids.
- [x] After 1M–2♦ in 2/1, show four clubs with 3♣ on 12–17 HCP; responder shows a four-card side major, places 5♣ with four-card club support, rebids six diamonds, or places 3NT without a fit.
- [x] Allow responder to raise opener's shown side major to game with four-card support in a direct 2/1 game force.
- [x] After 1♥–2♣ or 1♠–2♣, show four diamonds with 12–17 HCP when a higher-priority four-card major is unavailable; raise opener's shown diamonds to game with four-card support.
- [x] Add Jacoby 2NT as a game-forcing raise with 13+ HCP and four-card major support in SAYC and 2/1; opener shows shortness or bids game, then responder places game.
- [x] Apply natural competitive notrump responses with stoppers and simple major raises after one-level overcalls or takeout doubles in both SAYC and 2/1.
- [x] Apply natural competitive notrump responses after minor openings in both SAYC and 2/1.
- [x] Raise a minor opening after a one-level overcall with five-card support and 6–9 HCP in both SAYC and 2/1.
- [x] After a minor opening and one-level major overcall, use 5+ cards for a natural one-level major response over 1♥ and a negative double to show 4+ cards in the unbid major with 6+ HCP.
- [x] After a minor opening and one-level minor overcall, bid an available four-card major at the one level with 6+ HCP.
- [x] After a minor opening is doubled, respond naturally in an available four-card suit at the one level with 6+ HCP.
- [x] Cue-bid a one-level overcall after a minor opening with three-card support and 10+ HCP to show a game-forcing raise.
- [x] Cue-bid one- or two-level overcalls after a major opening with three-card support and 10+ HCP to show a strong raise.
- [x] After a major opening and one-level overcall, make a natural two-level new-suit response with 5+ cards and 10+ HCP in both styles.
- [x] After a major opening and a one-level overcall, bid an available new suit at the one level with 4+ cards and 6+ HCP in both SAYC and 2/1.
- [x] After 1M–1NT, rebid 4M with 19+ HCP and a six-card opening major when no side suit takes priority.
- [x] After opener's balanced 2NT rebid in a direct 2/1 sequence, place 3NT without a three-card major fit even when responder has a six-card minor.
- [x] After responder shows a four-card side major in a direct 2/1 game force, raise that major to game with three-card support.
- [x] Without three-card support for responder's side major, place the game force in 3NT.
- [x] Stop at 4M after opener raises a major fit to game; only continue to 5m when a long minor fit remains below game.
- [x] After opener's invitational 3M rebid, accept with 8+ HCP in SAYC or 10+ in 2/1, passing below those values.
- [x] After 1♥–(1♦)–1♠, raise four-card spade support by strength; without a spade fit, rebid a six-card heart suit at 2♥/3♥ by strength or show a balanced hand with a diamond stopper at 1NT/2NT with 12–14/18–19 HCP.
- [x] After 1♥–(1♦)–1♠–1NT, responder invites with 2NT on a balanced 10–12 HCP hand or 3♠ with five-card support, and places 3NT/4♠ with 13+ HCP.
- [x] Continue the 2/1 game force after responder rebids a six-card minor: opener raises with three-card support and responder places the minor game.
- [x] Without three-card support for responder's six-card minor, opener places the game force in 3NT.
- [x] After a major opening and a two-level minor overcall, make a negative double with 4+ cards in the unbid major and 6+ HCP.
- [x] After 1♠–(2♥), make a negative double with 4+ diamonds and 6+ HCP in both SAYC and 2/1.
- [x] After a two-level overcall of a major opening, raise to the three level with 3+ card support and 6–9 HCP in both styles.
- [x] Give Intermediate bots a natural five-card direct overcall over an opponent's one-level suit opening with 8+ HCP at the one level and 10+ at the two level.
- [x] Give Intermediate bots a simple raise of partner's one- or two-level overcall with three-card support and 6–10 support points.
- [x] Let Intermediate bots advance a one-level overcall with natural 1NT on a balanced 8–11 HCP hand with a stopper in opener's suit.
- [x] Let Intermediate bots advance an overcall in a natural five-card new suit, requiring 6+ HCP for a one-level bid and 11+ when bidding at the two level.
- [x] Let Intermediate bots make natural takeout doubles over one-level suit openings with 13+ total points including shortness and support for the unbid suits.
- [x] Let Intermediate bots advance takeout doubles with minimum or jump suit bids, natural notrump with a stopper, or a strong cuebid.
- [x] Let Intermediate bots cue-bid opener's suit with 3+ card support and 11+ support points after partner's one- or two-level overcall.
- [x] After advancer's strong-raise cue-bid, let the overcaller repeat with a minimum, show a three-card side suit with 11+ HCP, or bid game with 15+ HCP.
- [x] After a simple raise of an overcall, let the overcaller invite at the three level with 11–14 HCP after a one-level overcall and bid game with 15+ HCP.
- [x] After a major-suit advance of a takeout double, pass with a minimum, raise with 16–18 support points, jump-raise with 19+ support points, and accept game over a jump advance with 15+ support points.
- [x] After advancer's strong cuebid of opener's suit, let the takeout doubler name the longest available major, or longest available minor when no major is held.
- [x] After opener's partner raises over a takeout double, let advancer compete in a natural four-card suit with 6–8 support points, jump with 9–11, or cue-bid the raised suit with 12+.
- [x] Let Intermediate bots make a natural 1NT overcall with a balanced 15–18 HCP hand and a stopper in opener's suit.
  - [x] Let Intermediate bots open a natural weak two in a six-card major or diamond suit with 5–11 HCP and at least two honors among ace through ten.
  - [x] Support the forcing 2NT inquiry over a weak two: rebid the suit with 5–8 HCP; with 9–11 show an outside ace/king or bid 3NT without one, then let responder place game.
  - [x] Allow preemptive 3M/4M raises of a weak two with trump support, and a natural 3NT response with a balanced game hand and no major fit.
- [x] After a partner's 1NT overcall, support 2♣ Stayman with 8+ HCP and a four-card major, with a major-showing response or a 2♦ denial, then let responder invite or place game based on strength and fit.
- [x] After a partner's 1NT overcall, support natural five-card suit responses at the two level with 6+ HCP, or 3♣ with a six-card club suit because 2♣ is Stayman.
- [x] After a partner's 1NT overcall, invite in 2NT with a balanced 8–9 HCP hand or bid 3NT with a balanced 10+ HCP hand when responder has no four-card major.
- [x] After Stayman over a 1NT overcall, show four spades when a heart reply does not fit; let the overcaller raise spades or deny the fit in notrump, then let responder place game.
- [x] Use 2NT after a takeout double to show a 10+ point limit raise or better with four-card major or five-card minor support in both styles; opener distinguishes minimum and maximum.
- [x] After 1m–1NT, rebid a six-card minor with 12–17 HCP in both SAYC and 2/1.

### Milestone 4: Ship the shared app to requested platforms

#### Task 7: Add Tauri desktop and mobile hosts

**Files:**
- Create: `apps/client/src-tauri` configuration, capabilities, and platform build scripts
- Modify: workspace scripts and CI workflows

**Interfaces:**
- Produces: browser build plus installable Windows, macOS, iOS, and iPadOS builds from the shared client.

- [x] Configure Tauri 2 to load the built React client and allow only native file-dialog and selected text-file capabilities.
- [x] Implement native-safe PBN import/export and persistence lifecycle adapters behind the client storage boundary.
- [ ] Verify Windows and macOS builds on supported CI runners; build and launch the iOS/iPadOS app in an iPad simulator on macOS with Xcode (workflow configured; first run pending push).
- [x] Document signing, notarization, App Store submission, Windows installer, and web deployment steps in `docs/platform-delivery.md`.

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
