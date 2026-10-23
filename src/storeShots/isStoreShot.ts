export function isStoreShotMode(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("storeShot");
}

export function isBrowserPreview(): boolean {
  if (typeof window === "undefined") return true;
  return !("__TAURI_INTERNALS__" in window);
}
