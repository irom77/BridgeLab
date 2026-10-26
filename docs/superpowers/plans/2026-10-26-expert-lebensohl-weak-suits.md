# Expert Lebensohl Weak Suit Signoffs

## Goal

Give Expert responders a way to sign off in a weak long suit below the opponent's natural two-level overcall of partner's 1NT opening.

## Agreement

After a natural 2♦, 2♥, or 2♠ overcall:

- Responder with 0–7 HCP and at least five cards in a lower-ranking suit bids artificial 2NT.
- Opener completes the relay with 3♣, regardless of opener's hand.
- Responder passes with weak clubs or shows a weak lower-ranking suit at the three level.

This is a deliberately limited Expert Lebensohl treatment. It does not implement invitational, game-forcing, stopper, or Stayman continuations. The 2♣ overcall is excluded because it may be conventional. ACBL Unit 390 describes 2NT as a relay to 3♣, with a weak natural suit below the overcaller's suit shown after the relay: [Lebensohl](https://www.acblunit390.org/Simon/leb.htm).

## Verification

`ExpertBot` tests cover the weak responder's 2NT relay, opener's forced 3♣ response, and a weak diamond rebid after the relay. The broader workspace suite is run with `pnpm test`.
