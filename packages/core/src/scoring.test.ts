import { describe, expect, it } from "vitest";
import { scoreContract } from "./scoring.js";
import type { Contract } from "./game.js";

const contract = (level: Contract["level"], strain: Contract["strain"], declarer: Contract["declarer"] = "north", doubled: Contract["doubled"] = 0): Contract => ({ level, strain, declarer, doubled });

describe("duplicate contract scoring", () => {
  it.each([
    [contract(4, "spades"), 10, "None", 420],
    [contract(4, "spades"), 10, "NS", 620],
    [contract(3, "notrump"), 9, "None", 400],
    [contract(5, "clubs"), 11, "None", 400],
    [contract(2, "diamonds"), 9, "None", 110],
    [contract(4, "notrump"), 11, "None", 460],
    [contract(3, "hearts", "north", 1), 10, "None", 630],
    [contract(3, "hearts", "north", 2), 10, "None", 960],
    [contract(4, "hearts", "east"), 10, "None", -420],
    [contract(4, "spades", "north", 1), 10, "None", 590],
    [contract(4, "spades", "north", 2), 10, "None", 880],
    [contract(6, "notrump"), 12, "None", 990],
    [contract(6, "notrump"), 12, "NS", 1440],
    [contract(7, "hearts"), 13, "Both", 2210],
    [contract(3, "notrump"), 8, "None", -50],
    [contract(3, "notrump"), 7, "NS", -200],
    [contract(3, "notrump", "north", 1), 7, "None", -300],
    [contract(3, "notrump", "north", 1), 7, "NS", -500],
    [contract(3, "notrump", "north", 2), 7, "None", -600]
  ] as const)("scores contract as expected", (bid, tricks, vulnerability, expected) => {
    expect(scoreContract(bid, tricks, vulnerability).score).toBe(expected);
  });

  it("rejects trick counts outside a bridge hand", () => {
    expect(() => scoreContract(contract(1, "clubs"), 14, "None")).toThrow(RangeError);
  });
});
