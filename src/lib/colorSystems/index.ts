import type { Color, Rgb } from "@/types";
import { colorFromHex, colorFromRgb } from "@/lib/color";

export type ColorSystemId = "tailwind" | "material" | "css" | "bootstrap";

export type SystemSwatch = {
  token: string;
  /** Ready-to-paste token (e.g. bg-blue-500 or Blue 500). */
  copyText: string;
  hex: string;
  rgb: Rgb;
};

export type SystemMatch = SystemSwatch & {
  system: ColorSystemId;
  distance: number;
};

export type ColorSystemDef = {
  id: ColorSystemId;
  labelKey: string;
  swatches: SystemSwatch[];
  match: (color: Color, limit?: number) => SystemMatch[];
};

function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = Number.parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function swatch(token: string, hex: string, copyText = token): SystemSwatch {
  const rgb = hexToRgb(hex);
  return { token, copyText, hex: `#${hex.replace("#", "").toUpperCase()}`, rgb };
}

/** sRGB 0–255 → Lab (D65). */
export function rgbToLab(rgb: Rgb): [number, number, number] {
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;
  r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
  g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
  b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  x = x > 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

export function deltaE76(a: Rgb, b: Rgb): number {
  const [l1, a1, b1] = rgbToLab(a);
  const [l2, a2, b2] = rgbToLab(b);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}

export function nearestInPalette(
  target: Color,
  system: ColorSystemId,
  palette: SystemSwatch[],
  limit = 3,
): SystemMatch[] {
  return palette
    .map((s) => ({
      ...s,
      system,
      distance: deltaE76(target.rgb, s.rgb),
    }))
    .sort((x, y) => x.distance - y.distance)
    .slice(0, limit);
}

// ——— Tailwind default palette (v3) ———
const TW_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const TW_COLORS: Record<string, string[]> = {
  slate: ["#f8fafc","#f1f5f9","#e2e8f0","#cbd5e1","#94a3b8","#64748b","#475569","#334155","#1e293b","#0f172a","#020617"],
  gray: ["#f9fafb","#f3f4f6","#e5e7eb","#d1d5db","#9ca3af","#6b7280","#4b5563","#374151","#1f2937","#111827","#030712"],
  zinc: ["#fafafa","#f4f4f5","#e4e4e7","#d4d4d8","#a1a1aa","#71717a","#52525b","#3f3f46","#27272a","#18181b","#09090b"],
  neutral: ["#fafafa","#f5f5f5","#e5e5e5","#d4d4d4","#a3a3a3","#737373","#525252","#404040","#262626","#171717","#0a0a0a"],
  stone: ["#fafaf9","#f5f5f4","#e7e5e4","#d6d3d1","#a8a29e","#78716c","#57534e","#44403c","#292524","#1c1917","#0c0a09"],
  red: ["#fef2f2","#fee2e2","#fecaca","#fca5a5","#f87171","#ef4444","#dc2626","#b91c1c","#991b1b","#7f1d1d","#450a0a"],
  orange: ["#fff7ed","#ffedd5","#fed7aa","#fdba74","#fb923c","#f97316","#ea580c","#c2410c","#9a3412","#7c2d12","#431407"],
  amber: ["#fffbeb","#fef3c7","#fde68a","#fcd34d","#fbbf24","#f59e0b","#d97706","#b45309","#92400e","#78350f","#451a03"],
  yellow: ["#fefce8","#fef9c3","#fef08a","#fde047","#facc15","#eab308","#ca8a04","#a16207","#854d0e","#713f12","#422006"],
  lime: ["#f7fee7","#ecfccb","#d9f99d","#bef264","#a3e635","#84cc16","#65a30d","#4d7c0f","#3f6212","#365314","#1a2e05"],
  green: ["#f0fdf4","#dcfce7","#bbf7d0","#86efac","#4ade80","#22c55e","#16a34a","#15803d","#166534","#14532d","#052e16"],
  emerald: ["#ecfdf5","#d1fae5","#a7f3d0","#6ee7b7","#34d399","#10b981","#059669","#047857","#065f46","#064e3b","#022c22"],
  teal: ["#f0fdfa","#ccfbf1","#99f6e4","#5eead4","#2dd4bf","#14b8a6","#0d9488","#0f766e","#115e59","#134e4a","#042f2e"],
  cyan: ["#ecfeff","#cffafe","#a5f3fc","#67e8f9","#22d3ee","#06b6d4","#0891b2","#0e7490","#155e75","#164e63","#083344"],
  sky: ["#f0f9ff","#e0f2fe","#bae6fd","#7dd3fc","#38bdf8","#0ea5e9","#0284c7","#0369a1","#075985","#0c4a6e","#082f49"],
  blue: ["#eff6ff","#dbeafe","#bfdbfe","#93c5fd","#60a5fa","#3b82f6","#2563eb","#1d4ed8","#1e40af","#1e3a8a","#172554"],
  indigo: ["#eef2ff","#e0e7ff","#c7d2fe","#a5b4fc","#818cf8","#6366f1","#4f46e5","#4338ca","#3730a3","#312e81","#1e1b4b"],
  violet: ["#f5f3ff","#ede9fe","#ddd6fe","#c4b5fd","#a78bfa","#8b5cf6","#7c3aed","#6d28d9","#5b21b6","#4c1d95","#2e1065"],
  purple: ["#faf5ff","#f3e8ff","#e9d5ff","#d8b4fe","#c084fc","#a855f7","#9333ea","#7e22ce","#6b21a8","#581c87","#3b0764"],
  fuchsia: ["#fdf4ff","#fae8ff","#f5d0fe","#f0abfc","#e879f9","#d946ef","#c026d3","#a21caf","#86198f","#701a75","#4a044e"],
  pink: ["#fdf2f8","#fce7f3","#fbcfe8","#f9a8d4","#f472b6","#ec4899","#db2777","#be185d","#9d174d","#831843","#500724"],
  rose: ["#fff1f2","#ffe4e6","#fecdd3","#fda4af","#fb7185","#f43f5e","#e11d48","#be123c","#9f1239","#881337","#4c0519"],
};

function buildTailwind(): SystemSwatch[] {
  const out: SystemSwatch[] = [
    swatch("white", "#ffffff", "white"),
    swatch("black", "#000000", "black"),
  ];
  for (const [name, hexes] of Object.entries(TW_COLORS)) {
      TW_SHADES.forEach((shade, i) => {
      const token = `${name}-${shade}`;
      const hex = hexes[i] ?? "#000000";
      out.push(swatch(token, hex, token));
    });
  }
  return out;
}

// ——— Material Design (classic 500 + accents used on Android) ———
function buildMaterial(): SystemSwatch[] {
  const entries: Array<[string, string]> = [
    ["Red 50", "#FFEBEE"], ["Red 100", "#FFCDD2"], ["Red 200", "#EF9A9A"], ["Red 300", "#E57373"],
    ["Red 400", "#EF5350"], ["Red 500", "#F44336"], ["Red 600", "#E53935"], ["Red 700", "#D32F2F"],
    ["Red 800", "#C62828"], ["Red 900", "#B71C1C"], ["Red A200", "#FF5252"], ["Red A400", "#FF1744"],
    ["Pink 50", "#FCE4EC"], ["Pink 100", "#F8BBD0"], ["Pink 200", "#F48FB1"], ["Pink 300", "#F06292"],
    ["Pink 400", "#EC407A"], ["Pink 500", "#E91E63"], ["Pink 600", "#D81B60"], ["Pink 700", "#C2185B"],
    ["Pink 800", "#AD1457"], ["Pink 900", "#880E4F"], ["Pink A200", "#FF4081"], ["Pink A400", "#F50057"],
    ["Purple 50", "#F3E5F5"], ["Purple 100", "#E1BEE7"], ["Purple 200", "#CE93D8"], ["Purple 300", "#BA68C8"],
    ["Purple 400", "#AB47BC"], ["Purple 500", "#9C27B0"], ["Purple 600", "#8E24AA"], ["Purple 700", "#7B1FA2"],
    ["Purple 800", "#6A1B9A"], ["Purple 900", "#4A148C"], ["Purple A200", "#E040FB"], ["Purple A400", "#D500F9"],
    ["Deep Purple 50", "#EDE7F6"], ["Deep Purple 100", "#D1C4E9"], ["Deep Purple 200", "#B39DDB"],
    ["Deep Purple 300", "#9575CD"], ["Deep Purple 400", "#7E57C2"], ["Deep Purple 500", "#673AB7"],
    ["Deep Purple 600", "#5E35B1"], ["Deep Purple 700", "#512DA8"], ["Deep Purple 800", "#4527A0"],
    ["Deep Purple 900", "#311B92"], ["Deep Purple A200", "#7C4DFF"], ["Deep Purple A400", "#651FFF"],
    ["Indigo 50", "#E8EAF6"], ["Indigo 100", "#C5CAE9"], ["Indigo 200", "#9FA8DA"], ["Indigo 300", "#7986CB"],
    ["Indigo 400", "#5C6BC0"], ["Indigo 500", "#3F51B5"], ["Indigo 600", "#3949AB"], ["Indigo 700", "#303F9F"],
    ["Indigo 800", "#283593"], ["Indigo 900", "#1A237E"], ["Indigo A200", "#536DFE"], ["Indigo A400", "#3D5AFE"],
    ["Blue 50", "#E3F2FD"], ["Blue 100", "#BBDEFB"], ["Blue 200", "#90CAF9"], ["Blue 300", "#64B5F6"],
    ["Blue 400", "#42A5F5"], ["Blue 500", "#2196F3"], ["Blue 600", "#1E88E5"], ["Blue 700", "#1976D2"],
    ["Blue 800", "#1565C0"], ["Blue 900", "#0D47A1"], ["Blue A200", "#448AFF"], ["Blue A400", "#2979FF"],
    ["Light Blue 50", "#E1F5FE"], ["Light Blue 100", "#B3E5FC"], ["Light Blue 200", "#81D4FA"],
    ["Light Blue 300", "#4FC3F7"], ["Light Blue 400", "#29B6F6"], ["Light Blue 500", "#03A9F4"],
    ["Light Blue 600", "#039BE5"], ["Light Blue 700", "#0288D1"], ["Light Blue 800", "#0277BD"],
    ["Light Blue 900", "#01579B"], ["Light Blue A200", "#40C4FF"], ["Light Blue A400", "#00B0FF"],
    ["Cyan 50", "#E0F7FA"], ["Cyan 100", "#B2EBF2"], ["Cyan 200", "#80DEEA"], ["Cyan 300", "#4DD0E1"],
    ["Cyan 400", "#26C6DA"], ["Cyan 500", "#00BCD4"], ["Cyan 600", "#00ACC1"], ["Cyan 700", "#0097A7"],
    ["Cyan 800", "#00838F"], ["Cyan 900", "#006064"], ["Cyan A200", "#18FFFF"], ["Cyan A400", "#00E5FF"],
    ["Teal 50", "#E0F2F1"], ["Teal 100", "#B2DFDB"], ["Teal 200", "#80CBC4"], ["Teal 300", "#4DB6AC"],
    ["Teal 400", "#26A69A"], ["Teal 500", "#009688"], ["Teal 600", "#00897B"], ["Teal 700", "#00796B"],
    ["Teal 800", "#00695C"], ["Teal 900", "#004D40"], ["Teal A200", "#64FFDA"], ["Teal A400", "#1DE9B6"],
    ["Green 50", "#E8F5E9"], ["Green 100", "#C8E6C9"], ["Green 200", "#A5D6A7"], ["Green 300", "#81C784"],
    ["Green 400", "#66BB6A"], ["Green 500", "#4CAF50"], ["Green 600", "#43A047"], ["Green 700", "#388E3C"],
    ["Green 800", "#2E7D32"], ["Green 900", "#1B5E20"], ["Green A200", "#69F0AE"], ["Green A400", "#00E676"],
    ["Light Green 50", "#F1F8E9"], ["Light Green 100", "#DCEDC8"], ["Light Green 200", "#C5E1A5"],
    ["Light Green 300", "#AED581"], ["Light Green 400", "#9CCC65"], ["Light Green 500", "#8BC34A"],
    ["Light Green 600", "#7CB342"], ["Light Green 700", "#689F38"], ["Light Green 800", "#558B2F"],
    ["Light Green 900", "#33691E"], ["Light Green A200", "#B2FF59"], ["Light Green A400", "#76FF03"],
    ["Lime 50", "#F9FBE7"], ["Lime 100", "#F0F4C3"], ["Lime 200", "#E6EE9C"], ["Lime 300", "#DCE775"],
    ["Lime 400", "#D4E157"], ["Lime 500", "#CDDC39"], ["Lime 600", "#C0CA33"], ["Lime 700", "#AFB42B"],
    ["Lime 800", "#9E9D24"], ["Lime 900", "#827717"], ["Lime A200", "#EEFF41"], ["Lime A400", "#C6FF00"],
    ["Yellow 50", "#FFFDE7"], ["Yellow 100", "#FFF9C4"], ["Yellow 200", "#FFF59D"], ["Yellow 300", "#FFF176"],
    ["Yellow 400", "#FFEE58"], ["Yellow 500", "#FFEB3B"], ["Yellow 600", "#FDD835"], ["Yellow 700", "#FBC02D"],
    ["Yellow 800", "#F9A825"], ["Yellow 900", "#F57F17"], ["Yellow A200", "#FFFF00"], ["Yellow A400", "#FFEA00"],
    ["Amber 50", "#FFF8E1"], ["Amber 100", "#FFECB3"], ["Amber 200", "#FFE082"], ["Amber 300", "#FFD54F"],
    ["Amber 400", "#FFCA28"], ["Amber 500", "#FFC107"], ["Amber 600", "#FFB300"], ["Amber 700", "#FFA000"],
    ["Amber 800", "#FF8F00"], ["Amber 900", "#FF6F00"], ["Amber A200", "#FFD740"], ["Amber A400", "#FFC400"],
    ["Orange 50", "#FFF3E0"], ["Orange 100", "#FFE0B2"], ["Orange 200", "#FFCC80"], ["Orange 300", "#FFB74D"],
    ["Orange 400", "#FFA726"], ["Orange 500", "#FF9800"], ["Orange 600", "#FB8C00"], ["Orange 700", "#F57C00"],
    ["Orange 800", "#EF6C00"], ["Orange 900", "#E65100"], ["Orange A200", "#FFAB40"], ["Orange A400", "#FF9100"],
    ["Deep Orange 50", "#FBE9E7"], ["Deep Orange 100", "#FFCCBC"], ["Deep Orange 200", "#FFAB91"],
    ["Deep Orange 300", "#FF8A65"], ["Deep Orange 400", "#FF7043"], ["Deep Orange 500", "#FF5722"],
    ["Deep Orange 600", "#F4511E"], ["Deep Orange 700", "#E64A19"], ["Deep Orange 800", "#D84315"],
    ["Deep Orange 900", "#BF360C"], ["Deep Orange A200", "#FF6E40"], ["Deep Orange A400", "#FF3D00"],
    ["Brown 50", "#EFEBE9"], ["Brown 100", "#D7CCC8"], ["Brown 200", "#BCAAA4"], ["Brown 300", "#A1887F"],
    ["Brown 400", "#8D6E63"], ["Brown 500", "#795548"], ["Brown 600", "#6D4C41"], ["Brown 700", "#5D4037"],
    ["Brown 800", "#4E342E"], ["Brown 900", "#3E2723"],
    ["Grey 50", "#FAFAFA"], ["Grey 100", "#F5F5F5"], ["Grey 200", "#EEEEEE"], ["Grey 300", "#E0E0E0"],
    ["Grey 400", "#BDBDBD"], ["Grey 500", "#9E9E9E"], ["Grey 600", "#757575"], ["Grey 700", "#616161"],
    ["Grey 800", "#424242"], ["Grey 900", "#212121"],
    ["Blue Grey 50", "#ECEFF1"], ["Blue Grey 100", "#CFD8DC"], ["Blue Grey 200", "#B0BEC5"],
    ["Blue Grey 300", "#90A4AE"], ["Blue Grey 400", "#78909C"], ["Blue Grey 500", "#607D8B"],
    ["Blue Grey 600", "#546E7A"], ["Blue Grey 700", "#455A64"], ["Blue Grey 800", "#37474F"],
    ["Blue Grey 900", "#263238"],
    ["Black", "#000000"], ["White", "#FFFFFF"],
  ];
  return entries.map(([token, hex]) => swatch(token, hex, token));
}

// ——— CSS named (subset of popular W3C names) ———
function buildCssNamed(): SystemSwatch[] {
  const entries: Array<[string, string]> = [
    ["aliceblue","#F0F8FF"],["antiquewhite","#FAEBD7"],["aqua","#00FFFF"],["aquamarine","#7FFFD4"],
    ["azure","#F0FFFF"],["beige","#F5F5DC"],["bisque","#FFE4C4"],["black","#000000"],
    ["blanchedalmond","#FFEBCD"],["blue","#0000FF"],["blueviolet","#8A2BE2"],["brown","#A52A2A"],
    ["burlywood","#DEB887"],["cadetblue","#5F9EA0"],["chartreuse","#7FFF00"],["chocolate","#D2691E"],
    ["coral","#FF7F50"],["cornflowerblue","#6495ED"],["cornsilk","#FFF8DC"],["crimson","#DC143C"],
    ["cyan","#00FFFF"],["darkblue","#00008B"],["darkcyan","#008B8B"],["darkgoldenrod","#B8860B"],
    ["darkgray","#A9A9A9"],["darkgreen","#006400"],["darkgrey","#A9A9A9"],["darkkhaki","#BDB76B"],
    ["darkmagenta","#8B008B"],["darkolivegreen","#556B2F"],["darkorange","#FF8C00"],["darkorchid","#9932CC"],
    ["darkred","#8B0000"],["darksalmon","#E9967A"],["darkseagreen","#8FBC8F"],["darkslateblue","#483D8B"],
    ["darkslategray","#2F4F4F"],["darkturquoise","#00CED1"],["darkviolet","#9400D3"],["deeppink","#FF1493"],
    ["deepskyblue","#00BFFF"],["dimgray","#696969"],["dodgerblue","#1E90FF"],["firebrick","#B22222"],
    ["floralwhite","#FFFAF0"],["forestgreen","#228B22"],["fuchsia","#FF00FF"],["gainsboro","#DCDCDC"],
    ["ghostwhite","#F8F8FF"],["gold","#FFD700"],["goldenrod","#DAA520"],["gray","#808080"],
    ["green","#008000"],["greenyellow","#ADFF2F"],["grey","#808080"],["honeydew","#F0FFF0"],
    ["hotpink","#FF69B4"],["indianred","#CD5C5C"],["indigo","#4B0082"],["ivory","#FFFFF0"],
    ["khaki","#F0E68C"],["lavender","#E6E6FA"],["lavenderblush","#FFF0F5"],["lawngreen","#7CFC00"],
    ["lemonchiffon","#FFFACD"],["lightblue","#ADD8E6"],["lightcoral","#F08080"],["lightcyan","#E0FFFF"],
    ["lightgoldenrodyellow","#FAFAD2"],["lightgray","#D3D3D3"],["lightgreen","#90EE90"],["lightpink","#FFB6C1"],
    ["lightsalmon","#FFA07A"],["lightseagreen","#20B2AA"],["lightskyblue","#87CEFA"],["lightslategray","#778899"],
    ["lightsteelblue","#B0C4DE"],["lightyellow","#FFFFE0"],["lime","#00FF00"],["limegreen","#32CD32"],
    ["linen","#FAF0E6"],["magenta","#FF00FF"],["maroon","#800000"],["mediumaquamarine","#66CDAA"],
    ["mediumblue","#0000CD"],["mediumorchid","#BA55D3"],["mediumpurple","#9370DB"],["mediumseagreen","#3CB371"],
    ["mediumslateblue","#7B68EE"],["mediumspringgreen","#00FA9A"],["mediumturquoise","#48D1CC"],
    ["mediumvioletred","#C71585"],["midnightblue","#191970"],["mintcream","#F5FFFA"],["mistyrose","#FFE4E1"],
    ["moccasin","#FFE4B5"],["navajowhite","#FFDEAD"],["navy","#000080"],["oldlace","#FDF5E6"],
    ["olive","#808000"],["olivedrab","#6B8E23"],["orange","#FFA500"],["orangered","#FF4500"],
    ["orchid","#DA70D6"],["palegoldenrod","#EEE8AA"],["palegreen","#98FB98"],["paleturquoise","#AFEEEE"],
    ["palevioletred","#DB7093"],["papayawhip","#FFEFD5"],["peachpuff","#FFDAB9"],["peru","#CD853F"],
    ["pink","#FFC0CB"],["plum","#DDA0DD"],["powderblue","#B0E0E6"],["purple","#800080"],
    ["rebeccapurple","#663399"],["red","#FF0000"],["rosybrown","#BC8F8F"],["royalblue","#4169E1"],
    ["saddlebrown","#8B4513"],["salmon","#FA8072"],["sandybrown","#F4A460"],["seagreen","#2E8B57"],
    ["seashell","#FFF5EE"],["sienna","#A0522D"],["silver","#C0C0C0"],["skyblue","#87CEEB"],
    ["slateblue","#6A5ACD"],["slategray","#708090"],["snow","#FFFAFA"],["springgreen","#00FF7F"],
    ["steelblue","#4682B4"],["tan","#D2B48C"],["teal","#008080"],["thistle","#D8BFD8"],
    ["tomato","#FF6347"],["turquoise","#40E0D0"],["violet","#EE82EE"],["wheat","#F5DEB3"],
    ["white","#FFFFFF"],["whitesmoke","#F5F5F5"],["yellow","#FFFF00"],["yellowgreen","#9ACD32"],
  ];
  return entries.map(([token, hex]) => swatch(token, hex, token));
}

// ——— Bootstrap 5 ———
function buildBootstrap(): SystemSwatch[] {
  const entries: Array<[string, string]> = [
    ["blue", "#0d6efd"], ["indigo", "#6610f2"], ["purple", "#6f42c1"], ["pink", "#d63384"],
    ["red", "#dc3545"], ["orange", "#fd7e14"], ["yellow", "#ffc107"], ["green", "#198754"],
    ["teal", "#20c997"], ["cyan", "#0dcaf0"], ["black", "#000000"], ["white", "#ffffff"],
    ["gray", "#6c757d"], ["gray-dark", "#343a40"],
    ["gray-100", "#f8f9fa"], ["gray-200", "#e9ecef"], ["gray-300", "#dee2e6"], ["gray-400", "#ced4da"],
    ["gray-500", "#adb5bd"], ["gray-600", "#6c757d"], ["gray-700", "#495057"], ["gray-800", "#343a40"],
    ["gray-900", "#212529"],
    ["primary", "#0d6efd"], ["secondary", "#6c757d"], ["success", "#198754"], ["info", "#0dcaf0"],
    ["warning", "#ffc107"], ["danger", "#dc3545"], ["light", "#f8f9fa"], ["dark", "#212529"],
    ["blue-100", "#cfe2ff"], ["blue-200", "#9ec5fe"], ["blue-300", "#6ea8fe"], ["blue-400", "#3d8bfd"],
    ["blue-500", "#0d6efd"], ["blue-600", "#0a58ca"], ["blue-700", "#084298"], ["blue-800", "#052c65"],
    ["blue-900", "#031633"],
    ["red-100", "#f8d7da"], ["red-200", "#f1aeb5"], ["red-300", "#ea868f"], ["red-400", "#e35d6a"],
    ["red-500", "#dc3545"], ["red-600", "#b02a37"], ["red-700", "#842029"], ["red-800", "#58151c"],
    ["red-900", "#2c0b0e"],
    ["green-100", "#d1e7dd"], ["green-200", "#a3cfbb"], ["green-300", "#75b798"], ["green-400", "#479f76"],
    ["green-500", "#198754"], ["green-600", "#146c43"], ["green-700", "#0f5132"], ["green-800", "#0a3622"],
    ["green-900", "#051b11"],
  ];
  return entries.map(([token, hex]) => swatch(token, hex, token));
}

const TAILWIND = buildTailwind();
const MATERIAL = buildMaterial();
const CSS_NAMED = buildCssNamed();
const BOOTSTRAP = buildBootstrap();

export const COLOR_SYSTEMS: ColorSystemDef[] = [
  {
    id: "tailwind",
    labelKey: "systems.tailwind",
    swatches: TAILWIND,
    match: (color, limit = 3) => nearestInPalette(color, "tailwind", TAILWIND, limit),
  },
  {
    id: "material",
    labelKey: "systems.material",
    swatches: MATERIAL,
    match: (color, limit = 3) => nearestInPalette(color, "material", MATERIAL, limit),
  },
  {
    id: "css",
    labelKey: "systems.css",
    swatches: CSS_NAMED,
    match: (color, limit = 3) => nearestInPalette(color, "css", CSS_NAMED, limit),
  },
  {
    id: "bootstrap",
    labelKey: "systems.bootstrap",
    swatches: BOOTSTRAP,
    match: (color, limit = 3) => nearestInPalette(color, "bootstrap", BOOTSTRAP, limit),
  },
];

export function matchAllSystems(color: Color, limit = 3): Record<ColorSystemId, SystemMatch[]> {
  const out = {} as Record<ColorSystemId, SystemMatch[]>;
  for (const system of COLOR_SYSTEMS) {
    out[system.id] = system.match(color, limit);
  }
  return out;
}

export function colorFromSystemHex(hex: string): Color {
  return colorFromHex(hex) ?? colorFromRgb(hexToRgb(hex));
}
