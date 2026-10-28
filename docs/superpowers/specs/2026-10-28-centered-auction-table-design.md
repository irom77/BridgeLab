# Centered Auction Table Design

## Intent

Make the active bridge table the focus of ContractPlay, using Trickster Bridge's centered auction and uncluttered table as a reference. Players should see the current auction and their cards without setup and history panels competing for space, and the running app version should be visible at all times.

## Goals

- Center and enlarge the bidding panel throughout the auction, with call controls available in the same panel.
- Increase card size for desktop and touch screens while keeping hands usable at narrow widths.
- Put next-deal settings, PBN import, and recent hands behind a compact table menu while a game is open.
- Display the app package version in the persistent header, sourced from the package manifest.
- Preserve existing auction, play, bot, review, and accessibility behavior.

## Non-goals

- Reimplement SAYC explanations, bid suggestions, scoring, or Trickster's bidding-box interaction model.
- Change game rules, bot decisions, persistence, or PBN behavior.
- Add dependencies or platform-specific UI.

## Design

Use the existing React table and auction components. Give the game layout a phase class: during an auction, place the auction panel in the center of the table surface and make the table a single-column composition; after the auction, keep the auction as a compact companion panel and let the table and cards take the available width. Use responsive card dimensions that are visibly larger on desktop and remain tappable without horizontal overflow on mobile.

When a hand is active, move next-deal settings, PBN import, and recent hands into a native disclosure menu in the header. Keep review exit, deal-again, undo/redo, hints, and hand result actions available in their relevant phases. Read the release version from `apps/client/package.json` so it updates with the app release.

## Constraints

- Keep `packages/core` platform-neutral and do not change game transitions.
- Keep existing accessible labels and keyboard focus behavior.
- Use the workspace's `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm web:verify` scripts for release-readiness checks.
- The browser and Tauri hosts share the same client layout.

## Acceptance

- The bidding panel is visibly centered and prominent for the full auction, for manual and bot play.
- After the auction, the play table and larger cards use the main screen area.
- Setup controls, PBN import, and recent hands remain reachable from the compact menu.
- The persistent header displays the current package version.
- Desktop, tablet, and phone layouts remain readable and usable without horizontal overflow.
- Focused UI tests and all workspace release checks pass.
