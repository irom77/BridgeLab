import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyAction,
  cardId,
  createGameState,
  deal,
  redoAction,
  requestHint,
  SUITS,
  undoAction,
  type Bid,
  type Card,
  type GameState,
  type Seat,
  type SkillLevel,
  type Solver,
  type Suit,
  type Vulnerability
} from "@contractplay/core";
import { exportPbn, parsePbn } from "@contractplay/pbn";
import { deleteSavedHand, loadSoloData, saveSoloData, type PbnMetadata, type SavedHand, type SoloData } from "@contractplay/persistence";
import { createBot } from "@contractplay/bots";
import { createClientPersistenceAdapter } from "./platformPersistence.js";
import { isNativeClient, openPbnFile, savePbnFile } from "./nativeFiles.js";

const seatNames: Record<Seat, string> = { north: "North", east: "East", south: "South", west: "West" };
const biddingStrains = ["clubs", "diamonds", "hearts", "spades", "notrump"] as const;
const suitSymbols: Record<Suit, string> = { spades: "♠", hearts: "♥", diamonds: "♦", clubs: "♣" };
const suitNames: Record<Suit, string> = { spades: "spades", hearts: "hearts", diamonds: "diamonds", clubs: "clubs" };
const ranks: Record<string, string> = { A: "ace", K: "king", Q: "queen", J: "jack", T: "ten" };
const seats: readonly Seat[] = ["north", "east", "south", "west"];
const vulnerabilities: readonly Vulnerability[] = ["None", "NS", "EW", "Both"];
const partnerOf = (seat: Seat): Seat => seats[(seats.indexOf(seat) + 2) % 4]!;
const samePartnership = (a: Seat, b: Seat): boolean => seats.indexOf(a) % 2 === seats.indexOf(b) % 2;
const contractCalls: Bid[] = ["pass", "double", "redouble", ...[1, 2, 3, 4, 5, 6, 7].flatMap((level) => biddingStrains.map((strain) => `${level}${strain}` as Bid))];

function callLabel(bid: Bid): string {
  if (bid === "pass") return "Pass";
  if (bid === "double") return "Double";
  if (bid === "redouble") return "Redouble";
  const match = /^(\d)(clubs|diamonds|hearts|spades|notrump)$/.exec(bid);
  return match ? `${match[1]} ${match[2]}` : bid;
}

function cardLabel(card: Card): string {
  return `${ranks[card.rank] ?? card.rank} of ${suitNames[card.suit]}`;
}

function sortHand(cards: readonly Card[]): Card[] {
  return [...cards].sort((a, b) => SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit) || "23456789TJQKA".indexOf(b.rank) - "23456789TJQKA".indexOf(a.rank));
}

function createHandId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function reviewState(hand: SavedHand, cursor: number): GameState {
  let state = hand.game;
  while (state.history.cursor > cursor) state = undoAction(state);
  while (state.history.cursor < cursor) state = redoAction(state);
  return state;
}

export default function App({ solver }: { solver?: Solver } = {}) {
  const persistence = useMemo(() => createClientPersistenceAdapter(window.localStorage), []);
  const [soloData, setSoloData] = useState<SoloData>(() => loadSoloData(persistence.storage));
  const latestSoloData = useRef(soloData);
  latestSoloData.current = soloData;
  const pbnFileInput = useRef<HTMLInputElement>(null);
  const [game, setGame] = useState<GameState | undefined>(() => soloData.currentGame ?? undefined);
  const gameRef = useRef(game);
  gameRef.current = game;
  const [currentHandId, setCurrentHandId] = useState(() => soloData.currentHandId ?? (soloData.currentGame ? createHandId() : ""));
  const [dealer, setDealer] = useState<Seat>(() => soloData.currentGame?.dealer ?? "north");
  const [vulnerability, setVulnerability] = useState<Vulnerability>(() => soloData.currentGame?.vulnerability ?? "None");
  const [playAgainstBots, setPlayAgainstBots] = useState(false);
  const [userSeat, setUserSeat] = useState<Seat>("north");
  const [botSkill, setBotSkill] = useState<SkillLevel>("beginner");
  const [biddingStyle, setBiddingStyle] = useState<"SAYC" | "2/1">("SAYC");
  const [call, setCall] = useState<Bid>("pass");
  const [pbnInput, setPbnInput] = useState("");
  const [currentPbnMetadata, setCurrentPbnMetadata] = useState<PbnMetadata | undefined>(() => soloData.currentPbnMetadata);
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState<{ game: GameState; seat: Seat; cardIds: ReadonlySet<string>; usesSolver: boolean }>();
  const [reviewHandId, setReviewHandId] = useState<string>();
  const [reviewCursor, setReviewCursor] = useState(0);
  const auctionListRef = useRef<HTMLOListElement>(null);

  useEffect(() => persistence.onSuspend(() => saveSoloData(persistence.storage, latestSoloData.current)), [persistence]);

  useEffect(() => {
    if (!game || !currentHandId) return;
    let completedHands = soloData.completedHands;
    if (game.phase === "complete") {
      const record: SavedHand = {
        id: currentHandId,
        game,
        savedAt: new Date().toISOString(),
        ...(currentPbnMetadata ? { pbnMetadata: currentPbnMetadata } : {})
      };
      completedHands = [record, ...completedHands.filter((hand) => hand.id !== currentHandId)].slice(0, 25);
    }
    const nextData: SoloData = {
      version: 1,
      currentHandId,
      currentGame: game,
      ...(currentPbnMetadata ? { currentPbnMetadata } : {}),
      completedHands
    };
    latestSoloData.current = nextData;
    saveSoloData(persistence.storage, nextData);
    setSoloData(nextData);
  }, [game, currentHandId, currentPbnMetadata]);

  useEffect(() => {
    const dummyIsHumanControlled = !!game?.contract && game.phase === "play" &&
      (game.completedTricks.length > 0 || game.currentTrick.length > 0) &&
      samePartnership(userSeat, game.contract.declarer) && game.currentActor === partnerOf(game.contract.declarer);
    if (!game || !playAgainstBots || game.phase === "complete" || game.phase === "passed-out" || game.currentActor === userSeat || dummyIsHumanControlled) return;
    let cancelled = false;
    const turnState = game;
    const bot = createBot({ skill: botSkill, biddingStyle });
    const decide = async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 0));
      if (cancelled) return;
      const actorSeat = turnState.currentActor;
      const action = turnState.phase === "auction"
        ? { type: "bid" as const, seat: actorSeat, bid: await bot.chooseBid(turnState.hands[actorSeat], turnState.auction, actorSeat) }
        : { type: "play" as const, seat: actorSeat, card: await bot.chooseCard({
            seat: actorSeat,
            hand: turnState.hands[actorSeat],
            currentTrick: turnState.currentTrick,
            ...(turnState.currentTrick[0] ? { ledSuit: turnState.currentTrick[0].card.suit } : {}),
            ...(turnState.contract && turnState.contract.strain !== "notrump" ? { trump: turnState.contract.strain } : {})
          }) };
      if (cancelled) return;
      const result = applyAction(turnState, action);
      if (result.ok) setGame((current) => current === turnState ? result.state : current);
    };
    void decide();
    return () => { cancelled = true; };
  }, [game, playAgainstBots, userSeat, biddingStyle, botSkill]);

  const actor = game?.currentActor;
  const actorName = actor ? seatNames[actor] : "";
  const selectedHand = reviewHandId ? soloData.completedHands.find((hand) => hand.id === reviewHandId) : undefined;
  const shownGame = selectedHand ? reviewState(selectedHand, reviewCursor) : game;
  const isReviewing = !!selectedHand;
  const shownActor = shownGame?.currentActor;
  const dummySeat = shownGame?.contract ? partnerOf(shownGame.contract.declarer) : undefined;
  const userControlsDummy = !!shownGame?.contract &&
    (shownGame.completedTricks.length > 0 || shownGame.currentTrick.length > 0) &&
    samePartnership(userSeat, shownGame.contract.declarer) && shownActor === dummySeat;
  const canShowHand = !isReviewing && !!game && !!actor &&
    (game.phase === "auction" || game.phase === "play") &&
    (!playAgainstBots || actor === userSeat || userControlsDummy);
  const visibleHint = game && hint?.game === game && hint.seat === game.currentActor ? hint : undefined;
  const phaseLabel = shownGame?.phase === "auction" ? "Auction" : shownGame?.phase === "play" ? "Card play" : shownGame?.phase === "complete" ? "Hand complete" : "Passed out";

  function startHand() {
    const id = createHandId();
    setCurrentHandId(id);
    setGame(createGameState({ deal: deal(), dealer, vulnerability }));
    setCurrentPbnMetadata(undefined);
    setCall("pass");
    setReviewHandId(undefined);
    setMessage("");
  }

  function importHand(contents = pbnInput) {
    const board = parsePbn(contents).boards[0];
    const diagnostic = board?.diagnostics.find((entry) => entry.severity === "error");
    if (!board?.deal || !board.dealer || diagnostic) {
      setMessage(`Cannot import PBN: ${diagnostic?.message ?? "include a valid deal and dealer"}`);
      return;
    }
    let imported = createGameState({ deal: board.deal, dealer: board.dealer, vulnerability: board.vulnerability ?? "None" });
    for (const action of board.actions) {
      const result = applyAction(imported, action);
      if (!result.ok) {
        setMessage(`Cannot import PBN: ${result.error.message}`);
        return;
      }
      imported = result.state;
    }
    setCurrentHandId(createHandId());
    setGame(imported);
    setCurrentPbnMetadata({ tags: board.tags, comments: board.comments });
    setDealer(board.dealer);
    setVulnerability(board.vulnerability ?? "None");
    setReviewHandId(undefined);
    setPbnInput("");
    setMessage("");
  }

  async function choosePbnFile() {
    if (!isNativeClient()) {
      pbnFileInput.current?.click();
      return;
    }
    try {
      const contents = await openPbnFile();
      if (contents !== null) importHand(contents);
    } catch (error) {
      setMessage(`Cannot open PBN file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function importSelectedPbnFile(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    try {
      importHand(await file.text());
    } catch (error) {
      setMessage(`Cannot open PBN file: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      input.value = "";
    }
  }

  function submitAction(action: Parameters<typeof applyAction>[1]) {
    if (!game || isReviewing) return;
    const result = applyAction(game, action);
    if (result.ok) {
      setGame(result.state);
      setMessage("");
    } else {
      setMessage(result.error.message);
    }
  }

  async function showHint() {
    if (!game || game.phase !== "play") return;
    const requestedGame = game;
    const seat = requestedGame.currentActor;
    try {
      const cards = await requestHint({
        seat,
        hand: requestedGame.hands[seat],
        currentTrick: requestedGame.currentTrick,
        ...(requestedGame.currentTrick[0] ? { ledSuit: requestedGame.currentTrick[0].card.suit } : {}),
        ...(requestedGame.contract && requestedGame.contract.strain !== "notrump" ? { trump: requestedGame.contract.strain } : {})
      }, solver);
      if (gameRef.current !== requestedGame) return;
      setHint({ game: requestedGame, seat, cardIds: new Set(cards.map(cardId)), usesSolver: !!solver });
      setMessage("");
    } catch {
      if (gameRef.current === requestedGame) setMessage("Unable to get a hint. Please try again.");
    }
  }

  function takeBack() {
    if (!game || game.history.cursor === 0) return;
    setGame(undoAction(game));
    setMessage("");
  }

  function redo() {
    if (!game || game.history.cursor >= game.history.actions.length) return;
    setGame(redoAction(game));
    setMessage("");
  }

  function openReview(hand: SavedHand) {
    setReviewHandId(hand.id);
    setReviewCursor(0);
    setMessage("");
  }

  function removeHand(id: string) {
    setSoloData(deleteSavedHand(persistence.storage, id));
  }

  async function downloadHand(id: string) {
    const hand = soloData.completedHands.find((candidate) => candidate.id === id);
    if (!hand) return;
    const contents = exportPbn({
      dealer: hand.game.dealer,
      vulnerability: hand.game.vulnerability,
      actions: hand.game.history.actions,
      deal: hand.game.initialDeal,
      ...hand.pbnMetadata
    });
    if (!contents) return;
    if (isNativeClient()) {
      try {
        await savePbnFile(`contractplay-${id}.pbn`, contents);
      } catch (error) {
        setMessage(`Cannot export PBN file: ${error instanceof Error ? error.message : String(error)}`);
      }
      return;
    }
    if (typeof URL.createObjectURL !== "function") return;
    const url = URL.createObjectURL(new Blob([contents], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `contractplay-${id}.pbn`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const handCount = selectedHand?.game.history.actions.length ?? 0;
  const shownAuctionLength = shownGame?.auction.length;

  useEffect(() => {
    const list = auctionListRef.current;
    if (shownGame?.phase === "auction" && list) list.scrollTop = list.scrollHeight;
  }, [shownGame?.phase, shownAuctionLength]);

  const pbnImportForm = <details className="pbn-import">
    <summary>Import a PBN deal</summary>
    <form onSubmit={(event) => { event.preventDefault(); importHand(); }}>
      <label htmlFor="pbn-input">PBN deal</label>
      <input ref={pbnFileInput} aria-label="PBN file" type="file" accept=".pbn,.txt,text/plain" onChange={(event) => { void importSelectedPbnFile(event); }} hidden />
      <button className="secondary-button" type="button" onClick={() => { void choosePbnFile(); }}>Choose PBN file</button>
      <textarea id="pbn-input" value={pbnInput} onChange={(event) => setPbnInput(event.target.value)} placeholder={'[Dealer "N"]\n[Vulnerable "None"]\n[Deal "N:..."]'} />
      <button className="secondary-button" type="submit">Import hand</button>
    </form>
  </details>;
  const recentHandsPanel = <section className="recent-panel" aria-label="Recent hands">
    <div className="section-heading"><div><p className="eyebrow">ON THIS DEVICE</p><h2>Recent hands</h2></div><span className="auction-count">{soloData.completedHands.length}</span></div>
    {soloData.completedHands.length ? <ul className="recent-list">{soloData.completedHands.map((hand, index) => <li key={hand.id}>
      <button className="review-link" aria-label={`Review hand ${index + 1}`} onClick={() => openReview(hand)}><strong>Hand {soloData.completedHands.length - index}</strong><span>{new Date(hand.savedAt).toLocaleDateString()}</span></button>
      <div className="recent-actions"><button onClick={() => downloadHand(hand.id)} aria-label={`Export PBN hand ${index + 1}`}>Export PBN</button><button onClick={() => removeHand(hand.id)} aria-label={`Delete hand ${index + 1}`}>Delete</button></div>
    </li>)}</ul> : <p className="quiet-copy">Finished hands will be saved here for review.</p>}
  </section>;
  const tableMenu = shownGame ? <details className="table-menu">
    <summary>Table menu</summary>
    <div className="table-menu-content">
      {!isReviewing ? <button className="secondary-button menu-deal" onClick={startHand}>Deal a new hand</button> : <button className="secondary-button menu-deal" onClick={() => setReviewHandId(undefined)}>Exit review</button>}
      {!isReviewing ? <section className="menu-settings" aria-label="Next deal settings">
        <span className="eyebrow">NEXT DEAL</span>
        <label>Dealer<select aria-label="Dealer" value={dealer} onChange={(event) => setDealer(event.target.value as Seat)}>{seats.map((seat) => <option key={seat} value={seat}>{seatNames[seat]}</option>)}</select></label>
        <label>Vulnerability<select aria-label="Vulnerability" value={vulnerability} onChange={(event) => setVulnerability(event.target.value as Vulnerability)}>{vulnerabilities.map((value) => <option key={value} value={value}>{value === "None" ? "None" : value === "Both" ? "Both" : `${value} vulnerable`}</option>)}</select></label>
        <label>Opponents<select aria-label="Opponents" value={playAgainstBots ? "bots" : "manual"} onChange={(event) => setPlayAgainstBots(event.target.value === "bots")}><option value="manual">Manual table</option><option value="bots">Bots</option></select></label>
        {playAgainstBots ? <><label>Your seat<select aria-label="Your seat" value={userSeat} onChange={(event) => setUserSeat(event.target.value as Seat)}>{seats.map((seat) => <option key={seat} value={seat}>{seatNames[seat]}</option>)}</select></label><label>Bot skill<select aria-label="Bot skill" value={botSkill} onChange={(event) => setBotSkill(event.target.value as SkillLevel)}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="expert">Expert</option></select></label><label>Bot bidding style<select aria-label="Bot bidding style" value={biddingStyle} onChange={(event) => setBiddingStyle(event.target.value as "SAYC" | "2/1")}><option value="SAYC">Basic SAYC</option><option value="2/1">Basic 2/1</option></select></label></> : null}
      </section> : null}
      {pbnImportForm}
      {recentHandsPanel}
    </div>
  </details> : null;

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="ContractPlay home"><span className="brand-mark">C</span><span>ContractPlay</span></a>
        <div className="header-actions">
          <span className="header-version">Version {__CONTRACTPLAY_VERSION__}</span>
          {tableMenu}
        </div>
      </header>

      {!shownGame ? <section className="welcome-row" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">THE TABLE IS YOURS</p>
          <h1 id="page-title">A clearer way to play bridge.</h1>
          <p className="page-intro">Follow every call and card, one move at a time.</p>
        </div>
      </section> : null}

      {!shownGame ? (
        <section className="empty-table" aria-label="Bridge table preview">
          <div className="empty-suit suit-red">♥</div><div className="empty-suit">♠</div>
          <h2>A fresh deal is waiting</h2>
          <p>Choose the board settings, then follow the auction and play through all thirteen tricks.</p>
          <div className="setup-controls">
            <label>Dealer<select aria-label="Dealer" value={dealer} onChange={(event) => setDealer(event.target.value as Seat)}>{seats.map((seat) => <option key={seat} value={seat}>{seatNames[seat]}</option>)}</select></label>
            <label>Vulnerability<select aria-label="Vulnerability" value={vulnerability} onChange={(event) => setVulnerability(event.target.value as Vulnerability)}>{vulnerabilities.map((value) => <option key={value} value={value}>{value === "None" ? "None" : value === "Both" ? "Both" : `${value} vulnerable`}</option>)}</select></label>
            <label>Opponents<select aria-label="Opponents" value={playAgainstBots ? "bots" : "manual"} onChange={(event) => setPlayAgainstBots(event.target.value === "bots")}><option value="manual">Manual table</option><option value="bots">Bots</option></select></label>
            {playAgainstBots ? <><label>Your seat<select aria-label="Your seat" value={userSeat} onChange={(event) => setUserSeat(event.target.value as Seat)}>{seats.map((seat) => <option key={seat} value={seat}>{seatNames[seat]}</option>)}</select></label><label>Bot skill<select aria-label="Bot skill" value={botSkill} onChange={(event) => setBotSkill(event.target.value as SkillLevel)}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="expert">Expert</option></select></label><label>Bot bidding style<select aria-label="Bot bidding style" value={biddingStyle} onChange={(event) => setBiddingStyle(event.target.value as "SAYC" | "2/1")}><option value="SAYC">Basic SAYC</option><option value="2/1">Basic 2/1</option></select></label></> : null}
          </div>
          <button className="text-button" onClick={startHand}>Start a new hand <span aria-hidden="true">→</span></button>
          {pbnImportForm}
        </section>
      ) : shownGame ? (
        <>
        <div className={`game-layout ${shownGame.phase === "auction" ? "auction-layout" : ""}`}>
          <section className="table-panel" aria-label={isReviewing ? "Hand review" : "Bridge table"}>
            <div className="table-heading">
              <div><p className="eyebrow">{shownGame.contract ? `BOARD 1 · ${callLabel(`${shownGame.contract.level}${shownGame.contract.strain}` as Bid)} · ${seatNames[shownGame.contract.declarer]} DECLARES` : `BOARD 1 · DEALER ${seatNames[shownGame.dealer].toUpperCase()} · VULNERABILITY ${shownGame.vulnerability.toUpperCase()}`}</p><h2>{isReviewing ? "Hand review" : phaseLabel}</h2></div>
              <span className="status-pill" aria-live="polite">{isReviewing ? `Review · ${reviewCursor} of ${handCount}` : shownGame.phase === "auction" || shownGame.phase === "play" ? `${playAgainstBots && shownActor !== userSeat && !userControlsDummy ? "Bot · " : ""}${seatNames[shownActor!]} to ${shownGame.phase === "auction" ? "bid" : "play"}` : phaseLabel}</span>
            </div>

            <div className="table-surface">
              {seats.map((seat) => <div key={seat} className={`seat seat-${seat} ${shownActor === seat ? "active-seat" : ""}`}><span className="seat-compass">{seat[0]!.toUpperCase()}</span><span>{seatNames[seat]}</span></div>)}
              <div className="trick-area" role="region" aria-label="Current trick">
                {shownGame.currentTrick.length ? shownGame.currentTrick.map(({ seat, card }) => <span className="trick-card" key={seat}>{seatNames[seat][0]} {suitSymbols[card.suit]}{card.rank}</span>) : <span className="trick-placeholder">{shownGame.contract ? `${seatNames[shownGame.trickLeader]} leads` : "Auction in progress"}</span>}
              </div>
              {shownGame.phase === "auction" ? <section className="auction-panel centered-auction" aria-label="Auction">
                <div className="section-heading"><div><p className="eyebrow">CALLS SO FAR</p><h2>Auction</h2></div><span className="auction-count">{shownGame.auction.length}</span></div>
                {shownGame.auction.length ? <ol className="auction-list" ref={auctionListRef}>{shownGame.auction.map(({ seat, bid }, index) => <li key={`${seat}-${index}`}><span>{seatNames[seat]}</span><strong>{callLabel(bid)}</strong></li>)}</ol> : <p className="quiet-copy">The first call is yours to make.</p>}
                {!isReviewing && game?.phase === "auction" && (!playAgainstBots || game.currentActor === userSeat) ? <form className="call-controls" onSubmit={(event) => { event.preventDefault(); submitAction({ type: "bid", seat: game.currentActor, bid: call }); }}>
                  <label htmlFor="call-select">Contract call</label>
                  <div className="call-row"><select id="call-select" value={call} onChange={(event) => setCall(event.target.value as Bid)}>{contractCalls.map((option) => <option key={option} value={option}>{callLabel(option)}</option>)}</select><button className="primary-button small-button" type="submit">Make bid</button></div>
                </form> : null}
              </section> : null}
            </div>
            {shownGame.completedTricks.length ? <p className="trick-count" aria-live="polite">{shownGame.completedTricks.length} {shownGame.completedTricks.length === 1 ? "trick" : "tricks"} complete</p> : null}

            {canShowHand && game && actor ? <section className="hand-panel" aria-label={`${actorName}'s hand`}>
              <div className="hand-heading"><div><p className="eyebrow">{userControlsDummy ? "DUMMY · PLAYING AS" : "PLAYING AS"}</p><h3>{actorName}</h3></div><span>{game.hands[actor].length} cards</span></div>
              <div className="cards-row">
                {sortHand(game.hands[actor]).map((card) => game.phase === "play"
                  ? <button className={`playing-card ${card.suit === "hearts" || card.suit === "diamonds" ? "red-card" : ""} ${visibleHint?.cardIds.has(cardId(card)) ? "hinted-card" : ""}`} key={`${card.suit}-${card.rank}`} aria-label={`Play ${cardLabel(card)}`} onClick={() => submitAction({ type: "play", seat: actor, card })}><span>{card.rank}</span><span>{suitSymbols[card.suit]}</span></button>
                  : <span className={`playing-card auction-card ${card.suit === "hearts" || card.suit === "diamonds" ? "red-card" : ""}`} key={`${card.suit}-${card.rank}`} aria-label={cardLabel(card)}><span>{card.rank}</span><span>{suitSymbols[card.suit]}</span></span>)}
              </div>
              {game.phase === "play" ? <div className="hint-controls">
                <button className="secondary-button" onClick={() => { void showHint(); }}>Show hint</button>
                {visibleHint ? <p role="status">{visibleHint.usesSolver ? "Solver recommendations are highlighted." : "Legal cards are highlighted."}</p> : null}
              </div> : null}
            </section> : null}

            {isReviewing ? <div className="review-controls" aria-label="Review controls">
              <button className="secondary-button" disabled={reviewCursor === 0} onClick={() => setReviewCursor((cursor) => Math.max(0, cursor - 1))}>Previous action</button>
              <span>Reviewing action {reviewCursor} of {handCount}</span>
              <button className="secondary-button" disabled={reviewCursor >= handCount} onClick={() => setReviewCursor((cursor) => Math.min(handCount, cursor + 1))}>Next action</button>
            </div> : <div className="history-controls">
              <button className="secondary-button" disabled={!game || game.history.cursor === 0} onClick={takeBack}>Take back</button>
              <button className="secondary-button" disabled={!game || game.history.cursor >= game.history.actions.length} onClick={redo}>Redo</button>
            </div>}
          </section>

          <aside className="side-panel">
            {shownGame.phase !== "auction" ? <section className="auction-panel" aria-label="Auction">
              <div className="section-heading"><div><p className="eyebrow">CALLS SO FAR</p><h2>Auction</h2></div><span className="auction-count">{shownGame.auction.length}</span></div>
              {shownGame.auction.length ? <ol className="auction-list" ref={auctionListRef}>{shownGame.auction.map(({ seat, bid }, index) => <li key={`${seat}-${index}`}><span>{seatNames[seat]}</span><strong>{callLabel(bid)}</strong></li>)}</ol> : <p className="quiet-copy">The first call is yours to make.</p>}
              {!isReviewing && game?.phase === "auction" && (!playAgainstBots || game.currentActor === userSeat) ? <form className="call-controls" onSubmit={(event) => { event.preventDefault(); submitAction({ type: "bid", seat: game.currentActor, bid: call }); }}>
                <label htmlFor="call-select">Contract call</label>
                <div className="call-row"><select id="call-select" value={call} onChange={(event) => setCall(event.target.value as Bid)}>{contractCalls.map((option) => <option key={option} value={option}>{callLabel(option)}</option>)}</select><button className="primary-button small-button" type="submit">Make bid</button></div>
              </form> : null}
            </section> : null}

            {shownGame.phase === "complete" && shownGame.score ? <section className="score-panel" aria-label="Hand result"><p className="eyebrow">HAND RESULT</p><h2>{shownGame.contract?.level} {shownGame.contract?.strain}</h2><p>{shownGame.score.tricksTaken} tricks for {shownGame.contract?.declarer === "north" || shownGame.contract?.declarer === "south" ? "NS" : "EW"} · {shownGame.score.score > 0 ? "+" : ""}{shownGame.score.score} NS</p></section> : null}
            {shownGame.phase === "passed-out" ? <p className="score-panel">Passed out. Deal another hand when you’re ready.</p> : null}

          </aside>
        </div>
        </>
      ) : null}

      {message ? <p className="error-message" role="alert">{message}</p> : null}
      <footer className="app-footer"><span>ContractPlay</span><span>Every hand has a story.</span></footer>
    </main>
  );
}
