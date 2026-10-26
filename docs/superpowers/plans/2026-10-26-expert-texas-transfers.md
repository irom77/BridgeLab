# Expert Texas Transfers over 2NT

## Tasks

- [x] Test Expert 4♦/4♥ transfer selection with a six-card major and 0–9 HCP, including both-major preference.
- [x] Test opener acceptance at 4♥/4♠ and responder pass; cover five-card and 10+ HCP boundaries and interference exclusion.
- [x] Implement only the exact uncontested 2NT sequences and preserve existing Jacoby/Gerber behavior.
- [x] Update README, TODO, and CHANGES; `pnpm test` (568 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check` pass.

## Review focus

- The 4-level transfer must not intercept Gerber or the existing Jacoby transfer path.
- Interference must disable the conventional interpretation.
