import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Group,
  SegmentedControl,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  ContrastPanel,
  HexInput,
  HsbPicker,
  ImageColorPanel,
  LoupeCanvas,
} from "@/features/color-picker";
import { PalettePanel } from "@/features/palette";
import { SystemMatchGrid } from "@/features/systems/SystemMatchGrid";
import { contrastReport, contrastingInk, formatColor } from "@/lib/color";
import { ActionChip, ActionChipRow } from "@/ui/ActionChip";
import { FormatBar } from "@/ui/FormatBar";
import type {
  Color,
  ColorFormat,
  HistoryItem,
  LoupeUpdate,
  PickerMode,
} from "@/types";

type SessionTab = "capture" | "equivalences" | "palettes";

type ColorWorkspaceProps = {
  color: Color;
  copyFormat: ColorFormat;
  formatLabels: Record<ColorFormat, string>;
  mode: PickerMode;
  onModeChange: (mode: PickerMode) => void;
  modeLabels: Record<PickerMode, string>;
  picking: boolean;
  loupeSample: LoupeUpdate | null;
  history: HistoryItem[];
  onColorChange: (color: Color) => void;
  onFormatChange: (format: ColorFormat) => void;
  onCopy: () => Promise<void>;
  onStartPick: () => void;
  onStopPick: () => void;
  onSelectHistory: (item: HistoryItem) => void;
  onOpenHistory: () => void;
  onImagePick: (color: Color) => void;
  onCopySystemToken: (token: string) => void;
  onCopySystemBoth: (token: string, hex: string) => void;
  onSelectSystemHex: (hex: string) => void;
  onCopyPaletteColor: (color: Color) => Promise<void>;
  onExportPalette: (text: string) => Promise<void>;
  labels: {
    selected: string;
    copy: string;
    hex: string;
    hexInvalid: string;
    saturation: string;
    hue: string;
    pick: string;
    pickActive: string;
    pickHint: string;
    pickCancel: string;
    loupeCenter: string;
    recent: string;
    viewAll: string;
    capture: string;
    equivalences: string;
    palettes: string;
    systemsExact: string;
    systemsDelta: string;
    systemsCopyToken: string;
    systemsCopyBoth: string;
    systemsLabels: Record<string, string>;
    contrast: {
      title: string;
      onWhite: string;
      onBlack: string;
      pass: string;
      fail: string;
    };
    image: {
      chooseFile: string;
      urlPlaceholder: string;
      loadUrl: string;
      hint: string;
      dropHint: string;
      pasteHint: string;
      fileLabel: string;
      loading: string;
      errorInvalid: string;
      errorNetwork: string;
      zoomIn: string;
      zoomOut: string;
      zoomFit: string;
    };
    palette: {
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
};

export function ColorWorkspace({
  color,
  copyFormat,
  formatLabels,
  mode,
  onModeChange,
  modeLabels,
  picking,
  loupeSample,
  history,
  onColorChange,
  onFormatChange,
  onCopy,
  onStartPick,
  onStopPick,
  onSelectHistory,
  onOpenHistory,
  onImagePick,
  onCopySystemToken,
  onCopySystemBoth,
  onSelectSystemHex,
  onCopyPaletteColor,
  onExportPalette,
  labels,
}: ColorWorkspaceProps) {
  const [sessionTab, setSessionTab] = useState<SessionTab>("capture");
  const ink = contrastingInk(color);
  const recent = history.slice(0, 8);
  const contrast = contrastReport(color);
  const contrastOk =
    contrast.levelWhite === "AA" ||
    contrast.levelWhite === "AAA" ||
    contrast.levelBlack === "AA" ||
    contrast.levelBlack === "AAA";

  useEffect(() => {
    document.documentElement.style.setProperty("--active-glow", color.hex);
  }, [color.hex]);

  return (
    <Stack gap="md" className="ui-fade">
      <Box style={{ position: "relative" }}>
        <Box
          aria-hidden
          style={{
            position: "absolute",
            inset: "-18px -8px auto",
            height: 120,
            borderRadius: 40,
            background: `radial-gradient(ellipse at center, ${color.hex}55, transparent 70%)`,
            filter: "blur(18px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <Box
          style={{
            position: "relative",
            zIndex: 1,
            height: 148,
            borderRadius: 20,
            background: color.hex,
            display: "grid",
            placeItems: "center",
            boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.08)",
          }}
        >
          <Stack gap={8} align="center">
            <Text
              size="xs"
              tt="uppercase"
              fw={600}
              style={{
                letterSpacing: "0.08em",
                color: ink,
                opacity: 0.72,
              }}
            >
              {labels.selected}
            </Text>
            <Text
              ff="monospace"
              fw={700}
              style={{
                color: ink,
                letterSpacing: "0.06em",
                fontSize: 28,
                lineHeight: 1,
              }}
            >
              {color.hex}
            </Text>
            <Badge
              size="sm"
              variant="filled"
              style={{
                background: contrastOk
                  ? "rgb(16 185 129 / 0.85)"
                  : "rgb(239 68 68 / 0.85)",
                color: "#fff",
                backdropFilter: "blur(6px)",
              }}
            >
              {contrastOk ? labels.contrast.pass : labels.contrast.fail} AA
            </Badge>
          </Stack>
        </Box>
      </Box>

      <FormatBar
        value={copyFormat}
        formattedValue={formatColor(color, copyFormat)}
        labels={formatLabels}
        copyLabel={labels.copy}
        onFormatChange={onFormatChange}
        onCopy={() => void onCopy()}
      />

      <SegmentedControl
        fullWidth
        value={sessionTab}
        onChange={(value) => setSessionTab(value as SessionTab)}
        data={[
          { value: "capture", label: labels.capture },
          { value: "equivalences", label: labels.equivalences },
          { value: "palettes", label: labels.palettes },
        ]}
        radius="md"
        styles={{
          root: {
            background: "var(--color-elevated)",
            border: "1px solid var(--color-hairline)",
          },
          label: {
            fontSize: 12,
            fontWeight: 600,
            paddingTop: 8,
            paddingBottom: 8,
          },
        }}
      />

      {sessionTab === "capture" ? (
        <Stack gap="md" className="ui-fade" key="capture">
          <ActionChipRow>
            {(["eyedropper", "manual", "image"] as const).map((m) => (
              <ActionChip
                key={m}
                label={modeLabels[m]}
                active={mode === m}
                onClick={() => onModeChange(m)}
              />
            ))}
          </ActionChipRow>

          {mode === "eyedropper" ? (
            <Box className="ink-surface" p="md">
              <Stack gap="sm">
                <Group gap="xs" wrap="wrap" grow>
                  <Button
                    onClick={() => (picking ? onStopPick() : onStartPick())}
                    color={picking ? "orange" : "blue"}
                    variant={picking ? "light" : "filled"}
                    radius="md"
                    style={{ flex: "1 1 140px" }}
                  >
                    {picking ? labels.pickActive : labels.pick}
                  </Button>
                  {picking ? (
                    <Button variant="default" radius="md" onClick={onStopPick}>
                      {labels.pickCancel}
                    </Button>
                  ) : null}
                </Group>
                {picking ? (
                  <Stack gap="sm">
                    <Text size="xs" c="dimmed" ta="center">
                      {labels.pickHint}
                    </Text>
                    <LoupeCanvas
                      sample={loupeSample}
                      centerLabel={labels.loupeCenter}
                    />
                    <Text ta="center" ff="monospace" size="lg" fw={600}>
                      {loupeSample?.hex ?? "—"}
                    </Text>
                  </Stack>
                ) : null}
              </Stack>
            </Box>
          ) : null}

          {mode === "manual" ? (
            <Box className="ink-surface" p="md">
              <Stack gap="md">
                <HsbPicker
                  color={color}
                  onChange={onColorChange}
                  saturationLabel={labels.saturation}
                  hueLabel={labels.hue}
                />
                <HexInput
                  color={color}
                  label={labels.hex}
                  invalidLabel={labels.hexInvalid}
                  onChange={onColorChange}
                />
              </Stack>
            </Box>
          ) : null}

          {mode === "image" ? (
            <Box className="ink-surface" p="md">
              <ImageColorPanel onPick={onImagePick} labels={labels.image} />
            </Box>
          ) : null}

          <ContrastPanel color={color} labels={labels.contrast} />

          {recent.length > 0 ? (
            <Stack gap={8}>
              <Group justify="space-between">
                <Text
                  size="xs"
                  c="dimmed"
                  tt="uppercase"
                  fw={600}
                  style={{ letterSpacing: "0.06em" }}
                >
                  {labels.recent}
                </Text>
                <UnstyledButton
                  onClick={onOpenHistory}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--color-accent)",
                  }}
                >
                  {labels.viewAll}
                </UnstyledButton>
              </Group>
              <Group
                gap={8}
                wrap="nowrap"
                style={{ overflowX: "auto", paddingBottom: 4 }}
              >
                {recent.map((item) => (
                  <UnstyledButton
                    key={item.id}
                    onClick={() => onSelectHistory(item)}
                    aria-label={item.color.hex}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: item.color.hex,
                      flexShrink: 0,
                      boxShadow:
                        item.color.hex === color.hex
                          ? "inset 0 0 0 2px var(--color-accent)"
                          : "inset 0 0 0 1px var(--color-hairline)",
                    }}
                  />
                ))}
              </Group>
            </Stack>
          ) : null}
        </Stack>
      ) : null}

      {sessionTab === "equivalences" ? (
        <Box className="ui-fade" key="equivalences">
          <SystemMatchGrid
            color={color}
            exactLabel={labels.systemsExact}
            deltaLabel={labels.systemsDelta}
            copyTokenLabel={labels.systemsCopyToken}
            copyBothLabel={labels.systemsCopyBoth}
            systemLabels={labels.systemsLabels}
            onCopyToken={onCopySystemToken}
            onCopyBoth={onCopySystemBoth}
            onSelect={onSelectSystemHex}
          />
        </Box>
      ) : null}

      {sessionTab === "palettes" ? (
        <Box className="ui-fade" key="palettes">
          <PalettePanel
            color={color}
            copyFormat={copyFormat}
            onSelect={onColorChange}
            onCopyColor={onCopyPaletteColor}
            onExport={onExportPalette}
            labels={labels.palette}
          />
        </Box>
      ) : null}
    </Stack>
  );
}
