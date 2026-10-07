#!/usr/bin/env bash
# Installe un ffmpeg statique (7.0.2) et le lie dans bin/.
# A relancer au debut d'une session si bin/ffmpeg ne repond plus.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! python3 -c "import imageio_ffmpeg" 2>/dev/null; then
  echo ">> installation de imageio-ffmpeg..."
  pip install --break-system-packages --quiet imageio-ffmpeg
fi

FF="$(python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())")"
ln -sf "$FF" "$ROOT/bin/ffmpeg"

echo ">> ffmpeg pret :"
"$ROOT/bin/ffmpeg" -version 2>/dev/null | head -1
