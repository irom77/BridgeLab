# Expert Lebensohl Weak Club Signoff

## Goal

Give Expert responders a way to sign off in 3♣ with a weak long-club hand after an opponent makes a natural two-level overcall of partner's 1NT opening.

## Agreement

After a natural 2♦, 2♥, or 2♠ overcall:

- Responder with 0–7 HCP and at least five clubs bids artificial 2NT.
- Opener completes the relay with 3♣, regardless of opener's hand.
- Responder passes with the weak club hand.

This is a deliberately limited Expert Lebensohl treatment. It does not implement the other suit, game-forcing, stopper, or Stayman continuations. The 2♣ overcall is excluded because it may be conventional. ACBL Unit 390 describes 2NT as a relay to 3♣ and passing the relay with a weak club hand: [Lebensohl](https://www.acblunit390.org/Simon/leb.htm).

## Verification

`ExpertBot` tests cover the weak responder's 2NT relay, opener's forced 3♣ response, and responder's 3♣ signoff. The broader workspace suite is run with `pnpm test`.
