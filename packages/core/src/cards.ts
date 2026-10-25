export const SUITS = ["spades", "hearts", "diamonds", "clubs"] as const;
export type Suit = (typeof SUITS)[number];
export const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"] as const;
export type Rank = (typeof RANKS)[number];
export type Card = Readonly<{ suit: Suit; rank: Rank }>;

export const SEATS = ["north", "east", "south", "west"] as const;
export type Seat = (typeof SEATS)[number];
export type Hand = readonly Card[];
export type Deal = Readonly<Record<Seat, Hand>>;

export function createDeck(): Card[] {
  return SUITS.flatMap((suit) => RANKS.map((rank) => ({ suit, rank })));
}

/** Fisher-Yates shuffle. Inject random for deterministic simulations and tests. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export function deal(shuffledDeck: readonly Card[] = shuffle(createDeck())): Deal {
  if (shuffledDeck.length !== 52) throw new Error("A bridge deal must contain exactly 52 cards");
  const hands: Record<Seat, Card[]> = { north: [], east: [], south: [], west: [] };
  shuffledDeck.forEach((card, index) => hands[SEATS[index % 4]!].push(card));
  return hands;
}

export function cardId(card: Card): string {
  return `${card.suit}:${card.rank}`;
}

export function isValidDeal(deal: Deal): boolean {
  const cards = SEATS.flatMap((seat) => deal[seat]);
  const deck = new Set(createDeck().map(cardId));
  return SEATS.every((seat) => deal[seat].length === 13) &&
    cards.length === 52 && new Set(cards.map(cardId)).size === 52 &&
    cards.every((card) => deck.has(cardId(card)));
}
