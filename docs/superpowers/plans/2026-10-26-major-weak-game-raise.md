# Major Weak Game Raise Implementation Plan

**Goal:** Add a preemptive game raise after a one-level major opening when responder has at least five-card support, a singleton or void, and fewer than 10 HCP.

**Architecture:** Detect the distributional raise in the existing uncontested major-response path before natural new-suit responses. Strong Jacoby 2NT and constructive raises remain on their current paths.

**Tech Stack:** TypeScript, Vitest, pnpm workspace scripts.

**Reference:** [ACBL SAYC System Booklet](https://web2.acbl.org/documentLibrary/play/sayc_book.pdf)

## Global Constraints

- Apply only to uncontested one-level major openings.
- Keep the minimum at five-card support, shortness outside trumps, and fewer than 10 HCP.
- Do not alter stronger game-forcing or limit-raise responses.

## Review Focus

- Five-card support and a singleton or void jumps to 4M below 10 HCP.
- Three-card support retains the ordinary 2M raise.
- Hands with 10+ HCP retain their existing constructive or forcing response.

## Task 1: Add the preemptive response

- [x] Add failing tests for the weak five-card major raise and the 10-HCP boundary in SAYC and 2/1.
- [x] Implement the shortness and support check before natural new-suit responses.
- [x] Run `pnpm test` (415 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
