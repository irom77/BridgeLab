// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { applyAction, createGameState, deal, validatePlay } from "@contractplay/core";
import type { Solver } from "@contractplay/core";
import { exportPbn, parsePbn } from "@contractplay/pbn";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadSoloData, saveSoloData, type SoloData } from "@contractplay/persistence";
import App from "./App.js";

function completedGame() {
  let game = createGameState({ deal: deal(), dealer: "north", vulnerability: "None" });
  for (const bid of ["1clubs", "pass", "pass", "pass"] as const) {
    const result = applyAction(game, { type: "bid", seat: game.currentActor, bid });
    if (!result.ok) throw new Error(result.error.message);
    game = result.state;
  }
  while (game.phase === "play") {
    const seat = game.currentActor;
    const lead = game.currentTrick[0]?.card.suit;
    const card = game.hands[seat].find((candidate) => validatePlay(game.hands[seat], candidate, lead).legal)!;
    const result = applyAction(game, { type: "play", seat, card });
    if (!result.ok) throw new Error(result.error.message);
    game = result.state;
  }
  return game;
}

describe("bridge table", () => {
  afterEach(cleanup);
  afterEach(() => vi.restoreAllMocks());
  afterEach(() => vi.unstubAllGlobals());
  afterEach(() => vi.useRealTimers());
  beforeEach(() => window.localStorage.clear());

  it("starts a hand and advances the auction through the core reducer", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Start a new hand" }));
    expect(screen.getByRole("region", { name: "Auction" })).toBeTruthy();
    expect(screen.getByText("North to bid")).toBeTruthy();

    await user.selectOptions(screen.getByLabelText("Contract call"), "1clubs");
    await user.click(screen.getByRole("button", { name: "Make bid" }));
    expect(screen.getAllByRole("listitem")[0]?.textContent).toBe("North1 clubs");
    expect(screen.getByText("East to bid")).toBeTruthy();
  });

  it("shows rule feedback and keeps the auction on the same player after an invalid bid", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Start a new hand" }));
    await user.selectOptions(screen.getByLabelText("Contract call"), "1hearts");
    await user.click(screen.getByRole("button", { name: "Make bid" }));
    await user.selectOptions(screen.getByLabelText("Contract call"), "1clubs");
    await user.click(screen.getByRole("button", { name: "Make bid" }));

    expect(screen.getByRole("alert").textContent).toContain("must be higher");
    expect(screen.getByText("East to bid")).toBeTruthy();
  });

  it("rejects an off-suit card when the player can follow suit", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Start a new hand" }));
    const selectCall = async (call: string) => {
      await user.selectOptions(screen.getByLabelText("Contract call"), call);
      await user.click(screen.getByRole("button", { name: "Make bid" }));
    };
    await selectCall("1clubs");
    await selectCall("pass");
    await selectCall("pass");
    await selectCall("pass");
    await user.click(screen.getByRole("button", { name: "Play 4 of spades" }));
    await user.click(screen.getByRole("button", { name: "Play 4 of hearts" }));

    expect(screen.getByRole("alert").textContent).toContain("follow suit");
    expect(screen.getByText("South to play")).toBeTruthy();
  });

  it("shows every legal card as a hint without playing a card", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Start a new hand" }));
    const selectCall = async (call: string) => {
      await user.selectOptions(screen.getByLabelText("Contract call"), call);
      await user.click(screen.getByRole("button", { name: "Make bid" }));
    };
    await selectCall("1clubs");
    await selectCall("pass");
    await selectCall("pass");
    await selectCall("pass");
    const historyBefore = JSON.parse(window.localStorage.getItem("contractplay.solo")!).currentGame.history;

    await user.click(screen.getByRole("button", { name: "Show hint" }));

    expect(await screen.findByText("Legal cards are highlighted.")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /^Play / })).toHaveLength(13);
    expect(screen.getAllByRole("button", { name: /^Play / }).every((card) => card.classList.contains("hinted-card"))).toBe(true);
    expect(JSON.parse(window.localStorage.getItem("contractplay.solo")!).currentGame.history).toEqual(historyBefore);
  });

  it("shows optional solver recommendations when a solver is provided", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const solver: Solver = { recommendPlays: vi.fn().mockResolvedValue([{ suit: "spades", rank: "Q" }]) };
    const user = userEvent.setup();
    render(<App solver={solver} />);
    await user.click(screen.getByRole("button", { name: "Start a new hand" }));
    const selectCall = async (call: string) => {
      await user.selectOptions(screen.getByLabelText("Contract call"), call);
      await user.click(screen.getByRole("button", { name: "Make bid" }));
    };
    await selectCall("1clubs");
    await selectCall("pass");
    await selectCall("pass");
    await selectCall("pass");

    await user.click(screen.getByRole("button", { name: "Show hint" }));

    expect(await screen.findByText("Solver recommendations are highlighted.")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /^Play / }).filter((card) => card.classList.contains("hinted-card"))).toHaveLength(1);
    expect(solver.recommendPlays).toHaveBeenCalledTimes(1);
  });

  it("shows a message when solver recommendations fail", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const solver: Solver = { recommendPlays: vi.fn().mockRejectedValue(new Error("solver unavailable")) };
    const user = userEvent.setup();
    render(<App solver={solver} />);
    await user.click(screen.getByRole("button", { name: "Start a new hand" }));
    for (const call of ["1clubs", "pass", "pass", "pass"]) {
      await user.selectOptions(screen.getByLabelText("Contract call"), call);
      await user.click(screen.getByRole("button", { name: "Make bid" }));
    }

    await user.click(screen.getByRole("button", { name: "Show hint" }));

    expect((await screen.findByRole("alert")).textContent).toContain("Unable to get a hint. Please try again.");
  });

  it("limits a follow-suit hint to cards of the led suit", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Start a new hand" }));
    const selectCall = async (call: string) => {
      await user.selectOptions(screen.getByLabelText("Contract call"), call);
      await user.click(screen.getByRole("button", { name: "Make bid" }));
    };
    await selectCall("1clubs");
    await selectCall("pass");
    await selectCall("pass");
    await selectCall("pass");
    await user.click(screen.getByRole("button", { name: "Play 4 of spades" }));
    const playableCards = screen.getAllByRole("button", { name: /^Play / });

    await user.click(screen.getByRole("button", { name: "Show hint" }));

    expect(await screen.findByText("Legal cards are highlighted.")).toBeTruthy();
    const hintedCards = screen.getAllByRole("button", { name: /^Play / }).filter((card) => card.classList.contains("hinted-card"));
    expect(hintedCards.length).toBeGreaterThan(0);
    expect(hintedCards.length).toBeLessThan(playableCards.length);
    expect(hintedCards.every((card) => card.getAttribute("aria-label")?.endsWith("of spades"))).toBe(true);
  });

  it("does not display a pending hint after dealing a replacement hand", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Start a new hand" }));
    for (const call of ["1clubs", "pass", "pass", "pass"]) {
      fireEvent.change(screen.getByLabelText("Contract call"), { target: { value: call } });
      fireEvent.click(screen.getByRole("button", { name: "Make bid" }));
    }

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Show hint" }));
      fireEvent.click(screen.getByRole("button", { name: "Deal a new hand" }));
    });

    expect(screen.queryByText("Legal cards are highlighted.")).toBeNull();
  });

  it("plays legal cards through a complete hand and shows the result", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Start a new hand" }));
    const selectCall = async (call: string) => {
      await user.selectOptions(screen.getByLabelText("Contract call"), call);
      await user.click(screen.getByRole("button", { name: "Make bid" }));
    };
    await selectCall("1clubs");
    await selectCall("pass");
    await selectCall("pass");
    await selectCall("pass");

    const suitName: Record<string, string> = { "♠": "spades", "♥": "hearts", "♦": "diamonds", "♣": "clubs" };
    for (let cardCount = 0; cardCount < 52 && !screen.queryByRole("region", { name: "Hand result" }); cardCount++) {
      const cards = screen.getAllByRole("button", { name: /^Play / });
      const leadSymbol = screen.getByRole("region", { name: "Current trick" }).textContent?.match(/[♠♥♦♣]/)?.[0];
      const followingCard = leadSymbol
        ? cards.find((card) => card.getAttribute("aria-label")?.endsWith(`of ${suitName[leadSymbol]}`))
        : undefined;
      await user.click(followingCard ?? cards[0]!);
    }

    expect(screen.getByRole("region", { name: "Hand result" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Hand result" }).textContent).toContain("tricks for NS");
    await waitFor(() => expect(screen.getByRole("button", { name: "Review hand 1" })).toBeTruthy());
  }, 30000);

  it("uses the chosen dealer and vulnerability for a new deal", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText("Dealer"), "south");
    await user.selectOptions(screen.getByLabelText("Vulnerability"), "Both");
    await user.click(screen.getByRole("button", { name: "Start a new hand" }));

    expect(screen.getByText("BOARD 1 · DEALER SOUTH · VULNERABILITY BOTH")).toBeTruthy();
    expect(screen.getByText("South to bid")).toBeTruthy();
    await user.selectOptions(screen.getByLabelText("Dealer"), "west");
    await user.selectOptions(screen.getByLabelText("Vulnerability"), "NS");
    await user.click(screen.getByRole("button", { name: "Deal a new hand" }));
    expect(screen.getByText("BOARD 1 · DEALER WEST · VULNERABILITY NS")).toBeTruthy();
  });

  it("runs the three non-user seats through the auction using the selected style", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText("Opponents"), "bots");
    await user.selectOptions(screen.getByLabelText("Your seat"), "south");
    await user.selectOptions(screen.getByLabelText("Bot bidding style"), "2/1");
    await user.selectOptions(screen.getByLabelText("Bot skill"), "expert");
    await user.click(screen.getByRole("button", { name: "Start a new hand" }));

    await waitFor(() => expect(screen.getByText("South to bid")).toBeTruthy());
    expect(screen.getByRole("region", { name: "Auction" }).querySelectorAll("li").length).toBeGreaterThan(0);
    expect(screen.getByRole("region", { name: "Auction" }).querySelectorAll("li").length).toBeLessThan(3);
    expect(screen.getByLabelText("Contract call")).toBeTruthy();
  });

  it("offers Beginner through Expert bot skills when bots are enabled", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText("Opponents"), "bots");

    expect(screen.getByLabelText("Bot skill").textContent).toContain("Beginner");
    expect(screen.getByLabelText("Bot skill").textContent).toContain("Intermediate");
    expect(screen.getByLabelText("Bot skill").textContent).toContain("Advanced");
    expect(screen.getByLabelText("Bot skill").textContent).toContain("Expert");
  });

  it("automates bot play and lets the user play the exposed dummy hand", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText("Opponents"), "bots");
    await user.selectOptions(screen.getByLabelText("Your seat"), "north");
    await user.selectOptions(screen.getByLabelText("Dealer"), "north");
    await user.click(screen.getByRole("button", { name: "Start a new hand" }));
    await waitFor(() => expect(screen.getByText("North to bid")).toBeTruthy());
    await user.selectOptions(screen.getByLabelText("Contract call"), "1clubs");
    await user.click(screen.getByRole("button", { name: "Make bid" }));

    for (let call = 0; call < 8; call += 1) {
      if (screen.getByRole("region", { name: "Current trick" }).querySelectorAll(".trick-card").length > 0) break;
      if (screen.queryByText("North to bid")) {
        await user.selectOptions(screen.getByLabelText("Contract call"), "pass");
        await user.click(screen.getByRole("button", { name: "Make bid" }));
      } else {
        await waitFor(() => {
          const hasHumanTurn = !!screen.queryByText("North to bid");
          const hasOpeningLead = screen.getByRole("region", { name: "Current trick" }).querySelectorAll(".trick-card").length > 0;
          expect(hasHumanTurn || hasOpeningLead).toBe(true);
        });
      }
    }
    await waitFor(() => expect(screen.getByRole("region", { name: "Current trick" }).querySelectorAll(".trick-card")).toHaveLength(1));
    let dummyHand: HTMLElement | null | undefined;
    await waitFor(() => {
      dummyHand = ["North", "South"].map((seat) => screen.queryByRole("region", { name: `${seat}'s hand` }))
        .find((handPanel) => handPanel?.textContent?.includes("DUMMY"));
      expect(dummyHand).toBeTruthy();
    });
    const symbol = screen.getByRole("region", { name: "Current trick" }).textContent?.match(/[♠♥♦♣]/)?.[0];
    const suitName: Record<string, string> = { "♠": "spades", "♥": "hearts", "♦": "diamonds", "♣": "clubs" };
    await user.click(screen.getByRole("button", { name: "Show hint" }));
    expect(await screen.findByText("Legal cards are highlighted.")).toBeTruthy();
    const hintedDummyCards = screen.getAllByRole("button", { name: /^Play / }).filter((button) => button.classList.contains("hinted-card"));
    expect(hintedDummyCards.length).toBeGreaterThan(0);
    const dummyCards = screen.getAllByRole("button", { name: /^Play / });
    const ledSuit = symbol ? suitName[symbol] : undefined;
    const canFollowSuit = ledSuit !== undefined && dummyCards.some((button) => button.getAttribute("aria-label")?.endsWith(`of ${ledSuit}`));
    if (canFollowSuit) {
      expect(hintedDummyCards.every((button) => button.getAttribute("aria-label")?.endsWith(`of ${ledSuit}`))).toBe(true);
    } else {
      expect(hintedDummyCards).toHaveLength(dummyCards.length);
    }
    const dummyCard = canFollowSuit ? dummyCards.find((button) => button.getAttribute("aria-label")?.endsWith(`of ${ledSuit}`)) : dummyCards[0];
    await user.click(dummyCard!);
    await waitFor(() => expect(screen.getByRole("region", { name: "Current trick" }).querySelectorAll(".trick-card")).toHaveLength(3));
  });

  it("discards a queued bot decision when the user deals a replacement hand", async () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.change(screen.getByLabelText("Opponents"), { target: { value: "bots" } });
    fireEvent.change(screen.getByLabelText("Your seat"), { target: { value: "south" } });
    fireEvent.click(screen.getByRole("button", { name: "Start a new hand" }));
    fireEvent.change(screen.getByLabelText("Dealer"), { target: { value: "west" } });
    fireEvent.click(screen.getByRole("button", { name: "Deal a new hand" }));

    await act(async () => { await vi.runAllTimersAsync(); });
    const saved = JSON.parse(window.localStorage.getItem("contractplay.solo")!);
    expect(saved.currentGame.dealer).toBe("west");
    expect(saved.currentGame.auction[0].seat).toBe("west");
  });

  it("imports the first PBN board with its deal settings", async () => {
    const user = userEvent.setup();
    let imported = createGameState({ deal: deal(), dealer: "west", vulnerability: "EW" });
    for (const bid of ["1clubs", "pass", "pass", "pass"] as const) {
      const result = applyAction(imported, { type: "bid", seat: imported.currentActor, bid });
      if (!result.ok) throw new Error(result.error.message);
      imported = result.state;
    }
    const pbn = exportPbn({
      dealer: "west", vulnerability: "EW", actions: imported.history.actions, deal: imported.initialDeal,
      tags: [{ name: "Event", value: "Club Night" }], comments: ["Imported note"]
    });
    render(<App />);
    await user.click(screen.getByText("Import a PBN deal"));
    fireEvent.change(screen.getByLabelText("PBN deal"), { target: { value: pbn } });
    await user.click(screen.getByRole("button", { name: "Import hand" }));

    expect(screen.getByText("North to play")).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem("contractplay.solo")!).currentPbnMetadata).toEqual({
      tags: expect.arrayContaining([expect.objectContaining({ name: "Event", value: "Club Night" })]),
      comments: ["Imported note"]
    }));
  });

  it("exports a saved hand as PBN with its metadata", async () => {
    const user = userEvent.setup();
    const game = completedGame();
    saveSoloData(window.localStorage, {
      version: 1,
      currentHandId: "active-1",
      currentGame: createGameState({ deal: deal(), dealer: "north", vulnerability: "None" }),
      completedHands: [{
        id: "pbn-export-1", game, savedAt: "2026-10-25T12:00:00.000Z",
        pbnMetadata: { tags: [{ name: "Event", value: "Club Night" }, { name: "Site", value: "Table 4" }], comments: ["Imported board note"] }
      }]
    });
    expect(loadSoloData(window.localStorage).completedHands).toHaveLength(1);
    const createObjectURL = vi.fn().mockReturnValue("blob:contractplay-test");
    const revokeObjectURL = vi.fn();
    class CapturedBlob {
      readonly contents: string;
      readonly type: string | undefined;
      constructor(parts: readonly unknown[], options?: BlobPropertyBag) {
        this.contents = parts.map(String).join("");
        this.type = options?.type;
      }
    }
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    vi.stubGlobal("Blob", CapturedBlob);
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Export PBN hand 1" }));

    const download = createObjectURL.mock.calls[0]?.[0] as CapturedBlob | undefined;
    expect(download).toBeInstanceOf(CapturedBlob);
    expect(download?.type).toBe("text/plain;charset=utf-8");
    const exportedPbn = download?.contents ?? "";
    const board = parsePbn(exportedPbn).boards[0]!;
    expect(board.tags).toContainEqual(expect.objectContaining({ name: "Event", value: "Club Night" }));
    expect(board.tags).toContainEqual(expect.objectContaining({ name: "Site", value: "Table 4" }));
    expect(board.comments).toContain("Imported board note");
    expect(board.actions).toEqual(game.history.actions);
  });

  it("autosaves an accepted call and resumes it after the app reloads", async () => {
    const user = userEvent.setup();
    const firstRender = render(<App />);
    await user.click(screen.getByRole("button", { name: "Start a new hand" }));
    await user.selectOptions(screen.getByLabelText("Contract call"), "1clubs");
    await user.click(screen.getByRole("button", { name: "Make bid" }));

    await waitFor(() => expect(JSON.parse(window.localStorage.getItem("contractplay.solo")!).currentGame.auction).toHaveLength(1));
    firstRender.unmount();
    render(<App />);

    expect(screen.getByText("East to bid")).toBeTruthy();
    expect(screen.getAllByRole("listitem")[0]?.textContent).toBe("North1 clubs");
  });

  it("can take back and redo the most recent action", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Start a new hand" }));
    await user.selectOptions(screen.getByLabelText("Contract call"), "1clubs");
    await user.click(screen.getByRole("button", { name: "Make bid" }));
    await user.click(screen.getByRole("button", { name: "Take back" }));
    expect(screen.getByText("North to bid")).toBeTruthy();
    expect(screen.queryByText("North1 clubs")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Redo" }));
    expect(screen.getByText("East to bid")).toBeTruthy();
    expect(screen.getAllByRole("listitem")[0]?.textContent).toBe("North1 clubs");
  });

  it("steps through a saved hand without changing the active hand", async () => {
    const user = userEvent.setup();
    const finished = completedGame();
    const active = createGameState({ deal: deal(), dealer: "east", vulnerability: "EW" });
    const data: SoloData = {
      version: 1,
      currentHandId: "active-1",
      currentGame: active,
      completedHands: [{ id: "finished-1", game: finished, savedAt: "2026-10-25T12:00:00.000Z" }]
    };
    saveSoloData(window.localStorage, data);
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Review hand 1/ }));
    expect(screen.getByText("Reviewing action 0 of 56")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Next action" }));
    expect(screen.getByText("Reviewing action 1 of 56")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Exit review" }));

    expect(screen.getByText("East to bid")).toBeTruthy();
    expect(JSON.parse(window.localStorage.getItem("contractplay.solo")!).currentGame.currentActor).toBe("east");
  });
});
