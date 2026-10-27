# Intermediate quick-trick game response to weak three major plan

> **For agentic workers:** Use `superpowers:executing-plans` to execute this task in order.

**Goal:** Reach 4M after partner's 3M preempt when responder has 4.5+ estimated quick tricks, including a singleton-trump example.

**Spec:** [`2026-10-26-intermediate-weak-three-quick-trick-game-response-design.md`](../specs/2026-10-26-intermediate-weak-three-quick-trick-game-response-design.md)

**Files:**
- Modify `packages/bots/src/player.test.ts` for the ACBL example, quick-trick threshold, and gating.
- Modify `packages/bots/src/player.ts` to count quick tricks and apply the new route in Intermediate.
- Modify `TODO.md` and `CHANGES.md` after implementation.

## Task 1: Quick-trick game raise

1. Add a failing test for the ACBL 3♥–4♥ singleton-support hand and a negative 4.0 quick-trick boundary case; cover both major openings, styles, interference, and opener's pass.
2. Run the focused tests and confirm the singleton-support game raise fails before implementation.
3. Add a focused quick-trick helper and bid 4M at 4.5+ quick tricks after an uncontested partner 3M, preserving the four-card/15-HCP route.
4. Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `git diff --check`.
5. Update the roadmap and change history, then commit and push.

**Review focus:** The quick-trick sum matches the documented values; the 4.5 threshold includes the ACBL sample and excludes the 4.0 boundary; only uncontested partner 3M triggers; existing support raises remain unchanged.
