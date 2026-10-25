<p align="center">
  <img src="docs/bridgelab-logo.svg" alt="BridgeLab — play, learn, and review contract bridge" width="520" />
</p>

<h1 align="center">BridgeLab</h1>

<p align="center">A cross-platform home for contract bridge: play, learn, and review every hand.</p>

---

## Project status

BridgeLab is at the foundation stage. The repository currently contains an initial TypeScript core package; the app, complete rules engine, PBN round-tripping, bots, and platform builds are planned work.

See [TODO.md](TODO.md) for the current roadmap and [CHANGES.md](CHANGES.md) for completed work.

## Product goals

- Play contract bridge on the web, Windows, macOS, iOS, and iPad.
- Use one platform-neutral TypeScript rules core across clients.
- Support solo play, configurable bots, hints, and hand review with take-back and replay.
- Import and export hands in Portable Bridge Notation (PBN).
- Add live multiplayer with server-validated actions and private hands.

## Repository layout

```text
apps/                 Client and server applications (planned)
packages/core/        Bridge cards, rules, and game state
packages/pbn/         PBN parser and serializer (planned)
packages/bots/        Bot strategies and solver adapters (planned)
packages/protocol/    Shared network message types (planned)
docs/superpowers/
  plans/              Implementation plans
```

## Core package

The initial package lives in `packages/core/src` and currently provides card/deal types, dealing and shuffle helpers, follow-suit validation, trick winner evaluation, an immutable auction/play reducer with undo/redo reconstruction, bot/solver interfaces, and basic PBN metadata utilities.

The core is TypeScript and designed to stay independent of UI and platform APIs. It is part of the root pnpm workspace and builds to `packages/core/dist`.

## Development

Run `pnpm install` to install the development tools, then use `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` from the repository root.

## Project guidance

- [AGENTS.md](AGENTS.md) is the shared agent guidance.
- [CLAUDE.md](CLAUDE.md) and [GEMINI.md](GEMINI.md) carry the same project rules for those tools.
- Update `TODO.md` when work changes milestone status and add completed user-visible changes to `CHANGES.md`.

## License

BridgeLab is licensed under the [MIT License](LICENSE).
