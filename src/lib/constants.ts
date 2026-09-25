/** Maximum recent colors retained in history (favorites may sit outside this window). */
export const HISTORY_LIMIT = 30;

export const DEFAULT_SHORTCUT = "Alt+C";

export const SHORTCUT_PRESETS = ["Alt+C", "Ctrl+Shift+C", "Ctrl+Alt+C"] as const;

export const STORE_FILE = "bk-picker.json";

export const APP_CREATOR = {
  name: "Adrian Tafoya",
  url: "https://adriantaf.github.io",
} as const;
