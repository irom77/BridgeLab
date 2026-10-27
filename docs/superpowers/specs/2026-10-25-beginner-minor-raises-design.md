# Beginner Minor Raises

## Intent

Add a basic uncontested response to partner's one-level minor opening so beginner bots can show support without bidding a new suit.

## Goals and limits

- Respond only when partner's one-level minor opening is the only non-pass call.
- Keep the existing higher one-level new-suit response ahead of a minor raise.
- With at least five-card support and 6–9 HCP, raise 1♣/1♦ to 2♣/2♦.
- Pass outside that range or without five-card support.
- Keep SAYC and 2/1 behavior identical; complete systems and continuations remain planned.

## Approaches

- Add a narrow minor raise rule to the existing response decision: chosen because the current bot already handles partner identity and uncontested auction checks.
- Build a general auction/convention engine: deferred because distinct system agreements are a later roadmap stage.

## Constraints

Keep bidding logic in `packages/bots`, use only the bot's private hand and public auction, and leave action legality to core validation.
