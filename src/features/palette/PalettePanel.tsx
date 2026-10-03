import { Box, Button, Group, Stack, Text } from "@mantine/core";
import {
  complementaryPalette,
  analogousPalette,
  triadicPalette,
  exportPaletteAsText,
  contrastingInk,
  formatColor,
} from "@/lib/color";
import { PaletteRow } from "@/ui/PaletteRow";
import type { Color, ColorFormat, PaletteType } from "@/types";

type PalettePanelProps = {
  color: Color;
  copyFormat: ColorFormat;
  onSelect: (color: Color) => void;
  onCopyColor: (color: Color) => Promise<void>;
  onExport: (text: string) => Promise<void>;
  labels: {
    complementary: string;
    complementaryHint: string;
    analogous: string;
    analogousHint: string;
    triadic: string;
    triadicHint: string;
    export: string;
    clickHint: string;
  };
};

export function PalettePanel({
  color,
  copyFormat,
  onSelect,
  onCopyColor,
  onExport,
  labels,
}: PalettePanelProps) {
  const groups: Array<{
    type: PaletteType;
    title: string;
    description: string;
    colors: Color[];
  }> = [
    {
      type: "complementary",
      title: labels.complementary,
      description: labels.complementaryHint,
      colors: complementaryPalette(color),
    },
    {
      type: "analogous",
      title: labels.analogous,
      description: labels.analogousHint,
      colors: analogousPalette(color),
    },
    {
      type: "triadic",
      title: labels.triadic,
      description: labels.triadicHint,
      colors: triadicPalette(color),
    },
  ];

  return (
    <Stack gap="md">
      <Text size="xs" c="dimmed" px={2} style={{ lineHeight: 1.45 }}>
        {labels.clickHint}
      </Text>
      {groups.map((group) => (
        <Box key={group.type} className="ink-elevated" style={{ padding: 16 }}>
          <Stack gap="sm">
            <PaletteRow
              title={group.title}
              description={group.description}
              colors={group.colors}
              onSelect={(swatch) => {
                onSelect(swatch);
                void onCopyColor(swatch);
              }}
            />
            <Group gap="xs" wrap="wrap">
              {group.colors.map((swatch) => (
                <Button
                  key={`${group.type}-${swatch.hex}`}
                  size="xs"
                  variant="default"
                  onClick={() => {
                    onSelect(swatch);
                    void onCopyColor(swatch);
                  }}
                  styles={{
                    root: {
                      backgroundColor: swatch.hex,
                      color: contrastingInk(swatch),
                      border: "1px solid rgb(255 255 255 / 0.1)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      fontWeight: 650,
                      boxShadow: "0 4px 12px rgb(0 0 0 / 0.22)",
                    },
                  }}
                  title={formatColor(swatch, copyFormat)}
                >
                  {swatch.hex}
                </Button>
              ))}
            </Group>
            <Button
              variant="light"
              size="xs"
              onClick={() =>
                void onExport(
                  exportPaletteAsText(group.title, group.colors, copyFormat),
                )
              }
              style={{ alignSelf: "flex-start" }}
            >
              {labels.export}
            </Button>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
