import { useEffect, useState } from "react";
import { Stack, Text } from "@mantine/core";
import { LoupeCanvas } from "@/features/color-picker/LoupeCanvas";
import { t } from "@/i18n";
import { onLoupeUpdate } from "@/tauri";
import type { Locale, LoupeUpdate } from "@/types";

type LoupeWindowAppProps = {
  locale: Locale;
};

/** Dedicated floating loupe window (window label: loupe). */
export function LoupeWindowApp({ locale }: LoupeWindowAppProps) {
  const [sample, setSample] = useState<LoupeUpdate | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("loupe-window");
    document.body.style.background = "#f4f5f7";
    let unlisten: (() => void) | undefined;
    void onLoupeUpdate(setSample).then((fn) => {
      unlisten = fn;
    });
    return () => {
      document.documentElement.classList.remove("loupe-window");
      unlisten?.();
    };
  }, []);

  return (
    <Stack
      h="100vh"
      w="100vw"
      align="center"
      justify="center"
      gap={8}
      p={8}
      bg="var(--color-base)"
    >
      <LoupeCanvas sample={sample} centerLabel={t(locale, "loupe.center")} />
      <Text ff="monospace" size="xs" fw={600} style={{ letterSpacing: "0.04em" }}>
        {sample?.hex ?? "—"}
      </Text>
    </Stack>
  );
}
