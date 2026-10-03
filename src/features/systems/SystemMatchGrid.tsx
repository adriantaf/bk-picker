import { SimpleGrid, Stack, Text } from "@mantine/core";
import { COLOR_SYSTEMS, type ColorSystemId } from "@/lib/colorSystems";
import { MatchCard } from "@/ui/MatchCard";
import type { Color } from "@/types";

type SystemMatchGridProps = {
  color: Color;
  exactLabel: string;
  deltaLabel: string;
  copyTokenLabel: string;
  copyBothLabel: string;
  systemLabels: Record<string, string>;
  onCopyToken: (text: string) => void;
  onCopyBoth: (token: string, hex: string) => void;
  onSelect: (hex: string) => void;
  /** Top matches per system (default 3). */
  limit?: number;
};

/** Top N match cards per registered color system. */
export function SystemMatchGrid({
  color,
  exactLabel,
  deltaLabel,
  copyTokenLabel,
  copyBothLabel,
  systemLabels,
  onCopyToken,
  onCopyBoth,
  onSelect,
  limit = 3,
}: SystemMatchGridProps) {
  return (
    <Stack gap="lg">
      {COLOR_SYSTEMS.map((system) => {
        const matches = system.match(color, limit);
        if (matches.length === 0) return null;
        const id = system.id as ColorSystemId;
        const systemLabel = systemLabels[id] ?? system.id;

        return (
          <Stack key={id} gap="sm">
            <Text className="ink-section-label">{systemLabel}</Text>
            <SimpleGrid cols={1} spacing="sm">
              {matches.map((match) => (
                <MatchCard
                  key={`${id}-${match.token}-${match.hex}`}
                  systemLabel={systemLabel}
                  showSystemLabel={false}
                  match={match}
                  exactLabel={exactLabel}
                  deltaLabel={deltaLabel}
                  copyTokenLabel={copyTokenLabel}
                  copyBothLabel={copyBothLabel}
                  onCopyToken={onCopyToken}
                  onCopyBoth={onCopyBoth}
                  onSelect={onSelect}
                />
              ))}
            </SimpleGrid>
          </Stack>
        );
      })}
    </Stack>
  );
}
