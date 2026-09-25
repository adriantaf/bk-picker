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
npm run build:store     # NSIS con WebView2 offlineInstaller (Store)
```

## Microsoft Store

Sigue `store/STORE.md`. Resumen:

1. Partner Center → producto **EXE or MSI**
2. `npm run build:store`
3. Sube el `-setup.exe` y pon silent args **`/S`**
4. Website: `https://adriantaf.github.io/bk-picker/`
5. Capturas en `store/listing/screenshots/` (también en `docs/assets/` para la landing)

## Persistencia

`%APPDATA%\com.bkpicker.app\bk-picker.json`
