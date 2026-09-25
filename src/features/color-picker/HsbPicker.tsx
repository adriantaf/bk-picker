import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { colorFromHsb, colorToHsb } from "@/lib/color";
import type { Color, Hsb } from "@/types";

type HsbPickerProps = {
  color: Color;
  onChange: (color: Color) => void;
  saturationLabel: string;
  hueLabel: string;
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function HsbPicker({
  color,
  onChange,
  saturationLabel,
  hueLabel,
}: HsbPickerProps) {
  const hsb = colorToHsb(color);
  const boardRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"board" | "hue" | null>(null);

  const emitHsb = useCallback(
    (next: Hsb) => {
      onChange(colorFromHsb(next));
    },
    [onChange],
  );

  const updateBoard = useCallback(
    (clientX: number, clientY: number) => {
      const el = boardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const s = clamp01((clientX - rect.left) / rect.width) * 100;
      const b = (1 - clamp01((clientY - rect.top) / rect.height)) * 100;
      emitHsb({ h: hsb.h, s, b });
    },
    [emitHsb, hsb.h],
  );

  const updateHue = useCallback(
    (clientX: number) => {
      const el = hueRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0) return;
      const h = clamp01((clientX - rect.left) / rect.width) * 360;
      emitHsb({ h, s: hsb.s, b: hsb.b });
    },
    [emitHsb, hsb.b, hsb.s],
  );

  useEffect(() => {
    function onPointerMove(event: PointerEvent) {
      if (dragging.current === "board") {
        updateBoard(event.clientX, event.clientY);
      } else if (dragging.current === "hue") {
        updateHue(event.clientX);
      }
    }

    function onPointerUp() {
      dragging.current = null;
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [updateBoard, updateHue]);

  function handleBoardDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    dragging.current = "board";
    event.currentTarget.setPointerCapture(event.pointerId);
    updateBoard(event.clientX, event.clientY);
  }

  function handleHueDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    dragging.current = "hue";
    event.currentTarget.setPointerCapture(event.pointerId);
    updateHue(event.clientX);
  }

  const hueColor = `hsl(${hsb.h}, 100%, 50%)`;
  const knobLeft = `${hsb.s}%`;
  const knobTop = `${100 - hsb.b}%`;
  const hueLeft = `${(hsb.h / 360) * 100}%`;

  return (
    <div className="space-y-3">
      <div
        ref={boardRef}
        role="slider"
        aria-label={saturationLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(hsb.s)}
        tabIndex={0}
        onPointerDown={handleBoardDown}
        onKeyDown={(event) => {
          let next = { ...hsb };
          if (event.key === "ArrowRight") next = { ...next, s: Math.min(100, next.s + 2) };
          else if (event.key === "ArrowLeft") next = { ...next, s: Math.max(0, next.s - 2) };
          else if (event.key === "ArrowUp") next = { ...next, b: Math.min(100, next.b + 2) };
          else if (event.key === "ArrowDown") next = { ...next, b: Math.max(0, next.b - 2) };
          else return;
          event.preventDefault();
          emitHsb(next);
        }}
        className="hsb-board relative cursor-crosshair overflow-hidden rounded-[var(--radius-md)] touch-none select-none"
        style={{
          background: `
            linear-gradient(to top, #000, transparent),
            linear-gradient(to right, #fff, ${hueColor})
          `,
          boxShadow:
            "inset 0 0 0 1px rgb(0 0 0 / 0.08), 0 1px 2px rgb(0 0 0 / 0.06)",
        }}
      >
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{
            left: knobLeft,
            top: knobTop,
            backgroundColor: color.hex,
            boxShadow:
              "0 0 0 1px rgb(0 0 0 / 0.35), 0 2px 6px rgb(0 0 0 / 0.4)",
          }}
        />
      </div>

      <div
        ref={hueRef}
        role="slider"
        aria-label={hueLabel}
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(hsb.h)}
        tabIndex={0}
        onPointerDown={handleHueDown}
        onKeyDown={(event) => {
          let nextH = hsb.h;
          if (event.key === "ArrowRight") nextH = Math.min(360, hsb.h + 2);
          else if (event.key === "ArrowLeft") nextH = Math.max(0, hsb.h - 2);
          else return;
          event.preventDefault();
          emitHsb({ ...hsb, h: nextH });
        }}
        className="relative h-3.5 w-full cursor-ew-resize touch-none rounded-full"
        style={{
          background:
            "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
          boxShadow:
            "inset 0 0 0 1px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)",
        }}
      >
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{
            left: hueLeft,
            backgroundColor: hueColor,
            boxShadow:
              "0 0 0 1px rgb(0 0 0 / 0.25), 0 2px 5px rgb(0 0 0 / 0.2)",
          }}
        />
      </div>
    </div>
  );
}
