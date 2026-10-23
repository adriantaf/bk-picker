import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { App } from "./App";
import { LoupeWindowApp } from "@/features/color-picker";
import { loadSettings, DEFAULT_SETTINGS } from "@/storage";
import { isStoreShotMode } from "@/storeShots/isStoreShot";
import { bkTheme } from "@/theme";
import type { Locale } from "@/types";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";
import "./storeShots/storeShot.css";

async function resolveWindowLabel(): Promise<"main" | "loupe"> {
  try {
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    const label = getCurrentWindow().label;
    return label === "loupe" ? "loupe" : "main";
  } catch {
    return "main";
  }
}

function Root() {
  const [view, setView] = useState<"main" | "loupe" | "boot">("boot");
  const [locale, setLocale] = useState<Locale>(DEFAULT_SETTINGS.locale);

  useEffect(() => {
    void resolveWindowLabel().then((label) => {
      if (label === "loupe") {
        void loadSettings().then((settings) => {
          setLocale(settings.locale);
          setView("loupe");
        });
        return;
      }
      setView("main");
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("store-shot", isStoreShotMode());
  }, []);

  if (view === "boot") {
    return null;
  }

  if (view === "loupe") {
    return (
      <MantineProvider theme={bkTheme} forceColorScheme="dark">
        <LoupeWindowApp locale={locale} />
      </MantineProvider>
    );
  }

  const app = (
    <MantineProvider theme={bkTheme} forceColorScheme="dark">
      <Notifications position="top-center" zIndex={4000} limit={2} />
      <App />
    </MantineProvider>
  );

  if (!isStoreShotMode()) {
    return app;
  }

  return (
    <div className="store-shot-desktop" data-testid="store-shot-desktop">
      <div className="store-shot-window" data-testid="store-shot-window">
        <div className="store-shot-titlebar" aria-hidden>
          <span className="store-shot-title">BK Picker</span>
          <span className="store-shot-win-controls">
            <button type="button" tabIndex={-1} aria-hidden>
              ─
            </button>
            <button type="button" tabIndex={-1} aria-hidden>
              □
            </button>
            <button type="button" tabIndex={-1} aria-hidden>
              ✕
            </button>
          </span>
        </div>
        <div className="store-shot-content">{app}</div>
      </div>
    </div>
  );
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element #root not found");
}

createRoot(root).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
