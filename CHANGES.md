# Changes

Project changes are recorded here, newest first. Keep entries short and link implementation plans when useful.

## 2026-10-25

- Added the pnpm workspace foundation, shared strict TypeScript settings, core build/typecheck scripts, and CI workflow.
- Added immutable auction and card-play transitions, contract/declarer resolution, trick progression, and history reconstruction APIs in `packages/core`.
- Added full-deal validation and duplicate contract scoring, including vulnerability, doubles/redoubles, overtricks, undertricks, game, and slam bonuses; completed hands now include their score.
- Added PBN parsing and serialization for multi-board records, deals, auctions, card play, comments, preserved tags, and board-level diagnostics.
- Added the MIT license.
- Added the initial `packages/core` TypeScript scaffold for cards, dealing, play legality, action history, bot/hint interfaces, and basic PBN metadata utilities.
- Added the BridgeLab app roadmap and the initial project documentation and agent guidance.
