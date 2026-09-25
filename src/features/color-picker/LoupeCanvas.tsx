import { useEffect, useRef } from "react";
import type { LoupeUpdate } from "@/types";

type LoupeCanvasProps = {
  sample: LoupeUpdate | null;
  centerLabel: string;
};

export function LoupeCanvas({ sample, centerLabel }: LoupeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sample) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cell = Math.floor(canvas.width / sample.size);
    const grid = sample.size;
    canvas.height = cell * grid;

    for (let y = 0; y < grid; y += 1) {
      for (let x = 0; x < grid; x += 1) {
        const i = (y * grid + x) * 3;
        const r = sample.pixels[i] ?? 0;
        const g = sample.pixels[i + 1] ?? 0;
        const b = sample.pixels[i + 2] ?? 0;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }

    const mid = Math.floor(grid / 2);
    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.lineWidth = 2;
    ctx.strokeRect(mid * cell + 1, mid * cell + 1, cell - 2, cell - 2);
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.lineWidth = 1;
    ctx.strokeRect(mid * cell + 0.5, mid * cell + 0.5, cell - 1, cell - 1);
  }, [sample]);

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        width={143}
        height={143}
        className="rounded-[16px] border border-white/20 shadow-[0_8px_24px_rgb(0_0_0_/_0.45)]"
        style={{ imageRendering: "pixelated", width: 143, height: 143 }}
      />
      <div className="flex items-center gap-2">
        <span
          className="h-4 w-4 rounded-[4px] border border-white/25"
          style={{ backgroundColor: sample?.hex ?? "#000" }}
        />
        <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-wide text-text">
          {sample?.hex ?? "—"}
        </span>
      </div>
      <p className="text-[10px] text-muted">{centerLabel}</p>
    </div>
  );
}
