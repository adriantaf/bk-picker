import {
  Anchor,
  Box,
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

function SettingsCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <Box className="ink-elevated" style={{ padding: 18 }}>
      <Stack gap="md">
        <Box>
          <Text size="sm" fw={650}>
            {title}
          </Text>
          {hint ? (
            <Text size="xs" c="dimmed" mt={5} style={{ lineHeight: 1.45 }}>
              {hint}
            </Text>
          ) : null}
        </Box>
        {children}
      </Stack>
    </Box>
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
    <Stack gap="md" className="ui-fade">
      <SettingsCard title={labels.language} hint={labels.languageHint}>
        <LanguageToggle
          locale={locale}
          onChange={onLocaleChange}
          label={labels.languageToggle}
          labels={{ es: labels.languageEs, en: labels.languageEn }}
        />
      </SettingsCard>

      <SettingsCard title={labels.shortcut} hint={labels.shortcutHint}>
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
            root: {
              background: "var(--color-base)",
            },
            label: { whiteSpace: "nowrap", fontSize: 11 },
          }}
        />
        <Text
          size="xs"
          c={shortcutIsError ? "red" : "dimmed"}
          role={shortcutIsError ? "alert" : undefined}
        >
          {shortcutStatusText}
        </Text>
      </SettingsCard>

      <SettingsCard title={labels.alwaysOnTop} hint={labels.alwaysOnTopHint}>
        <Switch
          checked={alwaysOnTop}
          onChange={(event) =>
            onAlwaysOnTopChange(event.currentTarget.checked)
          }
          size="md"
          aria-label={labels.alwaysOnTop}
        />
      </SettingsCard>

      <SettingsCard title={labels.about}>
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
        <Text size="xs" c="dimmed">
          {labels.version} {version}
        </Text>
      </SettingsCard>
    </Stack>
  );
}
