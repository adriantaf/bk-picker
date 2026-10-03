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
        width: 56,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 14,
        paddingBottom: 14,
        gap: 8,
        borderRight: "1px solid var(--color-hairline)",
        background: "color-mix(in srgb, var(--color-surface) 55%, transparent)",
        backdropFilter: "blur(20px) saturate(1.2)",
        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
      }}
    >
      <Stack gap={8} align="center" style={{ width: "100%" }}>
        {ITEMS.map((item) => {
          const active = value === item.id;
          const { Icon } = item;
          return (
            <Tooltip key={item.id} label={labels[item.id]} position="right" withArrow>
              <UnstyledButton
                onClick={() => onChange(item.id)}
                aria-label={labels[item.id]}
                aria-current={active ? "page" : undefined}
                className="rail-btn ink-interactive"
                data-active={active}
              >
                {active ? (
                  <Box
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 3,
                      width: 3,
                      height: 16,
                      borderRadius: 99,
                      background: "var(--color-accent)",
                      boxShadow:
                        "0 0 10px color-mix(in srgb, var(--color-accent) 70%, transparent)",
                    }}
                  />
                ) : null}
                <Icon size={20} stroke={1.5} />
              </UnstyledButton>
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
}
