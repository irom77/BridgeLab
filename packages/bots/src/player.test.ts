import { cardId, createDeck, deal, SEATS, shuffle, type Hand, type Suit } from "@contractplay/core";
import { describe, expect, it } from "vitest";
import { createBot } from "./player.js";

const hand = (...cards: string[]): Hand => cards.map((value) => {
  const [suit, rank] = value.split(":") as ["spades" | "hearts" | "diamonds" | "clubs", "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "T" | "J" | "Q" | "K" | "A"];
  return { suit, rank };
});

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function seededDeal(seed: number) {
  return deal(shuffle(createDeck(), seededRandom(seed)));
}

describe("beginner bot", () => {
  it("opens a balanced hand with 15-17 high card points in notrump", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const openingHand = hand("spades:A", "spades:K", "spades:Q", "spades:J", "hearts:A", "hearts:T", "diamonds:Q", "diamonds:9", "diamonds:8", "clubs:9", "clubs:8", "clubs:7", "clubs:6");
    expect(await bot.chooseBid(openingHand, [], "north")).toBe("1notrump");
  });

  it("opens a five-card major instead of a longer four-card major", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const openingHand = hand("spades:A", "spades:K", "spades:Q", "spades:2", "hearts:A", "hearts:K", "hearts:Q", "hearts:J", "hearts:2", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3");
    expect(await bot.chooseBid(openingHand, [], "north")).toBe("1hearts");
  });

  it("opens a minor when neither major has five cards", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const openingHand = hand("spades:A", "spades:K", "spades:2", "spades:3", "hearts:Q", "hearts:J", "hearts:2", "hearts:3", "diamonds:A", "diamonds:K", "diamonds:Q", "diamonds:2", "clubs:2");
    expect(await bot.chooseBid(openingHand, [], "north")).toBe("1diamonds");
  });

  it("prefers diamonds when the minors are tied and no major has five cards", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const openingHand = hand("spades:A", "spades:K", "spades:2", "spades:3", "hearts:Q", "hearts:J", "hearts:2", "hearts:3", "diamonds:A", "diamonds:K", "diamonds:2", "clubs:Q", "clubs:2");
    expect(await bot.chooseBid(openingHand, [], "north")).toBe("1diamonds");
  });

  it("accepts either configured convention and passes a weak hand", async () => {
    const weak = deal().north.map(() => ({ suit: "clubs" as const, rank: "2" as const }));
    for (const biddingStyle of ["SAYC", "2/1"] as const) {
      const bot = createBot({ skill: "beginner", biddingStyle });
      expect(bot.config.biddingStyle).toBe(biddingStyle);
      expect(await bot.chooseBid(weak, [], "north")).toBe("pass");
    }
  });

  it("passes with fewer than 8 HCP after partner opens 1NT", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const balanced = hand("spades:K", "spades:2", "spades:3", "spades:4", "hearts:Q", "hearts:2", "hearts:3", "diamonds:Q", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4");
    expect(await bot.chooseBid(balanced, [{ seat: "north", bid: "1notrump" }], "south")).toBe("pass");
  });

  it("responds 2NT with 8-9 HCP to partner’s uncontested 1NT", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const balanced = hand("spades:A", "spades:2", "spades:3", "spades:4", "hearts:K", "hearts:2", "hearts:3", "diamonds:Q", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4");
    expect(await bot.chooseBid(balanced, [{ seat: "north", bid: "1notrump" }, { seat: "east", bid: "pass" }], "south")).toBe("2notrump");
  });

  it("responds 3NT with 10 or more HCP to partner’s uncontested 1NT", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const balanced = hand("spades:A", "spades:2", "spades:3", "spades:4", "hearts:K", "hearts:Q", "hearts:2", "diamonds:J", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4");
    expect(await bot.chooseBid(balanced, [{ seat: "north", bid: "1notrump" }], "south")).toBe("3notrump");
  });

  it("passes when 1NT was opened by an opponent", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const strong = hand("spades:A", "spades:K", "spades:Q", "spades:J", "hearts:A", "hearts:K", "hearts:Q", "diamonds:A", "diamonds:K", "diamonds:Q", "clubs:A", "clubs:K", "clubs:Q");
    expect(await bot.chooseBid(strong, [{ seat: "east", bid: "1notrump" }], "south")).toBe("pass");
  });

  it("passes on an unbalanced hand after partner opens 1NT", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const unbalanced = hand("spades:A", "spades:K", "spades:Q", "spades:J", "spades:T", "spades:9", "hearts:A", "hearts:K", "hearts:Q", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3");
    expect(await bot.chooseBid(unbalanced, [{ seat: "north", bid: "1notrump" }], "south")).toBe("pass");
  });

  it("raises partner’s major to the two level with 6-9 HCP and three-card support", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const handWithSupport = hand("hearts:A", "hearts:2", "hearts:3", "spades:K", "spades:2", "spades:3", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3", "clubs:4", "clubs:5");
    expect(await bot.chooseBid(handWithSupport, [{ seat: "north", bid: "1hearts" }], "south")).toBe("2hearts");
  });

  it("makes a limit raise with 10-12 HCP and three-card support", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const handWithSupport = hand("spades:A", "spades:2", "spades:3", "hearts:K", "hearts:Q", "hearts:2", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3", "clubs:4", "diamonds:Q");
    expect(await bot.chooseBid(handWithSupport, [{ seat: "north", bid: "1spades" }], "south")).toBe("1notrump");
  });

  it("bids game with 13 or more HCP and three-card support", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const handWithSupport = hand("hearts:A", "hearts:2", "hearts:3", "spades:A", "spades:K", "spades:2", "diamonds:Q", "diamonds:J", "diamonds:2", "clubs:Q", "clubs:2", "clubs:3", "clubs:4");
    expect(await bot.chooseBid(handWithSupport, [{ seat: "north", bid: "1hearts" }], "south")).toBe("4hearts");
  });

  it("raises an uncontested minor opening with five-card support and 6-9 HCP", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const withClubSupport = hand("clubs:A", "clubs:2", "clubs:3", "clubs:4", "clubs:5", "spades:K", "spades:2", "spades:3", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3", "diamonds:4");
    expect(await bot.chooseBid(withClubSupport, [{ seat: "north", bid: "1clubs" }], "south")).toBe("2clubs");
  });

  it("responds 1NT to a minor opening with a balanced 6-9 HCP hand and no five-card support", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const balanced = hand("spades:K", "spades:2", "spades:3", "hearts:Q", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:J", "clubs:Q", "clubs:2", "clubs:3");
    expect(await bot.chooseBid(balanced, [{ seat: "north", bid: "1clubs" }], "south")).toBe("1notrump");
  });

  it("makes an invitational minor raise with five-card support and 10-12 HCP", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const invitational = hand("clubs:A", "clubs:K", "clubs:Q", "clubs:2", "clubs:3", "spades:J", "spades:2", "spades:3", "hearts:2", "hearts:3", "diamonds:J", "diamonds:2", "diamonds:3");
    expect(await bot.chooseBid(invitational, [{ seat: "north", bid: "1clubs" }], "south")).toBe("3clubs");
  });

  it("responds 2NT with a balanced 10-12 HCP hand after 1 diamond", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const balanced = hand("diamonds:A", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:K", "clubs:2", "clubs:3", "hearts:Q", "hearts:J", "hearts:2", "spades:2", "spades:3", "spades:4");
    expect(await bot.chooseBid(balanced, [{ seat: "north", bid: "1diamonds" }], "south")).toBe("2notrump");
  });

  it("responds 3NT with a balanced 13-15 HCP hand after 1 diamond", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const balanced = hand("diamonds:A", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:Q", "clubs:2", "clubs:3", "hearts:A", "hearts:2", "hearts:3", "spades:K", "spades:2", "spades:3");
    expect(await bot.chooseBid(balanced, [{ seat: "north", bid: "1diamonds" }], "south")).toBe("3notrump");
  });

  it("rebids a six-card opening suit after partner's uncontested one-level response", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("hearts:A", "hearts:K", "hearts:Q", "hearts:J", "hearts:2", "hearts:3", "spades:A", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3", "clubs:4");
    const auction = [
      { seat: "north", bid: "1hearts" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1spades" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2hearts");
  });

  it("passes after a one-level new-suit response without six-card opener support", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const opener = hand("hearts:A", "hearts:K", "hearts:Q", "hearts:2", "spades:A", "spades:K", "spades:2", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3", "clubs:4");
    const auction = [
      { seat: "north", bid: "1hearts" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1spades" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("pass");
  });

  it("shows a four-card higher second suit at the one level", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("clubs:A", "clubs:K", "clubs:Q", "clubs:2", "spades:A", "spades:2", "spades:3", "spades:4", "hearts:2", "hearts:3", "hearts:4", "diamonds:2", "diamonds:3");
    const auction = [
      { seat: "north", bid: "1clubs" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("1spades");
  });

  it("does not repeat responder's suit as opener's second suit", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const opener = hand("clubs:A", "clubs:K", "clubs:Q", "clubs:2", "hearts:A", "hearts:2", "hearts:3", "hearts:4", "spades:2", "spades:3", "spades:4", "diamonds:2", "diamonds:3");
    const auction = [
      { seat: "north", bid: "1clubs" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2hearts");
  });

  it("does not make the second-suit rebid after an opponent interferes", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("clubs:A", "clubs:K", "clubs:Q", "clubs:2", "spades:A", "spades:2", "spades:3", "spades:4", "hearts:2", "hearts:3", "hearts:4", "diamonds:2", "diamonds:3");
    const auction = [
      { seat: "north", bid: "1clubs" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "2diamonds" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("pass");
  });

  it("does not rebid opener's suit after an opponent interferes", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("hearts:A", "hearts:K", "hearts:Q", "hearts:J", "hearts:2", "hearts:3", "spades:A", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3", "clubs:4");
    const auction = [
      { seat: "north", bid: "1hearts" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1spades" as const }, { seat: "west", bid: "2clubs" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("pass");
  });

  it("rebids 1NT with a balanced 12-14 HCP hand after a minor opening response", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("diamonds:A", "diamonds:K", "diamonds:Q", "diamonds:2", "clubs:J", "clubs:2", "clubs:3", "hearts:J", "hearts:2", "hearts:3", "spades:J", "spades:2", "spades:3");
    const auction = [
      { seat: "north", bid: "1diamonds" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("1notrump");
  });

  it("rebids 1NT with a balanced 12-14 HCP hand after a major opening response", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("hearts:A", "hearts:K", "hearts:Q", "hearts:J", "hearts:2", "spades:A", "spades:2", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3", "clubs:4");
    const auction = [
      { seat: "north", bid: "1hearts" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1spades" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("1notrump");
  });

  it("rebids 2NT with a balanced 18-19 HCP hand after a one-level response", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const opener = hand("diamonds:K", "diamonds:2", "diamonds:3", "diamonds:4", "hearts:A", "hearts:K", "hearts:Q", "spades:A", "spades:K", "clubs:2", "clubs:3", "clubs:4", "clubs:5");
    const auction = [
      { seat: "north", bid: "1diamonds" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2notrump");
  });

  it("shows a four-card lower side suit after a major opening and 1NT response", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("spades:A", "spades:K", "spades:Q", "spades:2", "spades:3", "hearts:K", "hearts:Q", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2hearts");
  });

  it("shows a four-card higher side suit as a reverse with 16+ HCP after 1H-1NT", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("hearts:A", "hearts:K", "hearts:Q", "hearts:2", "hearts:3", "spades:A", "spades:K", "spades:2", "spades:3", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1hearts" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2spades");
  });

  it("does not reverse into a higher side suit below 16 HCP after 1H-1NT", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("hearts:A", "hearts:K", "hearts:Q", "hearts:2", "hearts:3", "spades:A", "spades:2", "spades:3", "spades:4", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1hearts" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("pass");
  });

  it("rebids a six-card major after 1NT when no lower side suit is available", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("spades:A", "spades:K", "spades:Q", "spades:J", "spades:T", "spades:9", "hearts:K", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2spades");
  });

  it.each(["Q", "K", "A"] as const)("makes an invitational jump rebid with a six-card major and %s diamond", async (diamondHonor) => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("hearts:A", "hearts:K", "hearts:Q", "hearts:J", "hearts:9", "hearts:8", "spades:A", "spades:2", "spades:3", `diamonds:${diamondHonor}`, "diamonds:2", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1hearts" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("3hearts");
  });

  it("rebids a five-card major with minimum strength after 1M-1NT when no side suit is available", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("hearts:A", "hearts:K", "hearts:2", "hearts:3", "hearts:4", "spades:A", "spades:2", "spades:3", "diamonds:J", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1hearts" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2hearts");
  });

  it("rebids 2NT with a balanced 18-19 HCP hand after a major opening and 1NT response", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("spades:A", "spades:K", "spades:Q", "spades:J", "spades:2", "hearts:A", "hearts:K", "hearts:Q", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2notrump");
  });

  it("rebids 2NT with a balanced 18-19 HCP hand after a minor opening and 1NT response", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("clubs:A", "clubs:K", "clubs:Q", "clubs:2", "spades:A", "spades:K", "spades:2", "hearts:K", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3", "diamonds:4");
    const auction = [
      { seat: "north", bid: "1clubs" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2notrump");
  });

  it("accepts opener's 2NT rebid with 8 HCP after a minor opening", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("spades:A", "spades:2", "spades:3", "spades:4", "hearts:K", "hearts:2", "hearts:3", "diamonds:Q", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4");
    const auction = [
      { seat: "north", bid: "1diamonds" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "2notrump" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("3notrump");
  });

  it("declines game after opener's 2NT rebid with fewer than 8 HCP", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("spades:K", "spades:2", "spades:3", "spades:4", "hearts:Q", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4", "clubs:5");
    const auction = [
      { seat: "north", bid: "1diamonds" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "2notrump" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("pass");
  });

  it("raises responder's major with four-card support and 12-15 HCP", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("clubs:A", "clubs:K", "clubs:Q", "clubs:2", "hearts:A", "hearts:2", "hearts:3", "hearts:4", "spades:2", "spades:3", "spades:4", "diamonds:2", "diamonds:3");
    const auction = [
      { seat: "north", bid: "1clubs" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2hearts");
  });

  it("does not raise responder's major with only three-card support", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const opener = hand("clubs:A", "clubs:K", "clubs:Q", "clubs:2", "hearts:A", "hearts:2", "hearts:3", "spades:2", "spades:3", "spades:4", "diamonds:2", "diamonds:3", "diamonds:4");
    const auction = [
      { seat: "north", bid: "1clubs" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("1notrump");
  });

  it("responds 1NT to a major opening with a balanced 6-9 HCP hand and no support", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const balanced = hand("spades:A", "spades:2", "hearts:K", "hearts:2", "hearts:3", "diamonds:Q", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3", "clubs:4", "clubs:5");
    expect(await bot.chooseBid(balanced, [{ seat: "north", bid: "1spades" }], "south")).toBe("1notrump");
  });

  it("uses an invitational rather than minimum raise with 16 HCP", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("clubs:A", "clubs:K", "clubs:Q", "clubs:2", "hearts:A", "hearts:K", "hearts:2", "hearts:3", "spades:2", "spades:3", "spades:4", "diamonds:2", "diamonds:3");
    const auction = [
      { seat: "north", bid: "1clubs" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("3hearts");
  });

  it("makes an invitational jump raise with four-card major support and 16-18 HCP", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("clubs:A", "clubs:K", "clubs:Q", "clubs:J", "clubs:2", "hearts:A", "hearts:K", "hearts:2", "hearts:3", "spades:2", "spades:3", "diamonds:2", "diamonds:3");
    const auction = [
      { seat: "north", bid: "1clubs" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("3hearts");
  });

  it("keeps a balanced 18-19 HCP hand in the 2NT rebid range despite four-card support", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const opener = hand("hearts:A", "hearts:K", "hearts:2", "hearts:3", "spades:A", "spades:K", "spades:2", "diamonds:A", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4");
    const auction = [
      { seat: "north", bid: "1clubs" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2notrump");
  });

  it("shows four clubs after 1 diamond–1 spade with a five-card diamond suit", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const opener = hand("diamonds:A", "diamonds:K", "diamonds:Q", "diamonds:J", "diamonds:2", "clubs:K", "clubs:Q", "clubs:2", "clubs:3", "hearts:2", "hearts:3", "spades:2", "spades:3");
    const auction = [
      { seat: "north", bid: "1diamonds" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1spades" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2clubs");
  });

  it("does not make the opener raise after an opponent interferes", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const opener = hand("clubs:A", "clubs:K", "clubs:Q", "clubs:2", "hearts:A", "hearts:2", "hearts:3", "hearts:4", "spades:2", "spades:3", "spades:4", "diamonds:2", "diamonds:3");
    const auction = [
      { seat: "north", bid: "1clubs" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "2diamonds" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("pass");
  });

  it("passes on an unbalanced minimum minor opener without a six-card rebid suit", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const opener = hand("diamonds:A", "diamonds:K", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:J", "clubs:2", "clubs:3", "hearts:2", "hearts:3", "spades:2", "spades:3", "spades:4");
    const auction = [
      { seat: "north", bid: "1diamonds" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("pass");
  });

  it("prefers an available one-level new suit over raising a minor", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const withDiamondSupportAndHeartSuit = hand("diamonds:A", "diamonds:2", "diamonds:3", "diamonds:4", "diamonds:5", "hearts:K", "hearts:2", "hearts:3", "hearts:4", "spades:2", "spades:3", "clubs:2", "clubs:3");
    expect(await bot.chooseBid(withDiamondSupportAndHeartSuit, [{ seat: "north", bid: "1diamonds" }], "south")).toBe("1hearts");
  });

  it("does not raise a minor without five-card support or enough points", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const weakSupport = hand("clubs:K", "clubs:2", "clubs:3", "clubs:4", "spades:2", "spades:3", "spades:4", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3", "diamonds:4", "diamonds:5");
    const weakPoints = hand("clubs:2", "clubs:3", "clubs:4", "clubs:5", "clubs:6", "spades:K", "spades:2", "spades:3", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3", "diamonds:4");
    expect(await bot.chooseBid(weakSupport, [{ seat: "north", bid: "1clubs" }], "south")).toBe("pass");
    expect(await bot.chooseBid(weakPoints, [{ seat: "north", bid: "1clubs" }], "south")).toBe("pass");
  });

  it("responds at the two level in a four-card lower suit with at least 10 HCP", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const lowerSuit = hand("clubs:A", "clubs:K", "clubs:2", "clubs:3", "clubs:4", "hearts:A", "hearts:K", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3", "spades:2", "spades:3");
    expect(await bot.chooseBid(lowerSuit, [{ seat: "north", bid: "1spades" }], "south")).toBe("2clubs");
  });

  it("keeps a one-level new-suit response ahead of a longer two-level suit", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const twoSuits = hand("clubs:A", "clubs:K", "clubs:Q", "clubs:2", "clubs:3", "spades:K", "spades:Q", "spades:2", "spades:3", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3");
    expect(await bot.chooseBid(twoSuits, [{ seat: "north", bid: "1hearts" }], "south")).toBe("1spades");
  });

  it("requires four cards and 10 HCP for a two-level new-suit response", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const threeCardSuit = hand("clubs:A", "clubs:K", "clubs:Q", "spades:2", "spades:3", "hearts:2", "hearts:3", "hearts:4", "hearts:5", "diamonds:K", "diamonds:2", "diamonds:3", "diamonds:4");
    const weak = hand("clubs:K", "clubs:Q", "clubs:2", "clubs:3", "spades:2", "spades:3", "spades:4", "hearts:2", "hearts:3", "hearts:4", "diamonds:2", "diamonds:3", "diamonds:4");
    expect(await bot.chooseBid(threeCardSuit, [{ seat: "north", bid: "1spades" }], "south")).toBe("2hearts");
    expect(await bot.chooseBid(weak, [{ seat: "north", bid: "1spades" }], "south")).toBe("pass");
  });

  it("uses forcing 1NT with 12 HCP rather than making a game-forcing 2/1 response", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const twelvePoints = hand("spades:A", "spades:K", "clubs:K", "clubs:2", "clubs:3", "clubs:4", "hearts:2", "hearts:3", "hearts:4", "diamonds:Q", "diamonds:2", "diamonds:3", "diamonds:4");
    expect(await bot.chooseBid(twelvePoints, [{ seat: "north", bid: "1spades" }], "south")).toBe("1notrump");
  });

  it("uses a non-forcing two-level response with 10+ HCP as a passed hand", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const passedResponder = hand("spades:2", "spades:3", "hearts:A", "hearts:J", "hearts:2", "diamonds:K", "diamonds:2", "diamonds:3", "clubs:Q", "clubs:J", "clubs:2", "clubs:3", "clubs:4");
    const auction = [
      { seat: "north", bid: "pass" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1spades" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(passedResponder, auction, "north")).toBe("2clubs");

    const minimumOpener = hand("spades:A", "spades:K", "spades:2", "spades:3", "spades:4", "clubs:K", "clubs:2", "clubs:3", "diamonds:Q", "diamonds:2", "diamonds:3", "hearts:2", "hearts:3");
    expect(await bot.chooseBid(minimumOpener, [...auction, { seat: "north", bid: "2clubs" }, { seat: "east", bid: "pass" }], "south")).toBe("pass");

    const passedAuction = [
      ...auction,
      { seat: "north", bid: "1notrump" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    const minimumBalancedOpener = hand("spades:A", "spades:K", "spades:Q", "spades:2", "spades:3", "clubs:K", "clubs:2", "clubs:3", "diamonds:Q", "diamonds:2", "diamonds:3", "hearts:2", "hearts:3");
    expect(await bot.chooseBid(minimumBalancedOpener, passedAuction, "south")).toBe("pass");
  });

  it("continues an uncontested 2/1 sequence to game", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const thirteenPoints = hand("spades:A", "spades:K", "spades:Q", "spades:J", "clubs:K", "clubs:2", "clubs:3", "clubs:4", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3", "diamonds:4");
    const openerAuction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "2clubs" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    const opener = hand("spades:A", "spades:K", "spades:Q", "spades:2", "hearts:A", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3", "clubs:4");
    expect(await bot.chooseBid(opener, openerAuction, "north")).toBe("2spades");
    const responderAuction = [
      ...openerAuction,
      { seat: "north", bid: "2spades" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(thirteenPoints, responderAuction, "south")).toBe("4spades");
  });

  it("rebids 2NT with a balanced 18-19 HCP opener after a direct 2/1 response", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const opener = hand("spades:A", "spades:K", "spades:Q", "spades:J", "spades:2", "hearts:A", "hearts:K", "diamonds:Q", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4");
    const auction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "2diamonds" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2notrump");
  });

  it("shows a four-card side major after a direct 2/1 response", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const opener = hand("hearts:A", "hearts:K", "hearts:Q", "hearts:2", "hearts:3", "spades:A", "spades:K", "spades:2", "spades:3", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1hearts" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "2clubs" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2spades");
  });

  it("shows four diamonds after 1H-2C in a direct 2/1 game force", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const opener = hand("hearts:A", "hearts:K", "hearts:Q", "hearts:2", "hearts:3", "diamonds:A", "diamonds:K", "diamonds:2", "diamonds:3", "spades:2", "spades:3", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1hearts" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "2clubs" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2diamonds");
  });

  it("raises opener's shown side major to game with four-card support in a 2/1 force", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("spades:A", "spades:K", "spades:Q", "spades:J", "hearts:2", "hearts:3", "clubs:K", "clubs:Q", "clubs:J", "diamonds:A", "diamonds:K", "diamonds:Q", "diamonds:J");
    const auction = [
      { seat: "north", bid: "1hearts" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "2clubs" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "2spades" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("4spades");
  });

  it("starts a 2/1 game force with a four-card suit even with three-card major support", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("spades:A", "spades:K", "spades:2", "hearts:A", "hearts:2", "diamonds:K", "diamonds:Q", "diamonds:2", "diamonds:3", "clubs:K", "clubs:2", "clubs:3", "clubs:4");
    expect(await bot.chooseBid(responder, [{ seat: "north", bid: "1spades" }], "south")).toBe("2diamonds");
  });

  it("continues a 2/1 game force in notrump without major support", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("spades:A", "spades:K", "clubs:K", "clubs:2", "clubs:3", "clubs:4", "hearts:A", "hearts:2", "diamonds:2", "diamonds:3", "diamonds:4", "diamonds:5", "diamonds:6");
    const auction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "2clubs" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "2spades" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("3notrump");
  });

  it("rebids a six-card 2/1 suit after opener repeats the major", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("spades:A", "spades:2", "hearts:2", "hearts:3", "diamonds:A", "diamonds:K", "diamonds:Q", "diamonds:J", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4");
    const auction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "2diamonds" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "2spades" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("3diamonds");
  });

  it("shows a four-card side major while continuing a 2/1 game force", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("hearts:A", "hearts:K", "hearts:Q", "hearts:2", "spades:2", "spades:3", "diamonds:A", "diamonds:K", "diamonds:Q", "clubs:2", "clubs:3", "clubs:4", "clubs:5");
    const auction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "2diamonds" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "2spades" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("3hearts");
  });

  it("reaches game in opener's major after a balanced 2NT rebid with three-card support", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("spades:A", "spades:K", "spades:2", "hearts:A", "hearts:2", "diamonds:K", "diamonds:Q", "diamonds:2", "diamonds:3", "clubs:K", "clubs:2", "clubs:3", "clubs:4");
    const auction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "2diamonds" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "2notrump" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("4spades");
  });

  it("reaches 3NT after a balanced 2NT rebid without major support", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("spades:A", "spades:K", "hearts:Q", "hearts:J", "hearts:2", "diamonds:K", "diamonds:Q", "diamonds:2", "clubs:K", "clubs:Q", "clubs:2", "clubs:3", "clubs:4");
    const auction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "2diamonds" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "2notrump" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("3notrump");
  });

  it("uses a forcing 1NT response with 6-12 HCP in 2/1 when no other response fits", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("spades:2", "spades:3", "hearts:A", "hearts:J", "hearts:2", "diamonds:K", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:Q", "clubs:J", "clubs:2", "clubs:3");
    expect(await bot.chooseBid(responder, [{ seat: "north", bid: "1spades" }], "south")).toBe("1notrump");
  });

  it("responds naturally with 1NT after an opponent's double in 2/1", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const balanced = hand("spades:K", "spades:2", "spades:3", "spades:4", "hearts:A", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3", "clubs:4");
    const auction = [{ seat: "north", bid: "1spades" as const }, { seat: "east", bid: "double" as const }] as const;
    expect(await bot.chooseBid(balanced, auction, "south")).toBe("1notrump");
  });

  it("redoubles an opponent's double of partner's one-level opening with 10+ HCP", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const strong = hand("spades:A", "spades:K", "spades:Q", "spades:2", "hearts:A", "hearts:K", "hearts:2", "diamonds:A", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4");
    const auction = [{ seat: "north", bid: "1spades" as const }, { seat: "east", bid: "double" as const }] as const;
    expect(await bot.chooseBid(strong, auction, "south")).toBe("redouble");
  });

  it("responds naturally with a stopper after a one-level overcall in 2/1", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const balanced = hand("spades:K", "spades:2", "hearts:A", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3", "diamonds:4", "diamonds:5", "clubs:2", "clubs:3", "clubs:4", "clubs:5");
    const auction = [{ seat: "north", bid: "1spades" as const }, { seat: "east", bid: "1hearts" as const }] as const;
    expect(await bot.chooseBid(balanced, auction, "south")).toBe("1notrump");
  });

  it("makes a simple major raise after a one-level overcall with three-card support", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("spades:A", "spades:2", "spades:3", "hearts:K", "hearts:2", "hearts:3", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3", "clubs:4", "clubs:5");
    const auction = [{ seat: "north", bid: "1spades" as const }, { seat: "east", bid: "1hearts" as const }] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("2spades");
  });

  it("does not respond 1NT without a stopper in the overcalled suit", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const balanced = hand("spades:K", "spades:2", "hearts:2", "hearts:3", "hearts:4", "diamonds:A", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:Q", "clubs:2", "clubs:3", "clubs:4");
    const auction = [{ seat: "north", bid: "1spades" as const }, { seat: "east", bid: "1hearts" as const }] as const;
    expect(await bot.chooseBid(balanced, auction, "south")).toBe("pass");
  });

  it("responds naturally with 2NT after a two-level overcall with balanced 10-12 HCP and a stopper", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const balanced = hand("spades:K", "spades:2", "spades:3", "spades:4", "hearts:A", "hearts:2", "hearts:3", "diamonds:K", "diamonds:2", "diamonds:3", "clubs:Q", "clubs:2", "clubs:3");
    const auction = [{ seat: "north", bid: "1spades" as const }, { seat: "east", bid: "2clubs" as const }] as const;
    expect(await bot.chooseBid(balanced, auction, "south")).toBe("2notrump");
  });

  it("does not respond 2NT without a stopper after a two-level overcall", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const balanced = hand("spades:K", "spades:2", "spades:3", "spades:4", "hearts:A", "hearts:2", "hearts:3", "diamonds:K", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4");
    const auction = [{ seat: "north", bid: "1spades" as const }, { seat: "east", bid: "2clubs" as const }] as const;
    expect(await bot.chooseBid(balanced, auction, "south")).toBe("pass");
  });

  it("makes an artificial three-card minor rebid instead of passing a minimum after 2/1 forcing 1NT", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const opener = hand("spades:A", "spades:K", "spades:Q", "spades:2", "spades:3", "clubs:K", "clubs:2", "clubs:3", "diamonds:Q", "diamonds:2", "diamonds:3", "hearts:2", "hearts:3");
    const auction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(opener, auction, "north")).toBe("2clubs");
  });

  it("invites with 2NT after a 2/1 forcing 1NT and natural two-level rebid", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("spades:2", "spades:3", "hearts:A", "hearts:J", "hearts:2", "diamonds:K", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:Q", "clubs:J", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "2clubs" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("2notrump");
  });

  it("shows a three-card limit raise after using forcing 1NT in 2/1", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("spades:Q", "spades:J", "spades:2", "hearts:K", "hearts:2", "hearts:3", "hearts:4", "diamonds:A", "diamonds:2", "diamonds:3", "clubs:Q", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "2clubs" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("3spades");
  });

  it("rebids a five-card second major below the direct 2/1 response strength", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("spades:2", "spades:3", "hearts:A", "hearts:J", "hearts:2", "hearts:3", "hearts:4", "diamonds:K", "diamonds:2", "diamonds:3", "clubs:Q", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "2clubs" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("2hearts");
  });

  it("bids a four-card higher suit with at least 6 HCP after partner opens one club", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const handWithSuit = hand("hearts:A", "hearts:2", "hearts:3", "hearts:4", "spades:K", "spades:2", "spades:3", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3", "clubs:4");
    expect(await bot.chooseBid(handWithSuit, [{ seat: "north", bid: "1clubs" }], "south")).toBe("1hearts");
  });

  it("chooses the longest new suit and prefers the higher suit on a tie", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const handWithTwoSuits = hand("hearts:A", "hearts:2", "hearts:3", "hearts:4", "spades:K", "spades:2", "spades:3", "spades:4", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4");
    expect(await bot.chooseBid(handWithTwoSuits, [{ seat: "north", bid: "1clubs" }], "south")).toBe("1spades");
  });

  it("does not respond at the one level in a lower suit below partner’s opening", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const lowerSuitOnly = hand("diamonds:A", "diamonds:2", "diamonds:3", "diamonds:4", "hearts:K", "hearts:2", "hearts:3", "spades:2", "spades:3", "clubs:2", "clubs:3", "clubs:4", "clubs:5");
    expect(await bot.chooseBid(lowerSuitOnly, [{ seat: "north", bid: "1spades" }], "south")).toBe("1notrump");
  });

  it("uses the balanced 1NT response without a four-card higher suit", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const shortSuit = hand("hearts:A", "hearts:K", "hearts:Q", "spades:2", "spades:3", "spades:4", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3", "clubs:4", "clubs:5");
    expect(await bot.chooseBid(shortSuit, [{ seat: "north", bid: "1clubs" }], "south")).toBe("1notrump");
  });

  it("passes with fewer than 6 HCP even when a four-card new suit is available", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const weakHand = hand("hearts:K", "hearts:2", "hearts:3", "hearts:4", "spades:2", "spades:3", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3", "clubs:4", "clubs:5");
    expect(await bot.chooseBid(weakHand, [{ seat: "north", bid: "1clubs" }], "south")).toBe("pass");
  });

  it("bids a new suit without three-card support for partner’s major", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const noSupport = hand("spades:A", "spades:K", "spades:Q", "hearts:2", "hearts:3", "diamonds:A", "diamonds:K", "diamonds:Q", "diamonds:J", "clubs:A", "clubs:K", "clubs:Q", "clubs:J");
    expect(await bot.chooseBid(noSupport, [{ seat: "north", bid: "1hearts" }], "south")).toBe("2diamonds");
  });

  it("passes if an opponent has bid after partner’s 1NT", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const balanced = hand("spades:A", "spades:2", "spades:3", "spades:4", "hearts:K", "hearts:2", "hearts:3", "diamonds:Q", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4");
    expect(await bot.chooseBid(balanced, [{ seat: "north", bid: "1notrump" }, { seat: "east", bid: "2clubs" }], "south")).toBe("pass");
  });

  it("invites game with a balanced 10-12 HCP hand after opener rebids 1NT", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const balanced = hand("spades:A", "spades:2", "spades:3", "spades:4", "hearts:K", "hearts:J", "hearts:3", "diamonds:Q", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4");
    const auction = [
      { seat: "north", bid: "1clubs" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "1notrump" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(balanced, auction, "south")).toBe("2notrump");
  });

  it("invites game in its five-card major with 10-12 HCP after opener rebids 1NT", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const fiveCardHeartInvite = hand("hearts:A", "hearts:K", "hearts:J", "hearts:2", "hearts:3", "spades:Q", "spades:2", "spades:3", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1clubs" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "1notrump" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(fiveCardHeartInvite, auction, "south")).toBe("3hearts");
  });

  it("makes a three-card major limit raise after opener repeats the major over 1NT", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const responder = hand("hearts:2", "hearts:3", "hearts:4", "spades:A", "spades:2", "spades:3", "diamonds:K", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:Q", "clubs:J", "clubs:2");
    const auction = [
      { seat: "north", bid: "1hearts" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "2hearts" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("3hearts");
  });

  it("invites in notrump with a balanced 10-12 HCP hand after opener repeats the major", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const responder = hand("spades:2", "spades:3", "hearts:A", "hearts:2", "hearts:3", "hearts:4", "diamonds:K", "diamonds:2", "diamonds:3", "clubs:Q", "clubs:J", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1spades" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "2spades" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("2notrump");
  });

  it("places game with a balanced 13+ HCP hand after opener rebids 1NT", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const balanced = hand("spades:A", "spades:K", "spades:2", "spades:3", "hearts:Q", "hearts:J", "hearts:2", "diamonds:A", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4");
    const auction = [
      { seat: "north", bid: "1diamonds" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "1notrump" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(balanced, auction, "south")).toBe("3notrump");
  });

  it("raises opener's balanced 2NT rebid to game with 6+ HCP", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const responder = hand("spades:A", "spades:2", "spades:3", "hearts:K", "hearts:2", "hearts:3", "diamonds:Q", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3", "clubs:4", "clubs:5");
    const auction = [
      { seat: "north", bid: "1hearts" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1notrump" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "2notrump" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(responder, auction, "south")).toBe("3notrump");
  });

  it("rebids a five-card major with a minimum hand after opener's 1NT rebid", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const handWithFiveHearts = hand("hearts:A", "hearts:K", "hearts:2", "hearts:3", "hearts:4", "spades:2", "spades:3", "spades:4", "diamonds:2", "diamonds:3", "diamonds:4", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1clubs" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "1notrump" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(handWithFiveHearts, auction, "south")).toBe("2hearts");
  });

  it("does not make notrump continuations with an unbalanced hand", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const unbalanced = hand("spades:A", "spades:K", "spades:Q", "spades:J", "spades:T", "spades:9", "hearts:A", "hearts:K", "hearts:Q", "diamonds:2", "diamonds:3", "clubs:2", "clubs:3");
    const auction = [
      { seat: "north", bid: "1clubs" as const }, { seat: "east", bid: "pass" as const },
      { seat: "south", bid: "1hearts" as const }, { seat: "west", bid: "pass" as const },
      { seat: "north", bid: "1notrump" as const }, { seat: "east", bid: "pass" as const }
    ] as const;
    expect(await bot.chooseBid(unbalanced, auction, "south")).toBe("pass");
  });

  it("selects only a card in hand and follows suit when able", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "SAYC" });
    const cards = hand("spades:2", "hearts:A", "hearts:3");
    const choice = await bot.chooseCard({ seat: "east", hand: cards, currentTrick: [{ seat: "north", card: { suit: "hearts", rank: "2" } }], ledSuit: "hearts" });
    expect(cards).toContainEqual(choice);
    expect(choice.suit).toBe("hearts");
  });

  it("can discard when void in the led suit", async () => {
    const bot = createBot({ skill: "beginner", biddingStyle: "2/1" });
    const cards = hand("spades:2", "clubs:A");
    const choice = await bot.chooseCard({ seat: "east", hand: cards, currentTrick: [{ seat: "north", card: { suit: "hearts", rank: "2" } }], ledSuit: "hearts" });
    expect(cards).toContainEqual(choice);
  });

  it("lets an intermediate bot win with its cheapest card when partner is not winning", async () => {
    const bot = createBot({ skill: "intermediate", biddingStyle: "SAYC" });
    const cards = hand("hearts:3", "hearts:Q", "hearts:A");
    const choice = await bot.chooseCard({
      seat: "south",
      hand: cards,
      currentTrick: [
        { seat: "north", card: { suit: "hearts", rank: "2" } },
        { seat: "east", card: { suit: "hearts", rank: "9" } }
      ],
      ledSuit: "hearts"
    });
    expect(choice).toEqual({ suit: "hearts", rank: "Q" });
  });

  it("conserves high cards when partner is already winning", async () => {
    const bot = createBot({ skill: "intermediate", biddingStyle: "2/1" });
    const cards = hand("hearts:3", "hearts:A");
    const choice = await bot.chooseCard({
      seat: "south",
      hand: cards,
      currentTrick: [
        { seat: "north", card: { suit: "hearts", rank: "K" } },
        { seat: "east", card: { suit: "hearts", rank: "2" } }
      ],
      ledSuit: "hearts"
    });
    expect(choice).toEqual({ suit: "hearts", rank: "3" });
  });

  it("leads the top honor from a touching sequence", async () => {
    const bot = createBot({ skill: "intermediate", biddingStyle: "SAYC" });
    const cards = hand("hearts:K", "hearts:Q", "hearts:3", "clubs:2");
    const choice = await bot.chooseCard({ seat: "south", hand: cards, currentTrick: [] });
    expect(choice).toEqual({ suit: "hearts", rank: "K" });
  });

  it("leads fourth-highest from the longest suit when no honor sequence applies", async () => {
    const bot = createBot({ skill: "intermediate", biddingStyle: "SAYC" });
    const cards = hand("hearts:A", "hearts:8", "hearts:6", "hearts:4", "hearts:2", "spades:K", "spades:10", "spades:3", "clubs:5", "diamonds:7", "diamonds:3", "clubs:2", "diamonds:2");
    const choice = await bot.chooseCard({ seat: "south", hand: cards, currentTrick: [] });
    expect(choice).toEqual({ suit: "hearts", rank: "4" });
  });
});

describe("seeded bot behavior", () => {
  const suits: readonly Suit[] = ["spades", "hearts", "diamonds", "clubs"];
  const seeds = [1, 7, 42, 2026, 65537];

  it("creates the same deal from the same seed", () => {
    for (const seed of seeds) {
      expect(seededDeal(seed)).toEqual(seededDeal(seed));
    }
  });

  it.each(["beginner", "intermediate"] as const)("keeps %s bidding and card choices stable, private, and legal", async (skill) => {
    for (const seed of seeds) {
      const board = seededDeal(seed);
      for (const seat of SEATS) {
        const bot = createBot({ skill, biddingStyle: seed % 2 === 0 ? "SAYC" : "2/1" });
        const openingBid = await bot.chooseBid(board[seat], [], seat);
        expect(await bot.chooseBid(board[seat], [], seat)).toBe(openingBid);

        const previousSeat = SEATS[(SEATS.indexOf(seat) + SEATS.length - 1) % SEATS.length]!;
        for (const suit of suits) {
          const lead = board[previousSeat].find((card) => card.suit === suit);
          if (!lead) continue;

          const context = {
            seat,
            hand: board[seat],
            currentTrick: [{ seat: previousSeat, card: lead }],
            ledSuit: suit
          } as const;
          expect(Object.keys(context).sort()).toEqual(["currentTrick", "hand", "ledSuit", "seat"]);

          const choice = await bot.chooseCard(context);
          expect(board[seat].map(cardId)).toContain(cardId(choice));
          if (board[seat].some((card) => card.suit === suit)) expect(choice.suit).toBe(suit);
          expect(await bot.chooseCard(context)).toEqual(choice);
        }
      }
    }
  });
});
