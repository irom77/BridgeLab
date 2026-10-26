# Expert Blackwood King Ask

## Intent

Expert slam auctions already use 4NT to count aces but stop with a six-level contract once all four aces are known. Add the standard 5NT king ask as a continuation when the partnership has confirmed all four aces.

## Behavior

- Apply only after an Expert Blackwood 4NT ace ask in an agreed major suit, including 2/1 major-fit, Jacoby shortness, and accepted-splinter auctions.
- After an ace response proves that all four aces are held, asker bids 5NT to ask for kings.
- Answerer shows 0/4 kings with 6♣, one with 6♦, two with 6♥, three with 6♠, or four with 6NT.
- Asker bids 7M only when all four kings are known; otherwise place 6M.
- Do not alter Gerber, quantitative 4NT, or the Jacoby Grand Slam Force.

## Approaches

1. Keep placing 6M after confirming three or more aces. This avoids another auction round but leaves no route to count kings.
2. Ask for kings with 5NT only after all four aces are known, then place the major slam. **Selected** because it follows standard Blackwood and preserves the existing 5NT Grand Slam Force in its separate Jacoby sequence.

## Constraints

Keep the agreement in `packages/bots`; require an agreed major and an uncontested auction. Use simple Blackwood king responses, not Roman Key Card Blackwood.

## Source

ACBL, [More Commonly Used Conventions: Blackwood](https://cdn.acbl.org/assets/documents/teachers/Teacher-Manuals/More-Commonly-Used-Conventions-Lesson-5.pdf), specifies 5NT as the king ask after all aces are held and gives the 6♣–6NT king-count responses.
