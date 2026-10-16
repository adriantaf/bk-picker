# BK Picker — Guía Windows

## Prerrequisitos

1. **Node.js 20+**
2. **Rust stable** ([rustup](https://rustup.rs/))
3. **MSVC Build Tools**
4. **WebView2 Runtime**

```powershell
node -v; npm -v; rustc --version; cargo --version
```

## Desarrollo / build

```powershell
cd C:\Users\atafo\dev\desktop\bk-picker
npm install
npm run tauri dev
npm run build:release   # NSIS + MSI normales
npm run build:store     # NSIS con WebView2 offlineInstaller (Store EXE/MSI)
npm run pack:msix       # MSIX vía winapp CLI (Store MSIX or PWA)
```

### MSIX (winapp)

```powershell
winget install Microsoft.WinAppCli --source winget
winapp cert generate --if-exists skip
npm run pack:msix
# → store/msix/BK.Picker_<version>.0_x64.msix
```

Manifest: `Package.appxmanifest`. Detalle en `store/STORE.md`.

## Microsoft Store

Sigue `store/STORE.md`. Resumen **MSIX**:

1. Partner Center → producto **MSIX or PWA**
2. `npm run pack:msix`
3. Sube el `.msix` de `store/msix/`
4. Website: `https://adriantaf.github.io/bk-picker/`
5. Capturas en `store/listing/screenshots/` (también en `docs/assets/` para la landing)

Alternativa **EXE/MSI**: Partner Center → **EXE or MSI** → `npm run build:store` → silent args **`/S`**.
## Persistencia

`%APPDATA%\com.bkpicker.app\bk-picker.json`
