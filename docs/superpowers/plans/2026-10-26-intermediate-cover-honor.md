# Intermediate cover-an-honor play

## Scope

When acting second to an opponent's lead, Intermediate should cover a led honor with the lowest legal higher honor when one is available. It should not cover partner's honor lead. In all other cases it keeps the existing second-hand-low choice. Advanced and Expert inherit this Intermediate behavior.

## Verification

- Test covering a led queen with the cheapest higher honor.
- Test retaining second-hand-low when no higher honor is held.
- Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
