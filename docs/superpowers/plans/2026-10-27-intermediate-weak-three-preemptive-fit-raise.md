# Preemptive fit raises over weak three-level openings Implementation Plan

**Goal:** Place a preemptive fit contract immediately over a weak 3-level opening.

**Architecture:** Add a fit-length response after current direct game, 3NT, quick-trick, and forcing natural major routes in `IntermediateBot.chooseBid`. Advanced and Expert inherit this path, while Expert's direct Blackwood check remains earlier.

**Spec:** [`../specs/2026-10-27-intermediate-weak-three-preemptive-fit-raise-design.md`](../specs/2026-10-27-intermediate-weak-three-preemptive-fit-raise-design.md)

## Review Focus

- Three, four, five, and six-card support produce 4, 5, 6, and 7 of the opened suit.
- Existing higher-priority responses remain unchanged.
- No raise follows interference; opener passes after a preemptive raise.
- Intermediate, Advanced, and Expert behavior is covered.

### Task 1: Add and verify preemptive fit raises

**Files:**
- Modify: `packages/bots/src/player.test.ts`
- Modify: `packages/bots/src/player.ts`
- Modify: `TODO.md`
- Modify: `CHANGES.md`

- [x] Add failing tests for each support length and suit class, opener's pass, interference, and preservation of higher-priority routes already covered in the weak-three regression suite.
- [x] Run focused tests and verify failure before implementation.
- [x] Implement the direct fit-level raise after stronger response routes.
- [x] Run workspace checks and `git diff --check`.
- [x] Update roadmap/history.
- [ ] Commit and push.
