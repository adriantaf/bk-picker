# Microsoft Store — BK Picker

Checklist for Partner Center submission. Publisher display name: **Adrian Tafoya**.

## Product type (choose one)

| Path | Partner Center type | Package | Silent args |
|---|---|---|---|
| **MSIX (recommended for this repo)** | **MSIX or PWA** | `npm run pack:msix` → `store/msix/*.msix` | (none; MSIX install) |
| EXE / MSI (legacy Tauri Store flow) | **EXE or MSI** | `npm run build:store` → NSIS `-setup.exe` | `/S` |

If you already reserved BK Picker as EXE/MSI, create a new listing as **MSIX or PWA**, or change the product type if Partner Center allows.

## MSIX flow (winapp CLI)

Tauri does not emit MSIX. We build the release exe, then pack with [winapp CLI](https://learn.microsoft.com/en-us/windows/apps/dev-tools/winapp-cli/guides/tauri).

### Prerequisites

```powershell
winget install Microsoft.WinAppCli --source winget
winapp cert generate --if-exists skip   # creates gitignored devcert.pfx
```

Identity lives in [`Package.appxmanifest`](../Package.appxmanifest) (Display name **BK Picker**, publisher **Adrian Tafoya**, version **1.1.2.0**). Store icons are under `Assets/`.

### Pack

```powershell
npm run pack:msix
```

Output: `store/msix/BK.Picker_<version>.0_x64.msix` (gitignored). Upload that file in Partner Center → Packages. Microsoft **re-signs** for Store; the local cert is only for sideload testing.

Optional local install test (after `winapp cert install .\devcert.pfx` as admin):

```powershell
Add-AppxPackage .\store\msix\BK.Picker_1.1.2.0_x64.msix
```

## Before first upload

1. Create an individual developer account at [storedeveloper.microsoft.com](https://storedeveloper.microsoft.com) (free).
2. Reserve the app name **BK Picker** (product type **MSIX or PWA** for the MSIX path).
3. Build package: `npm run pack:msix` (or `npm run build:store` for EXE/MSI).
4. Prepare screenshots in `store/listing/screenshots/` (see README there).

## Listing

Use copy from `store/listing/es.md` and `store/listing/en.md`.

| Field | Value |
|---|---|
| Publisher | `Adrian Tafoya` | Must **not** equal product name `BK Picker` |
| Website | `https://adriantaf.github.io/bk-picker/` |
| Support | `https://adriantaf.github.io` |

## Screenshots (order)

Regenerate: `npm run capture:store` → `store/listing/screenshots/*.png` (1920×1080).

1. Color tab (Manual) with HSB + HEX  
2. Eyedropper with loupe  
3. Image mode  
4. History + favorites  
5. Palettes  
6. Systems  
7. Settings (language + about Adrian Tafoya)

## Age / capabilities

- No account, no cloud upload of screen content.
- Local clipboard + optional history on disk.

## Post-certification checklist

- [ ] Publisher shows as Adrian Tafoya, app title BK Picker
- [ ] Shortcut works after install
- [ ] Landing: `https://adriantaf.github.io/bk-picker/`
- [ ] GitHub Releases for community sideload (attach `.msix` + NSIS/MSI)
