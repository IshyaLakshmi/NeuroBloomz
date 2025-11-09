# Safe favicon mover for NeuroBloomz
# - Creates a backup of referenced favicon files
# - Moves existing favicon files from assets/ into the project root: "Used Favicons"
# - Updates all .html references from assets/<name> (with optional ?query) to "Used Favicons/<name>"
# - For any modified HTML file a .bak copy is created alongside the original

$root = "c:\Users\bagya\OneDrive\Desktop\PP Website Versions\final"
$used = Join-Path $root "Used Favicons"
$bak = Join-Path $root ("favicons-backup-$(Get-Date -Format yyyyMMdd_HHmmss)")

# ensure folders
if (-not (Test-Path $used)) { New-Item -ItemType Directory -Path $used | Out-Null }
if (-not (Test-Path $bak)) { New-Item -ItemType Directory -Path $bak | Out-Null }

# files we will act on (only move if the file exists)
$leaves = @(
    "favicon-16.png",
    "favicon-16x16.png",
    "favicon-32.png",
    "favicon-32x32.png",
    "favicon-192.png",
    "favicon-512.png",
    "favicon.ico",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png",
    "apple-touch-icon.png",
    "safari-pinned-tab.svg"
)

# Backup and move
foreach ($leaf in $leaves) {
    $src = Join-Path $root (Join-Path 'assets' $leaf)
    if (Test-Path $src) {
        Write-Host "Backing up $leaf to $bak"
        Copy-Item -Path $src -Destination $bak -Force
        Write-Host "Moving $leaf to $used"
        Move-Item -Path $src -Destination (Join-Path $used $leaf) -Force
    } else {
        Write-Host "Not found (skipping): $src"
    }
}

 # Update HTML files to reference new folder. We create .bak copies of changed files.
Get-ChildItem -Path $root -Filter *.html -Recurse | ForEach-Object {
    $path = $_.FullName
    $text = Get-Content -Raw -Path $path
    $replaced = $text
    foreach ($leaf in $leaves) {
    # Build a regex pattern that matches assets/<leaf> optionally followed by a query string
    # Use a simpler query-string matcher that avoids mixing quotes: match '?' then any non-space, non-'>' chars
    $pattern = [regex]::Escape("assets/$leaf") + '(\?[^>\s]*)?'
        $replaced = [regex]::Replace($replaced, $pattern, "Used Favicons/$leaf")
    }
    if ($replaced -ne $text) {
        Copy-Item -Path $path -Destination ($path + ".bak") -Force
        Set-Content -Path $path -Value $replaced -Force
        Write-Host "Updated references in: $path (backup at $path.bak)"
    }
}

Write-Host "Done. Moved existing favicon files and updated HTML references where applicable. Backups are in: $bak"
