import { Badge, Box, Button, Group, Stack, Text } from "@mantine/core";
import type { SystemMatch } from "@/lib/colorSystems";

const EXACT_DELTA = 0.75;

type MatchCardProps = {
  systemLabel: string;
  showSystemLabel?: boolean;
  match: SystemMatch;
  exactLabel: string;
  deltaLabel: string;
  hintLabel?: string;
  copyTokenLabel: string;
  copyBothLabel: string;
  onCopyToken: (text: string) => void;
  onCopyBoth: (token: string, hex: string) => void;
  onSelect: (hex: string) => void;
};

export function MatchCard({
  systemLabel,
  showSystemLabel = true,
  match,
  exactLabel,
  deltaLabel,
  hintLabel,
  copyTokenLabel,
  copyBothLabel,
  onCopyToken,
  onCopyBoth,
  onSelect,
}: MatchCardProps) {
  const exact = match.distance <= EXACT_DELTA;
  const hint =
    hintLabel ??
    (match.system === "tailwind" ? `bg-${match.token}` : undefined);

  return (
    <Box className="ink-elevated ink-interactive" style={{ padding: 14 }}>
      <Stack gap={12}>
        <Group wrap="nowrap" gap="sm" align="flex-start">
          <Box
            onClick={() => onSelect(match.hex)}
            className="swatch-chip"
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: match.hex,
              border: "1px solid var(--color-hairline)",
              cursor: "pointer",
              flexShrink: 0,
              boxShadow: "0 6px 16px rgb(0 0 0 / 0.28)",
            }}
            aria-label={match.hex}
          />
          <Stack gap={4} style={{ minWidth: 0, flex: 1 }}>
            {showSystemLabel ? (
              <Text className="ink-section-label">{systemLabel}</Text>
            ) : null}
            <Text size="sm" fw={650} truncate>
              {match.token}
            </Text>
            <Group gap={8}>
              <Text size="xs" ff="monospace" c="dimmed">
                {match.hex}
              </Text>
              <Badge
                size="xs"
                color={exact ? "teal" : "gray"}
                variant="light"
                style={{ fontWeight: 650 }}
              >
                {exact ? exactLabel : `${deltaLabel} ${match.distance.toFixed(1)}`}
              </Badge>
            </Group>
            {hint ? (
              <Text size="xs" ff="monospace" c="var(--color-accent)">
                {hint}
              </Text>
            ) : null}
          </Stack>
        </Group>
        <Group gap={8}>
          <Button
            size="compact-xs"
            variant="light"
            onClick={() => onCopyToken(match.copyText)}
          >
            {copyTokenLabel}
          </Button>
          <Button
            size="compact-xs"
            variant="default"
            onClick={() => onCopyBoth(match.copyText, match.hex)}
          >
            {copyBothLabel}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
