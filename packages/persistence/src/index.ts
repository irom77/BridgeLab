import { isValidDeal, RANKS, SEATS, SUITS, type Deal, type GameState, type Seat, type Suit } from "@bridgelab/core";

const storageKey = "bridgelab.solo";

export type SavedHand = Readonly<{
  id: string;
  game: GameState;
  savedAt: string;
}>;

export type SoloData = Readonly<{
  version: 1;
  currentHandId: string | null;
  currentGame: GameState | null;
  completedHands: readonly SavedHand[];
}>;

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const emptyData = (): SoloData => ({ version: 1, currentHandId: null, currentGame: null, completedHands: [] });

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSeat(value: unknown): value is Seat {
  return SEATS.includes(value as Seat);
}

function isCard(value: unknown): boolean {
  return isRecord(value) && SUITS.includes(value.suit as Suit) && RANKS.includes(value.rank as (typeof RANKS)[number]);
}

function isDeal(value: unknown): value is Deal {
  return isRecord(value) && SEATS.every((seat) => Array.isArray(value[seat]) && value[seat].every(isCard)) && isValidDeal(value as unknown as Deal);
}

function isTrickCard(value: unknown): boolean {
  return isRecord(value) && isSeat(value.seat) && isCard(value.card);
}

function isBid(value: unknown): boolean {
  return typeof value === "string" && (value === "pass" || value === "double" || value === "redouble" || /^[1-7](clubs|diamonds|hearts|spades|notrump)$/.test(value));
}

function isGame(value: unknown): value is GameState {
  if (!isRecord(value) || !["auction", "play", "passed-out", "complete"].includes(String(value.phase))) return false;
  if (!isSeat(value.dealer) || !isSeat(value.currentActor) || !isSeat(value.trickLeader)) return false;
  if (!["None", "NS", "EW", "Both"].includes(String(value.vulnerability))) return false;
  const hands = value.hands;
  if (!isDeal(value.initialDeal) || !isRecord(hands) || !SEATS.every((seat) => Array.isArray(hands[seat]) && hands[seat].every(isCard))) return false;
  if (!Array.isArray(value.auction) || !value.auction.every((entry) => isRecord(entry) && isSeat(entry.seat) && isBid(entry.bid))) return false;
  if (!Array.isArray(value.currentTrick) || value.currentTrick.length > 3 || !value.currentTrick.every(isTrickCard)) return false;
  if (!Array.isArray(value.completedTricks) || !value.completedTricks.every((trick) => Array.isArray(trick) && trick.length === 4 && trick.every(isTrickCard))) return false;
  if (!isRecord(value.history) || !Array.isArray(value.history.actions) || !Number.isInteger(value.history.cursor) || Number(value.history.cursor) < 0 || Number(value.history.cursor) > value.history.actions.length) return false;
  if (!value.history.actions.every((action) => isRecord(action) && isSeat(action.seat) && (action.type === "bid" ? isBid(action.bid) : action.type === "play" && isCard(action.card)))) return false;
  if (value.contract !== undefined && (!isRecord(value.contract) || !Number.isInteger(value.contract.level) || Number(value.contract.level) < 1 || Number(value.contract.level) > 7 || !(SUITS.includes(value.contract.strain as Suit) || value.contract.strain === "notrump") || !isSeat(value.contract.declarer) || ![0, 1, 2].includes(Number(value.contract.doubled)))) return false;
  if ((value.phase === "play" || value.phase === "complete") && value.contract === undefined) return false;
  if (value.score !== undefined && (!isRecord(value.score) || typeof value.score.score !== "number" || typeof value.score.tricksTaken !== "number")) return false;
  if (value.phase === "complete" && value.score === undefined) return false;
  return true;
}

function isSavedHand(value: unknown): value is SavedHand {
  return isRecord(value) && typeof value.id === "string" && typeof value.savedAt === "string" && isGame(value.game) && value.game.phase === "complete";
}

function normalize(value: unknown): SoloData {
  if (!isRecord(value)) return emptyData();
  if (value.version === 0) {
    return { ...emptyData(), currentGame: isGame(value.currentGame) ? value.currentGame : null };
  }
  if (value.version !== 1) return emptyData();
  const currentGame = isGame(value.currentGame) ? value.currentGame : null;
  return {
    version: 1,
    currentHandId: currentGame && typeof value.currentHandId === "string" ? value.currentHandId : null,
    currentGame,
    completedHands: Array.isArray(value.completedHands) ? value.completedHands.filter(isSavedHand) : []
  };
}

export function loadSoloData(storage: StorageLike): SoloData {
  const raw = storage.getItem(storageKey);
  if (raw === null) return emptyData();
  try {
    const parsed: unknown = JSON.parse(raw);
    const data = normalize(parsed);
    if (isRecord(parsed) && parsed.version !== data.version) saveSoloData(storage, data);
    return data;
  } catch {
    return emptyData();
  }
}

export function saveSoloData(storage: StorageLike, data: SoloData): void {
  storage.setItem(storageKey, JSON.stringify(data));
}

export function deleteSavedHand(storage: StorageLike, id: string): SoloData {
  const data = loadSoloData(storage);
  const updated: SoloData = { ...data, completedHands: data.completedHands.filter((hand) => hand.id !== id) };
  saveSoloData(storage, updated);
  return updated;
}

export function exportSavedHand(data: SoloData, id: string): string | undefined {
  const hand = data.completedHands.find((candidate) => candidate.id === id);
  return hand ? JSON.stringify(hand, null, 2) : undefined;
}
