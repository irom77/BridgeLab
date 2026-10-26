<p align="center">
  <img src="docs/contractplay-logo.svg" alt="ContractPlay — play, learn, and review contract bridge" width="520" />
</p>

<h1 align="center">ContractPlay</h1>

<p align="center">A cross-platform home for contract bridge: play, learn, and review every hand.</p>

---

## Project status

ContractPlay now has a responsive browser client for configured or imported local deals, autosaved play, take-back, hand review, beginner bots, and card-play hints. Without a solver, hints identify legal cards; hosts can optionally provide solver recommendations. Stronger bidding systems and platform builds remain planned work.

See [TODO.md](TODO.md) for the current roadmap and [CHANGES.md](CHANGES.md) for completed work.

## Product goals

- Play contract bridge on the web, Windows, macOS, iOS, and iPad.
- Use one platform-neutral TypeScript rules core across clients.
- Support solo play, configurable bots, hints, and hand review with take-back and replay.
- Import and export hands in Portable Bridge Notation (PBN).
- Add live multiplayer with server-validated actions and private hands.

## Repository layout

```text
apps/client/          Responsive React/Vite bridge table
apps/server/          Online game server (planned)
packages/core/        Bridge cards, rules, and game state
packages/pbn/         PBN parser, serializer, and diagnostics
packages/persistence/ Versioned local solo-game storage
packages/bots/        Beginner bidding and card play strategies
packages/protocol/    Shared network message types (planned)
docs/superpowers/
  plans/              Implementation plans
```

## Core package

The core package lives in `packages/core/src` and provides card/deal types, dealing and shuffle helpers, follow-suit validation, trick winner evaluation, an immutable auction/play reducer with undo/redo reconstruction, duplicate scoring, and bot/solver interfaces. The `packages/bots` package provides deterministic beginner bidding and legal card selection with limited SAYC and 2/1 behavior, plus intermediate card-play tactics that save high cards when partner is winning, take the trick cheaply when an opponent is ahead, and lead the top honor from a touching sequence or fourth-highest from a longest suit of four or more cards; intermediate bidding still uses beginner rules; opening selection uses five-card majors and minor fallback, alongside the 15–17 balanced 1NT and weak-hand pass rules. After a double of partner's one-level suit opening, responder can redouble with 10+ HCP. After uncontested partner openings, balanced hands respond to 1NT at 8+ HCP; after a major opening, a balanced 6–9 HCP hand without three-card support can respond 1NT. In 2/1 style, 1NT is a forcing response with 6–12 HCP when responder has no direct new-suit or minimum raise; 10–12 HCP hands with three-card major support also start with 1NT for a later limit raise. Passed-hand 2/1 sequences are treated as nonforcing, and opponent interference turns off the forcing 1NT agreement. After an opponent's double or one-level overcall, a balanced 6–9 HCP hand can respond naturally and nonforcibly with 1NT; after a two-level overcall, a balanced 10–12 HCP hand can respond with natural 2NT. A 6–9 HCP responder with three-card major support makes a simple raise after a one-level overcall. Notrump responses require a stopper in the overcalled suit. Opener continues the uncontested auction, and responder can invite with 2NT or show a three-card limit raise at 3M with 11–12 HCP, or rebid a five-card heart suit after 1♠–1NT–2♣ below direct 2/1 strength. After a minor opening, a balanced 6–9 HCP hand without five-card support can respond 1NT. Three-card support raises a major according to responder HCP, and five-card minor support raises at 6–12 HCP. Balanced responses to a minor opening use 2NT with 10–12 HCP or 3NT with 13–15 HCP; after 1m–1NT, a balanced 18–19 HCP opener rebids 2NT and responder accepts with 8+ HCP. New-suit responses require 4+ cards: one-level responses use 6+ HCP where possible; SAYC two-level responses use 10+ HCP, while 2/1 responses after a major opening require 13+ HCP, can be made with three-card major support, and continue the uncontested sequence to game, showing a four-card side major or rebidding a six-card response suit when responder lacks three-card support; opener can show a four-card side major with 12–17 HCP, and responder raises that suit to game with four-card support; after 1♥–2♣, opener can rebid a four-card diamond suit at 2♦ with 12–17 HCP if no four-card spade suit takes priority; after opener rebids balanced 2NT, responder places the contract in 4M with support or 3NT without it. After a one-level new-suit response, opener raises responder's major with four-card support and 12–15 HCP, can make an invitational jump raise with 16–18 HCP, can show a separate four-card higher suit at the one level, can rebid 2♣ after 1♦–1♠ with five diamonds and four clubs, can show a balanced 12–14 HCP hand with 1NT or 18–19 HCP with 2NT, and can rebid an opening suit held six or more cards long. After an uncontested major opening and 1NT response, opener can show a four-card lower side suit with 12–17 HCP, can reverse to 2♠ after 1♥–1NT with 16+ HCP and four spades, rebid a six-card major, or rebid a five-card major with 12–15 HCP in SAYC when no side suit is available, or jump rebid a six-card major with 16–18 HCP when no side suit is available; a balanced 18–19 HCP opener can rebid 2NT. After 1M–1NT–2M, responder can invite with 3M on 10–12 HCP and three-card support, or 2NT on a balanced hand. After opener's uncontested 1NT rebid, a balanced responder invites with 2NT on 10–12 HCP or bids 3NT on 13+ HCP; a responder with a five-card major and 10–12 HCP invites with 3M, or signs off in 2M with up to 9 HCP. Broader competitive auctions and complete convention systems remain planned. PBN parsing, serialization, and diagnostics live in the separate `packages/pbn` package, which depends on core.

The core is TypeScript and designed to stay independent of UI and platform APIs. It is part of the root pnpm workspace and builds to `packages/core/dist`.

## Development

Run `pnpm install` to install the development tools, then use `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` from the repository root.

Run `pnpm --filter @contractplay/client dev` to start the web client.

The client stores the current hand and up to 25 completed hands in browser local storage. PBN deals can be pasted into the import panel. Choose bots in setup to automate the three seats outside your selected seat, then choose Beginner or Intermediate skill. Intermediate bots currently use beginner bidding with separate opening-lead and trick-play tactics. During card play, choose **Show hint** to highlight legal cards, or solver recommendations when a host has configured a solver.

## Project guidance

- [AGENTS.md](AGENTS.md) is the shared agent guidance.
- [CLAUDE.md](CLAUDE.md) and [GEMINI.md](GEMINI.md) carry the same project rules for those tools.
- Update `TODO.md` when work changes milestone status and add completed user-visible changes to `CHANGES.md`.

## License

ContractPlay is licensed under the [MIT License](LICENSE).
