import {
  Box,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import type { ReactNode } from "react";
import { CopyButton, FormatSelector } from "@/ui";
import { contrastingInk } from "@/lib/color";
import type { Color, ColorFormat, LoupeUpdate, PickerMode } from "@/types";
import { ContrastPanel } from "./ContrastPanel";
import { HexInput } from "./HexInput";
import { HsbPicker } from "./HsbPicker";
import { LoupeCanvas } from "./LoupeCanvas";

type ActiveColorPanelProps = {
  selectedLabel: string;
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
  valueLabel: string;
  formatLabel: string;
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
  picking: boolean;
  loupeSample: LoupeUpdate | null;
  onColorChange: (color: Color) => void;
  onFormatChange: (format: ColorFormat) => void;
  onCopy: () => Promise<void>;
  onCopyError: () => void;
  onStartPick: () => void;
  onStopPick: () => void;
  children?: ReactNode;
};

export function ActiveColorPanel({
  selectedLabel,
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
  valueLabel,
  formatLabel,
  contrastLabels,
  mode,
  onModeChange,
  modeLabels,
  picking,
  loupeSample,
  onColorChange,
  onFormatChange,
  onCopy,
  onCopyError,
  onStartPick,
  onStopPick,
  children,
}: ActiveColorPanelProps) {
  const ink = contrastingInk(color);

  return (
    <Stack gap="lg" className="ui-fade">
      <Stack gap={6}>
        <Text
          size="xs"
          c="dimmed"
          tt="uppercase"
          fw={600}
          style={{ letterSpacing: "0.06em" }}
        >
          {selectedLabel}
        </Text>
        <Box
          style={{
            height: 120,
            borderRadius: 16,
            background: color.hex,
            display: "grid",
            placeItems: "center",
            boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.06)",
          }}
        >
          <Text
            ff="monospace"
            fw={700}
            size="xl"
            style={{ color: ink, letterSpacing: "0.04em" }}
          >
            {color.hex}
          </Text>
        </Box>
      </Stack>

      <Group gap="xs" grow>
        {(["eyedropper", "manual"] as const).map((m) => {
          const active = mode === m;
          return (
            <UnstyledButton
              key={m}
              onClick={() => onModeChange(m)}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                textAlign: "center",
                fontSize: 13,
                fontWeight: 600,
                color: active ? "var(--mantine-color-blue-6)" : "var(--color-muted)",
                background: active ? "var(--color-surface)" : "var(--color-elevated)",
                border: active
                  ? "1px solid var(--color-border)"
                  : "1px solid transparent",
                boxShadow: active ? "0 1px 2px rgb(0 0 0 / 0.04)" : "none",
              }}
            >
              {modeLabels[m]}
            </UnstyledButton>
          );
        })}
      </Group>

      {mode === "eyedropper" ? (
        <Stack gap="sm">
          <Group gap="xs" wrap="wrap" grow>
            <Button
              onClick={() => (picking ? onStopPick() : onStartPick())}
              color={picking ? "orange" : "blue"}
              variant={picking ? "light" : "filled"}
              radius="md"
              style={{ flex: "1 1 140px" }}
            >
              {picking ? pickActiveLabel : pickLabel}
            </Button>
            {picking ? (
              <Button variant="default" radius="md" onClick={onStopPick}>
                {pickCancelLabel}
              </Button>
            ) : null}
          </Group>
          {picking ? (
            <Stack gap="sm">
              <Text size="xs" c="dimmed" ta="center">
                {pickHint}
              </Text>
              <LoupeCanvas sample={loupeSample} centerLabel={loupeCenterLabel} />
              <Text ta="center" ff="monospace" size="lg" fw={600}>
                {loupeSample?.hex ?? "—"}
              </Text>
            </Stack>
          ) : null}
        </Stack>
      ) : null}

      {mode === "manual" ? (
        <HsbPicker
          color={color}
          onChange={onColorChange}
          saturationLabel={saturationLabel}
          hueLabel={hueLabel}
        />
      ) : null}

      <Stack gap={6}>
        <Text size="xs" c="dimmed" fw={600}>
          {valueLabel}
        </Text>
        <TextInput
          value={formattedValue}
          readOnly
          radius="md"
          styles={{
            input: {
              fontFamily: "var(--font-mono)",
              fontSize: 13,
            },
          }}
        />
      </Stack>

      <Group align="flex-end" gap="sm" wrap="wrap">
        <Box style={{ flex: "1 1 120px", minWidth: 0 }}>
          <Text size="xs" c="dimmed" fw={600} mb={6}>
            {formatLabel}
          </Text>
          <FormatSelector
            value={copyFormat}
            onChange={onFormatChange}
            labels={formatLabels}
          />
        </Box>
        <CopyButton
          label={copyLabel}
          copiedLabel={copiedLabel}
          failedLabel={failedLabel}
          onCopy={onCopy}
          onError={onCopyError}
          compact
        />
      </Group>

      <ContrastPanel color={color} labels={contrastLabels} />

      <HexInput
        color={color}
        label={hexLabel}
        invalidLabel={hexInvalidLabel}
        onChange={onColorChange}
      />

      {children}
    </Stack>
  );
}
