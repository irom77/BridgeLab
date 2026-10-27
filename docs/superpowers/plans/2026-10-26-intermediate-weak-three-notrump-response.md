# Intermediate 3NT response to weak three major implementation plan

> **For agentic workers:** Use `superpowers:executing-plans` to execute this task in order.

**Goal:** Respond 3NT over partner's 3♣/3♦/3♥/3♠ only with a concrete nine-trick running-suit hand and stoppers in the other side suits.

**Spec:** [`2026-10-26-intermediate-weak-three-notrump-response-design.md`](../specs/2026-10-26-intermediate-weak-three-notrump-response-design.md)

**Files:**
- Modify `packages/bots/src/player.test.ts` for the source example, style parity, and failure boundaries.
- Modify `packages/bots/src/player.ts` inside the Intermediate weak-three responder continuation.
- Modify `TODO.md` and `CHANGES.md` after implementation.

## Task 1: Nine-trick 3NT placement

1. Add tests for both major and minor openings with an eight-card AKQJ running suit, outside ace, and stoppers; no 3NT for a singleton-only hand, missing side-suit stopper, or opponent interference; opener passes after 3NT; cover SAYC and 2/1.
2. Run focused tests and confirm the qualifying response fails before implementation.
3. Add the natural 3NT branch after the major game raise. Require partner's uncontested 3-level suit opening, eight-card side suit with AKQJ, an outside ace, and A or Kx in each remaining side suit.
4. Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `git diff --check`.
5. Update roadmap and change history, then commit and push.

**Review focus:** Only partner's uncontested natural three-level suit opening; no singleton-only or generic HCP-based 3NT; the 4M fit raise retains priority; opener passes 3NT.
