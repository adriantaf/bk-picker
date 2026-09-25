import {
  Box,
  Button,
  Code,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import { ColorSwatch, CopyButton, FormatSelector } from "@/ui";
import type { Color, ColorFormat, LoupeUpdate, PickerMode } from "@/types";
import { ContrastPanel } from "./ContrastPanel";
import { HexInput } from "./HexInput";
import { HsbPicker } from "./HsbPicker";
import { ImageColorPanel } from "./ImageColorPanel";
import { LoupeCanvas } from "./LoupeCanvas";

type ActiveColorPanelProps = {
  title: string;
  hint: string;
  color: Color;
  formattedValue: string;
  copyFormat: ColorFormat;
  formatLabels: Record<ColorFormat, string>;
  copyLabel: string;
  copiedLabel: string;
  failedLabel: string;
  hexLabel: string;
  hexInvalidLabel: string;
  saturationLabel: string;
  hueLabel: string;
  pickLabel: string;
  pickActiveLabel: string;
  pickHint: string;
  pickCancelLabel: string;
  loupeCenterLabel: string;
  contrastLabels: {
    title: string;
    onWhite: string;
    onBlack: string;
    pass: string;
    fail: string;
  };
  mode: PickerMode;
  onModeChange: (mode: PickerMode) => void;
  modeLabels: Record<PickerMode, string>;
  imageLabels: {
    chooseFile: string;
    urlPlaceholder: string;
    loadUrl: string;
    hint: string;
    dropHint: string;
    pasteHint: string;
    loading: string;
    errorInvalid: string;
    errorNetwork: string;
    zoomIn: string;
    zoomOut: string;
    zoomFit: string;
    fileLabel: string;
  };
  picking: boolean;
  loupeSample: LoupeUpdate | null;
  onColorChange: (color: Color) => void;
  onImagePick: (color: Color) => void;
  onFormatChange: (format: ColorFormat) => void;
  onCopy: () => Promise<void>;
  onCopyError: () => void;
  onStartPick: () => void;
  onStopPick: () => void;
};

export function ActiveColorPanel({
  title,
  hint,
  color,
  formattedValue,
  copyFormat,
  formatLabels,
  copyLabel,
  copiedLabel,
  failedLabel,
  hexLabel,
  hexInvalidLabel,
  saturationLabel,
  hueLabel,
  pickLabel,
  pickActiveLabel,
  pickHint,
  pickCancelLabel,
  loupeCenterLabel,
  contrastLabels,
  mode,
  onModeChange,
  modeLabels,
  imageLabels,
  picking,
  loupeSample,
  onColorChange,
  onImagePick,
  onFormatChange,
  onCopy,
  onCopyError,
  onStartPick,
  onStopPick,
}: ActiveColorPanelProps) {
  return (
    <Paper p="md" component="section" className="ui-fade">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
          <Box style={{ minWidth: 0, flex: 1 }}>
            <Text size="sm" fw={600}>
              {title}
            </Text>
            <Text size="xs" c="dimmed" mt={2}>
              {hint}
            </Text>
          </Box>
          <ColorSwatch color={color} size="md" label={color.hex} />
        </Group>

        <SegmentedControl
          fullWidth
          value={mode}
          onChange={(value) => onModeChange(value as PickerMode)}
          data={[
            { value: "eyedropper", label: modeLabels.eyedropper },
            { value: "manual", label: modeLabels.manual },
            { value: "image", label: modeLabels.image },
          ]}
        />

        {mode === "eyedropper" ? (
          <Stack gap="sm" className="ui-fade">
            <Group gap="xs" wrap="wrap" grow>
              <Button
                onClick={() => (picking ? onStopPick() : onStartPick())}
                color={picking ? "orange" : "blue"}
                variant={picking ? "light" : "filled"}
                style={{ flex: "1 1 140px" }}
              >
                {picking ? pickActiveLabel : pickLabel}
              </Button>
              {picking ? (
                <Button
                  variant="default"
                  onClick={onStopPick}
                  style={{ flex: "0 0 auto" }}
                >
                  {pickCancelLabel}
                </Button>
              ) : null}
            </Group>

            {picking ? (
              <Paper p="sm" bg="gray.0" withBorder>
                <Stack gap="sm">
                  <Text size="xs" c="dimmed" ta="center">
                    {pickHint}
                  </Text>
                  <LoupeCanvas sample={loupeSample} centerLabel={loupeCenterLabel} />
                  <Text
                    ta="center"
                    ff="monospace"
                    size="lg"
                    fw={600}
                    style={{ letterSpacing: "0.04em" }}
                  >
                    {loupeSample?.hex ?? "—"}
                  </Text>
                </Stack>
              </Paper>
            ) : null}
          </Stack>
        ) : null}

        {mode === "manual" ? (
          <Box className="ui-fade">
            <HsbPicker
              color={color}
              onChange={onColorChange}
              saturationLabel={saturationLabel}
              hueLabel={hueLabel}
            />
          </Box>
        ) : null}

        {mode === "image" ? (
          <ImageColorPanel onPick={onImagePick} labels={imageLabels} />
        ) : null}

        <Group justify="space-between" align="flex-end" gap="sm" wrap="wrap">
          <FormatSelector
            value={copyFormat}
            onChange={onFormatChange}
            labels={formatLabels}
          />
          <CopyButton
            label={copyLabel}
            copiedLabel={copiedLabel}
            failedLabel={failedLabel}
            onCopy={onCopy}
            onError={onCopyError}
            compact
          />
        </Group>

        <Paper p="sm" bg="gray.0" withBorder>
          <Code
            block
            style={{
              background: "transparent",
              fontSize: 14,
              userSelect: "text",
              wordBreak: "break-all",
            }}
          >
            {formattedValue}
          </Code>
        </Paper>

        <ContrastPanel color={color} labels={contrastLabels} />

        <HexInput
          color={color}
          label={hexLabel}
          invalidLabel={hexInvalidLabel}
          onChange={onColorChange}
        />
      </Stack>
    </Paper>
  );
}
