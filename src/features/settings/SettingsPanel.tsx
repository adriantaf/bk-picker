import {
  Anchor,
  Box,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import type { ReactNode } from "react";
import { LanguageToggle } from "@/ui";
import { APP_CREATOR, SHORTCUT_PRESETS } from "@/lib/constants";
import type { Locale } from "@/types";

type SettingsPanelProps = {
  locale: Locale;
  shortcut: string;
  shortcutStatusText: string;
  shortcutIsError: boolean;
  alwaysOnTop: boolean;
  version: string;
  onLocaleChange: (locale: Locale) => void;
  onShortcutChange: (shortcut: string) => void;
  onAlwaysOnTopChange: (enabled: boolean) => void;
  onOpenExternal: (url: string) => void;
  labels: {
    language: string;
    languageHint: string;
    languageToggle: string;
    languageEs: string;
    languageEn: string;
    shortcut: string;
    shortcutHint: string;
    alwaysOnTop: string;
    alwaysOnTopHint: string;
    about: string;
    creator: string;
    version: string;
  };
};

function SettingsRow({
  title,
  hint,
  control,
}: {
  title: string;
  hint: string;
  control: ReactNode;
}) {
  return (
    <Group
      justify="space-between"
      align="center"
      wrap="nowrap"
      gap="md"
      py="md"
      style={{ borderBottom: "1px solid var(--color-hairline)" }}
    >
      <Box style={{ minWidth: 0, flex: 1 }}>
        <Text size="sm" fw={600}>
          {title}
        </Text>
        <Text size="xs" c="dimmed" mt={2}>
          {hint}
        </Text>
      </Box>
      <Box style={{ flexShrink: 0 }}>{control}</Box>
    </Group>
  );
}

export function SettingsPanel({
  locale,
  shortcut,
  shortcutStatusText,
  shortcutIsError,
  alwaysOnTop,
  version,
  onLocaleChange,
  onShortcutChange,
  onAlwaysOnTopChange,
  onOpenExternal,
  labels,
}: SettingsPanelProps) {
  return (
    <Stack gap="lg" className="ui-fade">
      <Paper p="md" radius="lg" withBorder={false} shadow="none" bg="var(--color-surface)">
        <SettingsRow
          title={labels.language}
          hint={labels.languageHint}
          control={
            <LanguageToggle
              locale={locale}
              onChange={onLocaleChange}
              label={labels.languageToggle}
              labels={{ es: labels.languageEs, en: labels.languageEn }}
            />
          }
        />
        <Box py="md" style={{ borderBottom: "1px solid var(--color-hairline)" }}>
          <Text size="sm" fw={600}>
            {labels.shortcut}
          </Text>
          <Text size="xs" c="dimmed" mt={2} mb="sm">
            {labels.shortcutHint}
          </Text>
          <SegmentedControl
            value={shortcut}
            onChange={onShortcutChange}
            data={SHORTCUT_PRESETS.map((preset) => ({
              value: preset,
              label: preset,
            }))}
            fullWidth
            radius="md"
            styles={{
              label: { whiteSpace: "nowrap", fontSize: 11 },
            }}
          />
          <Text
            size="xs"
            c={shortcutIsError ? "red" : "dimmed"}
            mt="xs"
            role={shortcutIsError ? "alert" : undefined}
          >
            {shortcutStatusText}
          </Text>
        </Box>
        <SettingsRow
          title={labels.alwaysOnTop}
          hint={labels.alwaysOnTopHint}
          control={
            <Switch
              checked={alwaysOnTop}
              onChange={(event) =>
                onAlwaysOnTopChange(event.currentTarget.checked)
              }
              size="md"
              aria-label={labels.alwaysOnTop}
            />
          }
        />
      </Paper>

      <Paper
        p="md"
        radius="lg"
        style={{ background: "var(--color-elevated)", border: "none" }}
      >
        <Text size="sm" fw={600} mb="xs">
          {labels.about}
        </Text>
        <Text size="xs" c="dimmed">
          {labels.creator}{" "}
          <Anchor
            component="button"
            type="button"
            fw={600}
            size="xs"
            onClick={() => onOpenExternal(APP_CREATOR.url)}
          >
            {APP_CREATOR.name}
          </Anchor>
        </Text>
        <Text size="xs" c="dimmed" mt={6}>
          {labels.version} {version}
        </Text>
      </Paper>
    </Stack>
  );
}
