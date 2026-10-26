# Weak-two outside-major restriction

## Scope

When opening a weak 2♦, 2♥, or 2♠, require the existing six-card suit quality and 5–11 HCP range, and deny an outside four-card major. For 2♦, this means fewer than four hearts and fewer than four spades; for 2♥ or 2♠, fewer than four cards in the other major.

## Approaches

- Open based only on points and the weak-two suit quality, which can conceal a 4–4 major fit.
- Apply the SAYC outside-major restriction when selecting the weak-two suit.

Use the SAYC restriction described by the ACBL [weak-two guidance](https://www.acblunit390.org/Simon/sayc.htm#weak-twos).

## Verification

- Cover a weak heart opening with four spades, a weak diamond opening with four hearts, and a weak spade opening with four hearts.
- Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
