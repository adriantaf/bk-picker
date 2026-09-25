import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { EmptyState } from "@/ui/EmptyState";
import type { HistoryItem } from "@/types";
import { HistoryItemView } from "./HistoryItem";

type HistoryListProps = {
  title: string;
  favoritesTitle: string;
  emptyTitle: string;
  favoriteLabel: string;
  searchPlaceholder: string;
  clearLabel: string;
  exportCssLabel: string;
  exportJsonLabel: string;
  items: HistoryItem[];
  activeHex: string;
  onSelect: (item: HistoryItem) => void;
  onToggleFavorite: (item: HistoryItem) => void;
  onClear: () => void;
  onExportCss: () => void;
  onExportJson: () => void;
};

export function HistoryList({
  title,
  favoritesTitle,
  emptyTitle,
  favoriteLabel,
  searchPlaceholder,
  clearLabel,
  exportCssLabel,
  exportJsonLabel,
  items,
  activeHex,
  onSelect,
  onToggleFavorite,
  onClear,
  onExportCss,
  onExportJson,
}: HistoryListProps) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return items;
    return items.filter(
      (item) =>
        item.color.hex.toLowerCase().includes(q) ||
        `rgb(${item.color.rgb.r},${item.color.rgb.g},${item.color.rgb.b})`
          .toLowerCase()
          .includes(q),
    );
  }, [items, q]);

  const favorites = filtered.filter((item) => item.favorite);
  const recent = filtered.filter((item) => !item.favorite);

  return (
    <Stack gap="md" className="ui-fade">
      <Group gap="xs" wrap="wrap">
        <TextInput
          size="xs"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          style={{ flex: "1 1 140px" }}
        />
        <Button size="xs" variant="default" onClick={onExportCss} disabled={items.length === 0}>
          {exportCssLabel}
        </Button>
        <Button size="xs" variant="default" onClick={onExportJson} disabled={items.length === 0}>
          {exportJsonLabel}
        </Button>
        <Button
          size="xs"
          variant="light"
          color="red"
          onClick={onClear}
          disabled={items.length === 0}
        >
          {clearLabel}
        </Button>
      </Group>

      {favorites.length > 0 ? (
        <Stack gap="xs">
          <Group justify="space-between" px={2}>
            <Text size="sm" fw={600}>
              {favoritesTitle}
            </Text>
            <Badge color="orange" variant="light" size="sm">
              {favorites.length}
            </Badge>
          </Group>
          <Paper p={6} component="ul" style={{ listStyle: "none", margin: 0 }}>
            {favorites.map((item) => (
              <li key={`fav-${item.id}`}>
                <HistoryItemView
                  item={item}
                  selected={item.color.hex === activeHex}
                  favoriteLabel={favoriteLabel}
                  onSelect={onSelect}
                  onToggleFavorite={onToggleFavorite}
                />
              </li>
            ))}
          </Paper>
        </Stack>
      ) : null}

      <Stack gap="xs">
        <Group justify="space-between" px={2}>
          <Text size="sm" fw={600}>
            {title}
          </Text>
          <Badge color="gray" variant="light" size="sm">
            {recent.length}
          </Badge>
        </Group>

        {recent.length === 0 && favorites.length === 0 ? (
          <EmptyState title={emptyTitle} />
        ) : recent.length === 0 ? (
          <EmptyState title={emptyTitle} />
        ) : (
          <Paper p={6} component="ul" style={{ listStyle: "none", margin: 0 }}>
            {recent.map((item) => (
              <li key={item.id}>
                <HistoryItemView
                  item={item}
                  selected={item.color.hex === activeHex}
                  favoriteLabel={favoriteLabel}
                  onSelect={onSelect}
                  onToggleFavorite={onToggleFavorite}
                />
              </li>
            ))}
          </Paper>
        )}
      </Stack>
    </Stack>
  );
}
