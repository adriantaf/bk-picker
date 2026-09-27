import { Box, ScrollArea } from "@mantine/core";
import type { ReactNode } from "react";

type AppShellProps = {
  tabs: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

/** Content shell: tabs + scrollable main + optional footer (no in-app brand). */
export function AppShell({ tabs, children, footer }: AppShellProps) {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        maxHeight: "100dvh",
        overflow: "hidden",
        background: "var(--color-base)",
        color: "var(--color-text)",
      }}
    >
      <Box
        px="md"
        pt="sm"
        pb={0}
        style={{
          flexShrink: 0,
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-hairline)",
        }}
      >
        {tabs}
      </Box>
      <ScrollArea
        style={{ flex: 1, minHeight: 0 }}
        type="auto"
        offsetScrollbars
        scrollbarSize={8}
      >
        <Box
          px="md"
          py="md"
          className="ui-fade"
          style={{ minWidth: 0, maxWidth: 560, marginInline: "auto" }}
        >
          {children}
        </Box>
      </ScrollArea>
      {footer ? (
        <Box
          px="md"
          py={8}
          style={{
            flexShrink: 0,
            borderTop: "1px solid var(--color-hairline)",
            background: "var(--color-surface)",
          }}
        >
          {footer}
        </Box>
      ) : null}
    </Box>
  );
}
