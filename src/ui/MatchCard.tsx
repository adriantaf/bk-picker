import { Badge, Box, Button, Group, Stack, Text } from "@mantine/core";
import type { SystemMatch } from "@/lib/colorSystems";

const EXACT_DELTA = 0.75;

type MatchCardProps = {
  systemLabel: string;
  /** When false, omit the system name (section header already shows it). */
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
    <Box className="ink-elevated" p={12} style={{ padding: 12 }}>
      <Stack gap={10}>
        <Group justify="space-between" wrap="nowrap" gap="sm">
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
            <Box
              onClick={() => onSelect(match.hex)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: match.hex,
                border: "1px solid var(--color-hairline)",
                cursor: "pointer",
                flexShrink: 0,
              }}
              aria-label={match.hex}
            />
            <Stack gap={2} style={{ minWidth: 0 }}>
              {showSystemLabel ? (
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.06em" }}>
                  {systemLabel}
                </Text>
              ) : null}
              <Text size="sm" fw={600} truncate>
                {match.token}
              </Text>
              <Group gap={6}>
                <Text size="xs" ff="monospace" c="dimmed">
                  {match.hex}
                </Text>
                <Badge size="xs" color={exact ? "teal" : "gray"} variant="light">
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
        </Group>
        <Group gap={6}>
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
