import { Button, Group, Stack, TextInput, UnstyledButton } from "@mantine/core";
import type { ColorFormat } from "@/types";

const FORMATS: ColorFormat[] = [
  "hex",
  "hex8",
  "rgb",
  "hsl",
  "hslModern",
  "oklch",
];

type FormatBarProps = {
  value: ColorFormat;
  formattedValue: string;
  labels: Record<ColorFormat, string>;
  copyLabel: string;
  onFormatChange: (format: ColorFormat) => void;
  onCopy: () => void;
};

export function FormatBar({
  value,
  formattedValue,
  labels,
  copyLabel,
  onFormatChange,
  onCopy,
}: FormatBarProps) {
  return (
    <Stack gap={10}>
      <Group gap={6} wrap="wrap">
        {FORMATS.map((format) => {
          const active = value === format;
          return (
            <UnstyledButton
              key={format}
              onClick={() => onFormatChange(format)}
              style={{
                padding: "5px 10px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.02em",
                color: active ? "#0e1116" : "var(--color-muted)",
                background: active ? "var(--color-accent)" : "var(--color-elevated)",
                boxShadow: active ? "none" : "inset 0 0 0 1px var(--color-hairline)",
                transition: "background-color 140ms ease, color 140ms ease",
              }}
            >
              {labels[format]}
            </UnstyledButton>
          );
        })}
      </Group>
      <Group gap="sm" align="stretch" wrap="nowrap">
        <TextInput
          value={formattedValue}
          readOnly
          radius="md"
          style={{ flex: 1, minWidth: 0 }}
          styles={{
            input: {
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              background: "var(--color-elevated)",
              border: "1px solid var(--color-hairline)",
              color: "var(--color-text)",
            },
          }}
        />
        <Button onClick={onCopy} radius="md" color="blue">
          {copyLabel}
        </Button>
      </Group>
    </Stack>
  );
}
