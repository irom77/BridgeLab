# Raise partner's weak three major to game

## Intent

Allow the Intermediate bot to place game in a major after partner opens a weak three-level major preempt when responder has a strong fit and enough high-card strength.

## Scope

- After an uncontested 3♥ or 3♠ opening by partner, raise to 4M with at least four-card support and 15+ HCP.
- Apply equally to SAYC and 2/1. Advanced and Expert inherit the behavior through their existing delegation.
- Otherwise preserve existing responder behavior. Do not add 3NT placement, minor-preempt responses, competitive continuations, or slam exploration in this slice.

## Approaches

- Add the rule to Beginner: simple, but changes the less-skilled bot's behavior.
- Add the rule to Intermediate's bidding wrapper: preserves the skill distinction and matches the existing weak-three opening slice; selected.
- Estimate quick tricks from suit honors and controls: closer to detailed table judgment, but the bot has no agreed quick-trick model and this small slice can use a conservative 15-HCP/four-trump threshold.

## Constraints and rationale

Use existing hand and auction APIs; keep core platform-neutral. ACBL preempt guidance says responder should count quick tricks toward game in the preempt suit and illustrates a 3♥–4♥ auction with four-card support and 15 HCP. The bot uses that example as a conservative proxy, not as a complete quick-trick evaluator. [ACBL response to preempts lesson](https://web2.acbl.org/CommunityLessons/1_16_25.pdf).
