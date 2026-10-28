# 2/1 game force: show major fit after opener raises responder's minor

## Intent

Complete an uncontested 2/1 game-forcing continuation when responder has three-card support for opener's major after opener raises responder's minor. A stronger responder should show the fit below game; a minimum game-forcing responder should use fast arrival and place game.

## Scope

- In 2/1 only, recognize an unpassed, uncontested 1M–2m–3m auction.
- With three-card support for opener's major, responder bids 3M with 15+ HCP to show the fit while preserving room below game; with 13–14 HCP, responder bids 4M by fast arrival.
- After responder's 3M, opener completes the agreed major game at 4M, including with a minimum opening hand.
- Cover both opening majors and both minor responses.
- Do not alter SAYC, passed-hand responses, auctions with interference before the direct 2/1 response, or slam exploration beyond completing game.

## Approaches

- Always jump to 4M with three-card support. This reaches game but loses the useful distinction between a minimum 2/1 hand and a hand with room to explore; it is already the current behavior.
- Use fast arrival: 13–14 HCP bids 4M, while 15+ HCP rebids 3M and opener must continue to game. This follows the ACBL 2/1 lesson's 3M support-showing sequence and fast-arrival example, while keeping the implementation to one fit route.
- Add a complete control-cue-bidding and slam auction after 3M. That requires additional control agreements and responder continuations, beyond this next game-force slice.

The selected approach is fast arrival, with 15 HCP as this bot's boundary between minimum and slam-interested game-forcing hands. The ACBL lesson demonstrates the 1♥–2♦–3♦–3♥ sequence and opener's 4♥ continuation with a minimum; the numeric boundary is a project policy for deterministic bot behavior, not an ACBL-mandated threshold.

## Constraints

- Keep the behavior in `packages/bots`; no core or UI changes.
- Preserve game-forcing behavior only for unpassed, uncontested 2/1 auctions.
- Ensure every responder slow raise is followed by opener's game completion.
- Source: [ACBL Teacher Manual, Lesson 8: Two-Over-One](https://cdn.acbl.org/assets/documents/teachers/Teacher-Manuals/More-Commonly-Used-Conventions-Lesson-8.pdf), pp. 399–401 (3M support rebid and minimum opener game continuation) and p. 405 (fast arrival).
