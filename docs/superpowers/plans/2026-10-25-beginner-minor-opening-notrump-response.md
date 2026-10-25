# Beginner minor opening notrump response

## Goal

Give responder a natural 1NT option with a balanced 6–9 HCP hand after an uncontested 1♣ or 1♦ opening, when responder does not have five-card support for opener's minor.

## Approach

Use the existing beginner responder path and hand-shape/HCP helpers. Preserve the current priority for a one-level new suit and five-card minor raise; add the new 1NT range before the existing 2NT invitation range.

## Scope

- Add focused coverage for a balanced hand in range with fewer than five cards in opener's minor.
- Document this beginner behavior and mark the roadmap slice complete.
- Competitive auctions and a complete SAYC/2/1 agreement remain out of scope.

## Verification

Verified: `pnpm test` (127 tests), `pnpm lint`, `pnpm typecheck`, and `git diff --check` pass.
