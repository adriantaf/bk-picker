# Screenshots checklist

Generated PNGs for Microsoft Store (1920×1080). Landing shots live in `docs/assets/`.

Regenerate:

```bash
npm run capture:store
```

| File | Shot |
|---|---|
| `01-color-tab.png` | Color tab (Manual) with HSB + HEX |
| `02-loupe.png` | Eyedropper active with loupe |
| `03-image.png` | Image mode with a sample photo |
| `04-history.png` | History + favorites |
| `05-palettes.png` | Palettes tab |
| `06-systems.png` | Systems / equivalences (Tailwind matches) |
| `07-settings.png` | Settings with language + Adrian Tafoya |

Tips:
- Captures use the **current dark** UI framed on a clean desktop at **1920×1080**.
- Do not crop away the window chrome; Partner Center expects full screenshots.
- Source harness: `?storeShot=1` + `scripts/capture-store-screenshots.mjs`.
