import { colorFromHex } from "@/lib/color";
import type { Color, HistoryItem, LoupeUpdate } from "@/types";

function mustColor(hex: string): Color {
  const color = colorFromHex(hex);
  if (!color) throw new Error(`Invalid demo hex: ${hex}`);
  return color;
}

/** Vibrant demo palette for Store screenshots. */
export const DEMO_ACTIVE = mustColor("#3B82F6");

export const DEMO_HISTORY: HistoryItem[] = [
  { id: "demo-1", color: mustColor("#3B82F6"), createdAt: "2026-10-20T18:00:00.000Z", favorite: true },
  { id: "demo-2", color: mustColor("#F43F5E"), createdAt: "2026-10-20T17:50:00.000Z", favorite: true },
  { id: "demo-3", color: mustColor("#10B981"), createdAt: "2026-10-20T17:40:00.000Z", favorite: true },
  { id: "demo-4", color: mustColor("#F59E0B"), createdAt: "2026-10-20T17:30:00.000Z", favorite: false },
  { id: "demo-5", color: mustColor("#8B5CF6"), createdAt: "2026-10-20T17:20:00.000Z", favorite: false },
  { id: "demo-6", color: mustColor("#06B6D4"), createdAt: "2026-10-20T17:10:00.000Z", favorite: false },
  { id: "demo-7", color: mustColor("#EC4899"), createdAt: "2026-10-20T17:00:00.000Z", favorite: false },
  { id: "demo-8", color: mustColor("#64748B"), createdAt: "2026-10-20T16:50:00.000Z", favorite: false },
];

/** Synthetic loupe grid centered on #3B82F6. */
export function buildDemoLoupe(hex = "#3B82F6"): LoupeUpdate {
  const color = mustColor(hex);
  const size = 11;
  const pixels: number[] = [];
  const mid = Math.floor(size / 2);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dist = Math.hypot(x - mid, y - mid);
      const mix = Math.min(1, dist / (mid + 0.5));
      const r = Math.round(color.rgb.r * (1 - mix) + 30 * mix);
      const g = Math.round(color.rgb.g * (1 - mix) + 40 * mix);
      const b = Math.round(color.rgb.b * (1 - mix) + 55 * mix);
      // Neighbor variation so the loupe looks like a real capture.
      const jitter = ((x * 17 + y * 31) % 7) - 3;
      pixels.push(
        Math.max(0, Math.min(255, r + jitter)),
        Math.max(0, Math.min(255, g + jitter)),
        Math.max(0, Math.min(255, b + jitter)),
      );
    }
  }

  return {
    x: 960,
    y: 540,
    hex: color.hex,
    r: color.rgb.r,
    g: color.rgb.g,
    b: color.rgb.b,
    size,
    pixels,
  };
}

export type StoreShotId =
  | "manual"
  | "loupe"
  | "image"
  | "history"
  | "palettes"
  | "systems"
  | "settings";

export type StoreShotCommand = {
  shot: StoreShotId;
};
