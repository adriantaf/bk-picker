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
import { PageTransition } from "@/ui/PageMotion";
import { Surface } from "@/ui/Surface";
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
  /** Optional controlled session tab (used by Store screenshot harness). */
  sessionTab?: SessionTab;
  onSessionTabChange?: (tab: SessionTab) => void;
  /** Optional sample image URL for Store screenshots. */
  demoImageUrl?: string | null;
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
  sessionTab: sessionTabProp,
  onSessionTabChange,
  demoImageUrl = null,
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
  const [sessionTabInternal, setSessionTabInternal] =
    useState<SessionTab>("capture");
  const sessionTab = sessionTabProp ?? sessionTabInternal;
  const setSessionTab = (tab: SessionTab) => {
    onSessionTabChange?.(tab);
    if (sessionTabProp === undefined) {
      setSessionTabInternal(tab);
    }
  };
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
    <Stack gap={18}>
      <Box style={{ position: "relative" }}>
        <Box
          aria-hidden
          style={{
            position: "absolute",
            inset: "-28px -16px auto",
            height: 140,
            borderRadius: 48,
            background: `radial-gradient(ellipse at center, ${color.hex}66, transparent 72%)`,
            filter: "blur(22px)",
            pointerEvents: "none",
            zIndex: 0,
            transition: "background var(--motion-slow)",
          }}
        />
        <Box
          className="ink-hero"
          style={{
            position: "relative",
            zIndex: 1,
            height: 168,
            background: color.hex,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Stack gap={10} align="center" style={{ position: "relative", zIndex: 1 }}>
            <Text
              size="xs"
              tt="uppercase"
              fw={650}
              style={{
                letterSpacing: "0.1em",
                color: ink,
                opacity: 0.7,
              }}
            >
              {labels.selected}
            </Text>
            <Text
              key={color.hex}
              ff="monospace"
              fw={700}
              className="ui-fade"
              style={{
                color: ink,
                letterSpacing: "0.08em",
                fontSize: 32,
                lineHeight: 1,
                textShadow: "0 2px 18px rgb(0 0 0 / 0.18)",
              }}
            >
              {color.hex}
            </Text>
            <Badge
              size="sm"
              variant="filled"
              style={{
                background: contrastOk
                  ? "rgb(16 185 129 / 0.88)"
                  : "rgb(239 68 68 / 0.88)",
                color: "#fff",
                backdropFilter: "blur(8px)",
                fontWeight: 650,
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
          label: {
            fontSize: 12,
            fontWeight: 650,
            paddingTop: 9,
            paddingBottom: 9,
          },
        }}
      />

      {sessionTab === "capture" ? (
        <PageTransition pageKey="capture">
        <Stack gap="md">
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
            <Surface>
              <Stack gap="sm">
                <Group gap="xs" wrap="wrap" grow>
                  <Button
                    onClick={() => (picking ? onStopPick() : onStartPick())}
                    color={picking ? "orange" : "blue"}
                    variant={picking ? "light" : "filled"}
                    radius="md"
                    style={{ flex: "1 1 140px", height: 40 }}
                  >
                    {picking ? labels.pickActive : labels.pick}
                  </Button>
                  {picking ? (
                    <Button variant="default" radius="md" onClick={onStopPick} style={{ height: 40 }}>
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
                    <Text ta="center" ff="monospace" size="lg" fw={650}>
                      {loupeSample?.hex ?? "—"}
                    </Text>
                  </Stack>
                ) : null}
              </Stack>
            </Surface>
          ) : null}

          {mode === "manual" ? (
            <Surface>
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
            </Surface>
          ) : null}

          {mode === "image" ? (
            <Surface>
              <ImageColorPanel
                onPick={onImagePick}
                labels={labels.image}
                demoImageUrl={demoImageUrl}
              />
            </Surface>
          ) : null}

          <ContrastPanel color={color} labels={labels.contrast} />

          {recent.length > 0 ? (
            <Stack gap={10}>
              <Group justify="space-between">
                <Text className="ink-section-label">{labels.recent}</Text>
                <UnstyledButton
                  onClick={onOpenHistory}
                  style={{
                    fontSize: 12,
                    fontWeight: 650,
                    color: "var(--color-accent)",
                    transition: "opacity var(--motion-fast)",
                  }}
                >
                  {labels.viewAll}
                </UnstyledButton>
              </Group>
              <Group
                gap={10}
                wrap="nowrap"
                style={{ overflowX: "auto", paddingBottom: 4, paddingTop: 2 }}
              >
                {recent.map((item) => (
                  <UnstyledButton
                    key={item.id}
                    className="swatch-chip"
                    onClick={() => onSelectHistory(item)}
                    aria-label={item.color.hex}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: item.color.hex,
                      flexShrink: 0,
                      boxShadow:
                        item.color.hex === color.hex
                          ? "0 0 0 2px var(--color-base), 0 0 0 4px var(--color-accent)"
                          : "inset 0 0 0 1px var(--color-hairline), 0 4px 12px rgb(0 0 0 / 0.25)",
                    }}
                  />
                ))}
              </Group>
            </Stack>
          ) : null}
        </Stack>
        </PageTransition>
      ) : null}

      {sessionTab === "equivalences" ? (
        <PageTransition pageKey="equivalences">
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
        </PageTransition>
      ) : null}

      {sessionTab === "palettes" ? (
        <PageTransition pageKey="palettes">
          <PalettePanel
            color={color}
            copyFormat={copyFormat}
            onSelect={onColorChange}
            onCopyColor={onCopyPaletteColor}
            onExport={onExportPalette}
            labels={labels.palette}
          />
        </PageTransition>
      ) : null}
    </Stack>
  );
}
