#!/usr/bin/env bash
# ========================================================
# Lanceur Violet Cockpit Desktop (Electron)
# ========================================================

set -e
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Vérifie si un paquet compilé existe dans release/
RELEASE_APPIMAGE="$(find "$PROJECT_DIR/release" -name "*.AppImage" 2>/dev/null | head -n 1)"

if [[ -n "$RELEASE_APPIMAGE" && -x "$RELEASE_APPIMAGE" ]]; then
    exec "$RELEASE_APPIMAGE" "$@"
else
    # Lancement direct via Electron
    exec npx electron . --no-sandbox "$@"
fi
