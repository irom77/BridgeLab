# Beginner Minor-Opening Responses

## Intent

Extend the beginner bot's limited response to partner's uncontested 1♣/1♦ opening with invitational minor raises and balanced notrump responses.

## Goals and limits

- Keep existing one- and two-level new-suit responses ahead of these calls.
- With five-card minor support and 6–9 HCP, raise to 2m; with five-card support and 10–12 HCP, raise to 3m.
- Without a five-card minor raise, respond 2NT with a balanced 10–12 HCP hand and 3NT with a balanced 13–15 HCP hand.
- Pass outside the defined ranges.
- Keep SAYC and 2/1 behavior identical in this beginner stage. This is not a complete minor response structure.

## Approaches

- Add narrow response bands to the existing uncontested response path: chosen because the current bot already selects responses from the partner's opening and hand.
- Implement separate SAYC and 2/1 auction trees now: deferred until the roadmap's system-specific agreement stage.

## Constraints

Only respond to partner's uncontested minor opening. Keep core action validation authoritative and cover strength, shape, support, and response priority with focused tests.
