import type { CSSProperties, ReactNode } from "react";
import { Box } from "@mantine/core";

type SurfaceProps = {
  children: ReactNode;
  variant?: "glass" | "elevated" | "plain";
  padding?: number | string;
  className?: string;
  style?: CSSProperties;
  interactive?: boolean;
};

/** Consistent Ink Surface panel primitive. */
export function Surface({
  children,
  variant = "glass",
  padding = 16,
  className,
  style,
  interactive = false,
}: SurfaceProps) {
  const base =
    variant === "elevated"
      ? "ink-elevated"
      : variant === "glass"
        ? "ink-surface"
        : undefined;

  return (
    <Box
      className={[base, interactive ? "ink-interactive" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={{ padding, ...style }}
    >
      {children}
    </Box>
  );
}
