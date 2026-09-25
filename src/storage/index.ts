import { load } from "@tauri-apps/plugin-store";
import { DEFAULT_COLOR } from "@/lib/color";
import { DEFAULT_SHORTCUT, HISTORY_LIMIT, STORE_FILE } from "@/lib/constants";
import type { AppSettings, Color, ColorFormat, HistoryItem, Locale } from "@/types";

const HISTORY_KEY = "history";
const SETTINGS_KEY = "settings";
const ONBOARDING_KEY = "onboardingSeen";

export const DEFAULT_SETTINGS: AppSettings = {
  locale: "es",
  alwaysOnTop: false,
  copyFormat: "hex",
  shortcut: DEFAULT_SHORTCUT,
};

function isLocale(value: unknown): value is Locale {
  return value === "es" || value === "en";
}

function isColorFormat(value: unknown): value is ColorFormat {
  return (
    value === "hex" ||
    value === "rgb" ||
    value === "hsl" ||
    value === "hslModern" ||
    value === "oklch" ||
    value === "hex8"
  );
}

function isRgb(value: unknown): value is Color["rgb"] {
  if (!value || typeof value !== "object") return false;
  const rgb = value as Record<string, unknown>;
  return (
    typeof rgb.r === "number" &&
    typeof rgb.g === "number" &&
    typeof rgb.b === "number"
  );
}

function isHsl(value: unknown): value is Color["hsl"] {
  if (!value || typeof value !== "object") return false;
  const hsl = value as Record<string, unknown>;
  return (
    typeof hsl.h === "number" &&
    typeof hsl.s === "number" &&
    typeof hsl.l === "number"
  );
}

function isColor(value: unknown): value is Color {
  if (!value || typeof value !== "object") return false;
  const color = value as Record<string, unknown>;
  return (
    typeof color.hex === "string" &&
    isRgb(color.rgb) &&
    isHsl(color.hsl)
  );
}

function isHistoryItem(value: unknown): value is HistoryItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.favorite === "boolean" &&
    isColor(item.color)
  );
}

function parseSettings(value: unknown): AppSettings {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_SETTINGS };
  }

  const raw = value as Record<string, unknown>;
  return {
    locale: isLocale(raw.locale) ? raw.locale : DEFAULT_SETTINGS.locale,
    alwaysOnTop:
      typeof raw.alwaysOnTop === "boolean"
        ? raw.alwaysOnTop
        : DEFAULT_SETTINGS.alwaysOnTop,
    copyFormat: isColorFormat(raw.copyFormat)
      ? raw.copyFormat
      : DEFAULT_SETTINGS.copyFormat,
    shortcut:
      typeof raw.shortcut === "string" && raw.shortcut.trim().length > 0
        ? raw.shortcut
        : DEFAULT_SETTINGS.shortcut,
  };
}

function parseHistory(value: unknown): HistoryItem[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isHistoryItem);
}

async function getStore() {
  return load(STORE_FILE, { autoSave: true });
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const store = await getStore();
    const value = await store.get<unknown>(SETTINGS_KEY);
    return parseSettings(value);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const store = await getStore();
  await store.set(SETTINGS_KEY, settings);
  await store.save();
}

export async function loadHistory(): Promise<HistoryItem[]> {
  try {
    const store = await getStore();
    const value = await store.get<unknown>(HISTORY_KEY);
    return parseHistory(value);
  } catch {
    return [];
  }
}

export async function saveHistory(items: HistoryItem[]): Promise<void> {
  const store = await getStore();
  await store.set(HISTORY_KEY, items);
  await store.save();
}

export async function loadOnboardingSeen(): Promise<boolean> {
  try {
    const store = await getStore();
    const value = await store.get<unknown>(ONBOARDING_KEY);
    return value === true;
  } catch {
    return false;
  }
}

export async function saveOnboardingSeen(seen = true): Promise<void> {
  const store = await getStore();
  await store.set(ONBOARDING_KEY, seen);
  await store.save();
}

export function createHistoryItem(color: Color, favorite = false): HistoryItem {
  return {
    id: crypto.randomUUID(),
    color,
    createdAt: new Date().toISOString(),
    favorite,
  };
}

/**
 * Keep newest HISTORY_LIMIT non-favorite rows, but never drop favorites
 * that still fit in a soft cap (favorites + recent).
 */
export function trimHistory(items: HistoryItem[]): HistoryItem[] {
  const favorites = items.filter((item) => item.favorite);
  const recent = items.filter((item) => !item.favorite).slice(0, HISTORY_LIMIT);
  const merged = [...favorites];
  for (const item of recent) {
    if (!merged.some((existing) => existing.id === item.id)) {
      merged.push(item);
    }
  }
  return merged;
}

export { DEFAULT_COLOR, HISTORY_LIMIT };
