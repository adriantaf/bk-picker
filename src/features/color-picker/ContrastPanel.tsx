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

function levelOk(level: ContrastLevel): boolean {
  return level === "AA" || level === "AAA";
}

export function ContrastPanel({ color, labels }: ContrastPanelProps) {
  const report = contrastReport(color);
  const best = report.onWhite >= report.onBlack ? report.levelWhite : report.levelBlack;
  const aa = levelOk(report.levelWhite) || levelOk(report.levelBlack);
  const aaa = report.levelWhite === "AAA" || report.levelBlack === "AAA";

  return (
    <Paper
      p="md"
      radius="lg"
      style={{
        background: "var(--color-elevated)",
        border: "none",
        boxShadow: "none",
      }}
    >
      <Stack gap={10}>
        <Text
          size="xs"
          c="dimmed"
          tt="uppercase"
          fw={600}
          style={{ letterSpacing: "0.06em" }}
        >
          {labels.title}
        </Text>
        <Group gap="sm" wrap="wrap">
          <Badge
            size="lg"
            radius="xl"
            color={aa ? "teal" : "red"}
            variant="filled"
            leftSection={aa ? "✓" : "×"}
          >
            {aa ? `${labels.pass} AA` : `${labels.fail} AA`}
          </Badge>
          <Badge
            size="lg"
            radius="xl"
            color={aaa ? "teal" : "gray"}
            variant={aaa ? "filled" : "light"}
            leftSection={aaa ? "✓" : "×"}
          >
            {aaa ? `${labels.pass} AAA` : `${labels.fail} AAA`}
          </Badge>
          <Text size="xs" c="dimmed" ff="monospace">
            {labels.onWhite} {report.onWhite.toFixed(1)} · {labels.onBlack}{" "}
            {report.onBlack.toFixed(1)} · {best}
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
}
