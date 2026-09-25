import { Box, UnstyledButton } from "@mantine/core";
import { contrastingInk } from "@/lib/color";
import type { Color } from "@/types";

type ColorSwatchProps = {
  color: Color;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  onClick?: () => void;
  label?: string;
  showHex?: boolean;
};

const sizePx = {
  sm: 32,
  md: 44,
  lg: 56,
} as const;

export function ColorSwatch({
  color,
  size = "md",
  selected = false,
  onClick,
  label,
  showHex = false,
}: ColorSwatchProps) {
  const dim = sizePx[size];
  const ink = contrastingInk(color);
  const style = {
    width: dim,
    minWidth: dim,
    height: dim,
    borderRadius: 8,
    backgroundColor: color.hex,
    border: "1px solid rgb(0 0 0 / 0.1)",
    boxShadow: selected
      ? "0 0 0 2px var(--mantine-color-blue-5), 0 0 0 4px var(--color-base)"
      : "inset 0 0 0 0.5px rgb(0 0 0 / 0.08)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 120ms ease, box-shadow 120ms ease",
    cursor: onClick ? "pointer" : "default",
  } as const;

  const content = showHex ? (
    <Box
      component="span"
      ff="monospace"
      style={{
        color: ink,
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.04em",
      }}
    >
      {color.hex.replace("#", "")}
    </Box>
  ) : null;

  if (onClick) {
    return (
      <UnstyledButton
        onClick={onClick}
        aria-label={label ?? color.hex}
        title={label ?? color.hex}
        style={style}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {content}
      </UnstyledButton>
    );
  }

  return (
    <Box
      style={style}
      aria-label={label ?? color.hex}
      title={label ?? color.hex}
      role="img"
    >
      {content}
    </Box>
  );
}
