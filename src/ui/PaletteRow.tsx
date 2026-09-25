import { Group, Stack, Text } from "@mantine/core";
import { ColorSwatch } from "@/ui/ColorSwatch";
import type { Color } from "@/types";

type PaletteRowProps = {
  title: string;
  description: string;
  colors: Color[];
  onSelect: (color: Color) => void;
};

export function PaletteRow({
  title,
  description,
  colors,
  onSelect,
}: PaletteRowProps) {
  return (
    <Stack gap="xs">
      <Stack gap={2}>
        <Text size="sm" fw={600}>
          {title}
        </Text>
        <Text size="xs" c="dimmed">
          {description}
        </Text>
      </Stack>
      <Group gap="xs" wrap="wrap">
        {colors.map((color) => (
          <ColorSwatch
            key={color.hex}
            color={color}
            size="sm"
            onClick={() => onSelect(color)}
            label={color.hex}
          />
        ))}
      </Group>
    </Stack>
  );
}
