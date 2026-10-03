import { Text } from "@mantine/core";

type ShortcutBannerProps = {
  label: string;
  statusText: string;
  isError: boolean;
};

export function ShortcutBanner({
  label,
  statusText,
  isError,
}: ShortcutBannerProps) {
  return (
    <Text
      size="xs"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        lineHeight: 1.4,
        color: isError ? "var(--color-danger)" : "var(--color-muted)",
      }}
      role={isError ? "alert" : undefined}
    >
      <Text span fw={650} size="xs" c={isError ? "red" : "var(--color-text)"}>
        {label}
      </Text>
      <Text span size="xs" c="dimmed">
        ·
      </Text>
      <Text span size="xs">
        {statusText}
      </Text>
    </Text>
  );
}
