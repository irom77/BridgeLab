# Intermediate Support Doubles

## Goal

Add the Support Double convention to Intermediate bidding after a minor opening, partner's one-level major response, and a direct suit overcall by responder's right-hand opponent.

## Agreement

- Double shows exactly three-card support for responder's major.
- Four-card or longer support is shown by raising the major at the cheapest legal level.
- With fewer than three cards, use existing natural bidding logic.
- Apply only when the auction is open for opener to act and the overcall is a natural suit bid. Do not treat a penalty double or other interference as a support double.

## Verification

- [x] Add focused bot tests for three-card support, four-card support after both one- and two-level overcalls, no support, and a major opening exclusion.
- [x] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `git diff --check`; all pass.

## Source

[ACBL Commonly Used Conventions](https://web2.acbl.org/documentLibrary/play/commonlyusedconventions.pdf)
