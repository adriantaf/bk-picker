import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Group,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  COLOR_SYSTEMS,
  matchAllSystems,
  type ColorSystemId,
  type SystemMatch,
} from "@/lib/colorSystems";
import type { Color } from "@/types";

type SystemsPanelProps = {
  color: Color;
  onCopyToken: (text: string) => void;
  onCopyBoth: (token: string, hex: string) => void;
  onSelect: (hex: string) => void;
  embedded?: boolean;
  labels: {
    title: string;
    hint: string;
    nearest: string;
    exact: string;
    copyToken: string;
    copyBoth: string;
    delta: string;
    search: string;
    filterAll: string;
    systemLabels: Record<string, string>;
  };
};

const EXACT_DELTA = 0.75;

function MatchRow({
  match,
  copyLabel,
  copyBothLabel,
  deltaLabel,
  exactLabel,
  onCopy,
  onCopyBoth,
  onSelect,
}: {
  match: SystemMatch;
  copyLabel: string;
  copyBothLabel: string;
  deltaLabel: string;
  exactLabel: string;
  onCopy: (text: string) => void;
  onCopyBoth: (token: string, hex: string) => void;
  onSelect: (hex: string) => void;
}) {
  const exact = match.distance <= EXACT_DELTA;
  return (
    <Paper
      p="sm"
      radius="md"
      withBorder
      style={
        exact
          ? {
              borderColor: "var(--mantine-color-teal-5)",
              boxShadow: "0 0 0 1px var(--mantine-color-teal-1)",
            }
          : undefined
      }
    >
      <Group justify="space-between" align="center" wrap="wrap" gap="sm">
        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
          <UnstyledButton
            onClick={() => onSelect(match.hex)}
            aria-label={match.hex}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: match.hex,
              border: "1px solid rgb(0 0 0 / 0.1)",
              flexShrink: 0,
            }}
          />
          <Stack gap={2} style={{ minWidth: 0 }}>
            <Group gap={6}>
              <Text size="sm" fw={600} truncate>
                {match.token}
              </Text>
              {exact ? (
                <Badge size="xs" color="teal" variant="filled">
                  {exactLabel}
                </Badge>
              ) : null}
            </Group>
            <Group gap={6}>
              <Text size="xs" ff="monospace" c="dimmed">
                {match.hex}
              </Text>
              <Badge size="xs" variant="light" color="gray">
                {deltaLabel} {match.distance.toFixed(1)}
              </Badge>
            </Group>
          </Stack>
        </Group>
        <Group gap={6}>
          <Button size="xs" variant="light" onClick={() => onCopy(match.copyText)}>
            {copyLabel}
          </Button>
          <Button
            size="xs"
            variant="default"
            onClick={() => onCopyBoth(match.copyText, match.hex)}
          >
            {copyBothLabel}
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}

export function SystemsPanel({
  color,
  onCopyToken,
  onCopyBoth,
  onSelect,
  embedded = false,
  labels,
}: SystemsPanelProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ColorSystemId | "all">("all");
  const matches = useMemo(
    () => matchAllSystems(color, embedded ? 2 : 3),
    [color, embedded],
  );

  const systems = COLOR_SYSTEMS.filter(
    (s) => filter === "all" || s.id === filter,
  );

  const q = query.trim().toLowerCase();

  return (
    <Stack gap="sm" className="ui-fade">
      {!embedded ? (
        <Stack gap={4}>
          <Text size="sm" fw={600}>
            {labels.title}
          </Text>
          <Text size="xs" c="dimmed">
            {labels.hint}
          </Text>
        </Stack>
      ) : null}

      <TextInput
        size="xs"
        placeholder={labels.search}
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        radius="md"
      />

      <SegmentedControl
        fullWidth
        size="xs"
        value={filter}
        onChange={(v) => setFilter(v as ColorSystemId | "all")}
        data={[
          { value: "all", label: labels.filterAll },
          ...COLOR_SYSTEMS.map((s) => ({
            value: s.id,
            label: labels.systemLabels[s.id] ?? s.id,
          })),
        ]}
        styles={{
          label: { fontSize: 10, paddingInline: 4 },
        }}
      />

      {systems.map((system) => {
        const rows = matches[system.id].filter((m) =>
          q
            ? m.token.toLowerCase().includes(q) ||
              m.hex.toLowerCase().includes(q) ||
              m.copyText.toLowerCase().includes(q)
            : true,
        );
        if (rows.length === 0) return null;
        return (
          <Stack key={system.id} gap="xs">
            <Group justify="space-between" px={2}>
              <Text size="sm" fw={600}>
                {labels.systemLabels[system.id] ?? system.id}
              </Text>
              <Badge size="sm" variant="light">
                {labels.nearest}
              </Badge>
            </Group>
            <SimpleGrid cols={1} spacing="xs">
              {rows.map((match) => (
                <MatchRow
                  key={`${system.id}-${match.token}-${match.hex}`}
                  match={match}
                  copyLabel={labels.copyToken}
                  copyBothLabel={labels.copyBoth}
                  deltaLabel={labels.delta}
                  exactLabel={labels.exact}
                  onCopy={onCopyToken}
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
