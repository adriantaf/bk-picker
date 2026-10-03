import type { ComponentType } from "react";
import { Box, Stack, Tooltip, UnstyledButton } from "@mantine/core";
import {
  IconColorPicker,
  IconHistory,
  IconSettings,
} from "@tabler/icons-react";
import type { AppTab } from "@/types";

type IconRailProps = {
  value: AppTab;
  onChange: (tab: AppTab) => void;
  labels: Record<AppTab, string>;
};

type TablerIcon = ComponentType<{ size?: number | string; stroke?: number }>;

const ITEMS: Array<{ id: AppTab; Icon: TablerIcon }> = [
  { id: "workspace", Icon: IconColorPicker },
  { id: "history", Icon: IconHistory },
  { id: "settings", Icon: IconSettings },
];

export function IconRail({ value, onChange, labels }: IconRailProps) {
  return (
    <Box
      component="nav"
      aria-label="Main"
      style={{
        width: 52,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: 12,
        gap: 6,
        borderRight: "1px solid var(--color-hairline)",
        background: "color-mix(in srgb, var(--color-surface) 70%, transparent)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Stack gap={6} align="center" style={{ width: "100%" }}>
        {ITEMS.map((item) => {
          const active = value === item.id;
          const { Icon } = item;
          return (
            <Tooltip key={item.id} label={labels[item.id]} position="right" withArrow>
              <UnstyledButton
                onClick={() => onChange(item.id)}
                aria-label={labels[item.id]}
                aria-current={active ? "page" : undefined}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  color: active ? "var(--color-text)" : "var(--color-muted)",
                  background: active
                    ? "color-mix(in srgb, var(--color-accent) 22%, var(--color-elevated))"
                    : "transparent",
                  boxShadow: active
                    ? "inset 0 0 0 1px color-mix(in srgb, var(--color-accent) 45%, transparent)"
                    : "none",
                  transition: "background-color 140ms ease, color 140ms ease",
                }}
              >
                <Icon size={20} stroke={1.5} />
              </UnstyledButton>
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
}
