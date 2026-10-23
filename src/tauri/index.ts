import type {
  CapturedColorPayload,
  LoupeUpdate,
  ShortcutStatus,
} from "@/types";

type UnlistenFn = () => void;

function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

async function invokeCmd<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<T>(cmd, args);
}

async function listenEvent<T>(
  event: string,
  handler: (payload: T) => void,
): Promise<UnlistenFn> {
  if (!isTauri()) {
    return () => undefined;
  }
  const { listen } = await import("@tauri-apps/api/event");
  return listen<T>(event, (e) => handler(e.payload));
}

export async function capturePixelUnderCursor(): Promise<CapturedColorPayload> {
  return invokeCmd<CapturedColorPayload>("capture_pixel_under_cursor");
}

export async function getShortcutStatus(): Promise<ShortcutStatus> {
  if (!isTauri()) {
    return { registered: true, shortcut: "Alt+C", error: null };
  }
  return invokeCmd<ShortcutStatus>("get_shortcut_status");
}

export async function setAlwaysOnTop(enabled: boolean): Promise<void> {
  if (!isTauri()) return;
  await invokeCmd("set_always_on_top", { enabled });
}

export async function startPickMode(): Promise<void> {
  if (!isTauri()) return;
  await invokeCmd("start_pick_mode");
}

export async function stopPickMode(): Promise<void> {
  if (!isTauri()) return;
  await invokeCmd("stop_pick_mode");
}

export async function isPickMode(): Promise<boolean> {
  if (!isTauri()) return false;
  return invokeCmd<boolean>("is_pick_mode");
}

export async function setGlobalShortcut(
  shortcut: string,
): Promise<ShortcutStatus> {
  if (!isTauri()) {
    return { registered: true, shortcut, error: null };
  }
  return invokeCmd<ShortcutStatus>("set_global_shortcut", { shortcut });
}

export async function copyTextToClipboard(text: string): Promise<void> {
  if (!isTauri()) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    }
    return;
  }
  const { writeText } = await import("@tauri-apps/plugin-clipboard-manager");
  await writeText(text);
}

/** Open https URL in the OS default browser. */
export async function openExternalUrl(url: string): Promise<void> {
  if (!isTauri()) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  const { openUrl } = await import("@tauri-apps/plugin-opener");
  await openUrl(url);
}

/** Fetch remote image bytes via Tauri HTTP (bypasses WebView CORS). */
export async function fetchImageBytes(url: string): Promise<Uint8Array> {
  if (!isTauri()) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return new Uint8Array(await response.arrayBuffer());
  }
  const { fetch: tauriFetch } = await import("@tauri-apps/plugin-http");
  const response = await tauriFetch(url, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

export function onColorCaptured(
  handler: (payload: CapturedColorPayload) => void,
): Promise<UnlistenFn> {
  return listenEvent<CapturedColorPayload>("color-captured", handler);
}

export function onShortcutError(
  handler: (message: string) => void,
): Promise<UnlistenFn> {
  return listenEvent<string>("shortcut-error", handler);
}

export function onLoupeUpdate(
  handler: (payload: LoupeUpdate) => void,
): Promise<UnlistenFn> {
  return listenEvent<LoupeUpdate>("loupe-update", handler);
}

export function onPickStopped(handler: () => void): Promise<UnlistenFn> {
  return listenEvent("pick-stopped", () => handler());
}

export function onPickCancelled(handler: () => void): Promise<UnlistenFn> {
  return listenEvent("pick-cancelled", () => handler());
}
