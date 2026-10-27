# Expert Puppet Stayman over 2NT

## Intent

Expert partnerships need to find both four-card and five-card major fits after a balanced 2NT opening. The current natural Stayman response finds a four-card major but does not reliably expose opener's five-card major.

## Behavior

- In Expert, responder uses 3♣ over an uncontested 2NT opening when holding at least three cards in either major, asking for a four- or five-card major.
- Opener shows a five-card major at 3♥/3♠, shows one or more four-card majors with 3♦, and denies any four- or five-card major with 3NT.
- Responder raises a shown five-card major to game with three-card support, or bids 3NT without a fit.
- After 3♦, responder shows a four-card major by bidding the other major at the three level; opener raises with four-card support or bids 3NT. With both four-card majors, responder uses 4♦ to ask opener to choose a fit.
- After 3NT denies opener's major, responder can use a Texas transfer to place game with a six-four major holding; opener accepts and responder passes.
- Beginner, Intermediate, Advanced, 1NT, and competitive auctions retain their current methods.

## Approaches

1. Keep basic Stayman over 2NT. This is simple but can miss a 5–3 fit when opener holds a five-card major.
2. Use Puppet Stayman for Expert over 2NT, preserving the existing basic method for other skill levels. **Selected** because it discovers five-card majors while retaining four-card fit discovery.

## Constraints and non-goals

Keep the logic in `packages/bots`; do not change core auction rules or other notrump methods.

## Source

ACBL, [Puppet Stayman](https://web2.acbl.org/documentlibrary/play/commonly_used_conventions/puppetstayman.pdf), describes the 3♣ inquiry and opener's 3♥/3♠, 3♦, and 3NT responses, responder's fit-showing continuations, and Texas transfers after 3NT denial with a 6–4 major holding.
