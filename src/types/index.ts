export type Rgb = {
  r: number;
  g: number;
  b: number;
};

export type Hsl = {
  h: number;
  s: number;
  l: number;
};

/** Hue 0–360, saturation/brightness 0–100 (HSB / HSV). */
export type Hsb = {
  h: number;
  s: number;
  b: number;
};

export type Color = {
  hex: string;
  rgb: Rgb;
  hsl: Hsl;
};

export type ColorFormat =
  | "hex"
  | "rgb"
  | "hsl"
  | "hslModern"
  | "oklch"
  | "hex8";

export type PaletteType = "complementary" | "analogous" | "triadic";

export type Locale = "es" | "en";

export type AppTab = "picker" | "history" | "palettes" | "systems" | "settings";

export type PickerMode = "eyedropper" | "manual" | "image";

export type HistoryItem = {
  id: string;
  color: Color;
  createdAt: string;
  favorite: boolean;
};

export type AppSettings = {
  locale: Locale;
  alwaysOnTop: boolean;
  copyFormat: ColorFormat;
  shortcut: string;
};

export type CapturedColorPayload = {
  hex: string;
  r: number;
  g: number;
  b: number;
  copiedText: string;
};

export type ShortcutStatus = {
  registered: boolean;
  shortcut: string;
  error: string | null;
};

export type LoupeUpdate = {
  x: number;
  y: number;
  hex: string;
  r: number;
  g: number;
  b: number;
  size: number;
  pixels: number[];
};
