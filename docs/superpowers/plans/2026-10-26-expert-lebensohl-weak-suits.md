# Expert Lebensohl Continuations

## Goal

Distinguish weak signoffs, invitations, and notrump stopper holdings after an opponent's natural two-level overcall of partner's 1NT opening.

## Agreement

After a natural 2♦, 2♥, or 2♠ overcall:

- Responder with 0–7 HCP and at least five cards in a lower-ranking suit bids artificial 2NT.
- Opener completes the relay with 3♣, regardless of opener's hand.
- Responder passes with weak clubs or shows a weak lower-ranking suit at the three level.
- Responder with 8–9 HCP and at least five cards in a higher-ranking suit uses 2NT, then bids that suit at the three level to invite.
- A balanced responder with 10+ HCP and a stopper in the overcalled suit uses 2NT, then bids 3NT after opener relays to 3♣.
- A balanced responder with 10+ HCP and no stopper bids 3NT directly.

This is a deliberately limited Expert Lebensohl treatment. It does not implement direct game-forcing new-suit bids or the cue-bid Stayman continuations. The 2♣ overcall is excluded because it may be conventional. ACBL Unit 390 describes 2NT as a relay to 3♣, with weak suits below the overcaller's suit shown after the relay, suits above it invitational, and slow/fast 3NT distinguishing stopper holdings: [Lebensohl](https://www.acblunit390.org/Simon/leb.htm).

## Verification

`ExpertBot` tests cover weak and invitational suit sequences, the forced 3♣ relay, and direct/slow 3NT stopper distinctions. The broader workspace suite is run with `pnpm test`.
