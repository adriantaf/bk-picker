# Generate Microsoft Store-ish marketing icons from the app icon.
# Usage:
#   powershell -ExecutionPolicy Bypass -File store/scripts/generate-store-assets.ps1

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$src = Join-Path $root "src-tauri\icons\icon.png"
$out = Join-Path $root "store\listing\assets"

if (-not (Test-Path $src)) {
  Write-Error "Missing source icon: $src. Run: npm run tauri icon path\to\icon.png"
}

New-Item -ItemType Directory -Force -Path $out | Out-Null
Add-Type -AssemblyName System.Drawing

function Save-Square([string]$path, [int]$size) {
  $img = [System.Drawing.Image]::FromFile($src)
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.Clear([System.Drawing.Color]::FromArgb(255, 28, 28, 30))
  $g.DrawImage($img, 0, 0, $size, $size)
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
}

Save-Square (Join-Path $out "StoreLogo.png") 50
Save-Square (Join-Path $out "Square44x44Logo.png") 44
Save-Square (Join-Path $out "Square150x150Logo.png") 150
Save-Square (Join-Path $out "Square310x310Logo.png") 310

$widePath = Join-Path $out "Wide310x150Logo.png"
$img = [System.Drawing.Image]::FromFile($src)
$bmp = New-Object System.Drawing.Bitmap 310, 150
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(255, 28, 28, 30))
$g.DrawImage($img, 80, 0, 150, 150)
$bmp.Save($widePath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose(); $img.Dispose()

Write-Host "Store assets written to $out"
Get-ChildItem $out | Format-Table Name, Length
