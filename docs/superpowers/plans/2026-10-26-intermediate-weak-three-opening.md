# Intermediate weak three-level opening implementation plan

> **For agentic workers:** Use `superpowers:executing-plans` to execute this task in order.

**Goal:** Add a natural seven-card preemptive opening to the Intermediate bot without changing Beginner behavior.

**Spec:** [`2026-10-26-intermediate-weak-three-opening-design.md`](../specs/2026-10-26-intermediate-weak-three-opening-design.md)

**Files:**
- Modify `packages/bots/src/player.test.ts` for boundary and style tests.
- Modify `packages/bots/src/player.ts` inside `IntermediateBot.chooseBid`.
- Modify `TODO.md` and `CHANGES.md` after implementation.

## Task 1: Intermediate weak three opening

1. Add focused tests for a qualifying seven-card major and minor, 5- and 10-HCP boundaries, 11-HCP exclusion, insufficient suit quality, outside-four-card-major exclusion, Beginner gating, and prior opponent action gating.
2. Run the focused tests and confirm the qualifying cases fail because Intermediate passes.
3. Add the opening branch to Intermediate before delegating to Beginner; use 5–10 HCP, seven or more cards, `hasReasonableWeakTwoSuit`, and `hasOutsideFourCardMajor`.
4. Run focused tests and the complete workspace checks: `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `git diff --check`.
5. Update the roadmap and change history with the exact behavior and note that replies over the preempt remain out of scope.
6. Commit and push the completed slice.

**Review focus:**
- Weak three is selected only for an all-pass auction and only by Intermediate/Advanced/Expert via inheritance.
- A seven-card minor/major with qualifying honors opens at three.
- 5–10 HCP inclusive qualifies; 4 or 11 does not.
- A weak suit or outside four-card major blocks the preempt.
- Existing weak twos and Beginner behavior are unchanged.
