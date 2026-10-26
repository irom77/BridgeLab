# Expert Checkback Stayman Inquiry and Replies

## Scope

After an uncontested 1♣/1♦–1♥/1♠–1NT auction, Expert SAYC responder with 10+ HCP and a five-card response major or four-card other major uses artificial 2♣ Checkback Stayman. Opener shows three-card support for responder's major, a four-card other major, or denies both with 2♦. Responder places game or invites in a major only with an eight-card fit; with a shorter fit, responder may place/invite in notrump with a balanced hand and stoppers. Opener accepts a 3M invitation with 14+ HCP. Expert 2/1 uses New Minor Forcing with the unbid minor in the same auctions; see [its implementation plan](2026-10-26-expert-new-minor-forcing.md).

## Implementation

Keep the existing artificial 2♣ inquiry, opener's shape-showing replies, responder's fit/notrump placement, and opener's invitation acceptance in Expert SAYC bidding. Expert 2/1 uses the unbid minor for its inquiry; both conventions remain isolated from beginner/intermediate bots.

## Verification

- Cover responder's inquiry at invitational strength and its natural fallback below that range.
- Cover opener's three-card fit, four-card side major, and denial responses, then responder's game/invitation decisions and notrump placement.
- Cover opener's acceptance and rejection of a 3M invitation.
- Run the bot test, root test, typecheck, lint, and whitespace checks.

The reply structure follows the simple Checkback Stayman treatment described by [ACBL Unit 390](https://www.acblunit390.org/Simon/checkback-stayman.htm).
