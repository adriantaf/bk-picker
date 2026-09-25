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
    aboutBody: string;
    creator: string;
    version: string;
  };
};

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
    <Stack gap="md" className="ui-fade">
      <Paper p="md">
        <Stack gap="sm">
          <Box>
            <Text size="sm" fw={600}>
              {labels.language}
            </Text>
            <Text size="xs" c="dimmed" mt={2}>
              {labels.languageHint}
            </Text>
          </Box>
          <LanguageToggle
            locale={locale}
            onChange={onLocaleChange}
            label={labels.languageToggle}
            labels={{ es: labels.languageEs, en: labels.languageEn }}
          />
        </Stack>
      </Paper>

      <Paper p="md">
        <Stack gap="sm">
          <Box>
            <Text size="sm" fw={600}>
              {labels.shortcut}
            </Text>
            <Text size="xs" c="dimmed" mt={2}>
              {labels.shortcutHint}
            </Text>
          </Box>
          <SegmentedControl
            value={shortcut}
            onChange={onShortcutChange}
            data={SHORTCUT_PRESETS.map((preset) => ({
              value: preset,
              label: preset,
            }))}
            fullWidth
            orientation="horizontal"
            styles={{
              root: { flexWrap: "wrap" },
              label: { whiteSpace: "nowrap", fontSize: 11 },
            }}
          />
          <Text
            size="xs"
            c={shortcutIsError ? "red" : "dimmed"}
            role={shortcutIsError ? "alert" : undefined}
            aria-live={shortcutIsError ? "polite" : undefined}
          >
            {shortcutStatusText}
          </Text>
        </Stack>
      </Paper>

      <Paper p="md">
        <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
          <Box style={{ minWidth: 0, flex: 1 }}>
            <Text size="sm" fw={600}>
              {labels.alwaysOnTop}
            </Text>
            <Text size="xs" c="dimmed" mt={2}>
              {labels.alwaysOnTopHint}
            </Text>
          </Box>
          <Switch
            checked={alwaysOnTop}
            onChange={(event) => onAlwaysOnTopChange(event.currentTarget.checked)}
            size="md"
            aria-label={labels.alwaysOnTop}
          />
        </Group>
      </Paper>

      <Paper p="md">
        <Stack gap="sm">
          <Text size="sm" fw={600}>
            {labels.about}
          </Text>
          <Text size="xs" c="dimmed" style={{ lineHeight: 1.5 }}>
            {labels.aboutBody}
          </Text>
          <Paper p="sm" bg="gray.0" withBorder>
            <Text size="xs" c="dimmed">
              {labels.creator}
            </Text>
            <Anchor
              component="button"
              type="button"
              fw={600}
              size="sm"
              mt={4}
              display="inline-block"
              onClick={() => onOpenExternal(APP_CREATOR.url)}
            >
              {APP_CREATOR.name}
            </Anchor>
            <Text size="xs" c="dimmed" mt="sm">
              {labels.version} {version}
            </Text>
          </Paper>
        </Stack>
      </Paper>
    </Stack>
  );
}
