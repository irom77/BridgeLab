# BridgeLab roadmap

Status follows the app-wide plan in [`docs/superpowers/plans/2026-10-25-bridgelab-app.md`](docs/superpowers/plans/2026-10-25-bridgelab-app.md).

## Current focus

Finish the platform-neutral bridge core (rules, scoring, and take-back/replay), then build PBN import/export. Start the solo client after those domain APIs are stable.

## Foundation

- [ ] Establish the pnpm workspace, root scripts, and CI (workspace, scripts, and CI workflow are scaffolded; dependency installation, lockfile, and CI verification remain).
- [ ] Complete immutable auction/play state, scoring, and undo/replay in `packages/core` (deal validation, auction modifier handling, scoring, and score-on-completion are implemented; focused coverage and rule review remain).
- [ ] Complete PBN support (parser, serializer, multi-board records, deals, auctions, play, tags, comments, and diagnostics are implemented in `packages/core`; round-trip coverage, malformed-input review, and extraction into `packages/pbn` remain).

## Solo app

- [ ] Build responsive React client and bridge table UI.
- [ ] Add local solo setup, autosave, hand history, review, and take-back.
- [ ] Implement bot strategies for beginner through expert levels and SAYC / 2/1 styles.
- [ ] Connect hint UI to legal move generation and optional solver adapter.

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
