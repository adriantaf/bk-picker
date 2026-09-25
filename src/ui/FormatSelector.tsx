import { Select } from "@mantine/core";
import type { ColorFormat } from "@/types";

type FormatSelectorProps = {
  value: ColorFormat;
  onChange: (format: ColorFormat) => void;
  labels: Record<ColorFormat, string>;
};

const FORMATS: ColorFormat[] = [
  "hex",
  "hex8",
  "rgb",
  "hsl",
  "hslModern",
  "oklch",
];

export function FormatSelector({
  value,
  onChange,
  labels,
}: FormatSelectorProps) {
  return (
    <Select
      value={value}
      onChange={(next) => {
        if (next) onChange(next as ColorFormat);
      }}
      data={FORMATS.map((format) => ({
        value: format,
        label: labels[format],
      }))}
      size="xs"
      allowDeselect={false}
      comboboxProps={{ withinPortal: true }}
      style={{ flex: "1 1 140px", minWidth: 0 }}
      aria-label="Copy format"
    />
  );
}
