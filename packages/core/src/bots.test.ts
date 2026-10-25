import { describe, expect, it, vi } from "vitest";
import type { PlayContext, Solver } from "./bots.js";
import { requestHint } from "./bots.js";

const context: PlayContext = {
  seat: "north",
  hand: [
    { suit: "hearts", rank: "2" },
    { suit: "spades", rank: "3" },
    { suit: "hearts", rank: "A" }
  ],
  currentTrick: []
};

describe("requestHint", () => {
  it("returns every card when leading", async () => {
    await expect(requestHint(context)).resolves.toEqual(context.hand);
  });

  it("returns only cards that follow suit", async () => {
    await expect(requestHint({ ...context, ledSuit: "hearts" })).resolves.toEqual([
      { suit: "hearts", rank: "2" },
      { suit: "hearts", rank: "A" }
    ]);
  });

  it("returns every card when void in the led suit", async () => {
    await expect(requestHint({ ...context, hand: [{ suit: "spades", rank: "3" }], ledSuit: "hearts" }))
      .resolves.toEqual([{ suit: "spades", rank: "3" }]);
  });

  it("uses solver recommendations when a solver is configured", async () => {
    const recommendations = [{ suit: "spades" as const, rank: "3" as const }];
    const solver: Solver = { recommendPlays: vi.fn().mockResolvedValue(recommendations) };

    await expect(requestHint(context, solver)).resolves.toEqual(recommendations);
    expect(solver.recommendPlays).toHaveBeenCalledWith(context);
  });

  it("filters solver recommendations to cards the player may legally play", async () => {
    const solver: Solver = {
      recommendPlays: vi.fn().mockResolvedValue([
        { suit: "spades", rank: "3" },
        { suit: "hearts", rank: "A" }
      ])
    };

    await expect(requestHint({ ...context, ledSuit: "hearts" }, solver)).resolves.toEqual([
      { suit: "hearts", rank: "A" }
    ]);
  });
});
