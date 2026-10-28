import type { StorageLike } from "@contractplay/persistence";

export interface ClientPersistenceAdapter {
  readonly storage: StorageLike;
  onSuspend(flush: () => void): () => void;
}

export function createClientPersistenceAdapter(
  storage: StorageLike,
  appWindow: Window = window,
  appDocument: Document = document
): ClientPersistenceAdapter {
  return {
    storage,
    onSuspend: (flush) => installPersistenceLifecycle(flush, appWindow, appDocument)
  };
}

export function installPersistenceLifecycle(
  flush: () => void,
  appWindow: Window = window,
  appDocument: Document = document
): () => void {
  const onVisibilityChange = () => {
    if (appDocument.visibilityState === "hidden") flush();
  };
  appDocument.addEventListener("visibilitychange", onVisibilityChange);
  appWindow.addEventListener("pagehide", flush);

  return () => {
    appDocument.removeEventListener("visibilitychange", onVisibilityChange);
    appWindow.removeEventListener("pagehide", flush);
  };
}
