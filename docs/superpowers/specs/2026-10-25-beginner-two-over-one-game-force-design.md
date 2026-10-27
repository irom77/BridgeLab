# Beginner 2/1 Game Force Design

## Intent

Make the beginner bot's 2/1 style observably different from SAYC for uncontested major-suit openings. A 2/1 response in a lower-ranking suit should start a game-forcing auction only with 13+ HCP, and the bot should continue that sequence to game.

## Scope

- Keep the existing SAYC 10+ HCP two-level new-suit response behavior.
- In 2/1, require 13+ HCP for a lower-suit two-level response to partner's 1♥ or 1♠ opening.
- Recognize the resulting uncontested sequence and continue it: opener rebids their major at the two level; responder bids game, choosing 4M with at least three-card support and otherwise 3NT.
- Add focused bot tests and document the limits of this beginner implementation.

## Approaches

- Change only the response threshold: small change, but the 2/1 sequence could then be passed and would not function as a game force.
- Implement the narrow sequence through game: a complete observable behavior with limited continuation logic. This is the chosen approach.
- Build a general auction forcing-state engine: supports broader conventions, but expands this slice into the unfinished full bidding-system project.

## Constraints and non-goals

Keep this logic in `packages/bots`, preserving the platform-neutral core. This does not implement full SAYC/2/1 agreements, 2/1 auctions after minor openings, slam bidding, interference, or expert hand evaluation. The 13 HCP threshold and simple game destination are beginner-level approximations.
