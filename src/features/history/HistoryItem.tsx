import { ActionIcon, Box, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { ColorSwatch } from "@/ui/ColorSwatch";
import type { HistoryItem } from "@/types";

type HistoryItemViewProps = {
  item: HistoryItem;
  selected: boolean;
  favoriteLabel: string;
  onSelect: (item: HistoryItem) => void;
  onToggleFavorite: (item: HistoryItem) => void;
};

export function HistoryItemView({
  item,
  selected,
  favoriteLabel,
  onSelect,
  onToggleFavorite,
}: HistoryItemViewProps) {
  return (
    <Group
      gap="xs"
      wrap="nowrap"
      px={8}
      py={6}
      style={{
        borderRadius: 10,
        background: selected ? "var(--mantine-color-blue-0)" : "transparent",
        transition: "background-color 120ms ease",
      }}
    >
      <UnstyledButton
        onClick={() => onSelect(item)}
        style={{ flex: 1, minWidth: 0 }}
        aria-label={item.color.hex}
      >
        <Group gap="sm" wrap="nowrap">
          <ColorSwatch
            color={item.color}
            size="sm"
            selected={selected}
            label={item.color.hex}
            showHex
          />
          <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
            <Text size="xs" ff="monospace" truncate>
              {item.color.hex}
            </Text>
            <Text size="10px" c="dimmed" truncate>
              rgb({item.color.rgb.r}, {item.color.rgb.g}, {item.color.rgb.b})
            </Text>
          </Stack>
        </Group>
      </UnstyledButton>
      <ActionIcon
        variant="subtle"
        color={item.favorite ? "orange" : "gray"}
        aria-pressed={item.favorite}
        aria-label={favoriteLabel}
        title={favoriteLabel}
        onClick={() => onToggleFavorite(item)}
      >
        <Box component="span" style={{ fontSize: 14, lineHeight: 1 }}>
          {item.favorite ? "★" : "☆"}
        </Box>
      </ActionIcon>
    </Group>
  );
}
