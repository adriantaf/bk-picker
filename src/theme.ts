import { createTheme, rem } from "@mantine/core";

export const bkTheme = createTheme({
  primaryColor: "blue",
  fontFamily:
    '"Segoe UI Variable", "Segoe UI", "SF Pro Text", -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif',
  fontFamilyMonospace:
    '"Cascadia Mono", "JetBrains Mono", "SF Mono", ui-monospace, Consolas, monospace',
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
      "#e8eef6",
      "#c5cedc",
      "#8b97a8",
      "#5c687a",
      "#3a4556",
      "#242c3b",
      "#1c2330",
      "#161b22",
      "#12161d",
      "#0e1116",
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
          transition:
            "background-color 140ms ease, transform 140ms ease, box-shadow 140ms ease",
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
    },
    TextInput: {
      defaultProps: {
        radius: "md",
        size: "sm",
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: "md",
      },
    },
    Notification: {
      styles: {
        root: {
          boxShadow: "0 8px 32px rgb(0 0 0 / 0.35)",
        },
      },
    },
  },
});
