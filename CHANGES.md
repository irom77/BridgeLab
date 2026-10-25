# Changes

Project changes are recorded here, newest first. Keep entries short and link implementation plans when useful.

## Unreleased

- Rebranded the app and workspace packages as ContractPlay; existing `bridgelab.solo` saves migrate to the new storage key.
- Added a responder game acceptance: 3NT with 6+ HCP after 1M–1NT–2NT.
- Added an invitational 3M responder rebid with a five-card major and 10–12 HCP after opener's uncontested 1NT rebid.
- Added a solo setup choice for Beginner or Intermediate bot skill; Intermediate bots still use beginner bidding.
- Added the 1♥–1NT–2♠ opener reverse with 16+ HCP and four spades, after checking for an available lower side suit.
- Added an initial intermediate bot skill that conserves high cards when partner is winning and takes a trick with the cheapest winning card when an opponent is ahead. Its bidding still uses beginner rules.
- Added the natural 1♦–1♠–2♣ opener continuation with at least five diamonds, four clubs, and 12–17 HCP.
- Added an invitational opener jump raise to 3M with four-card support and 16–18 HCP after an uncontested one-level major response.
- Added balanced responder continuations after an uncontested opener 1NT rebid: 2NT with 10–12 HCP and 3NT with 13+ HCP.
- Added a natural 2M signoff after an uncontested 1NT rebid when responder has a five-card major and no more than 9 HCP.
- Added a natural lower side-suit rebid after an uncontested 1M–1NT response when opener has 12–17 HCP, five cards in the major, and four cards in the side suit.
- Added a natural 2M rebid after 1M–1NT when opener has 12–17 HCP, six cards in the major, and no lower four-card side suit to show.
- Added a balanced 2NT opener rebid with 18–19 HCP after an uncontested 1M–1NT auction.
- Added a 1NT response with a balanced 6–9 HCP hand after a major opening when responder lacks three-card support.
- Added a 1NT response with a balanced 6–9 HCP hand after a minor opening when responder lacks five-card support.
- Added natural one-level opener rebids in a separate four-card higher suit after an uncontested one-level response.
- Added an uncontested opener raise of responder's major with four-card support and 12–15 HCP.
- Added balanced opener rebids after a one-level new-suit response: 12–14 HCP in 1NT and 18–19 HCP in 2NT.
- Distinguished limited SAYC and 2/1 two-level responses: SAYC keeps the 10+ HCP response, while a 2/1 response after a major opening requires 13+ HCP and continues to game.
- Added a balanced 12–14 HCP 1NT rebid after a minor opening and partner's one-level suit response.
- Added a simple opener rebid of the original suit with six or more cards after an uncontested one-level new-suit response.
- Expanded uncontested minor-opening responses with five-card invitational raises and balanced 2NT/3NT ranges.
- Added limited uncontested two-level new-suit responses with four-card length and 10+ high-card points when no higher one-level suit is available.
- Added a limited uncontested raise after a minor opening with five-card support and 6–9 high-card points.
- Added one-level new-suit responses with four-card length and six high-card points after an uncontested partner opening.
- Added basic uncontested major raises after partner opens hearts or spades, scaled by responder high-card points and support.
- Added basic balanced 1NT responses after an uncontested partner opening, with the bot given its seat to identify partnership.
- Refined beginner opening bids to prefer five-card majors and use a minor when no major qualifies.
- Added advisory card-play hints that highlight legal cards, or optional solver recommendations when a host provides a solver.
- Added a platform-neutral beginner bot package with deterministic opening/pass bidding and legal card play, plus an optional solo table mode with automated opponents.
- Added local dealer/vulnerability setup and PBN deal import to the client.
- Added versioned browser autosave/resume, recent completed hands, JSON export/delete, and move-by-move review with take-back and redo.
- Verified the table and card hand at phone, tablet, and desktop widths without horizontal overflow.

## 2026-10-25

- Added a responsive React bridge table with reducer-backed auction, card play, rule feedback, trick progression, and hand results.
- Added the pnpm lockfile, focused core and PBN tests, and a separate `@contractplay/pbn` package; corrected redoubled undertrick penalties.
- Added the pnpm workspace foundation, shared strict TypeScript settings, core build/typecheck scripts, and CI workflow.
- Added immutable auction and card-play transitions, contract/declarer resolution, trick progression, and history reconstruction APIs in `packages/core`.
- Added full-deal validation and duplicate contract scoring, including vulnerability, doubles/redoubles, overtricks, undertricks, game, and slam bonuses; completed hands now include their score.
- Added PBN parsing and serialization for multi-board records, deals, auctions, card play, comments, preserved tags, and board-level diagnostics.
- Added the MIT license.
- Added the initial `packages/core` TypeScript scaffold for cards, dealing, play legality, action history, bot/hint interfaces, and basic PBN metadata utilities.
- Added the ContractPlay app roadmap and the initial project documentation and agent guidance.
