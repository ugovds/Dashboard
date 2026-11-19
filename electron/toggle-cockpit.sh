#!/usr/bin/env bash
# ========================================================
# toggle-cockpit.sh
# Bascule intelligente de Violet Cockpit :
# - Toujours sur le bureau actuellement actif
# - En mode plein écran maximisé (fake fullscreen avec barre des tâches visible)
# - Toggle afficher / masquer si déjà au premier plan
# ========================================================

set -e
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

hyprctl repl '
local target = nil
for _, w in ipairs(hl.get_windows()) do
    if w.class == "violet-cockpit" then
        target = w
        break
    end
end

if not target then
    hl.dispatch(hl.dsp.exec_cmd("'$PROJECT_DIR'/run-desktop.sh"))
    return
end

local active_w = hl.get_active_window()
local current_ws = hl.get_active_workspace()

-- 1. Si Violet Cockpit est déjà actif au premier plan : le masquer (Toggle off)
if active_w and active_w.address == target.address then
    hl.dispatch(hl.dsp.exec_cmd("'$PROJECT_DIR'/run-desktop.sh --hide"))
    return
end

-- 2. Donner le focus
hl.dispatch(hl.dsp.focus({ window = target }))

-- 3. Si sur un autre bureau : le rapatrier immédiatement sur le bureau actuel
if current_ws and target.workspace.id ~= current_ws.id then
    hl.dispatch(hl.dsp.window.move({ workspace = current_ws.id, address = target.address }))
end

-- 4. S'\''assurer qu'\''il est restauré/affiché
hl.dispatch(hl.dsp.exec_cmd("'$PROJECT_DIR'/run-desktop.sh --show"))
hl.dispatch(hl.dsp.focus({ window = target }))

-- 5. Appliquer le mode plein écran maximisé (fake fullscreen avec barre des tâches visible)
local updated_target = nil
for _, w in ipairs(hl.get_windows()) do
    if w.class == "violet-cockpit" then
        updated_target = w
        break
    end
end
if updated_target and updated_target.fullscreen ~= 1 then
    hl.dispatch(hl.dsp.window.fullscreen({ mode = "maximized", action = "toggle" }))
end
' >/dev/null 2>&1 || {
    # Fallback si hyprctl repl n'est pas dispo
    "$PROJECT_DIR/run-desktop.sh" --toggle
}
