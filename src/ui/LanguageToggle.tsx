import { SegmentedControl } from "@mantine/core";
import type { Locale } from "@/types";

type LanguageToggleProps = {
  locale: Locale;
  onChange: (locale: Locale) => void;
  label: string;
  labels: Record<Locale, string>;
};

export function LanguageToggle({
  locale,
  onChange,
  label,
  labels,
}: LanguageToggleProps) {
  return (
    <SegmentedControl
      value={locale}
      onChange={(next) => onChange(next as Locale)}
      aria-label={label}
      data={[
        { value: "es", label: labels.es },
        { value: "en", label: labels.en },
      ]}
      fullWidth
    />
  );
}
