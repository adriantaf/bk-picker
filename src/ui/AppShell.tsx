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

/** Dark shell: glass rail + ambient glow + scrollable main. */
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
          radial-gradient(780px 360px at 18% -8%, color-mix(in srgb, var(--active-glow) 32%, transparent), transparent 58%),
          radial-gradient(520px 280px at 92% 12%, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 55%),
          linear-gradient(180deg, #0d1016 0%, var(--color-base) 48%, #080a0e 100%)
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
            padding: "18px 20px 22px",
          }}
        >
          <Box
            key={tab}
            className="ui-fade"
            style={{ maxWidth: 540, marginInline: "auto" }}
          >
            {children}
          </Box>
        </Box>
        {footer ? (
          <Box
            px="md"
            py={10}
            style={{
              flexShrink: 0,
              borderTop: "1px solid var(--color-hairline)",
              background: "color-mix(in srgb, var(--color-surface) 65%, transparent)",
              backdropFilter: "blur(16px) saturate(1.15)",
              WebkitBackdropFilter: "blur(16px) saturate(1.15)",
            }}
          >
            {footer}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
