# Intermediate weak three major game response implementation plan

> **For agentic workers:** Use `superpowers:executing-plans` to execute this task in order.

**Goal:** Raise an uncontested partner 3♥/3♠ opening to game with four-card support and 15+ HCP in Intermediate, Advanced, and Expert.

**Spec:** [`2026-10-26-intermediate-weak-three-major-game-response-design.md`](../specs/2026-10-26-intermediate-weak-three-major-game-response-design.md)

**Files:**
- Modify `packages/bots/src/player.test.ts` for qualifying, boundary, and interference cases.
- Modify `packages/bots/src/player.ts` inside `IntermediateBot.chooseBid`.
- Modify `TODO.md` and `CHANGES.md` after implementation.

## Task 1: Major game raise over partner's weak three

1. Add tests for both major openings, four-card support, 15-HCP minimum, rejection below the strength/support thresholds, SAYC/2/1 parity, and interference.
2. Run focused tests and confirm qualifying raises fail before implementation.
3. Add the responder branch before delegating to Beginner. Require exactly one contract call, partner's 3♥/3♠ opening, no intervening calls, four-card support, and 15+ HCP.
4. Verify opener passes after the 4M placement and no other skill tiers gain independent bidding behavior.
5. Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `git diff --check`.
6. Update roadmap and change history, then commit and push.

**Review focus:** Natural uncompetitive major raise only; all four gating conditions and both suits are tested; six-card weak twos and existing weak-three openings remain unchanged.
