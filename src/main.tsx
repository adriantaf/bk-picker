import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { App } from "./App";
import { LoupeWindowApp } from "@/features/color-picker";
import { loadSettings, DEFAULT_SETTINGS } from "@/storage";
import { bkTheme } from "@/theme";
import type { Locale } from "@/types";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";

function Root() {
  const [view, setView] = useState<"main" | "loupe" | "boot">("boot");
  const [locale, setLocale] = useState<Locale>(DEFAULT_SETTINGS.locale);

  useEffect(() => {
    const label = getCurrentWindow().label;
    if (label === "loupe") {
      void loadSettings().then((settings) => {
        setLocale(settings.locale);
        setView("loupe");
      });
      return;
    }
    setView("main");
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

  return (
    <MantineProvider theme={bkTheme} forceColorScheme="dark">
      <Notifications position="top-center" zIndex={4000} limit={2} />
      <App />
    </MantineProvider>
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
