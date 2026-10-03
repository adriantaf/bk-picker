import { ActionIcon, Box, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import type { HistoryItem } from "@/types";

type HistoryCardProps = {
  item: HistoryItem;
  selected: boolean;
  favoriteLabel: string;
  copyLabel: string;
  removeLabel: string;
  onSelect: (item: HistoryItem) => void;
  onCopy: (item: HistoryItem) => void;
  onToggleFavorite: (item: HistoryItem) => void;
  onRemove: (item: HistoryItem) => void;
};

export function HistoryCard({
  item,
  selected,
  favoriteLabel,
  copyLabel,
  removeLabel,
  onSelect,
  onCopy,
  onToggleFavorite,
  onRemove,
}: HistoryCardProps) {
  return (
    <Box
      className="ink-elevated"
      style={{
        padding: 10,
        boxShadow: selected
          ? "inset 0 0 0 1px color-mix(in srgb, var(--color-accent) 55%, transparent)"
          : undefined,
      }}
    >
      <Stack gap={8}>
        <UnstyledButton onClick={() => onSelect(item)} aria-label={item.color.hex}>
          <Box
            style={{
              height: 72,
              borderRadius: 12,
              background: item.color.hex,
              border: "1px solid var(--color-hairline)",
            }}
          />
        </UnstyledButton>
        <Group justify="space-between" wrap="nowrap" gap={6}>
          <Stack gap={2} style={{ minWidth: 0 }}>
            <Text size="xs" ff="monospace" fw={600} truncate>
              {item.color.hex}
            </Text>
            <Text size="10px" c="dimmed" truncate>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </Stack>
          <Group gap={4} wrap="nowrap">
            <ActionIcon
              size="sm"
              variant="subtle"
              color={item.favorite ? "yellow" : "gray"}
              aria-label={favoriteLabel}
              onClick={() => onToggleFavorite(item)}
            >
              {item.favorite ? "★" : "☆"}
            </ActionIcon>
            <ActionIcon
              size="sm"
              variant="subtle"
              color="blue"
              aria-label={copyLabel}
              onClick={() => onCopy(item)}
            >
              ⎘
            </ActionIcon>
            <ActionIcon
              size="sm"
              variant="subtle"
              color="red"
              aria-label={removeLabel}
              onClick={() => onRemove(item)}
            >
              ×
            </ActionIcon>
          </Group>
        </Group>
      </Stack>
    </Box>
  );
}
