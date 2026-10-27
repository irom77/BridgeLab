<p align="center">
  <img src="docs/contractplay-logo.svg" alt="ContractPlay — play, learn, and review contract bridge" width="520" />
</p>

<h1 align="center">ContractPlay</h1>

<p align="center">Play, learn, and review contract bridge.</p>

---

## Status

ContractPlay currently provides a responsive browser table for local deals, configurable bots, PBN import, autosaved play, take-back, hand review, and card-play hints. A host can supply a solver for recommendations; without one, hints show legal cards.

Native clients, online multiplayer, and complete SAYC and 2/1 agreements remain planned. See the [roadmap](TODO.md) and [change history](CHANGES.md).

## Project structure

```text
apps/client/          React and Vite browser client
packages/core/        Platform-neutral cards, rules, and game state
packages/pbn/         PBN parser, serializer, and diagnostics
packages/persistence/ Versioned local game storage
packages/bots/        Bidding and card-play strategies
docs/superpowers/     Feature plans and specifications
```

The core package owns legal actions and immutable game transitions. PBN, persistence, bots, and the client build on its shared types and APIs.

## Bots

Choose Beginner, Intermediate, Advanced, or Expert play, and configure SAYC or 2/1 bidding. The beginner bot covers opening bids and common uncontested and competitive auctions. Intermediate adds natural overcalls, weak three-level openings, major game raises and qualified 3NT placement over them, takeout doubles, and card-play tactics; Advanced adds a third-hand honor play; Expert adds selected conventions and slam tools. Convention coverage is still limited; see [TODO.md](TODO.md) for exact scope.

Card-play hints highlight all legal cards when no solver is configured. If a host supplies a solver, the client shows its legal recommendations without playing a card.

## Development

Requires Node.js 20 or later and pnpm.

```sh
pnpm install
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

Start the browser client with:

```sh
pnpm --filter @contractplay/client dev
```

The browser client stores the current hand and up to 25 completed hands in local storage. PBN deals can be pasted into the import panel.

## Project guidance

- [AGENTS.md](AGENTS.md) contains shared project instructions.
- [CLAUDE.md](CLAUDE.md) and [GEMINI.md](GEMINI.md) mirror those instructions.
- Record roadmap changes in `TODO.md` and meaningful user-facing changes in `CHANGES.md`.

## License

MIT. See [LICENSE](LICENSE).
