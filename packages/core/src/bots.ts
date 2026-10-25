import type { Card, Hand, Seat, Suit } from "./cards.js";
import type { Bid } from "./history.js";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type BiddingStyle = "SAYC" | "2/1" | (string & {});
export type BotConfig = Readonly<{ skill: SkillLevel; biddingStyle: BiddingStyle }>;
export type PlayContext = Readonly<{ seat: Seat; hand: Hand; ledSuit?: Suit; trump?: Suit }>;

export interface BotPlayer {
  readonly config: BotConfig;
  chooseBid(hand: Hand, auction: readonly Bid[]): Promise<Bid>;
  chooseCard(context: PlayContext): Promise<Card>;
}

export interface Solver {
  recommendPlays(context: PlayContext): Promise<readonly Card[]>;
}

export async function requestHint(context: PlayContext, solver?: Solver): Promise<readonly Card[]> {
  if (solver) return solver.recommendPlays(context);
  if (context.ledSuit && context.hand.some((card) => card.suit === context.ledSuit)) {
    return context.hand.filter((card) => card.suit === context.ledSuit);
  }
  return context.hand;
}
