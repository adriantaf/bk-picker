import { Paper, Text } from "@mantine/core";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Paper p="lg" ta="center">
      <Text size="sm" c="dimmed">
        {title}
      </Text>
      {description ? (
        <Text size="xs" c="dimmed" mt={6}>
          {description}
        </Text>
      ) : null}
    </Paper>
  );
}
