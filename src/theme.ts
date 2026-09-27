import { createTheme, rem } from "@mantine/core";

export const bkTheme = createTheme({
  primaryColor: "blue",
  fontFamily:
    '"Segoe UI", "SF Pro Text", -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif',
  fontFamilyMonospace:
    '"Cascadia Mono", "SF Mono", ui-monospace, Consolas, monospace',
  defaultRadius: "md",
  cursorType: "pointer",
  spacing: {
    xs: rem(6),
    sm: rem(10),
    md: rem(14),
    lg: rem(20),
    xl: rem(28),
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
          transition: "background-color 120ms ease, transform 120ms ease, box-shadow 120ms ease",
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
    Tabs: {
      defaultProps: {
        radius: "md",
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
    Alert: {
      defaultProps: {
        radius: "md",
      },
    },
    Notification: {
      styles: {
        root: {
          boxShadow: "0 8px 24px rgb(0 0 0 / 0.12)",
        },
      },
    },
  },
});
