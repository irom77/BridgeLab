# SAYC two-level response opener rebids

## Scope

After an uncontested, unpassed-hand SAYC 1♥/1♠ opening and a natural 2♣/2♦ response, opener should not pass the forcing response. Show an available natural four-card side suit with 13–18 HCP (a reverse only with 16–18). If no eligible side suit exists, repeat the five-card major with 12–18 HCP. After a natural side-suit rebid, responder raises that suit with four-card support and 10+ HCP, invites in 2NT with balanced 10–12 HCP and stoppers in unbid suits, shows preference for opener’s major with 10+ HCP and two-card support, or bids 3NT with balanced 13+ HCP and stoppers in unbid suits. After opener repeats the major, responder can invite in 2NT or raise with support; opener accepts the 3M or 2NT invitation with 16+ HCP, bidding 4M or 3NT respectively.

After a reverse to the alternate major (1♥–2♦–2♠ or 1♠–2♦–2♥), responder can invite in that major with four-card support and 10+ HCP; opener accepts with three-card support and 16+ HCP. The implementation leaves 2/1 game-force auctions to their existing continuation logic and ignores competitive auctions.

## Evidence

The ACBL SAYC booklet says 2♣/2♦ responses after a major opening show at least four cards and 10+ points, and that opener's rebids are natural. It describes minimum hands as 13–15 and medium hands as 16–18. Source: https://web2.acbl.org/documentLibrary/play/sayc_book.pdf

## Verification

- Bot tests cover showing a four-card diamond side suit, falling back to the opening major without that suit, raising the shown suit, inviting in notrump after either major opening, preferring opener’s major, raising the repeated major from 10 HCP, raising the alternate major after a reverse, bidding game with 13 HCP, and opener accepting either invitation at 16 HCP.
- Regression tests ensure a 1♥–2♦–2♠ reverse requires 16+ HCP and a weaker opener repeats hearts.
- Verified with `pnpm test` (641 tests), `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
