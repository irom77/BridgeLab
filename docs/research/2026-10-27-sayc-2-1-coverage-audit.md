# SAYC and 2/1 coverage audit

Date: 2026-10-27

## Scope and evidence

This is a gap audit of the current README, roadmap, bot implementation, tests, and plans. It is not a certification that the bot implements every auction in either system. The README correctly says complete SAYC and 2/1 agreements remain planned; `TODO.md` likewise leaves the response-agreement parent and strategy parent unchecked ([README](../../README.md), [TODO.md](../../TODO.md#L99)).

ACBL's official SAYC page provides the SAYC card and full instructions, and its Club Corner lists a Basic 2 over 1 card authored from Larry Cohen's ACBL Bridge Bulletin series ([ACBL convention cards](https://www.acbl.org/club-corner/)). The linked SAYC and Basic 2/1 PDFs returned HTTP 403 during this audit, so detailed comparisons below use accessible ACBL lesson material and direct repository evidence rather than claiming a complete PDF-by-PDF conformance audit.

## Verified coverage

- The roadmap records a substantial, tested baseline: selected SAYC/2/1 1NT continuations; fourth-suit forcing; several natural continuations after direct 2/1 responses; common notrump responses; and selected Expert conventions. These entries describe bounded implemented sequences, not complete systems ([TODO.md, response agreements](../../TODO.md#L99), [TODO.md, Expert strategies](../../TODO.md#L117)).
- ACBL's Two-Over-One lesson defines a direct unpassed-hand two-level new-suit response as game forcing and lists exceptions including opponent intervention, a passed responder, partner's overcall, and a 1NT opening ([ACBL Teacher Manual, Lesson 8](https://cdn.acbl.org/assets/documents/teachers/Teacher-Manuals/More-Commonly-Used-Conventions-Lesson-8.pdf)). The project implements an uncontested, unpassed-hand subset; `twoOverOneAuction` recognizes only a bounded set of later calls and currently stops recognizing the sequence after five contract calls ([player.ts](../../packages/bots/src/player.ts#L121)).
- The ACBL's current Larry Cohen series says 2/1 forcing 1NT over a major opening is used only after a first- or second-seat opening, not when opponents intervene, and shows 6–12 HCP in 2/1 versus 6–10 in Standard ([ACBL Daily Bulletin, Part 2](https://cdn.acbl.org/nabc/2026/01/bulletins/db2.pdf)).

## Actionable gaps

1. **Simple major-raise continuations — implemented in the current branch.** Both styles now invite or place game after 1M–2M, responders accept at 8–9 HCP or pass at 6–7, and SAYC openers accept 1M–3M with 13+ HCP. Focused tests cover both majors and styles; the implementation is linked in the [design](../superpowers/specs/2026-10-27-major-raise-continuations-design.md) and [plan](../superpowers/plans/2026-10-27-major-raise-continuations.md).

2. **Gate 2/1 forcing 1NT by opener seat.** The responder path at `packages/bots/src/player.ts:1646–1647` checks that the responder has not passed, but does not check whether the major was opened by the dealer or second hand. Thus an unpassed fourth-seat responder after a third-seat 1M opening can receive the 2/1 6–12 HCP forcing-1NT treatment, contrary to the ACBL-described agreement. The tests cover a normal unpassed 1M opening and a passed responder, but no third-seat opener (`player.test.ts:2250`, `:1614`). Add a third-seat regression and select a documented non-forcing response treatment.

3. **Replace the remaining broad strategy placeholders with bounded agreements.** The roadmap explicitly leaves “Further detailed continuations and complete SAYC agreements” open at `TODO.md:99`, “Other expert bidding/play strategies” open at `TODO.md:117`, and other weak-three tries open at `TODO.md:145`. Those are real incomplete requirements, not merge-ready checkboxes. The next step after the concrete major-raise plan is to enumerate one convention/auction family at a time and record its force, range, interference, and passed-hand rules before implementation.

## Limits

This audit did not exhaustively enumerate the 4-seat auction tree or every SAYC/2/1 card entry. The two primary ACBL PDFs that would enable a complete system-card comparison were listed by the official ACBL page but blocked with HTTP 403 in this environment. The source-backed seat exception and repository's explicit unfinished plan are sufficient to identify concrete remaining work.
