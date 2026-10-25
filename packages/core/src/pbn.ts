import { SEATS, type Deal, type Seat } from "./cards.js";
import type { GameAction } from "./history.js";

export type Vulnerability = "None" | "NS" | "EW" | "Both";
export type PbnHand = Readonly<{ dealer: Seat; vulnerability: Vulnerability; actions: readonly GameAction[]; deal?: Deal }>;

const seatLetter: Record<Seat, string> = { north: "N", east: "E", south: "S", west: "W" };
function dealHand(cards: Deal[Seat]): string {
  const rankOrder = "23456789TJQKA";
  return (["spades", "hearts", "diamonds", "clubs"] as const).map((suit) =>
    cards.filter((card) => card.suit === suit).sort((a, b) => rankOrder.indexOf(b.rank) - rankOrder.indexOf(a.rank)).map((card) => card.rank).join("")
  ).join(".");
}

/** Emits a compact single-board PBN record with standard tag and section names. */
export function exportPbn(hand: PbnHand): string {
  const tags = [`[Dealer "${seatLetter[hand.dealer]}"]`, `[Vulnerable "${hand.vulnerability}"]`];
  if (hand.deal) {
    const start = SEATS.indexOf(hand.dealer);
    const clockwise = [...SEATS.slice(start), ...SEATS.slice(0, start)];
    tags.push(`[Deal "${seatLetter[hand.dealer]}:${clockwise.map((seat) => dealHand(hand.deal![seat])).join(" ")}"]`);
  }
  const bids = hand.actions.filter((a) => a.type === "bid");
  const plays = hand.actions.filter((a) => a.type === "play");
  const sections: string[] = [...tags];
  if (bids.length) sections.push(`[Auction "${seatLetter[bids[0]!.seat]}"]\n${bids.map((a) => a.bid === "pass" ? "Pass" : a.bid === "double" ? "X" : a.bid === "redouble" ? "XX" : a.bid.replace("notrump", "NT").replace("clubs", "C").replace("diamonds", "D").replace("hearts", "H").replace("spades", "S")).join(" ")}`);
  if (plays.length) sections.push(`[Play "${seatLetter[plays[0]!.seat]}"]\n${plays.map((a) => `${a.card.rank}${({ spades: "S", hearts: "H", diamonds: "D", clubs: "C" } as const)[a.card.suit]}`).join(" ")}`);
  return sections.join("\n");
}

/** Minimal tag extractor for reloading metadata. Full PBN grammar is intentionally left to a parser adapter. */
export function parsePbnMetadata(pbn: string): Pick<PbnHand, "dealer" | "vulnerability"> {
  const tag = (name: string) => pbn.match(new RegExp(`\\[${name}\\s+"([^"]+)"\\]`, "i"))?.[1];
  const dealerCode = tag("Dealer")?.toUpperCase();
  const dealer = ({ N: "north", E: "east", S: "south", W: "west" } as const)[dealerCode as "N" | "E" | "S" | "W"];
  if (!dealer) throw new Error("PBN is missing a valid [Dealer] tag");
  const vulnerable = tag("Vulnerable")?.toLowerCase();
  const vulnerability = ({ none: "None", love: "None", ns: "NS", ew: "EW", both: "Both", all: "Both" } as const)[vulnerable as "none" | "love" | "ns" | "ew" | "both" | "all"];
  if (!vulnerability) throw new Error("PBN is missing a valid [Vulnerable] tag");
  return { dealer, vulnerability };
}
