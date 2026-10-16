import type { ReactNode } from "react";
import {
  AppShell as MantineAppShell,
  Box,
  Image,
  Text,
} from "@mantine/core";
import brandLogo from "@/assets/brand-logo.svg";
import { IconRail } from "./IconRail";
import { PageTransition } from "./PageMotion";
import type { AppTab } from "@/types";
import classes from "./AppShell.module.css";

type AppShellProps = {
  tab: AppTab;
  onTabChange: (tab: AppTab) => void;
  tabLabels: Record<AppTab, string>;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Desktop shell: Mantine AppShell + mica navbar + animated main pane.
 * Fluent acrylic surfaces + macOS-like spacing.
 */
export function AppShell({
  tab,
  onTabChange,
  tabLabels,
  children,
  footer,
}: AppShellProps) {
  return (
    <MantineAppShell
      className={classes.shell}
      navbar={{ width: 56, breakpoint: 0 }}
      footer={footer ? { height: 46 } : undefined}
      padding={0}
      withBorder={false}
    >
      <MantineAppShell.Navbar className={classes.navbar} p={0} withBorder={false}>
        <Box className={classes.brand} aria-hidden>
          <Image src={brandLogo} alt="" w={36} h={36} fit="contain" />
        </Box>
        <IconRail value={tab} onChange={onTabChange} labels={tabLabels} />
        <Box style={{ flex: 1 }} />
        <Text
          size="10px"
          c="dimmed"
          ta="center"
          px={4}
          style={{ letterSpacing: "0.04em", opacity: 0.55 }}
        >
          BK
        </Text>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main className={classes.main}>
        <Box
          px={20}
          py={18}
          style={{
            height: "100%",
            overflow: "auto",
            minHeight: 0,
          }}
        >
          <Box className={classes.mainInner}>
            <PageTransition pageKey={tab}>{children}</PageTransition>
          </Box>
        </Box>
      </MantineAppShell.Main>

      {footer ? (
        <MantineAppShell.Footer className={classes.footer} px="md" py={10} withBorder={false}>
          {footer}
        </MantineAppShell.Footer>
      ) : null}
    </MantineAppShell>
  );
}
