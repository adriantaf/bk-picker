import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";
import type {
  CapturedColorPayload,
  LoupeUpdate,
  ShortcutStatus,
} from "@/types";

export async function capturePixelUnderCursor(): Promise<CapturedColorPayload> {
  return invoke<CapturedColorPayload>("capture_pixel_under_cursor");
}

export async function getShortcutStatus(): Promise<ShortcutStatus> {
  return invoke<ShortcutStatus>("get_shortcut_status");
}

export async function setAlwaysOnTop(enabled: boolean): Promise<void> {
  await invoke("set_always_on_top", { enabled });
}

export async function startPickMode(): Promise<void> {
  await invoke("start_pick_mode");
}

export async function stopPickMode(): Promise<void> {
  await invoke("stop_pick_mode");
}

export async function isPickMode(): Promise<boolean> {
  return invoke<boolean>("is_pick_mode");
}

export async function setGlobalShortcut(
  shortcut: string,
): Promise<ShortcutStatus> {
  return invoke<ShortcutStatus>("set_global_shortcut", { shortcut });
}

export async function copyTextToClipboard(text: string): Promise<void> {
  await writeText(text);
}

/** Open https URL in the OS default browser. */
export async function openExternalUrl(url: string): Promise<void> {
  const { openUrl } = await import("@tauri-apps/plugin-opener");
  await openUrl(url);
}

/** Fetch remote image bytes via Tauri HTTP (bypasses WebView CORS). */
export async function fetchImageBytes(url: string): Promise<Uint8Array> {
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
  return listen<CapturedColorPayload>("color-captured", (event) => {
    handler(event.payload);
  });
}

export function onShortcutError(
  handler: (message: string) => void,
): Promise<UnlistenFn> {
  return listen<string>("shortcut-error", (event) => {
    handler(event.payload);
  });
}

export function onLoupeUpdate(
  handler: (payload: LoupeUpdate) => void,
): Promise<UnlistenFn> {
  return listen<LoupeUpdate>("loupe-update", (event) => {
    handler(event.payload);
  });
}

export function onPickStopped(handler: () => void): Promise<UnlistenFn> {
  return listen("pick-stopped", () => handler());
}

export function onPickCancelled(handler: () => void): Promise<UnlistenFn> {
  return listen("pick-cancelled", () => handler());
}
