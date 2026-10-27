# Expose intermediate bot skill in solo setup

## Goal

Let solo players choose the implemented Intermediate card-play tactic from the client.

## Approach

Add a Beginner/Intermediate selector beside bot seat and bidding-style settings. Pass the selected level to all three automated seats. Do not expose advanced or expert levels before they are implemented.

## Verification

Added a setup integration test. `pnpm test` (131 tests), `pnpm lint`, `pnpm typecheck`, and `git diff --check` pass. Lint reports the existing Node warning that `eslint.config.js` is parsed as ES module without `type: module` in the root package.
