import type { Color, ColorFormat, Hsb, Hsl, Rgb } from "@/types";

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function clampUnit(value: number, max = 100): number {
  return Math.max(0, Math.min(max, value));
}

function toHexByte(value: number): string {
  return clampByte(value).toString(16).padStart(2, "0").toUpperCase();
}

export function rgbToHex(rgb: Rgb): string {
  return `#${toHexByte(rgb.r)}${toHexByte(rgb.g)}${toHexByte(rgb.b)}`;
}

export function hexToRgb(hex: string): Rgb | null {
  const normalized = hex.trim().replace(/^#/, "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    return null;
  }

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

export function rgbToHsl(rgb: Rgb): Hsl {
  const r = clampByte(rgb.r) / 255;
  const g = clampByte(rgb.g) / 255;
  const b = clampByte(rgb.b) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
  }

  h = Math.round((h * 60 + 360) % 360);
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(hsl: Hsl): Rgb {
  const h = ((hsl.h % 360) + 360) % 360;
  const s = clampUnit(hsl.s) / 100;
  const l = clampUnit(hsl.l) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h < 60) {
    rPrime = c;
    gPrime = x;
  } else if (h < 120) {
    rPrime = x;
    gPrime = c;
  } else if (h < 180) {
    gPrime = c;
    bPrime = x;
  } else if (h < 240) {
    gPrime = x;
    bPrime = c;
  } else if (h < 300) {
    rPrime = x;
    bPrime = c;
  } else {
    rPrime = c;
    bPrime = x;
  }

  return {
    r: clampByte((rPrime + m) * 255),
    g: clampByte((gPrime + m) * 255),
    b: clampByte((bPrime + m) * 255),
  };
}

export function rgbToHsb(rgb: Rgb): Hsb {
  const r = clampByte(rgb.r) / 255;
  const g = clampByte(rgb.g) / 255;
  const b = clampByte(rgb.b) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
  }

  h = Math.round((h * 60 + 360) % 360);
  const s = max === 0 ? 0 : (delta / max) * 100;
  const brightness = max * 100;

  return {
    h,
    s: Math.round(s),
    b: Math.round(brightness),
  };
}

export function hsbToRgb(hsb: Hsb): Rgb {
  const h = ((hsb.h % 360) + 360) % 360;
  const s = clampUnit(hsb.s) / 100;
  const v = clampUnit(hsb.b) / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h < 60) {
    rPrime = c;
    gPrime = x;
  } else if (h < 120) {
    rPrime = x;
    gPrime = c;
  } else if (h < 180) {
    gPrime = c;
    bPrime = x;
  } else if (h < 240) {
    gPrime = x;
    bPrime = c;
  } else if (h < 300) {
    rPrime = x;
    bPrime = c;
  } else {
    rPrime = c;
    bPrime = x;
  }

  return {
    r: clampByte((rPrime + m) * 255),
    g: clampByte((gPrime + m) * 255),
    b: clampByte((bPrime + m) * 255),
  };
}

export function colorFromRgb(rgb: Rgb): Color {
  const normalized = {
    r: clampByte(rgb.r),
    g: clampByte(rgb.g),
    b: clampByte(rgb.b),
  };

  return {
    hex: rgbToHex(normalized),
    rgb: normalized,
    hsl: rgbToHsl(normalized),
  };
}

export function colorFromHex(hex: string): Color | null {
  const rgb = hexToRgb(hex);
  return rgb ? colorFromRgb(rgb) : null;
}

export function colorFromHsb(hsb: Hsb): Color {
  return colorFromRgb(hsbToRgb(hsb));
}

export function colorToHsb(color: Color): Hsb {
  return rgbToHsb(color.rgb);
}

export function formatColor(color: Color, format: ColorFormat): string {
  switch (format) {
    case "rgb":
      return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    case "hsl":
      return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
    case "hslModern":
      return `hsl(${color.hsl.h} ${color.hsl.s}% ${color.hsl.l}%)`;
    case "oklch": {
      const { l, c, h } = rgbToOklch(color.rgb);
      return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;
    }
    case "hex8":
      return `${color.hex}FF`;
    case "hex":
    default:
      return color.hex;
  }
}

/** sRGB → OKLCH (approx, for CSS copy). */
export function rgbToOklch(rgb: Rgb): { l: number; c: number; h: number } {
  const toLinear = (v: number) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);
  const l_ = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m_ = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s_ = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l = Math.cbrt(l_);
  const m = Math.cbrt(m_);
  const s = Math.cbrt(s_);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bOk = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(a, bOk);
  let H = (Math.atan2(bOk, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { l: L, c: C, h: Number.isFinite(H) ? H : 0 };
}

/** WCAG contrast ratio between two sRGB colors. */
export function contrastRatio(fg: Rgb, bg: Rgb): number {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export type ContrastLevel = "fail" | "AA" | "AAA";

export function contrastLevel(ratio: number, largeText = false): ContrastLevel {
  if (largeText) {
    if (ratio >= 4.5) return "AAA";
    if (ratio >= 3) return "AA";
    return "fail";
  }
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  return "fail";
}

export function contrastReport(color: Color): {
  onWhite: number;
  onBlack: number;
  levelWhite: ContrastLevel;
  levelBlack: ContrastLevel;
} {
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };
  const onWhite = contrastRatio(color.rgb, white);
  const onBlack = contrastRatio(color.rgb, black);
  return {
    onWhite,
    onBlack,
    levelWhite: contrastLevel(onWhite),
    levelBlack: contrastLevel(onBlack),
  };
}

function rotateHue(h: number, delta: number): number {
  return (((h + delta) % 360) + 360) % 360;
}

/** Opposite hue — strong contrast for CTAs and accents. */
export function complementaryPalette(color: Color): Color[] {
  const hsb = colorToHsb(color);
  return [color, colorFromHsb({ ...hsb, h: rotateHue(hsb.h, 180) })];
}

/** Neighbor hues — soft harmony for backgrounds and calm UI. */
export function analogousPalette(color: Color): Color[] {
  const hsb = colorToHsb(color);
  return [
    colorFromHsb({ ...hsb, h: rotateHue(hsb.h, -30) }),
    color,
    colorFromHsb({ ...hsb, h: rotateHue(hsb.h, 30) }),
  ];
}

/** Three evenly spaced hues — lively but balanced sets. */
export function triadicPalette(color: Color): Color[] {
  const hsb = colorToHsb(color);
  return [
    color,
    colorFromHsb({ ...hsb, h: rotateHue(hsb.h, 120) }),
    colorFromHsb({ ...hsb, h: rotateHue(hsb.h, 240) }),
  ];
}

export function exportPaletteAsText(
  title: string,
  colors: Color[],
  format: ColorFormat,
): string {
  const lines = [
    title,
    ...colors.map((color, index) => `${index + 1}. ${formatColor(color, format)}`),
    "",
    `Generated with BK Picker · Adrian Tafoya`,
  ];
  return lines.join("\n");
}

/** Relative luminance for WCAG-ish contrast decisions. */
export function relativeLuminance(rgb: Rgb): number {
  const channel = (value: number) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

export function contrastingInk(color: Color): "#111111" | "#F5F5F7" {
  return relativeLuminance(color.rgb) > 0.45 ? "#111111" : "#F5F5F7";
}

export const DEFAULT_COLOR: Color = colorFromRgb({ r: 59, g: 130, b: 246 });
