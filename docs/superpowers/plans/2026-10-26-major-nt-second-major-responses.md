# Second-major responses after a major opening and 1NT

## Scope

Complete the natural second-major continuation symmetrically after opener rebids a minor. After 1♠–1NT–2♣, responder can show five hearts below the direct 2/1 response strength. After 1♥–1NT–2♣ or 2♦, responder can show five spades below the direct two-level response strength. SAYC uses its 10-HCP direct two-level response threshold; 2/1 uses 13 HCP.

## Implementation

Extend the existing second-major rebid condition to recognize the unbid major after either major opening. The responder continues to use the existing balanced invitation and support priorities.

## Verification

- Cover the 1♥ opening continuation after both 2♣ and 2♦ rebids in SAYC and 2/1.
- Confirm the existing 1♠–1NT–2♣–2♥ behavior remains intact.
- Run the focused bot tests and the root workspace test, typecheck, lint, and whitespace checks.
