import { useEffect, useState } from "react";
import { Button } from "@mantine/core";

type CopyButtonProps = {
  label: string;
  copiedLabel: string;
  failedLabel?: string;
  onCopy: () => Promise<void> | void;
  onError?: (error: unknown) => void;
  disabled?: boolean;
  compact?: boolean;
};

export function CopyButton({
  label,
  copiedLabel,
  failedLabel,
  onCopy,
  onError,
  disabled = false,
  compact = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!copied && !failed) return;
    const timer = window.setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [copied, failed]);

  async function handleClick() {
    if (disabled) return;
    try {
      await onCopy();
      setFailed(false);
      setCopied(true);
    } catch (error) {
      setCopied(false);
      setFailed(true);
      onError?.(error);
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      color={failed ? "red" : copied ? "teal" : "blue"}
      variant={copied || failed ? "light" : "filled"}
      size={compact ? "xs" : "sm"}
      style={{ flexShrink: 0 }}
    >
      {failed && failedLabel ? failedLabel : copied ? copiedLabel : label}
    </Button>
  );
}
