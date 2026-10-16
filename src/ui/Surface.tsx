import type { CSSProperties, ReactNode } from "react";
import { Paper } from "@mantine/core";

type SurfaceProps = {
  children: ReactNode;
  variant?: "glass" | "elevated" | "plain";
  padding?: number | string;
  className?: string;
  style?: CSSProperties;
  interactive?: boolean;
};

/** Layered surface primitive (mica / elevated / plain). */
export function Surface({
  children,
  variant = "glass",
  padding = 16,
  className,
  style,
  interactive = false,
}: SurfaceProps) {
  if (variant === "plain") {
    return (
      <div className={className} style={{ padding, ...style }}>
        {children}
      </div>
    );
  }

  return (
    <Paper
      className={[
        variant === "glass" ? "ink-surface" : "ink-elevated",
        interactive ? "ink-interactive" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      p={padding}
      radius={variant === "glass" ? "lg" : "md"}
      style={{
        ...(variant === "glass"
          ? {
              background: "color-mix(in srgb, var(--color-surface) 72%, transparent)",
              backdropFilter: "blur(18px) saturate(1.2)",
              WebkitBackdropFilter: "blur(18px) saturate(1.2)",
            }
          : undefined),
        ...style,
      }}
    >
      {children}
    </Paper>
  );
}
