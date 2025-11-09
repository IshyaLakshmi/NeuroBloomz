OpenDyslexic local hosting helper

Purpose
- Keep a local copy of the OpenDyslexic font for offline/fast loading and privacy.
- The main HTML (`4th draft.html`) already references `assets/OpenDyslexic-Regular.woff2` via @font-face.

What you should do
1. Preferred: place a WOFF2 of OpenDyslexic at:
   assets/OpenDyslexic-Regular.woff2

   If you have a different format (OTF/TTF), you can convert to WOFF2 (instructions below).

2. Optionally run the included PowerShell helper `download-opendyslexic.ps1` to fetch a copy of the OpenDyslexic OTF into this folder. The script will fetch an OTF and, if a local WOFF2 converter is available, will attempt conversion.

Notes about the license and source
- The helper script downloads from the OpenDyslexic GitHub project. Please ensure you have the right to download and host any font files for your use case.

Conversion options (if you only have .otf or .ttf)
- Python / fonttools + brotli (recommended):
  pip install fonttools brotli
  python - <<'PY'
  from fontTools.ttLib import TTFont
  from fontTools import subset
  # Use other known tools or utilities to create woff2; many GUI sites exist but check license
  PY

- Google woff2 tool (if available on Windows)
  woff2_compress.exe path\to\font.otf
  # produces font.woff2 next to the original file

Scripts in this folder
- download-opendyslexic.ps1 — attempts to download an OTF from the OpenDyslexic GitHub and save it here; will attempt conversion if `woff2_compress` is found in PATH.
- check-font.ps1 — quick check to tell you whether `OpenDyslexic-Regular.woff2` exists locally and prints next steps.

If you want me to attempt the download and conversion automatically from here, tell me and I can run `download-opendyslexic.ps1` in a terminal (it requires network access and optional conversion tools). If you prefer to upload the WOFF2 file, drop it in `assets/` and I'll verify it automatically.