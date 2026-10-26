# Expert Blackwood King Ask

## Tasks

- [x] Test 5NT after all four aces are known, the 6-level king-count response, and final 6M/7M placement.
- [x] Implement the continuation across existing agreed-major Blackwood contexts without changing Gerber or Grand Slam Force.
- [x] Update README, TODO, and CHANGES; `pnpm test` (593 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check` pass.

## Review focus

- Distinguish 5NT king asks after 4NT from the Grand Slam Force after Jacoby 2NT.
- Do not ask kings when the 5♣ ace response is ambiguous and all four aces are not confirmed.
