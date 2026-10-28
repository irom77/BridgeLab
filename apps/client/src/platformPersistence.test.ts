// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { createClientPersistenceAdapter, installPersistenceLifecycle } from "./platformPersistence.js";

describe("persistence lifecycle", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("flushes saved data when the app is hidden or the page is closed", () => {
    const flush = vi.fn();
    const previousVisibility = Object.getOwnPropertyDescriptor(document, "visibilityState");
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    const cleanup = installPersistenceLifecycle(flush, window, document);

    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("pagehide"));

    expect(flush).toHaveBeenCalledTimes(2);
    cleanup();
    if (previousVisibility) Object.defineProperty(document, "visibilityState", previousVisibility);
  });

  it("does not flush when the app remains visible", () => {
    const flush = vi.fn();
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    const cleanup = installPersistenceLifecycle(flush, window, document);

    document.dispatchEvent(new Event("visibilitychange"));

    expect(flush).not.toHaveBeenCalled();
    cleanup();
  });

  it("keeps the shared storage contract and flushes it on app suspension", () => {
    const storage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    const adapter = createClientPersistenceAdapter(storage, window, document);
    const cleanup = adapter.onSuspend(() => adapter.storage.setItem("contractplay.solo", "saved"));

    window.dispatchEvent(new Event("pagehide"));

    expect(adapter.storage).toBe(storage);
    expect(storage.setItem).toHaveBeenCalledWith("contractplay.solo", "saved");
    cleanup();
  });
});
