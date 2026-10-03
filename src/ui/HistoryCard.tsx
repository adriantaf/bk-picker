import { ActionIcon, Box, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconCopy, IconStar, IconStarFilled, IconX } from "@tabler/icons-react";
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
        padding: 12,
        boxShadow: selected
          ? "inset 0 0 0 1px color-mix(in srgb, var(--color-accent) 55%, transparent), 0 8px 22px rgb(0 0 0 / 0.28)"
          : undefined,
      }}
    >
      <Stack gap={10}>
        <UnstyledButton onClick={() => onSelect(item)} aria-label={item.color.hex}>
          <Box
            className="swatch-chip"
            style={{
              height: 84,
              borderRadius: 14,
              background: item.color.hex,
              border: "1px solid var(--color-hairline)",
              boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.12)",
            }}
          />
        </UnstyledButton>
        <Group justify="space-between" wrap="nowrap" gap={6}>
          <Stack gap={2} style={{ minWidth: 0 }}>
            <Text size="xs" ff="monospace" fw={650} truncate>
              {item.color.hex}
            </Text>
            <Text size="10px" c="dimmed" truncate>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </Stack>
          <Group gap={2} wrap="nowrap">
            <ActionIcon
              size="sm"
              variant="subtle"
              color={item.favorite ? "yellow" : "gray"}
              aria-label={favoriteLabel}
              onClick={() => onToggleFavorite(item)}
            >
              {item.favorite ? (
                <IconStarFilled size={15} />
              ) : (
                <IconStar size={15} stroke={1.5} />
              )}
            </ActionIcon>
            <ActionIcon
              size="sm"
              variant="subtle"
              color="blue"
              aria-label={copyLabel}
              onClick={() => onCopy(item)}
            >
              <IconCopy size={15} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              size="sm"
              variant="subtle"
              color="red"
              aria-label={removeLabel}
              onClick={() => onRemove(item)}
            >
              <IconX size={15} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>
      </Stack>
    </Box>
  );
}
