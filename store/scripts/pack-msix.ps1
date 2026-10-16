# Build BK Picker (Tauri release) and pack as MSIX via winapp CLI.
# Prerequisites: winapp CLI (`winget install Microsoft.WinAppCli`), Package.appxmanifest, devcert.pfx
# Usage:
#   powershell -ExecutionPolicy Bypass -File store/scripts/pack-msix.ps1
#   npm run pack:msix

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Set-Location $root

$stage = Join-Path $root "store\msix-stage"
$outDir = Join-Path $root "store\msix"
# Prefer CARGO_TARGET_DIR (Cursor sandbox remaps this); fall back to src-tauri/target
$cargoTarget = if ($env:CARGO_TARGET_DIR) { $env:CARGO_TARGET_DIR } else { Join-Path $root "src-tauri\target" }
$exeSrc = Join-Path $cargoTarget "release\bk-picker.exe"
$cert = Join-Path $root "devcert.pfx"
$manifest = Join-Path $root "Package.appxmanifest"

if (-not (Get-Command winapp -ErrorAction SilentlyContinue)) {
  Write-Error "winapp CLI not found. Install: winget install Microsoft.WinAppCli --source winget"
}

if (-not (Test-Path $manifest)) {
  Write-Error "Missing Package.appxmanifest at repo root. Run: winapp init . --setup-sdks none --use-defaults"
}

if (-not (Test-Path $cert)) {
  Write-Host "Generating development certificate..."
  winapp cert generate --if-exists skip
}

Write-Host "Building Tauri release..."
npm run tauri -- build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if (-not (Test-Path $exeSrc)) {
  Write-Error "Missing release exe: $exeSrc"
}

New-Item -ItemType Directory -Force -Path $stage | Out-Null
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
Copy-Item -Force $exeSrc (Join-Path $stage "bk-picker.exe")

$pkgJson = Get-Content (Join-Path $root "package.json") -Raw | ConvertFrom-Json
$ver4 = "$($pkgJson.version).0"
$msixName = "BK.Picker_${ver4}_x64.msix"
$msixOut = Join-Path $outDir $msixName

Write-Host "Packaging MSIX ($msixName)..."
winapp package $stage --cert $cert --manifest $manifest --output $msixOut --exe bk-picker.exe
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "MSIX ready: $msixOut"
Get-ChildItem $outDir -Filter "*.msix" | ForEach-Object { Write-Host " - $($_.FullName) ($([math]::Round($_.Length/1MB, 2)) MB)" }
