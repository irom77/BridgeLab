# Expert Gerber Implementation Plan

> **For agentic workers:** Use the implementation workflow to execute this plan task by task.

**Goal:** Add an Expert bot tier that uses direct Gerber over 1NT/2NT openings and preserves quantitative 4NT.

**Architecture:** `ExpertBot` wraps `AdvancedBot`. It intercepts only the direct, uncontested NT–4♣ ace-ask and its response. It returns the ace-count response or places 4NT/6NT using the responder's known aces; all other bidding and card play delegate to Advanced.

**Tech Stack:** TypeScript, React, Vitest, pnpm workspace scripts.

**Spec:** `docs/superpowers/specs/2026-10-26-expert-gerber-design.md`

## Global Constraints

- Keep `packages/core` platform-neutral.
- Keep bidding deterministic and only use the bot's hand and public auction.
- Gerber applies only directly over partner's uncontested 1NT/2NT opening.
- Do not change existing skill behavior.

## Review Focus

- Balanced strong no-major hands choose 4♣ at the defined 1NT/2NT thresholds.
- Direct 4♣ over partner's notrump opening returns the correct ace-count bid.
- Responder resolves the Gerber answer into 4NT or 6NT, handling 4♦ conservatively.
- Expert delegates all non-Gerber bids and all card play to Advanced.
- The solo selector and seeded tests include Expert.

## Task 1: Add Expert Gerber bidding

**Files:**
- Modify: `packages/bots/src/player.test.ts`
- Modify: `packages/bots/src/player.ts`

**Interfaces:**
- Produces `ExpertBot implements BotPlayer`; `chooseBid` intercepts Gerber and delegates otherwise, `chooseCard` delegates to `AdvancedBot`.
- `createBot({ skill: "expert", biddingStyle })` returns `ExpertBot`.

- [x] Add failing tests for Expert's 1NT/2NT 4♣ asks, opener ace-count responses, responder placement, and quantitative 4NT fallback.
- [x] Run the focused tests and confirm they fail because Expert is unavailable.
- [x] Implement an ace-count helper and `ExpertBot` interception for the exact no-interference sequences in the design.
- [x] Run focused bot tests and confirm Gerber and quantitative 4NT fallback behavior pass.

## Task 2: Expose Expert in the solo client

**Files:**
- Modify: `apps/client/src/App.tsx`
- Modify: `apps/client/src/App.test.tsx`
- Modify: `packages/bots/src/player.test.ts`

**Interfaces:**
- The client uses `SkillLevel` and offers Beginner, Intermediate, Advanced, and Expert.

- [x] Add failing UI and seeded-determinism tests for Expert.
- [x] Add Expert to both solo setup selectors and the seeded bot skill cases.
- [x] Update `README.md`, `TODO.md`, `CHANGES.md`, and the app-wide plan to describe Expert's implemented convention and remaining bidding limits.
- [x] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `git diff --check` (357 tests pass; lint reports only the existing Node module-type warning).
