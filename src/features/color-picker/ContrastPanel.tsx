import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import { contrastReport, type ContrastLevel } from "@/lib/color";
import type { Color } from "@/types";

type ContrastPanelProps = {
  color: Color;
  labels: {
    title: string;
    onWhite: string;
    onBlack: string;
    pass: string;
    fail: string;
  };
};

function levelColor(level: ContrastLevel): string {
  if (level === "AAA") return "teal";
  if (level === "AA") return "blue";
  return "red";
}

function levelLabel(level: ContrastLevel, pass: string, fail: string): string {
  if (level === "fail") return fail;
  return `${pass} ${level}`;
}

export function ContrastPanel({ color, labels }: ContrastPanelProps) {
  const report = contrastReport(color);

  return (
    <Paper p="sm" withBorder bg="gray.0">
      <Stack gap={8}>
        <Text size="xs" fw={600}>
          {labels.title}
        </Text>
        <Group justify="space-between" gap="xs" wrap="wrap">
          <Group gap={6}>
            <Text size="xs" c="dimmed">
              {labels.onWhite}
            </Text>
            <Text size="xs" ff="monospace" fw={600}>
              {report.onWhite.toFixed(2)}:1
            </Text>
            <Badge size="xs" color={levelColor(report.levelWhite)} variant="light">
              {levelLabel(report.levelWhite, labels.pass, labels.fail)}
            </Badge>
          </Group>
          <Group gap={6}>
            <Text size="xs" c="dimmed">
              {labels.onBlack}
            </Text>
            <Text size="xs" ff="monospace" fw={600}>
              {report.onBlack.toFixed(2)}:1
            </Text>
            <Badge size="xs" color={levelColor(report.levelBlack)} variant="light">
              {levelLabel(report.levelBlack, labels.pass, labels.fail)}
            </Badge>
          </Group>
        </Group>
        <Group gap="xs" grow>
          <Paper
            p={6}
            radius="sm"
            style={{
              background: "#fff",
              color: color.hex,
              textAlign: "center",
              fontSize: 11,
              fontWeight: 600,
              border: "1px solid rgb(0 0 0 / 0.08)",
            }}
          >
            Aa
          </Paper>
          <Paper
            p={6}
            radius="sm"
            style={{
              background: "#111",
              color: color.hex,
              textAlign: "center",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Aa
          </Paper>
        </Group>
      </Stack>
    </Paper>
  );
}
