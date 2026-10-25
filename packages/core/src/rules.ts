import { cardId, type Card, type Hand, type Seat, type Suit } from "./cards.js";

export type TrickCard = Readonly<{ seat: Seat; card: Card }>;
export type PlayLegality = Readonly<{ legal: boolean; reason?: "card-not-held" | "must-follow-suit" }>;

/** Checks ownership and the follow-suit obligation. A void hand may discard any suit. */
export function validatePlay(hand: Hand, card: Card, ledSuit?: Suit): PlayLegality {
  if (!hand.some((held) => cardId(held) === cardId(card))) return { legal: false, reason: "card-not-held" };
  if (ledSuit && card.suit !== ledSuit && hand.some((held) => held.suit === ledSuit)) {
    return { legal: false, reason: "must-follow-suit" };
  }
  return { legal: true };
}

export function legalCards(hand: Hand, ledSuit?: Suit): Hand {
  if (!ledSuit || !hand.some((card) => card.suit === ledSuit)) return hand;
  return hand.filter((card) => card.suit === ledSuit);
}

const rankValue = (rank: Card["rank"]): number => "23456789TJQKA".indexOf(rank);

/** Returns the winner for a trick; trump is optional for no-trump contracts. */
export function trickWinner(plays: readonly TrickCard[], trump?: Suit): Seat {
  if (plays.length !== 4) throw new Error("A complete trick must contain four cards");
  const ledSuit = plays[0]!.card.suit;
  return plays.reduce((best, play) => {
    const bestTrump = trump !== undefined && best.card.suit === trump;
    const playTrump = trump !== undefined && play.card.suit === trump;
    if (playTrump !== bestTrump) return playTrump ? play : best;
    if (play.card.suit === best.card.suit && rankValue(play.card.rank) > rankValue(best.card.rank)) return play;
    if (!bestTrump && !playTrump && play.card.suit === ledSuit && best.card.suit !== ledSuit) return play;
    return best;
  }).seat;
}
