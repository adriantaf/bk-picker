import { useEffect, useState } from "react";
import { TextInput } from "@mantine/core";
import { colorFromHex } from "@/lib/color";
import type { Color } from "@/types";

type HexInputProps = {
  color: Color;
  label: string;
  invalidLabel: string;
  onChange: (color: Color) => void;
};

export function HexInput({
  color,
  label,
  invalidLabel,
  onChange,
}: HexInputProps) {
  const [draft, setDraft] = useState(color.hex);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    setDraft(color.hex);
    setInvalid(false);
  }, [color.hex]);

  function commit(value: string) {
    const next = colorFromHex(value);
    if (!next) {
      setInvalid(true);
      setDraft(color.hex);
      return;
    }
    setInvalid(false);
    setDraft(next.hex);
    onChange(next);
  }

  return (
    <TextInput
      label={label}
      value={draft}
      spellCheck={false}
      autoComplete="off"
      error={invalid ? invalidLabel : undefined}
      onChange={(event) => {
        setDraft(event.currentTarget.value);
        setInvalid(false);
      }}
      onBlur={() => commit(draft)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.currentTarget.blur();
        }
      }}
      styles={{
        input: {
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.04em",
        },
      }}
    />
  );
}
