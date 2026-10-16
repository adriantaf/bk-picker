import { createTheme, rem } from "@mantine/core";

/** Fluent acrylic + macOS spacing — dark-first developer tool theme. */
export const bkTheme = createTheme({
  primaryColor: "blue",
  fontFamily:
    '"Outfit", "Segoe UI Variable", "SF Pro Text", -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif',
  fontFamilyMonospace:
    '"SF Mono", "Cascadia Mono", "JetBrains Mono", ui-monospace, Consolas, monospace',
  defaultRadius: "md",
  cursorType: "pointer",
  spacing: {
    xs: rem(6),
    sm: rem(10),
    md: rem(14),
    lg: rem(20),
    xl: rem(28),
  },
  radius: {
    xs: rem(8),
    sm: rem(10),
    md: rem(14),
    lg: rem(18),
    xl: rem(24),
  },
  colors: {
    dark: [
      "#eef2f8",
      "#c5cedc",
      "#8b96a8",
      "#5c687a",
      "#3a4556",
      "#242c3d",
      "#1a2030",
      "#12161d",
      "#0e1116",
      "#0a0c10",
    ],
  },
  headings: {
    fontWeight: "600",
  },
  other: {
    mica: "color-mix(in srgb, var(--color-surface) 58%, transparent)",
    acrylic: "blur(22px) saturate(1.25)",
  },
  components: {
    AppShell: {
      styles: {
        root: {
          background: "transparent",
        },
        main: {
          background: "transparent",
          minHeight: 0,
        },
        navbar: {
          background: "transparent",
          borderInlineEnd: "none",
        },
        footer: {
          background: "transparent",
          borderTop: "none",
        },
      },
    },
    Button: {
      defaultProps: {
        size: "sm",
        radius: "md",
      },
      styles: {
        root: {
          fontWeight: 600,
          transition:
            "background-color 120ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 120ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 120ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        },
      },
    },
    Paper: {
      defaultProps: {
        radius: "lg",
        withBorder: false,
        shadow: "none",
      },
      styles: {
        root: {
          background: "color-mix(in srgb, var(--color-elevated) 88%, transparent)",
          border: "1px solid var(--color-hairline)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.03)",
        },
      },
    },
    Card: {
      defaultProps: {
        radius: "md",
        padding: "md",
        withBorder: false,
        shadow: "none",
      },
      styles: {
        root: {
          background: "color-mix(in srgb, var(--color-elevated) 88%, transparent)",
          border: "1px solid var(--color-hairline)",
          transition:
            "transform 120ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 120ms ease, border-color 120ms ease",
        },
      },
    },
    Modal: {
      defaultProps: {
        radius: "lg",
        centered: true,
        overlayProps: {
          backgroundOpacity: 0.5,
          blur: 8,
        },
      },
      styles: {
        content: {
          background: "color-mix(in srgb, var(--color-surface) 88%, transparent)",
          backdropFilter: "blur(24px) saturate(1.2)",
          WebkitBackdropFilter: "blur(24px) saturate(1.2)",
          border: "1px solid var(--color-hairline)",
          boxShadow: "0 24px 64px rgb(0 0 0 / 0.45)",
        },
        header: {
          background: "transparent",
        },
      },
    },
    Tabs: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        list: {
          background: "color-mix(in srgb, var(--color-elevated) 75%, transparent)",
          border: "1px solid var(--color-hairline)",
          borderRadius: rem(14),
          padding: 4,
          gap: 4,
        },
        tab: {
          fontWeight: 600,
          border: "none",
          "&[data-active]": {
            background: "color-mix(in srgb, var(--color-accent) 22%, var(--color-overlay))",
            boxShadow:
              "inset 0 0 0 1px color-mix(in srgb, var(--color-accent) 35%, transparent)",
          },
        },
      },
    },
    SegmentedControl: {
      defaultProps: {
        radius: "md",
        size: "xs",
      },
      styles: {
        root: {
          background: "color-mix(in srgb, var(--color-elevated) 80%, transparent)",
          border: "1px solid var(--color-hairline)",
          backdropFilter: "blur(12px)",
        },
        indicator: {
          background: "color-mix(in srgb, var(--color-accent) 22%, var(--color-overlay))",
          boxShadow:
            "inset 0 0 0 1px color-mix(in srgb, var(--color-accent) 35%, transparent)",
        },
        label: {
          fontWeight: 600,
        },
      },
    },
    TextInput: {
      defaultProps: {
        radius: "md",
        size: "sm",
      },
      styles: {
        input: {
          background: "color-mix(in srgb, var(--color-elevated) 90%, transparent)",
          border: "1px solid var(--color-hairline)",
          color: "var(--color-text)",
          transition: "border-color 120ms ease, box-shadow 120ms ease",
        },
      },
    },
    Tooltip: {
      defaultProps: {
        withArrow: true,
        radius: "md",
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        root: {
          transition: "background-color 120ms ease, transform 120ms ease",
        },
      },
    },
    Badge: {
      defaultProps: {
        radius: "md",
      },
    },
    Notification: {
      styles: {
        root: {
          boxShadow: "0 12px 40px rgb(0 0 0 / 0.4)",
          backdropFilter: "blur(16px)",
        },
      },
    },
  },
});
