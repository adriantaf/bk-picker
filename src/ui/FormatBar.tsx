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
    <Stack gap={12}>
      <Group
        gap={4}
        wrap="nowrap"
        style={{
          overflowX: "auto",
          padding: 4,
          borderRadius: 14,
          background: "color-mix(in srgb, var(--color-elevated) 75%, transparent)",
          border: "1px solid var(--color-hairline)",
          backdropFilter: "blur(12px)",
        }}
      >
        {FORMATS.map((format) => {
          const active = value === format;
          return (
            <UnstyledButton
              key={format}
              onClick={() => onFormatChange(format)}
              style={{
                flex: "1 0 auto",
                padding: "7px 10px",
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 650,
                letterSpacing: "0.02em",
                color: active ? "var(--color-text)" : "var(--color-muted)",
                background: active
                  ? "color-mix(in srgb, var(--color-accent) 22%, var(--color-overlay))"
                  : "transparent",
                boxShadow: active
                  ? "inset 0 0 0 1px color-mix(in srgb, var(--color-accent) 40%, transparent)"
                  : "none",
                transition:
                  "background-color var(--motion-fast), color var(--motion-fast), box-shadow var(--motion-fast)",
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
              letterSpacing: "0.02em",
              height: 40,
            },
          }}
        />
        <Button
          onClick={onCopy}
          radius="md"
          color="blue"
          style={{ height: 40, minWidth: 88, fontWeight: 650 }}
        >
          {copyLabel}
        </Button>
      </Group>
    </Stack>
  );
}
