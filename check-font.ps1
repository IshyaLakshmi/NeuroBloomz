<#
Quick check for the OpenDyslexic files in assets/
Run from project root:
  .\assets\check-font.ps1

This script exits with code 0 when the WOFF2 file exists.
#>
$woff2 = Join-Path $PSScriptRoot 'OpenDyslexic-Regular.woff2'
$otf = Join-Path $PSScriptRoot 'OpenDyslexic3-Regular.otf'

if(Test-Path $woff2){
    Write-Host "OK: Found local OpenDyslexic WOFF2 at: $woff2" -ForegroundColor Green
    exit 0
}
if(Test-Path $otf){
    Write-Host "Found OTF at: $otf — but WOFF2 is missing." -ForegroundColor Yellow
    Write-Host "You can convert the OTF to WOFF2 using the woff2 tools (woff2_compress)." -ForegroundColor Yellow
    exit 2
}
Write-Host "No OpenDyslexic font found in assets/. Please add OpenDyslexic-Regular.woff2 to assets/ or run download-opendyslexic.ps1." -ForegroundColor Red
exit 3