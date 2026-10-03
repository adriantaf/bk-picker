import { HISTORY_LIMIT } from "@/lib/constants";
import type { Color, HistoryItem } from "@/types";
import { createHistoryItem, trimHistory } from "@/storage";

/**
 * History model:
 * - Newest first.
 * - Skip consecutive duplicate hex.
 * - Favorites persist beyond the recent HISTORY_LIMIT window via trimHistory.
 */
export function prependHistory(
  items: HistoryItem[],
  color: Color,
): HistoryItem[] {
  const head = items[0];
  if (head && head.color.hex.toUpperCase() === color.hex.toUpperCase()) {
    return items;
  }

  return trimHistory([createHistoryItem(color), ...items]);
}

export function toggleFavorite(
  items: HistoryItem[],
  id: string,
): HistoryItem[] {
  return trimHistory(
    items.map((item) =>
      item.id === id ? { ...item, favorite: !item.favorite } : item,
    ),
  );
}

export function removeHistoryItem(
  items: HistoryItem[],
  id: string,
): HistoryItem[] {
  return items.filter((item) => item.id !== id);
}

export { HISTORY_LIMIT };
