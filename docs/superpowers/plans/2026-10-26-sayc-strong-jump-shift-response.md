# SAYC Strong Jump-Shift Response

## Agreement

- In an uncontested auction, an unpassed SAYC responder with 19+ HCP and a five-card new suit makes a natural jump shift.
- A jump to a suit that could have been bid at the one level is at the two level; a suit that normally requires a two-level response is jumped to the three level.
- 2/1 keeps its direct two-level response agreement.

## Scope

This change implements and tests responder bid selection, including the 19-HCP threshold and the SAYC/2/1 distinction. Opener and responder continuations after a jump shift remain future work; this plan does not mark the broader agreements milestone complete.

## Verification

- [x] Focused tests cover the 19-HCP SAYC jump, below-threshold natural response, and unchanged 2/1 response.
- [x] Run workspace test (605 passed), typecheck, lint, and diff checks.
