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
      className="ink-interactive"
      style={{
        flex: 1,
        minWidth: 0,
        padding: "12px 10px",
        borderRadius: 14,
        textAlign: "center",
        fontSize: 13,
        fontWeight: 650,
        color: active ? "var(--color-text)" : "var(--color-muted)",
        background: active
          ? "color-mix(in srgb, var(--color-accent) 20%, var(--color-elevated))"
          : "color-mix(in srgb, var(--color-elevated) 80%, transparent)",
        boxShadow: active
          ? "inset 0 0 0 1px color-mix(in srgb, var(--color-accent) 45%, transparent), 0 6px 18px rgb(0 0 0 / 0.2)"
          : "inset 0 0 0 1px var(--color-hairline)",
        backdropFilter: "blur(10px)",
        transition:
          "background-color var(--motion-fast), color var(--motion-fast), box-shadow var(--motion-fast), transform var(--motion-fast)",
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
