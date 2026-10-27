# Expert Blackwood after a weak-three minor major fit

## Intent

Give Expert a slam investigation after a weak-three minor opening finds a major fit. Today the bot can ask directly when responder has a five-card minor fit, and can play 3m–3M–4M naturally, but it cannot continue with ace/keycard asks after the major fit is confirmed.

## Scope

- In Expert only, after an uncontested 3♣/3♦–3♥/3♠–4M auction, responder uses 4NT with 19+ HCP and a six-card response major.
- Reuse the existing Blackwood responses: 5♣/♦/♥/♠ for 0/4, 1, 2, 3 aces; ask with 5NT after all four aces are known; opener answers kings at the six level.
- Place 6M unless all four aces and all four kings are known, then place 7M. Opener passes the final contract.
- Keep direct Blackwood over 3m with a five-card minor fit and all existing 3M weak-three Blackwood behavior unchanged.
- Do not start or continue the sequence after opponent interference.

## Approaches

- Reuse direct-minor Blackwood by pretending responder's minor is the agreed suit. This conflicts with the established major fit and produces wrong slam contracts.
- Add a separate, exact major-fit continuation after 3m–3M–4M, using the shared ace/king response meanings and the major as trump. This is the chosen approach because the auction already confirms the major fit and the direct minor-fit ask remains distinct.
- Generalize all Blackwood auctions into a new framework. That would broaden the change and risk existing slam sequences without helping this one.

## Constraints and rationale

Keep bidding behavior in `packages/bots`; do not change core. Require 19+ HCP and a six-card response major, and cover both minors and majors with focused tests. Opener's 4M raise confirms the fit. Update `TODO.md` and `CHANGES.md`.
