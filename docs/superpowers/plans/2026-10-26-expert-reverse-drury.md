# Expert Reverse Drury

## Goal

Add a tested Expert-only Reverse Drury sequence for passed responders after a third- or fourth-seat major opening. Beginner, Intermediate, and Advanced bidding remain unchanged.

## Agreement

The ACBL teacher manual describes Reverse Drury as a passed hand's artificial 2♣ response to partner's third- or fourth-seat major opening, showing a limit raise; opener rebids 2M to deny game interest, bids game with game values, or otherwise makes a descriptive bid. See [ACBL Major Suit Raises II](https://cdn.acbl.org/assets/documents/teachers/Major-Suit-Raises-II-TM.pdf).

ContractPlay's tested treatment is:

- A responder who passed before partner's 1♥/1♠ opening, has at least three-card support, and has 10–12 support points (HCP plus shortness) responds 2♣.
- Opener rebids 2M with up to 12 HCP, bids 2♦ with 13–15 HCP, and bids 4M with 16+ HCP.
- After 2♦, responder bids 3M with 10–11 support points or 4M with 12+.
- Opener accepts 3M with 15+ HCP and otherwise passes.

The opener ranges and the 2♦ relay are the project's explicit simplified treatment; they are not presented as universal Drury ranges. The code checks that the auction is uncontested through each decision.

## Verification

Focused `ExpertBot` examples cover third-seat use, minimum signoff, sound opening, direct game, responder invitation/game placement, and opener acceptance. Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build` from the repository root.
