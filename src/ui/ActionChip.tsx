import type { ReactNode } from "react";
import { Group, UnstyledButton } from "@mantine/core";

type ActionChipProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
};

export function ActionChip({ label, active = false, onClick }: ActionChipProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: 0,
        padding: "11px 10px",
        borderRadius: 12,
        textAlign: "center",
        fontSize: 13,
        fontWeight: 600,
        color: active ? "var(--color-text)" : "var(--color-muted)",
        background: active
          ? "color-mix(in srgb, var(--color-accent) 18%, var(--color-elevated))"
          : "var(--color-elevated)",
        boxShadow: active
          ? "inset 0 0 0 1px color-mix(in srgb, var(--color-accent) 40%, transparent)"
          : "inset 0 0 0 1px var(--color-hairline)",
        transition: "background-color 140ms ease, color 140ms ease",
      }}
    >
      {label}
    </UnstyledButton>
  );
}

type ActionChipRowProps = {
  children: ReactNode;
};

export function ActionChipRow({ children }: ActionChipRowProps) {
  return (
    <Group gap={8} wrap="nowrap" grow>
      {children}
    </Group>
  );
}
