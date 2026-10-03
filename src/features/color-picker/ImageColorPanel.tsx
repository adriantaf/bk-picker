import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  FileButton,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  canvasPointToImage,
  createSampleContext,
  drawImageContain,
  loadImageFromBlob,
  loadImageFromFile,
  sampleBitmapPixel,
  type LoadedImage,
} from "@/lib/imageColor";
import { fetchImageBytes } from "@/tauri";
import type { Color } from "@/types";

type ImageColorPanelProps = {
  onPick: (color: Color) => void;
  labels: {
    chooseFile: string;
    urlPlaceholder: string;
    loadUrl: string;
    hint: string;
    dropHint: string;
    pasteHint: string;
    loading: string;
    errorInvalid: string;
    errorNetwork: string;
    zoomIn: string;
    zoomOut: string;
    zoomFit: string;
    fileLabel: string;
  };
};

export function ImageColorPanel({ onPick, labels }: ImageColorPanelProps) {
  const displayRef = useRef<HTMLCanvasElement>(null);
  const sampleRef = useRef<{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
  } | null>(null);
  const imageRef = useRef<LoadedImage | null>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [hoverHex, setHoverHex] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function clearImage() {
    imageRef.current?.revoke?.();
    imageRef.current = null;
    sampleRef.current = null;
    setHasImage(false);
    setHoverHex(null);
    setFileName(null);
  }

  async function applyLoaded(loaded: LoadedImage, name?: string) {
    clearImage();
    imageRef.current = loaded;
    sampleRef.current = createSampleContext(loaded.bitmap);
    setHasImage(true);
    setZoom(1);
    setError(null);
    setFileName(name ?? null);
    requestAnimationFrame(() => redraw(1));
  }

  function redraw(nextZoom = zoom) {
    const canvas = displayRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    drawImageContain(canvas, img.bitmap, nextZoom);
  }

  useEffect(() => {
    if (!hasImage) return;
    redraw(zoom);
    const onResize = () => redraw(zoom);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hasImage, zoom]);

  useEffect(() => () => clearImage(), []);

  useEffect(() => {
    async function onPaste(event: ClipboardEvent) {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (!item.type.startsWith("image/")) continue;
        event.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;
        setLoading(true);
        setError(null);
        try {
          const loaded = await loadImageFromFile(file);
          await applyLoaded(loaded, file.name || "clipboard.png");
        } catch {
          setError(labels.errorInvalid);
        } finally {
          setLoading(false);
        }
        return;
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [labels.errorInvalid]);

  async function handleFile(file: File | null) {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const loaded = await loadImageFromFile(file);
      await applyLoaded(loaded, file.name);
    } catch {
      setError(labels.errorInvalid);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadUrl() {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      const bytes = await fetchImageBytes(trimmed);
      const copy = new Uint8Array(bytes);
      const blob = new Blob([copy]);
      const loaded = await loadImageFromBlob(blob);
      const name = trimmed.split("/").pop()?.split("?")[0] || "url-image";
      await applyLoaded(loaded, name);
    } catch {
      setError(labels.errorNetwork);
    } finally {
      setLoading(false);
    }
  }

  function pickAt(clientX: number, clientY: number, commit: boolean) {
    const canvas = displayRef.current;
    const img = imageRef.current;
    const sample = sampleRef.current;
    if (!canvas || !img || !sample) return;
    const pt = canvasPointToImage(
      canvas,
      clientX,
      clientY,
      img.width,
      img.height,
      zoom,
    );
    if (!pt) return;
    const color = sampleBitmapPixel(sample.ctx, pt.x, pt.y);
    setHoverHex(color.hex);
    if (commit) onPick(color);
  }

  async function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      setError(labels.errorInvalid);
      return;
    }
    await handleFile(file);
  }

  return (
    <Stack gap="sm" className="ui-fade">
      <Text size="xs" c="dimmed">
        {labels.hint}
      </Text>
      <Text size="xs" c="dimmed">
        {labels.pasteHint}
      </Text>

      <Paper
        p="sm"
        withBorder
        radius="md"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => void handleDrop(e)}
        style={{
          borderStyle: "dashed",
          borderColor: dragging
            ? "var(--mantine-color-blue-5)"
            : "var(--color-border)",
          background: dragging
            ? "color-mix(in srgb, var(--color-accent) 16%, var(--color-surface))"
            : "var(--color-elevated)",
          transition: "background-color 120ms ease, border-color 120ms ease",
        }}
      >
        <Stack gap="xs" align="center">
          <Text size="xs" c="dimmed" ta="center">
            {labels.dropHint}
          </Text>
          <Group gap="xs" wrap="wrap" justify="center">
            <FileButton onChange={handleFile} accept="image/*">
              {(props) => (
                <Button {...props} variant="light" loading={loading} size="xs">
                  {labels.chooseFile}
                </Button>
              )}
            </FileButton>
            {hasImage ? (
              <Group gap={4}>
                <Button
                  size="compact-xs"
                  variant="default"
                  onClick={() =>
                    setZoom((z) => Math.max(0.5, Number((z - 0.25).toFixed(2))))
                  }
                >
                  {labels.zoomOut}
                </Button>
                <Button size="compact-xs" variant="default" onClick={() => setZoom(1)}>
                  {labels.zoomFit}
                </Button>
                <Button
                  size="compact-xs"
                  variant="default"
                  onClick={() =>
                    setZoom((z) => Math.min(4, Number((z + 0.25).toFixed(2))))
                  }
                >
                  {labels.zoomIn}
                </Button>
              </Group>
            ) : null}
          </Group>
          {fileName ? (
            <Text size="xs" ff="monospace" truncate maw="100%">
              {labels.fileLabel}: {fileName}
            </Text>
          ) : null}
        </Stack>
      </Paper>

      <Group align="flex-end" gap="xs" wrap="wrap">
        <TextInput
          style={{ flex: "1 1 160px", minWidth: 0 }}
          placeholder={labels.urlPlaceholder}
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleLoadUrl();
          }}
        />
        <Button onClick={() => void handleLoadUrl()} loading={loading}>
          {labels.loadUrl}
        </Button>
      </Group>

      {error ? (
        <Alert color="red" variant="light">
          {error}
        </Alert>
      ) : null}

      {loading && !hasImage ? (
        <Text size="xs" c="dimmed" ta="center">
          {labels.loading}
        </Text>
      ) : null}

      <canvas
        ref={displayRef}
        className="image-pick-canvas"
        aria-label={labels.hint}
        style={{
          display: hasImage ? "block" : "none",
          height: "min(42vh, 280px)",
        }}
        onClick={(e) => pickAt(e.clientX, e.clientY, true)}
        onMouseMove={(e) => pickAt(e.clientX, e.clientY, false)}
        onWheel={(e) => {
          if (!hasImage) return;
          e.preventDefault();
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          setZoom((z) =>
            Math.min(4, Math.max(0.5, Number((z + delta).toFixed(2)))),
          );
        }}
      />

      {hasImage && hoverHex ? (
        <Text size="xs" ta="center" ff="monospace" fw={600}>
          {hoverHex}
        </Text>
      ) : null}
    </Stack>
  );
}
