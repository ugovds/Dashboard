#!/usr/bin/env bash
# ========================================================
# Lanceur Violet Cockpit Desktop (Tauri v2 + Rust)
# ========================================================

set -e
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

export PATH="$HOME/.cargo/bin:$PATH"

# Optimisations GPU / WebKitGTK Linux Wayland
export WEBKIT_DISABLE_DMABUF_RENDERER=1
export __NV_DISABLE_EXPLICIT_SYNC=1

BINARY_RELEASE="$PROJECT_DIR/src-tauri/target/release/violet-cockpit"
BINARY_DEBUG="$PROJECT_DIR/src-tauri/target/debug/violet-cockpit"

if [[ -f "$BINARY_RELEASE" ]]; then
    exec "$BINARY_RELEASE" "$@"
elif [[ -f "$BINARY_DEBUG" ]]; then
    exec "$BINARY_DEBUG" "$@"
else
    echo "⚙️ Binaire non trouvé. Lancement via npm run tauri dev..."
    exec npm run tauri dev
fi
