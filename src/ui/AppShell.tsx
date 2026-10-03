import { Box } from "@mantine/core";
import type { ReactNode } from "react";
import { IconRail } from "./IconRail";
import type { AppTab } from "@/types";

type AppShellProps = {
  tab: AppTab;
  onTabChange: (tab: AppTab) => void;
  tabLabels: Record<AppTab, string>;
  children: ReactNode;
  footer?: ReactNode;
};

/** Dark shell: left icon rail + scrollable main. */
export function AppShell({
  tab,
  onTabChange,
  tabLabels,
  children,
  footer,
}: AppShellProps) {
  return (
    <Box
      style={{
        display: "flex",
        height: "100dvh",
        maxHeight: "100dvh",
        overflow: "hidden",
        background: `
          radial-gradient(900px 420px at 20% -10%, color-mix(in srgb, var(--active-glow) 28%, transparent), transparent 55%),
          var(--color-base)
        `,
        color: "var(--color-text)",
      }}
    >
      <IconRail value={tab} onChange={onTabChange} labels={tabLabels} />
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            padding: "16px 18px",
          }}
          className="ui-fade"
        >
          <Box style={{ maxWidth: 520, marginInline: "auto" }}>{children}</Box>
        </Box>
        {footer ? (
          <Box
            px="md"
            py={8}
            style={{
              flexShrink: 0,
              borderTop: "1px solid var(--color-hairline)",
              background: "color-mix(in srgb, var(--color-surface) 80%, transparent)",
              backdropFilter: "blur(10px)",
            }}
          >
            {footer}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
