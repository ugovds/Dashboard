#!/usr/bin/env bash
# ========================================================
# Lanceur Violet Cockpit Desktop (Electron)
# ========================================================

set -e
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

export PATH="/usr/local/bin:/usr/bin:$PROJECT_DIR/node_modules/.bin:$PATH"

# 1. Vérifie si un paquet compilé existe dans release/
RELEASE_APPIMAGE="$(find "$PROJECT_DIR/release" -name "*.AppImage" 2>/dev/null | head -n 1)"

if [[ -n "$RELEASE_APPIMAGE" && -x "$RELEASE_APPIMAGE" ]]; then
    exec "$RELEASE_APPIMAGE" "$@"
elif [[ -x "$PROJECT_DIR/node_modules/.bin/electron" ]]; then
    # Lancement direct via le binaire local Electron
    exec "$PROJECT_DIR/node_modules/.bin/electron" . --no-sandbox "$@"
else
    # Fallback npx
    exec npx electron . --no-sandbox "$@"
fi

