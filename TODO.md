# ContractPlay roadmap

Status follows the app-wide plan in [`docs/superpowers/plans/2026-10-25-contractplay-app.md`](docs/superpowers/plans/2026-10-25-contractplay-app.md).

## Current focus

The core rules, PBN package, and solo client are in place. Beginner bots support basic opening bids and legal card play; Intermediate adds an initial card-play tactic and is selectable in solo setup. Card-play hints identify legal moves or optional solver recommendations. Next is broader SAYC / 2/1 bidding and more distinct strategy behavior.

## Foundation

- [x] Establish the pnpm workspace, root scripts, and CI (workspace dependencies installed; lockfile generated; local checks pass).
- [x] Complete immutable auction/play state, scoring, and undo/replay in `packages/core` (focused coverage includes auction modifiers, legality, 13-trick completion, scoring examples, and history reconstruction).
- [x] Complete initial PBN support (parser and serializer are extracted into `packages/pbn`; round-trip, seats/vulnerabilities, comments, tags, malformed records, and board-isolation coverage is in place).
- [x] Rename the app, workspace package scope, and repository to ContractPlay.

## Solo app

- [x] Build responsive React client and bridge table UI (auction, legal card play, result display, keyboard-accessible controls, and phone/tablet/desktop viewport checks).
- [x] Add local solo setup, PBN import, autosave/resume, recent hand history, review, and take-back.
- [x] Add deterministic beginner bots with basic SAYC / 2/1 opening-and-pass bidding and legal card selection.
- [ ] Implement intermediate through expert strategies and complete SAYC / 2/1 agreements.
  - [x] Refine beginner openings: 15–17 balanced 1NT, five-card majors, minor fallback.
  - [x] Add a limited uncontested balanced 1NT response.
  - [x] Add basic uncontested raises after partner opens 1♥ or 1♠.
  - [x] Add a balanced 1NT response with 6–9 HCP after a major opening when responder has fewer than three-card support.
  - [x] Add a balanced 1NT response with 6–9 HCP after a minor opening when responder has fewer than five-card support.
  - [x] Add one-level new-suit responses with 4+ cards and 6+ HCP where a higher one-level suit is available.
  - [x] Add uncontested minor responses: five-card raises at 6–12 HCP and balanced 2NT/3NT responses at 10–15 HCP.
  - [x] Add limited uncontested two-level new-suit responses with 4+ cards and 10+ HCP where no one-level new-suit response is available.
  - [x] Add basic opener continuations after a one-level new-suit response: rebid a 6+ card opening suit or show a balanced 12–14 HCP hand in 1NT after a minor opening.
  - [x] Extend balanced opener rebids after a one-level new-suit response: 12–14 HCP in 1NT and 18–19 HCP in 2NT.
  - [x] Add an uncontested minimum opener raise of responder's major with four-card support.
  - [x] Add an invitational opener jump raise of responder's major with four-card support and 16–18 HCP.
  - [x] Add a natural 2♣ opener rebid after 1♦–1♠ with five diamonds and four clubs.
  - [x] Add natural one-level opener rebids in a separate four-card higher suit.
  - [x] Add a balanced responder invitation or game bid after opener's uncontested 1NT rebid.
  - [x] Add a natural five-card major signoff after opener's uncontested 1NT rebid with a minimum responder hand.
  - [x] Invite game in a five-card major at 3M with 10–12 HCP after opener's uncontested 1NT rebid.
  - [x] Add 2/1 forcing 1NT responses with 6–12 HCP when no direct new-suit or minimum raise applies; 10–12 HCP three-card major limit raises start with 1NT.
  - [x] Require a 2/1 opener with 12–17 HCP to continue after forcing 1NT, including a manufactured three-card minor rebid when needed.
  - [x] Add responder's 11–12 HCP 2NT invitation or three-card major limit raise after opener's natural minor rebid.
  - [x] Rebids a five-card heart suit below direct 2/1 strength after 1♠–1NT–2♣.
  - [x] Respect passed-hand exceptions: lower the direct two-level response threshold and do not force opener to rebid after a passed-hand 1NT response.
  - [x] Treat a 1NT response after an opponent's double or one-level overcall as natural and nonforcing in 2/1, with 6–9 balanced HCP and a stopper over an overcall.
  - [ ] Cover remaining interference exceptions to the 2/1 forcing 1NT agreement.
  - [x] Add a natural two-level lower side-suit rebid after a major opening and an uncontested 1NT response.
  - [x] After 1♥–1NT, show a four-card spade suit with a 2♠ reverse and 16+ HCP, preferring a four-card lower side suit when available.
  - [ ] Add broader opener continuations and strength ranges.
    - [x] After 1M–1NT, rebid a six-card opening major when no lower four-card side suit is available.
    - [x] After 1M–1NT, rebid 2NT with a balanced 18–19 HCP hand.
    - [x] After 1M–1NT–2NT, responder bids 3NT with 6+ HCP to accept game.
  - [ ] Implement distinct SAYC and 2/1 response agreements, including game-forcing 2/1 sequences. (2/1 now uses forcing 1NT with 6–12 HCP in the listed uncontested cases; a narrow major-opening 1M–2-over-1 sequence requires 13+ HCP and continues to game. Broader continuations and complete SAYC agreements remain.)
  - [ ] Add intermediate, advanced, and expert bidding/play strategies with distinct tested behavior.
    - [x] Add an initial intermediate card-play tactic: win cheaply when an opponent is winning, or play low when partner is winning; bidding still uses beginner rules.
  - [x] Expose Beginner and Intermediate bot skill in solo setup; advanced and expert remain unavailable.
  - [ ] Cover competitive auctions, doubles, interference, and convention edge cases.
- [x] Connect card-play hint UI to legal move generation and optional solver recommendations. (Without a solver, the client highlights all legal cards; it makes no strategic claim.)

## Platform delivery

- [ ] Package and verify the shared client for Web, Windows, macOS, iOS, and iPadOS.
- [ ] Document signing, store submissions, and web deployment.

## Online multiplayer

- [ ] Build authenticated/guest sessions, table lifecycle, and server-authoritative actions.
- [ ] Protect private hands and recover live tables after disconnects.
- [ ] Connect lobby/table UI and verify reconnect, stale actions, and duplicate delivery.

## Production readiness

- [ ] Add accessibility review, security controls, observability, backups, and release automation.
- [ ] Complete cross-platform regression checks and release runbooks.
