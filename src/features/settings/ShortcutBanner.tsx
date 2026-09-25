import { Alert, Text } from "@mantine/core";

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
    <Alert
      color={isError ? "red" : "gray"}
      variant="light"
      p="xs"
      radius="md"
      styles={{ message: { fontSize: 11, lineHeight: 1.4 } }}
    >
      <Text span fw={600} size="xs">
        {label}
      </Text>
      <Text span size="xs" mx={6} c="dimmed">
        ·
      </Text>
      <Text span size="xs">
        {statusText}
      </Text>
    </Alert>
  );
}
