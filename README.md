# BK Picker

Utilidad de escritorio para Windows: captura colores de la pantalla o de una imagen, lupa, formatos HEX/RGB/HSL/OKLCH, historial, favoritos, paletas y equivalentes de design systems (Tailwind, Material, CSS, Bootstrap).

Hecho por [Adrian Tafoya](https://adriantaf.github.io).

- **Sitio:** [adriantaf.github.io/bk-picker](https://adriantaf.github.io/bk-picker/)
- **Descargas:** [Releases](https://github.com/adriantaf/bk-picker/releases)

## Requisitos

- Windows 10/11
- WebView2 (el instalador NSIS puede pedir descargarlo si no está instalado)

## Desarrollo

```powershell
npm install
npm run tauri dev
```

## Build

```powershell
# Instalador normal (NSIS + MSI)
npm run build:release

# Build orientado a Microsoft Store (WebView2 offlineInstaller)
npm run build:store
```

## Microsoft Store

Guía interna: [`store/STORE.md`](store/STORE.md) · Copy listing: [`store/listing/`](store/listing/)

## Atajo por defecto

`Alt+C` (configurable en Ajustes).

## Licencia

Copyright © Adrian Tafoya. Todos los derechos reservados salvo acuerdo escrito.
