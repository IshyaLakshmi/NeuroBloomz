Used Favicons

This folder will contain the favicon files actually used by the site. I created a safe PowerShell script at the project root (`move-favicons.ps1`) that will:

- Back up existing favicon-like files from `assets/` into a timestamped backup folder (so nothing is lost).
- Move the existing files into this `Used Favicons` folder.
- Update all `.html` files to reference `Used Favicons/<filename>` instead of `assets/<filename>` (it handles optional query strings like `?v=...`).
- Create `.bak` copies of any HTML files it updates.

Files the script targets (only moved if they exist):
- favicon-16.png
- favicon-16x16.png
- favicon-32.png
- favicon-32x32.png
- favicon-192.png
- favicon-512.png
- favicon.ico
- android-chrome-192x192.png
- android-chrome-512x512.png
- apple-touch-icon.png
- safari-pinned-tab.svg

How to run (PowerShell, Windows):

1. Open PowerShell in the project root (the folder containing `index.html`).
2. Run:

   powershell -ExecutionPolicy Bypass -File .\move-favicons.ps1

The script is idempotent and safe: it copies files to a backup folder before moving, and preserves `.bak` copies of changed HTML files.

If you want me to run the script now, say "Run it now" and I'll execute it for you and report results.