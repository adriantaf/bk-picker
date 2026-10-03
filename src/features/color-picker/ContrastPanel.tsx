import { Badge, Group, Text } from "@mantine/core";
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
    <Group gap={8} wrap="wrap" align="center">
      <Text
        size="xs"
        c="dimmed"
        tt="uppercase"
        fw={600}
        style={{ letterSpacing: "0.06em" }}
      >
        {labels.title}
      </Text>
      <Badge size="sm" radius="md" color={aa ? "teal" : "red"} variant="light">
        {aa ? `${labels.pass} AA` : `${labels.fail} AA`}
      </Badge>
      <Badge size="sm" radius="md" color={aaa ? "teal" : "gray"} variant="light">
        {aaa ? `${labels.pass} AAA` : `${labels.fail} AAA`}
      </Badge>
      <Text size="xs" c="dimmed" ff="monospace">
        {labels.onWhite} {report.onWhite.toFixed(1)} · {labels.onBlack}{" "}
        {report.onBlack.toFixed(1)} · {best}
      </Text>
    </Group>
  );
}
