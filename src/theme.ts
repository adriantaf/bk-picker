import { createTheme, rem } from "@mantine/core";

export const bkTheme = createTheme({
  primaryColor: "blue",
  fontFamily:
    '"SF Pro Text", "Segoe UI Variable", "Segoe UI", -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif',
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
  components: {
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
          boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--color-accent) 35%, transparent)",
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
