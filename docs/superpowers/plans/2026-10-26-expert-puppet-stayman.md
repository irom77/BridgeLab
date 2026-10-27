# Expert Puppet Stayman over 2NT

## Tasks

- [x] Test Expert 3♣ inquiry, opener's five-card major and 3NT denial responses.
- [x] Test responder's fit/no-fit placement after 3♥/3♠, four-card fit discovery after 3♦, and interference exclusion.
- [x] Test Texas transfer, opener acceptance, and responder pass after 3NT denies a major fit with a 6–4 major holding.
- [x] Implement the exact uncontested Expert sequences while preserving non-Expert Stayman.
- [x] Update README, TODO, and CHANGES; `pnpm test` (587 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check` pass.

## Review focus

- Keep the Puppet interpretation isolated to Expert 2NT auctions so existing 2NT Stayman behavior remains stable for other skills.
- Don't interpret 3♣ as Puppet Stayman after an opponent acts.
