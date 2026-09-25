import type { Color, Rgb } from "@/types";
import { colorFromRgb } from "@/lib/color";

export type LoadedImage = {
  bitmap: ImageBitmap;
  width: number;
  height: number;
  /** Object URL or data URL for <img> / canvas draw. */
  src: string;
  revoke?: () => void;
};

export async function loadImageFromFile(file: File): Promise<LoadedImage> {
  const src = URL.createObjectURL(file);
  try {
    const bitmap = await createImageBitmap(file);
    return {
      bitmap,
      width: bitmap.width,
      height: bitmap.height,
      src,
      revoke: () => URL.revokeObjectURL(src),
    };
  } catch (error) {
    URL.revokeObjectURL(src);
    throw error;
  }
}

export async function loadImageFromBlob(blob: Blob): Promise<LoadedImage> {
  const src = URL.createObjectURL(blob);
  try {
    const bitmap = await createImageBitmap(blob);
    return {
      bitmap,
      width: bitmap.width,
      height: bitmap.height,
      src,
      revoke: () => URL.revokeObjectURL(src),
    };
  } catch (error) {
    URL.revokeObjectURL(src);
    throw error;
  }
}

/** Map click on displayed canvas (CSS pixels) to source image coords. */
export function canvasPointToImage(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
  imageWidth: number,
  imageHeight: number,
  zoom = 1,
): { x: number; y: number } | null {
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  const scale =
    Math.min(rect.width / imageWidth, rect.height / imageHeight) *
    Math.max(0.25, zoom);
  const drawW = imageWidth * scale;
  const drawH = imageHeight * scale;
  const offsetX = (rect.width - drawW) / 2;
  const offsetY = (rect.height - drawH) / 2;
  const cx = clientX - rect.left - offsetX;
  const cy = clientY - rect.top - offsetY;
  if (cx < 0 || cy < 0 || cx > drawW || cy > drawH) return null;
  const x = Math.min(imageWidth - 1, Math.max(0, Math.floor(cx / scale)));
  const y = Math.min(imageHeight - 1, Math.max(0, Math.floor(cy / scale)));
  return { x, y };
}

export function sampleBitmapPixel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
): Color {
  const data = ctx.getImageData(x, y, 1, 1).data;
  const rgb: Rgb = {
    r: data[0] ?? 0,
    g: data[1] ?? 0,
    b: data[2] ?? 0,
  };
  return colorFromRgb(rgb);
}

export function drawImageContain(
  canvas: HTMLCanvasElement,
  bitmap: ImageBitmap,
  zoom = 1,
): CanvasRenderingContext2D {
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || canvas.width || 320;
  const cssH = canvas.clientHeight || Math.min(280, cssW * 0.75);
  canvas.width = Math.max(1, Math.floor(cssW * dpr));
  canvas.height = Math.max(1, Math.floor(cssH * dpr));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2d context unavailable");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);
  const scale =
    Math.min(cssW / bitmap.width, cssH / bitmap.height) * Math.max(0.25, zoom);
  const drawW = bitmap.width * scale;
  const drawH = bitmap.height * scale;
  const x = (cssW - drawW) / 2;
  const y = (cssH - drawH) / 2;
  ctx.imageSmoothingEnabled = zoom < 1.5;
  ctx.drawImage(bitmap, x, y, drawW, drawH);
  return ctx;
}

/** Offscreen 1:1 buffer for accurate pixel sampling. */
export function createSampleContext(bitmap: ImageBitmap): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2d context unavailable");
  ctx.drawImage(bitmap, 0, 0);
  return { canvas, ctx };
}
