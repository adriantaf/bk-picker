import { Button, Stack, Text } from "@mantine/core";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Stack
      className="ink-elevated"
      p="lg"
      gap="md"
      align="center"
      style={{ padding: 24, textAlign: "center" }}
    >
      <Text size="sm" c="dimmed">
        {title}
      </Text>
      {description ? (
        <Text size="xs" c="dimmed">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button onClick={onAction} radius="md">
          {actionLabel}
        </Button>
      ) : null}
    </Stack>
  );
}
