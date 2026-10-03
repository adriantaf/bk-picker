import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { EmptyState } from "@/ui/EmptyState";
import { HistoryCard } from "@/ui/HistoryCard";
import type { HistoryItem } from "@/types";

type HistoryListProps = {
  title: string;
  favoritesTitle: string;
  emptyTitle: string;
  emptyCta?: string;
  onEmptyCta?: () => void;
  favoriteLabel: string;
  copyLabel: string;
  removeLabel: string;
  searchPlaceholder: string;
  clearLabel: string;
  exportCssLabel: string;
  exportJsonLabel: string;
  items: HistoryItem[];
  activeHex: string;
  onSelect: (item: HistoryItem) => void;
  onCopy: (item: HistoryItem) => void;
  onToggleFavorite: (item: HistoryItem) => void;
  onRemove: (item: HistoryItem) => void;
  onClear: () => void;
  onExportCss: () => void;
  onExportJson: () => void;
};

export function HistoryList({
  title,
  favoritesTitle,
  emptyTitle,
  emptyCta,
  onEmptyCta,
  favoriteLabel,
  copyLabel,
  removeLabel,
  searchPlaceholder,
  clearLabel,
  exportCssLabel,
  exportJsonLabel,
  items,
  activeHex,
  onSelect,
  onCopy,
  onToggleFavorite,
  onRemove,
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
      <Group justify="space-between" align="center">
        <Text size="sm" fw={700}>
          {title}
        </Text>
      </Group>

      <Group gap="xs" wrap="wrap">
        <TextInput
          size="xs"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          style={{ flex: "1 1 140px" }}
          styles={{
            input: {
              background: "var(--color-elevated)",
              border: "1px solid var(--color-hairline)",
            },
          }}
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

      {items.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          actionLabel={emptyCta}
          onAction={onEmptyCta}
        />
      ) : null}

      {favorites.length > 0 ? (
        <Stack gap="xs">
          <Group justify="space-between" px={2}>
            <Text size="sm" fw={600}>
              {favoritesTitle}
            </Text>
            <Badge color="yellow" variant="light" size="sm">
              {favorites.length}
            </Badge>
          </Group>
          <SimpleGrid cols={2} spacing="sm">
            {favorites.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                selected={item.color.hex === activeHex}
                favoriteLabel={favoriteLabel}
                copyLabel={copyLabel}
                removeLabel={removeLabel}
                onSelect={onSelect}
                onCopy={onCopy}
                onToggleFavorite={onToggleFavorite}
                onRemove={onRemove}
              />
            ))}
          </SimpleGrid>
        </Stack>
      ) : null}

      {recent.length > 0 ? (
        <SimpleGrid cols={2} spacing="sm">
          {recent.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              selected={item.color.hex === activeHex}
              favoriteLabel={favoriteLabel}
              copyLabel={copyLabel}
              removeLabel={removeLabel}
              onSelect={onSelect}
              onCopy={onCopy}
              onToggleFavorite={onToggleFavorite}
              onRemove={onRemove}
            />
          ))}
        </SimpleGrid>
      ) : null}

      {items.length > 0 && filtered.length === 0 ? (
        <EmptyState title={emptyTitle} />
      ) : null}
    </Stack>
  );
}
