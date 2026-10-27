# Simple major raise continuations implementation plan

**Goal:** Finish uncontested follow-ups after a responder's simple or limit raise of opener's major.

**Spec:** [`../specs/2026-10-27-major-raise-continuations-design.md`](../specs/2026-10-27-major-raise-continuations-design.md)

## Task 1: Handle invitations after natural major raises

**Files:** `packages/bots/src/player.ts`, `packages/bots/src/player.test.ts`, `TODO.md`, `CHANGES.md`.

- [x] Add failing tests for both styles and majors: 1M–2M opener's invitation/game placement and responder accept/pass boundary; SAYC 1M–3M opener accept/pass boundary.
- [x] Implement uncontested natural follow-ups without changing direct raise selection.
- [x] Run focused tests and all workspace checks; run `git diff --check`.
- [ ] Update roadmap and change history, request a focused review, then commit and push.
