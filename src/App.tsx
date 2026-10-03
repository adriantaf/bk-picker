import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Center, Loader, Stack, Text } from "@mantine/core";
import { getVersion } from "@tauri-apps/api/app";
import { HistoryList } from "@/features/history";
import {
  prependHistory,
  removeHistoryItem,
  toggleFavorite,
} from "@/features/history/historyStore";
import { OnboardingModal } from "@/features/onboarding";
import { SettingsPanel, ShortcutBanner } from "@/features/settings";
import { ColorWorkspace } from "@/features/workspace";
import { t } from "@/i18n";
import {
  colorFromHex,
  colorFromRgb,
  formatColor,
  DEFAULT_COLOR,
} from "@/lib/color";
import { DEFAULT_SHORTCUT } from "@/lib/constants";
import {
  DEFAULT_SETTINGS,
  loadHistory,
  loadOnboardingSeen,
  loadSettings,
  saveHistory,
  saveOnboardingSeen,
  saveSettings,
} from "@/storage";
import {
  copyTextToClipboard,
  onColorCaptured,
  onLoupeUpdate,
  onPickCancelled,
  onPickStopped,
  onShortcutError,
  getShortcutStatus,
  openExternalUrl,
  setAlwaysOnTop,
  setGlobalShortcut,
  startPickMode,
  stopPickMode,
} from "@/tauri";
import {
  notifyColorCaptured,
  notifyCopiedLocal,
  notifyError,
} from "@/lib/notify";
import type {
  AppSettings,
  AppTab,
  CapturedColorPayload,
  Color,
  ColorFormat,
  HistoryItem,
  Locale,
  LoupeUpdate,
  PickerMode,
} from "@/types";
import { AppShell } from "@/ui";

type BootState = "loading" | "ready" | "error";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export function App() {
  const [boot, setBoot] = useState<BootState>("loading");
  const [bootTick, setBootTick] = useState(0);
  const [tab, setTab] = useState<AppTab>("workspace");
  const [pickerMode, setPickerMode] = useState<PickerMode>("manual");
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [activeColor, setActiveColor] = useState<Color>(DEFAULT_COLOR);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [shortcutError, setShortcutError] = useState<string | null>(null);
  const [shortcutLabel, setShortcutLabel] = useState(DEFAULT_SHORTCUT);
  const [picking, setPicking] = useState(false);
  const [loupeSample, setLoupeSample] = useState<LoupeUpdate | null>(null);
  const [appVersion, setAppVersion] = useState("1.0.0");
  const [showOnboarding, setShowOnboarding] = useState(false);

  const locale = settings.locale;

  useEffect(() => {
    let cancelled = false;

    async function bootApp() {
      setBoot("loading");
      try {
        const [loadedSettings, loadedHistory, onboardingSeen, version] =
          await Promise.all([
            loadSettings(),
            loadHistory(),
            loadOnboardingSeen(),
            getVersion().catch(() => "1.0.0"),
          ]);

        if (cancelled) return;

        setSettings(loadedSettings);
        setHistory(loadedHistory);
        setAppVersion(version);
        document.documentElement.lang = loadedSettings.locale;
        await setAlwaysOnTop(loadedSettings.alwaysOnTop);

        try {
          const status = await setGlobalShortcut(loadedSettings.shortcut);
          if (cancelled) return;
          setShortcutLabel(status.shortcut || loadedSettings.shortcut);
          setShortcutError(status.error);
        } catch (error) {
          const fallback = await getShortcutStatus();
          if (cancelled) return;
          setShortcutLabel(fallback.shortcut || loadedSettings.shortcut);
          setShortcutError(
            fallback.error ??
              (error instanceof Error ? error.message : String(error)),
          );
        }

        if (loadedHistory[0]) {
          setActiveColor(loadedHistory[0].color);
        }

        setShowOnboarding(!onboardingSeen);
        setBoot("ready");
      } catch {
        if (!cancelled) {
          setBoot("error");
        }
      }
    }

    void bootApp();
    return () => {
      cancelled = true;
    };
  }, [bootTick]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    document.documentElement.style.setProperty("--active-glow", activeColor.hex);
  }, [activeColor.hex]);

  const pushColor = useCallback((color: Color) => {
    setActiveColor(color);
    setHistory((prev) => {
      const next = prependHistory(prev, color);
      void saveHistory(next);
      return next;
    });
  }, []);

  const copyFormatted = useCallback(
    async (color: Color, format: ColorFormat = settings.copyFormat) => {
      const text = formatColor(color, format);
      await copyTextToClipboard(text);
      notifyCopiedLocal(text, t(locale, "copy.copied"));
      return text;
    },
    [locale, settings.copyFormat],
  );

  const applyCapturedColor = useCallback(
    (payload: CapturedColorPayload) => {
      const color =
        colorFromHex(payload.hex) ??
        colorFromRgb({ r: payload.r, g: payload.g, b: payload.b });

      setPicking(false);
      setLoupeSample(null);
      setTab("workspace");
      setPickerMode("eyedropper");
      pushColor(color);

      const text = formatColor(color, settings.copyFormat);
      void copyTextToClipboard(text)
        .then(() => {
          notifyColorCaptured(text, t(locale, "shortcut.capturing"));
        })
        .catch(() => {
          notifyColorCaptured(color.hex, t(locale, "shortcut.capturing"));
        });
    },
    [locale, pushColor, settings.copyFormat],
  );

  useEffect(() => {
    const unsubscribers: Array<() => void> = [];

    void onColorCaptured(applyCapturedColor).then((fn) => unsubscribers.push(fn));
    void onShortcutError((message) => setShortcutError(message)).then((fn) =>
      unsubscribers.push(fn),
    );
    void onLoupeUpdate((sample) => {
      setLoupeSample(sample);
    }).then((fn) => unsubscribers.push(fn));
    void onPickStopped(() => {
      setPicking(false);
      setLoupeSample(null);
    }).then((fn) => unsubscribers.push(fn));
    void onPickCancelled(() => {
      setPicking(false);
      setLoupeSample(null);
    }).then((fn) => unsubscribers.push(fn));

    return () => {
      for (const unsub of unsubscribers) unsub();
    };
  }, [applyCapturedColor]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "c") {
        return;
      }
      if (isEditableTarget(event.target)) return;
      if (tab !== "workspace" || picking) return;
      event.preventDefault();
      void copyFormatted(activeColor).catch(() =>
        notifyError(t(locale, "copy.failed")),
      );
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeColor, copyFormatted, locale, picking, tab]);

  useEffect(() => {
    async function onPaste(event: ClipboardEvent) {
      if (isEditableTarget(event.target)) return;
      if (pickerMode === "image" && tab === "workspace") return;

      const text = event.clipboardData?.getData("text")?.trim();
      if (!text) return;
      const color = colorFromHex(text);
      if (!color) return;

      event.preventDefault();
      pushColor(color);
      try {
        await copyFormatted(color);
      } catch {
        notifyError(t(locale, "copy.failed"));
      }
    }

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [copyFormatted, locale, pickerMode, pushColor, tab]);

  async function persistSettings(next: AppSettings) {
    setSettings(next);
    await saveSettings(next);
  }

  async function handleLocaleChange(nextLocale: Locale) {
    await persistSettings({ ...settings, locale: nextLocale });
  }

  async function handleCopy() {
    try {
      await copyFormatted(activeColor);
    } catch {
      notifyError(t(locale, "copy.failed"));
      throw new Error("copy failed");
    }
  }

  async function handleFormatChange(copyFormat: ColorFormat) {
    await persistSettings({ ...settings, copyFormat });
    try {
      await copyFormatted(activeColor, copyFormat);
    } catch {
      notifyError(t(locale, "copy.failed"));
    }
  }

  async function handleShortcutChange(shortcut: string) {
    try {
      const status = await setGlobalShortcut(shortcut);
      setShortcutLabel(status.shortcut);
      setShortcutError(status.error);
      await persistSettings({ ...settings, shortcut: status.shortcut });
    } catch (error) {
      setShortcutError(error instanceof Error ? error.message : String(error));
    }
  }

  async function handleAlwaysOnTopChange(enabled: boolean) {
    await setAlwaysOnTop(enabled);
    await persistSettings({ ...settings, alwaysOnTop: enabled });
  }

  async function handleStartPick() {
    setTab("workspace");
    setPickerMode("eyedropper");
    setPicking(true);
    try {
      await startPickMode();
    } catch (error) {
      setPicking(false);
      setShortcutError(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async function handleStopPick() {
    await stopPickMode();
    setPicking(false);
    setLoupeSample(null);
  }

  async function handleSelectHistory(item: HistoryItem) {
    setActiveColor(item.color);
    setTab("workspace");
    try {
      await copyFormatted(item.color);
    } catch {
      notifyError(t(locale, "copy.failed"));
    }
  }

  function handleToggleFavorite(item: HistoryItem) {
    setHistory((prev) => {
      const next = toggleFavorite(prev, item.id);
      void saveHistory(next);
      return next;
    });
  }

  function handleRemoveHistory(item: HistoryItem) {
    setHistory((prev) => {
      const next = removeHistoryItem(prev, item.id);
      void saveHistory(next);
      return next;
    });
  }

  function handleClearHistory() {
    setHistory([]);
    void saveHistory([]);
    notifyCopiedLocal("", t(locale, "history.cleared"));
  }

  async function handleExportHistoryCss() {
    const favorites = history.filter((item) => item.favorite);
    const source = favorites.length > 0 ? favorites : history;
    const lines = source.map(
      (item, index) =>
        `--color-${index + 1}: ${formatColor(item.color, settings.copyFormat)};`,
    );
    const text = `:root {\n  ${lines.join("\n  ")}\n}\n`;
    await copyTextToClipboard(text);
    notifyCopiedLocal(text, t(locale, "history.exported"));
  }

  async function handleExportHistoryJson() {
    const favorites = history.filter((item) => item.favorite);
    const source = favorites.length > 0 ? favorites : history;
    const payload = source.map((item) => ({
      hex: item.color.hex,
      rgb: item.color.rgb,
      hsl: item.color.hsl,
      favorite: item.favorite,
      value: formatColor(item.color, settings.copyFormat),
    }));
    const text = JSON.stringify(payload, null, 2);
    await copyTextToClipboard(text);
    notifyCopiedLocal(text, t(locale, "history.exported"));
  }

  async function handleExportPalette(text: string) {
    await copyTextToClipboard(text);
    notifyCopiedLocal(text, t(locale, "palette.exported"));
  }

  async function handleCopyPaletteColor(color: Color) {
    try {
      await copyFormatted(color);
    } catch {
      notifyError(t(locale, "copy.failed"));
    }
  }

  function handleImagePick(color: Color) {
    pushColor(color);
    setTab("workspace");
    void copyFormatted(color)
      .then(() => undefined)
      .catch(() => {
        notifyColorCaptured(color.hex, t(locale, "copy.copied"));
      });
  }

  async function handleCopySystemToken(token: string) {
    await copyTextToClipboard(token);
    notifyCopiedLocal(token, t(locale, "copy.copied"));
  }

  async function handleCopySystemBoth(token: string, hex: string) {
    const text = `${token}\n${hex}`;
    await copyTextToClipboard(text);
    notifyCopiedLocal(text, t(locale, "copy.copied"));
  }

  async function handleSelectSystemHex(hex: string) {
    const color = colorFromHex(hex);
    if (!color) return;
    pushColor(color);
    try {
      await copyFormatted(color);
    } catch {
      notifyError(t(locale, "copy.failed"));
    }
  }

  function handleModeChange(mode: PickerMode) {
    if (picking && mode !== "eyedropper") {
      void handleStopPick();
    }
    setPickerMode(mode);
  }

  const shortcutStatusText = useMemo(() => {
    if (shortcutError) {
      return `${t(locale, "shortcut.error")}: ${shortcutError}`;
    }
    return t(locale, "shortcut.ready", { shortcut: shortcutLabel });
  }, [locale, shortcutError, shortcutLabel]);

  const formatLabels = useMemo(
    () => ({
      hex: t(locale, "format.hex"),
      hex8: t(locale, "format.hex8"),
      rgb: t(locale, "format.rgb"),
      hsl: t(locale, "format.hsl"),
      hslModern: t(locale, "format.hslModern"),
      oklch: t(locale, "format.oklch"),
    }),
    [locale],
  );

  const imageLabels = useMemo(
    () => ({
      chooseFile: t(locale, "image.chooseFile"),
      urlPlaceholder: t(locale, "image.urlPlaceholder"),
      loadUrl: t(locale, "image.loadUrl"),
      hint: t(locale, "image.hint"),
      dropHint: t(locale, "image.dropHint"),
      pasteHint: t(locale, "image.pasteHint"),
      fileLabel: t(locale, "image.fileLabel"),
      loading: t(locale, "image.loading"),
      errorInvalid: t(locale, "image.errorInvalid"),
      errorNetwork: t(locale, "image.errorNetwork"),
      zoomIn: t(locale, "image.zoomIn"),
      zoomOut: t(locale, "image.zoomOut"),
      zoomFit: t(locale, "image.zoomFit"),
    }),
    [locale],
  );

  if (boot === "loading") {
    return (
      <Center h="100dvh" bg="var(--color-base)" style={{ gap: 12 }}>
        <Loader size="sm" />
        <Text size="sm" c="dimmed">
          {t(locale, "status.loading")}
        </Text>
      </Center>
    );
  }

  if (boot === "error") {
    return (
      <Center h="100dvh" bg="var(--color-base)" px="md">
        <Stack align="center" gap="md">
          <Text size="sm" c="red" ta="center" role="alert">
            {t(locale, "status.error")}
          </Text>
          <Button onClick={() => setBootTick((n) => n + 1)}>
            {t(locale, "status.retry")}
          </Button>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      <OnboardingModal
        opened={showOnboarding}
        onClose={() => {
          setShowOnboarding(false);
          void saveOnboardingSeen(true);
        }}
        labels={{
          title: t(locale, "onboarding.title"),
          body: t(locale, "onboarding.body"),
          itemShortcut: t(locale, "onboarding.shortcut"),
          itemEyedropper: t(locale, "onboarding.eyedropper"),
          itemImage: t(locale, "onboarding.image"),
          itemSystems: t(locale, "onboarding.systems"),
          cta: t(locale, "onboarding.cta"),
        }}
      />
      <AppShell
        tab={tab}
        onTabChange={(next) => {
          if (picking && next !== "workspace") void handleStopPick();
          setTab(next);
        }}
        tabLabels={{
          workspace: t(locale, "tab.workspace"),
          history: t(locale, "tab.history"),
          settings: t(locale, "tab.settings"),
        }}
        footer={
          tab === "workspace" ? (
            <ShortcutBanner
              label={t(locale, "shortcut.label")}
              statusText={shortcutStatusText}
              isError={Boolean(shortcutError)}
            />
          ) : null
        }
      >
        {tab === "workspace" ? (
          <ColorWorkspace
            color={activeColor}
            copyFormat={settings.copyFormat}
            formatLabels={formatLabels}
            mode={pickerMode}
            onModeChange={handleModeChange}
            modeLabels={{
              eyedropper: t(locale, "mode.eyedropper"),
              manual: t(locale, "mode.manual"),
              image: t(locale, "mode.image"),
            }}
            picking={picking}
            loupeSample={loupeSample}
            history={history}
            onColorChange={setActiveColor}
            onFormatChange={(format) => void handleFormatChange(format)}
            onCopy={handleCopy}
            onStartPick={() => void handleStartPick()}
            onStopPick={() => void handleStopPick()}
            onSelectHistory={(item) => void handleSelectHistory(item)}
            onOpenHistory={() => setTab("history")}
            onImagePick={handleImagePick}
            onCopySystemToken={(token) => void handleCopySystemToken(token)}
            onCopySystemBoth={(token, hex) =>
              void handleCopySystemBoth(token, hex)
            }
            onSelectSystemHex={(hex) => void handleSelectSystemHex(hex)}
            onCopyPaletteColor={handleCopyPaletteColor}
            onExportPalette={handleExportPalette}
            labels={{
              selected: t(locale, "active.selected"),
              copy: t(locale, "copy.label"),
              hex: t(locale, "hex.label"),
              hexInvalid: t(locale, "hex.invalid"),
              saturation: t(locale, "picker.saturation"),
              hue: t(locale, "picker.hue"),
              pick: t(locale, "pick.start"),
              pickActive: t(locale, "pick.active"),
              pickHint: t(locale, "pick.hint"),
              pickCancel: t(locale, "pick.cancel"),
              loupeCenter: t(locale, "loupe.center"),
              recent: t(locale, "workspace.recent"),
              viewAll: t(locale, "workspace.viewAll"),
              capture: t(locale, "workspace.capture"),
              equivalences: t(locale, "workspace.equivalences"),
              palettes: t(locale, "workspace.palettes"),
              systemsExact: t(locale, "systems.exact"),
              systemsDelta: t(locale, "systems.delta"),
              systemsCopyToken: t(locale, "systems.copyToken"),
              systemsCopyBoth: t(locale, "systems.copyBoth"),
              systemsLabels: {
                tailwind: t(locale, "systems.tailwind"),
                material: t(locale, "systems.material"),
                css: t(locale, "systems.css"),
                bootstrap: t(locale, "systems.bootstrap"),
              },
              contrast: {
                title: t(locale, "contrast.title"),
                onWhite: t(locale, "contrast.onWhite"),
                onBlack: t(locale, "contrast.onBlack"),
                pass: t(locale, "contrast.pass"),
                fail: t(locale, "contrast.fail"),
              },
              image: imageLabels,
              palette: {
                complementary: t(locale, "palette.complementary"),
                complementaryHint: t(locale, "palette.complementaryHint"),
                analogous: t(locale, "palette.analogous"),
                analogousHint: t(locale, "palette.analogousHint"),
                triadic: t(locale, "palette.triadic"),
                triadicHint: t(locale, "palette.triadicHint"),
                export: t(locale, "palette.export"),
                clickHint: t(locale, "palette.clickHint"),
              },
            }}
          />
        ) : null}

        {tab === "history" ? (
          <HistoryList
            title={t(locale, "history.title")}
            favoritesTitle={t(locale, "history.favorites")}
            emptyTitle={t(locale, "history.empty")}
            emptyCta={t(locale, "pick.start")}
            onEmptyCta={() => {
              setTab("workspace");
              void handleStartPick();
            }}
            favoriteLabel={t(locale, "history.favorite")}
            copyLabel={t(locale, "history.copy")}
            removeLabel={t(locale, "history.remove")}
            searchPlaceholder={t(locale, "history.search")}
            clearLabel={t(locale, "history.clear")}
            exportCssLabel={t(locale, "history.exportCss")}
            exportJsonLabel={t(locale, "history.exportJson")}
            items={history}
            activeHex={activeColor.hex}
            onSelect={(item) => void handleSelectHistory(item)}
            onCopy={(item) => void handleSelectHistory(item)}
            onToggleFavorite={handleToggleFavorite}
            onRemove={handleRemoveHistory}
            onClear={handleClearHistory}
            onExportCss={() => void handleExportHistoryCss()}
            onExportJson={() => void handleExportHistoryJson()}
          />
        ) : null}

        {tab === "settings" ? (
          <SettingsPanel
            locale={locale}
            shortcut={settings.shortcut}
            shortcutStatusText={shortcutStatusText}
            shortcutIsError={Boolean(shortcutError)}
            alwaysOnTop={settings.alwaysOnTop}
            version={appVersion}
            onLocaleChange={(next) => void handleLocaleChange(next)}
            onShortcutChange={(next) => void handleShortcutChange(next)}
            onAlwaysOnTopChange={(next) => void handleAlwaysOnTopChange(next)}
            onOpenExternal={(url) => {
              void openExternalUrl(url).catch(() =>
                notifyError(t(locale, "status.error")),
              );
            }}
            labels={{
              language: t(locale, "settings.language"),
              languageHint: t(locale, "settings.languageHint"),
              languageToggle: t(locale, "language.label"),
              languageEs: t(locale, "language.es"),
              languageEn: t(locale, "language.en"),
              shortcut: t(locale, "settings.shortcut"),
              shortcutHint: t(locale, "settings.shortcutHint"),
              alwaysOnTop: t(locale, "settings.alwaysOnTop"),
              alwaysOnTopHint: t(locale, "settings.alwaysOnTopHint"),
              about: t(locale, "settings.about"),
              creator: t(locale, "settings.creator"),
              version: t(locale, "settings.version"),
            }}
          />
        ) : null}
      </AppShell>
    </>
  );
}
