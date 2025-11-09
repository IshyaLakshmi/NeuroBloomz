<#
Download OpenDyslexic OTF into this folder and optionally convert to WOFF2 if you have the woff2 tool.

Usage:
  Open PowerShell in the project root and run:
    .\assets\download-opendyslexic.ps1

Notes:
- This script downloads an OTF from the OpenDyslexic GitHub repo (raw file).
- It will NOT overwrite an existing file unless you pass -Force.
- Conversion to WOFF2 requires `woff2_compress` available in PATH. If not available, the OTF will remain and you can convert it externally.
- Always double-check licensing before hosting fonts.
#>
param(
    [switch]$Force
)

$destOtf = Join-Path $PSScriptRoot 'OpenDyslexic3-Regular.otf'
$destWoff2 = Join-Path $PSScriptRoot 'OpenDyslexic-Regular.woff2'

if(Test-Path $destWoff2 -and -not $Force){
    Write-Host "Found existing $destWoff2 — nothing to do. Use -Force to re-download/convert." -ForegroundColor Yellow
    exit 0
}

$rawUrl = 'https://github.com/antijingoist/open-dyslexic/raw/master/OpenDyslexic3-Regular.otf'
try{
    Write-Host "Downloading OpenDyslexic OTF from $rawUrl ..."
    Invoke-WebRequest -Uri $rawUrl -OutFile $destOtf -UseBasicParsing -ErrorAction Stop
    Write-Host "Saved OTF to: $destOtf" -ForegroundColor Green
}catch{
    Write-Host "Download failed: $_" -ForegroundColor Red
    exit 1
}

# Attempt conversion if woff2_compress is available
$woff2Tool = Get-Command 'woff2_compress' -ErrorAction SilentlyContinue
if($woff2Tool){
    Write-Host "Found woff2_compress tool at $($woff2Tool.Path). Attempting conversion..."
    try{
        & $woff2Tool.Path $destOtf
        # woff2_compress typically writes file alongside the input with .woff2 ext
        $produced = [System.IO.Path]::ChangeExtension($destOtf, '.woff2')
        if(Test-Path $produced){
            Move-Item -Path $produced -Destination $destWoff2 -Force
            Write-Host "Converted and saved WOFF2 to $destWoff2" -ForegroundColor Green
        }else{
            Write-Host "Conversion completed but expected output not found: $produced" -ForegroundColor Yellow
        }
    }catch{
        Write-Host "Conversion failed: $_" -ForegroundColor Red
    }
}else{
    Write-Host "woff2_compress not found in PATH. If you want to convert the .otf to .woff2, install the woff2 tools or use an online converter. The downloaded file is at: $destOtf" -ForegroundColor Yellow
}

Write-Host "Done. If you placed a WOFF2 at '$destWoff2', the site will use it on next load." -ForegroundColor Cyan