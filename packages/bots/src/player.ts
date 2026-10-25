import { SEATS, cardId, type Bid, type BotConfig, type BotPlayer, type Hand, type PlayContext, type PublicBid, type Seat, type Suit } from "@bridgelab/core";

export interface ConventionSystem {
  readonly style: "SAYC" | "2/1";
  openingBid(hand: Hand): Bid;
}

const highCardPoints: Readonly<Record<string, number>> = { A: 4, K: 3, Q: 2, J: 1 };
const suits: readonly Suit[] = ["spades", "hearts", "diamonds", "clubs"];

function points(hand: Hand): number {
  return hand.reduce((total, card) => total + (highCardPoints[card.rank] ?? 0), 0);
}

function isBalanced(hand: Hand): boolean {
  const counts = suits.map((suit) => hand.filter((card) => card.suit === suit).length);
  return counts.every((count) => count >= 2) && counts.filter((count) => count === 2).length <= 1;
}

function twoOverOneAuction(auction: readonly PublicBid[], style: ConventionSystem["style"]) {
  if (style !== "2/1") return undefined;
  const contracts = auction.filter(({ bid }) => bid !== "pass");
  if (contracts.length < 2 || contracts.length > 3) return undefined;
  const opening = contracts[0]!;
  const response = contracts[1]!;
  const openingSuit = opening.bid.match(/^1(hearts|spades)$/)?.[1] as Suit | undefined;
  const responseSuit = response.bid.match(/^2(clubs|diamonds|hearts|spades)$/)?.[1] as Suit | undefined;
  const suitOrder: readonly Suit[] = ["clubs", "diamonds", "hearts", "spades"];
  const expectedResponder = SEATS[(SEATS.indexOf(opening.seat) + 2) % SEATS.length]!;
  if (!openingSuit || !responseSuit || response.seat !== expectedResponder || suitOrder.indexOf(responseSuit) >= suitOrder.indexOf(openingSuit)) return undefined;
  if (contracts.length === 3 && (contracts[2]!.seat !== opening.seat || contracts[2]!.bid !== `2${openingSuit}`)) return undefined;
  return { openingSeat: opening.seat, responderSeat: response.seat, openingSuit };
}

function makeConvention(style: ConventionSystem["style"]): ConventionSystem {
  return {
    style,
    openingBid(hand) {
      const hcp = points(hand);
      if (hcp < 12) return "pass";
      if (hcp >= 15 && hcp <= 17 && isBalanced(hand)) return "1notrump";
      const counts = new Map(suits.map((suit) => [suit, hand.filter((card) => card.suit === suit).length]));
      const majors: readonly Suit[] = ["spades", "hearts"];
      const minors: readonly Suit[] = ["diamonds", "clubs"];
      const eligibleMajors = majors.filter((suit) => counts.get(suit)! >= 5);
      const candidates = eligibleMajors.length > 0 ? eligibleMajors : minors;
      const preferred = [...candidates].sort((a, b) => counts.get(b)! - counts.get(a)! || candidates.indexOf(a) - candidates.indexOf(b))[0]!;
      return `1${preferred}` as Bid;
    }
  };
}

function legalCards(context: PlayContext) {
  const ledSuit = context.ledSuit ?? context.currentTrick[0]?.card.suit;
  const followSuit = ledSuit ? context.hand.filter((card) => card.suit === ledSuit) : [];
  return followSuit.length ? followSuit : context.hand;
}

const rankValue = (rank: string): number => "23456789TJQKA".indexOf(rank);

function beats(play: { card: Hand[number] }, current: { card: Hand[number] }, ledSuit: Suit, trump?: Suit): boolean {
  const playIsTrump = trump !== undefined && play.card.suit === trump;
  const currentIsTrump = trump !== undefined && current.card.suit === trump;
  if (playIsTrump !== currentIsTrump) return playIsTrump;
  if (play.card.suit === current.card.suit) return rankValue(play.card.rank) > rankValue(current.card.rank);
  return !playIsTrump && !currentIsTrump && play.card.suit === ledSuit && current.card.suit !== ledSuit;
}

function winningPlay(plays: PlayContext["currentTrick"], ledSuit: Suit, trump?: Suit) {
  return plays.reduce((current, play) => beats(play, current, ledSuit, trump) ? play : current);
}

function lowestCard(cards: Hand) {
  return [...cards].sort((a, b) => rankValue(a.rank) - rankValue(b.rank) || a.suit.localeCompare(b.suit))[0]!;
}

export class BeginnerBot implements BotPlayer {
  readonly config: BotConfig;
  readonly convention: ConventionSystem;

  constructor(config: BotConfig) {
    if (config.skill !== "beginner") throw new Error("Only beginner bot skill is currently implemented");
    this.config = config;
    this.convention = makeConvention(config.biddingStyle === "2/1" ? "2/1" : "SAYC");
  }

  async chooseBid(hand: Hand, auction: readonly PublicBid[], seat: Seat): Promise<Bid> {
    if (auction.length === 0 || auction.every(({ bid }) => bid === "pass")) {
      return this.convention.openingBid(hand);
    }

    const contractCalls = auction.filter(({ bid }) => bid !== "pass");
    const partner = SEATS[(SEATS.indexOf(seat) + 2) % SEATS.length]!;
    if (contractCalls.length === 3) {
      const [opening, response, rebid] = contractCalls;
      if (
        opening?.seat === partner && response?.seat === seat && rebid?.seat === partner &&
        /^1(hearts|spades)$/.test(opening.bid) && response.bid === "1notrump" && rebid.bid === "2notrump"
      ) {
        return points(hand) >= 6 ? "3notrump" : "pass";
      }
      const isOneLevelSuit = (bid: Bid | undefined) => bid !== undefined && /^1(clubs|diamonds|hearts|spades)$/.test(bid);
      if (
        opening?.seat === partner && response?.seat === seat && rebid?.seat === partner &&
        isOneLevelSuit(opening.bid) && isOneLevelSuit(response.bid) && rebid.bid === "1notrump"
      ) {
        const responderPoints = points(hand);
        const responderMajor = response.bid === "1hearts" || response.bid === "1spades" ? response.bid.slice(1) as Suit : undefined;
        if (responderMajor && responderPoints >= 10 && responderPoints <= 12 && hand.filter((card) => card.suit === responderMajor).length >= 5) {
          return `3${responderMajor}` as Bid;
        }
        if (isBalanced(hand)) {
          if (responderPoints >= 10 && responderPoints <= 12) return "2notrump";
          if (responderPoints >= 13) return "3notrump";
        }
        if (responderMajor && hand.filter((card) => card.suit === responderMajor).length >= 5 && responderPoints <= 9) {
          return `2${responderMajor}` as Bid;
        }
      }
    }
    const twoOverOne = twoOverOneAuction(auction, this.convention.style);
    if (twoOverOne && contractCalls.length === 2 && twoOverOne.openingSeat === seat) {
      return `2${twoOverOne.openingSuit}` as Bid;
    }
    if (twoOverOne && contractCalls.length === 3 && twoOverOne.responderSeat === seat) {
      const support = hand.filter((card) => card.suit === twoOverOne.openingSuit).length;
      return support >= 3 ? `4${twoOverOne.openingSuit}` as Bid : "3notrump";
    }
    if (contractCalls.length === 2) {
      const [opening, response] = contractCalls;
      const openingSuit = opening?.bid.match(/^1(clubs|diamonds|hearts|spades)$/)?.[1] as Suit | undefined;
      if (
        opening?.seat === seat && response?.seat === partner &&
        (openingSuit === "hearts" || openingSuit === "spades") && response.bid === "1notrump"
      ) {
        const openerPoints = points(hand);
        if (isBalanced(hand) && openerPoints >= 18 && openerPoints <= 19) return "2notrump";
        if (openerPoints >= 12 && openerPoints <= 17 && hand.filter((card) => card.suit === openingSuit).length >= 5) {
          const suitOrder: readonly Suit[] = ["clubs", "diamonds", "hearts", "spades"];
          const openingRank = suitOrder.indexOf(openingSuit);
          const secondSuit = suitOrder
            .filter((suit) => suitOrder.indexOf(suit) < openingRank && hand.filter((card) => card.suit === suit).length >= 4)
            .sort((a, b) => hand.filter((card) => card.suit === b).length - hand.filter((card) => card.suit === a).length || suitOrder.indexOf(b) - suitOrder.indexOf(a))[0];
          if (secondSuit) return `2${secondSuit}` as Bid;
          const higherSecondSuit = suitOrder.find((suit) => suitOrder.indexOf(suit) > openingRank && hand.filter((card) => card.suit === suit).length >= 4);
          if (higherSecondSuit && openerPoints >= 16) return `2${higherSecondSuit}` as Bid;
          if (hand.filter((card) => card.suit === openingSuit).length >= 6) return `2${openingSuit}` as Bid;
        }
        return "pass";
      }
      const responseSuit = response?.bid.match(/^1(clubs|diamonds|hearts|spades)$/)?.[1] as Suit | undefined;
      if (opening?.seat !== seat || response?.seat !== partner || !openingSuit || !responseSuit || openingSuit === responseSuit) return "pass";
      const openerPoints = points(hand);
      const responderMajor = responseSuit === "hearts" || responseSuit === "spades" ? responseSuit : undefined;
      if (responderMajor && openerPoints >= 12 && openerPoints <= 15 && hand.filter((card) => card.suit === responderMajor).length >= 4) {
        return `2${responderMajor}` as Bid;
      }
      const suitOrder: readonly Suit[] = ["clubs", "diamonds", "hearts", "spades"];
      const openingRank = suitOrder.indexOf(openingSuit);
      const secondSuit = suitOrder
        .filter((suit) => suit !== responseSuit && suitOrder.indexOf(suit) > openingRank && hand.filter((card) => card.suit === suit).length >= 4)
        .sort((a, b) => hand.filter((card) => card.suit === b).length - hand.filter((card) => card.suit === a).length || suitOrder.indexOf(b) - suitOrder.indexOf(a))[0];
      if (secondSuit) return `1${secondSuit}` as Bid;
      if (isBalanced(hand) && openerPoints >= 12 && openerPoints <= 14) return "1notrump";
      if (isBalanced(hand) && openerPoints >= 18 && openerPoints <= 19) return "2notrump";
      if (responderMajor && openerPoints >= 16 && openerPoints <= 18 && hand.filter((card) => card.suit === responderMajor).length >= 4) {
        return `3${responderMajor}` as Bid;
      }
      if (
        openingSuit === "diamonds" && responseSuit === "spades" && openerPoints >= 12 && openerPoints <= 17 &&
        hand.filter((card) => card.suit === "diamonds").length >= 5 && hand.filter((card) => card.suit === "clubs").length >= 4
      ) return "2clubs";
      if (hand.filter((card) => card.suit === openingSuit).length >= 6) return `2${openingSuit}` as Bid;
      return "pass";
    }
    if (contractCalls.length !== 1) return "pass";
    const opening = contractCalls[0]!;
    if (opening.seat !== partner) return "pass";

    const responderPoints = points(hand);
    if (opening.bid === "1notrump") {
      if (!isBalanced(hand) || responderPoints < 8) return "pass";
      return responderPoints < 10 ? "2notrump" : "3notrump";
    }

    const openingSuit = opening.bid.match(/^1(clubs|diamonds|hearts|spades)$/)?.[1] as Suit | undefined;
    if (!openingSuit) return "pass";
    const openedMajor = openingSuit === "hearts" || openingSuit === "spades" ? openingSuit : undefined;
    if (responderPoints >= 6) {
      const suitOrder: readonly Suit[] = ["clubs", "diamonds", "hearts", "spades"];
      const openingRank = suitOrder.indexOf(openingSuit);
      const suitLength = (suit: Suit) => hand.filter((card) => card.suit === suit).length;
      const newSuit = [...suitOrder]
        .filter((suit) => suitOrder.indexOf(suit) > openingRank && suitLength(suit) >= 4)
        .sort((a, b) => suitLength(b) - suitLength(a) || suitOrder.indexOf(b) - suitOrder.indexOf(a))[0];
      if (newSuit) return `1${newSuit}` as Bid;
      const hasMajorSupport = (openingSuit === "hearts" || openingSuit === "spades") && suitLength(openingSuit) >= 3;
      const twoLevelMinimum = this.convention.style === "2/1" && openedMajor ? 13 : 10;
      if (responderPoints >= twoLevelMinimum && !hasMajorSupport) {
        const twoLevelSuit = [...suitOrder]
          .filter((suit) => suit !== openingSuit && suitOrder.indexOf(suit) < openingRank && suitLength(suit) >= 4)
          .sort((a, b) => suitLength(b) - suitLength(a) || suitOrder.indexOf(b) - suitOrder.indexOf(a))[0];
        if (twoLevelSuit) return `2${twoLevelSuit}` as Bid;
      }
    }

    if (contractCalls.length !== 1) return "pass";
    if (openingSuit === "clubs" || openingSuit === "diamonds") {
      const supportLength = hand.filter((card) => card.suit === openingSuit).length;
      if (supportLength >= 5 && responderPoints >= 6 && responderPoints <= 9) return `2${openingSuit}` as Bid;
      if (supportLength >= 5 && responderPoints >= 10 && responderPoints <= 12) return `3${openingSuit}` as Bid;
      if (supportLength < 5 && isBalanced(hand) && responderPoints >= 6 && responderPoints <= 9) return "1notrump";
      if (supportLength < 5 && isBalanced(hand) && responderPoints >= 10 && responderPoints <= 12) return "2notrump";
      if (isBalanced(hand) && responderPoints >= 13 && responderPoints <= 15) return "3notrump";
      return "pass";
    }
    if (!openedMajor) return "pass";
    const supportLength = hand.filter((card) => card.suit === openedMajor).length;
    if (supportLength < 3 && isBalanced(hand) && responderPoints >= 6 && responderPoints <= 9) return "1notrump";
    if (supportLength < 3 || responderPoints < 6) return "pass";
    if (responderPoints < 10) return `2${openedMajor}` as Bid;
    if (responderPoints < 13) return `3${openedMajor}` as Bid;
    return `4${openedMajor}` as Bid;
  }

  async chooseCard(context: PlayContext) {
    const choices = legalCards(context);
    return [...choices].sort((a, b) => cardId(a).localeCompare(cardId(b)))[0]!;
  }
}

/** Intermediate card play wins the current trick cheaply when partner is not already winning. */
export class IntermediateBot implements BotPlayer {
  readonly config: BotConfig;
  private readonly biddingBot: BeginnerBot;

  constructor(config: BotConfig) {
    if (config.skill !== "intermediate") throw new Error("IntermediateBot requires intermediate skill");
    this.config = config;
    this.biddingBot = new BeginnerBot({ ...config, skill: "beginner" });
  }

  chooseBid(hand: Hand, auction: readonly PublicBid[], seat: Seat): Promise<Bid> {
    return this.biddingBot.chooseBid(hand, auction, seat);
  }

  async chooseCard(context: PlayContext) {
    const choices = legalCards(context);
    const ledSuit = context.ledSuit ?? context.currentTrick[0]?.card.suit;
    if (!ledSuit || context.currentTrick.length === 0) return lowestCard(choices);

    const currentWinner = winningPlay(context.currentTrick, ledSuit, context.trump);
    const partner = SEATS[(SEATS.indexOf(context.seat) + 2) % SEATS.length]!;
    if ((SEATS.indexOf(currentWinner.seat) % 2) === (SEATS.indexOf(partner) % 2)) return lowestCard(choices);

    const winningCards = choices.filter((card) => {
      const plays = [...context.currentTrick, { seat: context.seat, card }];
      return winningPlay(plays, ledSuit, context.trump).seat === context.seat;
    });
    return lowestCard(winningCards.length ? winningCards : choices);
  }
}

export function createBot(config: BotConfig): BotPlayer {
  if (config.skill === "beginner") return new BeginnerBot(config);
  if (config.skill === "intermediate") return new IntermediateBot(config);
  throw new Error(`Bot skill ${config.skill} is not implemented yet`);
}
