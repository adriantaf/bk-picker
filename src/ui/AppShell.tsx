import { Group, Text, Box, Image, ScrollArea } from "@mantine/core";
import type { ReactNode } from "react";
import brandIcon from "@/assets/brand-icon.png";

type AppShellProps = {
  tabs: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  brandTitle?: string;
};

/** Content shell: brand header + tabs + scrollable main + optional footer. */
export function AppShell({
  tabs,
  children,
  footer,
  brandTitle = "BK Picker",
}: AppShellProps) {
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
        px="sm"
        pt="sm"
        pb={8}
        style={{
          flexShrink: 0,
          borderBottom: "1px solid var(--color-hairline)",
          background:
            "color-mix(in srgb, var(--color-surface) 92%, transparent)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Group gap={8} mb={8} wrap="nowrap">
          <Image
            src={brandIcon}
            alt=""
            w={22}
            h={22}
            radius={6}
            style={{ flexShrink: 0 }}
          />
          <Text size="sm" fw={700} style={{ letterSpacing: "-0.02em" }}>
            {brandTitle}
          </Text>
        </Group>
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
