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
      className="ink-elevated ui-fade"
      gap="md"
      align="center"
      style={{ padding: "32px 24px", textAlign: "center" }}
    >
      <Text size="sm" c="dimmed" maw={280} style={{ lineHeight: 1.5 }}>
        {title}
      </Text>
      {description ? (
        <Text size="xs" c="dimmed" maw={260}>
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button onClick={onAction} radius="md" style={{ marginTop: 4 }}>
          {actionLabel}
        </Button>
      ) : null}
    </Stack>
  );
}
