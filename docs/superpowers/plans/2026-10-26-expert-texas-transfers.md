# Expert Texas Transfers over Notrump

## Tasks

- [x] Test Expert 4♦/4♥ transfer selection over 1NT with a six-card major and 8–9 HCP and over 2NT with 0–9 HCP, including both-major preference.
- [x] Test opener acceptance at 4♥/4♠ and responder pass; cover five-card and stronger-HCP boundaries and interference exclusion.
- [x] Implement only the exact uncontested 1NT/2NT sequences and preserve existing Jacoby/Gerber behavior.
- [x] Update README, TODO, and CHANGES; `pnpm test` (574 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check` pass.

## Review focus

- The 4-level transfer must not intercept Gerber or the existing Jacoby transfer path.
- Interference must disable the conventional interpretation.
