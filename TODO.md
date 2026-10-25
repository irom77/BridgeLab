# BridgeLab roadmap

Status follows the app-wide plan in [`docs/superpowers/plans/2026-10-25-bridgelab-app.md`](docs/superpowers/plans/2026-10-25-bridgelab-app.md).

## Foundation

- [ ] Establish the pnpm workspace, root scripts, and CI.
- [ ] Complete and test immutable auction/play state, scoring, and undo/replay in `packages/core`.
- [ ] Build complete PBN parsing, serialization, and round-trip tests.

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
